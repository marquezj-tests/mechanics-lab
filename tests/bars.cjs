const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const {Geometry,Physics,Joints}=vm.runInNewContext(html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='))+';({Geometry,Physics,Joints})');
const mass=(id,x,y,vx=0,vy=0)=>({id,type:'mass',x,y,vx,vy,mass:1});
const anchor=(id,x,y)=>({id,type:'anchor',x,y});
const bar=(a,b,length,extra={})=>({id:'r',type:'bar',a,b,length,localA:{x:0,y:0},localB:{x:0,y:0},collideConnected:false,...extra});
const model=(bodies,bars,gravityOn=false)=>({bodies,bars,springs:[],gravityOn,gravity:9.81});
const evolve=(m,t)=>{for(let i=0;i<Math.round(t/Physics.dt);i++)Physics.step(m);};
function error(m){return Math.max(...m.bars.map(r=>{const a=Joints.endpoint(m.bodies.find(b=>b.id===r.a),r.localA),b=Joints.endpoint(m.bodies.find(b=>b.id===r.b),r.localB);return Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-r.length);}));}
let angle=.1,L=2,m=model([anchor('a',0,0),mass('b',L*Math.sin(angle),-L*Math.cos(angle))],[bar('a','b',L)],true),initialX=m.bodies[1].x;
evolve(m,2*Math.PI*Math.sqrt(L/9.81));assert.ok(Math.abs(m.bodies[1].x-initialX)<.002,'pendulum returns near analytical small-angle period');
evolve(m,10);assert.ok(error(m)<1e-7,'pendulum length remains fixed');
m=model([mass('a',-1,0,0,-1),mass('b',1,0,0,1)],[bar('a','b',2)]);evolve(m,4);assert.ok(error(m)<1e-7);assert.ok(Math.abs(m.bodies[0].vx+m.bodies[1].vx)<1e-9&&Math.abs(m.bodies[0].vy+m.bodies[1].vy)<1e-9,'free bar conserves linear momentum');
m=model([anchor('a',0,0),mass('b',1,-1),mass('c',2,-2)],[bar('a','b',Math.SQRT2),bar('b','c',Math.SQRT2,{id:'r2'})],true);evolve(m,4);assert.ok(error(m)<1e-5,'chain of bars maintains lengths');
let b={...mass('b',2,0),shape:'rectangle',width:1,height:1,angle:0,omega:0};b.inertia=Geometry.inertia(b);m=model([anchor('a',0,0),b],[bar('a','b',Math.sqrt(5),{localB:{x:0,y:1}})],true);evolve(m,.5);assert.ok(Math.abs(b.omega)>.1,'off-center attachment transmits torque');assert.ok(error(m)<1e-7);
b=mass('b',1,Math.sqrt(3),0,0);b.constraint={x:0,y:Math.sqrt(3),angle:0};m=model([anchor('a',0,0),b],[bar('a','b',2)],true);evolve(m,1);assert.ok(error(m)<1e-7);assert.ok(Math.abs(b.y-Math.sqrt(3))<1e-12,'bar respects slider constraint');
m=model([anchor('a',0,0),anchor('b',2,0)],[bar('a','b',2)]);evolve(m,.1);assert.equal(m.bodies[0].x,0);assert.equal(m.bodies[1].x,2);
console.log('PASS: pendulum period/length, free connected masses, momentum, chains, off-center torque, slider constraints and anchor endpoints');
// Regress transient stretching: checking only the final frame hid this failure.
const chain=[anchor('pivot',0,0)],links=[];
for(let i=1;i<=10;i++){const body={...mass('solid'+i,i*.25,-i*.3),mass:i===10?1000:1,shape:'rectangle',width:.5,height:.2,angle:i,omega:i*.5};body.inertia=Geometry.inertia(body);const previous=chain[chain.length-1];chain.push(body);const link=bar(previous.id,body.id,1,{id:'joint'+i,localA:previous.shape?{x:.2,y:0}:{x:0,y:0},localB:{x:-.2,y:0}}),a=Joints.endpoint(previous,link.localA),b=Joints.endpoint(body,link.localB);link.length=Math.hypot(a.x-b.x,a.y-b.y);links.push(link);}
m=model(chain,links,true);let peakError=0;for(let i=0;i<360;i++){Physics.step(m);peakError=Math.max(peakError,error(m));}assert.ok(peakError<1e-6,`coupled bars stretched by ${peakError} m`);
const immovable=model([anchor('a',0,0),anchor('b',2,0)],[bar('a','b',1)]);assert.throws(()=>Physics.step(immovable),/bar constraints cannot be satisfied/,'incompatible constraints must pause, not silently stretch');
console.log('PASS: every-step length accuracy for coupled off-center rigid bodies with 1000:1 mass ratio; incompatible constraints rejected. Peak error:',peakError,'m');
// User fixture: Bar 1's target is 2.4166 m but starts 2.8284 m long.
const fixture=()=>JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'fixtures/two_mass_pendulum.json'),'utf8'));
m=fixture();assert.ok(error(m)>.4);const mismatch=Physics.prepare(m);assert.ok(mismatch>.4);assert.ok(error(m)<1e-6);for(const b of m.bodies.filter(b=>b.type==='mass'))assert.equal(Math.hypot(b.vx,b.vy),0,'assembly must not inject velocity');
const preparedEnergy=Physics.energy(m);Physics.step(m);assert.ok(Math.abs(Physics.energy(m)-preparedEnergy)<.001,'first step must not inject assembly energy');
m=fixture();Physics.step(m);assert.ok(Math.max(...m.bodies.filter(b=>b.type==='mass').map(b=>Math.hypot(b.vx,b.vy)))<.1,'direct stepping must also assemble without kick');
let fixtureError=0;for(let i=0;i<240*2;i++){Physics.step(m);fixtureError=Math.max(fixtureError,error(m));}assert.ok(fixtureError<1e-6);
console.log('PASS: supplied triangular-pendulum fixture assembles without velocity kick and keeps bar lengths. Peak error:',fixtureError,'m');
