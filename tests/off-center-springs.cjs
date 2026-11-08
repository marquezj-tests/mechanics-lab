const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),code=html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy=')),validation=html.slice(html.indexOf('function validate(raw)'),html.indexOf("\n$('file').onchange"));
const {Geometry,Springs,Physics,Joints,PlotAxes,AttachedMonitors,validate}=vm.runInNewContext(code+validation+';({Geometry,Springs,Physics,Joints,PlotAxes,AttachedMonitors,validate})');
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`),clone=x=>JSON.parse(JSON.stringify(x));
const anchor=(id,x,y)=>({id,type:'anchor',name:id,x,y});
function solid(id,x,y,mass=1){const b={id,type:'mass',name:id,x,y,mass,vx:0,vy:0,shape:'rectangle',width:2,height:.2,angle:0,omega:0,restitution:1,friction:0};b.inertia=Geometry.inertia(b);return b;}
const spring=(a,b,extra={})=>({id:'s',type:'spring',name:'Spring',a,b,k:10,rest:2,damping:0,localA:{x:1,y:0},localB:{x:0,y:0},...extra});
const model=(bodies,s)=>({version:1,name:'Test',bodies,springs:[s],bars:[],forces:[],gravityOn:false,gravity:9.81,solverPrecision:'high',plots:[],canvasMonitors:[],view:{x:0,y:0,scale:70}});
let b=solid('b',0,0,2);b.angle=Math.PI/2;b.omega=2;let a=anchor('a',3,1),s=spring('b','a',{k:4,rest:1,damping:3}),m=model([b,a],s),g=Springs.geometry(s,b,a),r=Springs.reaction(s,b,a);
near(g.a.x,0);near(g.a.y,1);near(g.length,3);near(g.rate,2);near(r.fx,14);near(r.fy,0);near(r.momentA,-14);near(r.momentB,0);
// Elastic force/torque are minus the potential-energy gradient.
s.damping=0;const e0=Physics.energy(m),delta=1e-6;b.angle+=delta;const plus=Physics.energy(m);b.angle-=2*delta;const minus=Physics.energy(m);b.angle+=delta;near(-(plus-minus)/(2*delta),Springs.reaction(s,b,a).momentA,1e-8);near(e0,.5*b.inertia*4+8);
// Fixed support balances the off-center spring couple; a pin permits rotation.
b=solid('b',0,0);b.fixed=true;a=anchor('a',1,3);s=spring('b','a');m=model([b,a],s);Physics.step(m);near(b.supportReaction.fy,-10);near(b.supportReaction.moment,-10);near(b.omega,0);
b.fixed=false;b.support={kind:'pinned',x:0,y:0};Physics.step(m,1e-7);near(b.omega,10/b.inertia*1e-7,1e-13);near(b.supportReaction.moment,0);near(b.x,0);near(b.y,0);
// Damping can act on rotation even with both endpoints' centers immovable.
b=solid('b',0,0);b.support={kind:'pinned',x:0,y:0};b.omega=1;a=anchor('a',1,2);s=spring('b','a',{k:0,damping:2});m=model([b,a],s);Physics.step(m,1e-7);near(b.omega,Math.exp(-2/b.inertia*1e-7),1e-13);near(b.x,0);near(b.y,0);
function pair(damping=0){const p=solid('p',-2,0,2),q=solid('q',2,.2,3);p.width=q.width=.8;p.height=q.height=.4;p.inertia=Geometry.inertia(p);q.inertia=Geometry.inertia(q);p.angle=.4;q.angle=-.2;p.omega=.8;q.omega=-.3;p.vx=-.3;q.vx=.4;return model([p,q],spring('p','q',{k:damping?0:5,rest:3.8,damping,localA:{x:.2,y:.2},localB:{x:-.2,y:-.2}}));}
const momentum=m=>m.bodies.reduce((v,b)=>({x:v.x+b.mass*b.vx,y:v.y+b.mass*b.vy,L:v.L+b.mass*(b.x*b.vy-b.y*b.vx)+b.inertia*b.omega}),{x:0,y:0,L:0});
for(const damping of [0,2]){m=pair(damping);const p0=momentum(m),e0=Physics.energy(m);let peak=0,previous=e0;for(let i=0;i<720;i++){Physics.step(m);const energy=Physics.energy(m);peak=Math.max(peak,Math.abs(energy-e0)/Math.max(1,e0));if(damping)assert.ok(energy<=previous+1e-12,'pure viscous damping must not add energy');previous=energy;}
 const p=momentum(m);near(p.x,p0.x,1e-10);near(p.y,p0.y,1e-10);near(p.L,p0.L,1e-9);if(damping)assert.ok(previous<e0-.01);else assert.ok(peak<1e-5,`elastic energy drift ${peak}`);
}
// Coupled damper impulses respect bar velocities and lengths.
b=solid('b',2,0);b.vy=1;s=spring('b','c',{k:0,damping:2});m=model([anchor('a',0,0),b,anchor('c',0,2)],s);m.bars=[{id:'bar',type:'bar',a:'a',b:'b',length:2,localA:{x:0,y:0},localB:{x:0,y:0}}];const energy=Physics.energy(m);for(let i=0;i<240;i++)Physics.step(m);assert.ok(Joints.maxError(m)<1e-9);assert.ok(Physics.energy(m)<energy);
// A tension-only rope releases under inward damping and reacts to outward damping.
for(const vy of [-1,1]){const bob={id:'bob',type:'mass',name:'Bob',x:2,y:0,mass:1,vx:0,vy};m=model([anchor('pin',0,0),bob,anchor('damperEnd',3,1)],spring('bob','damperEnd',{k:0,damping:2,localA:{x:0,y:0}}));m.strings=[{id:'rope',type:'string',a:'pin',b:'bob',localA:{x:0,y:0},localB:{x:0,y:0},via:[],length:2}];Physics.step(m,1e-4);if(vy>0){assert.ok(Math.hypot(bob.x,bob.y)<2);near(m.strings[0].reaction.tension,0,1e-8);}else{assert.ok(Joints.maxError(m)<1e-9);near(m.strings[0].reaction.tension,1.5,.01);}}
// Recorded rotation and attachment velocity drive plots, moments and impulses.
b=solid('b',0,0);a=anchor('a',1,3);s=spring('b','a');m=model([b,a],s);const frame={t:0,energy:Physics.energy(m),states:[clone(b)]};b.angle=Math.PI/2;b.omega=2;
r=PlotAxes.reaction(m,frame,'s');near(r.fy,10);near(r.momentA,10);near(r.angularImpulseA,10/240);near(PlotAxes.value(m,frame,'spring:s:length'),3);
const pin=AttachedMonitors.anchor(m,'s');near(pin.x,.5);near(pin.y,2);
const file=validate({...m,bodies:[frame.states[0],a]});near(file.springs[0].localA.x,1);near(validate(clone(file)).springs[0].localA.x,1);
const legacy=clone(file);delete legacy.springs[0].localA;delete legacy.springs[0].localB;near(validate(legacy).springs[0].localA.x,0);
for(const mutate of [m=>m.springs[0].localA=null,m=>m.springs[0].localA.x=Infinity,m=>m.springs[0].localB.x=1]){const invalid=clone(file);mutate(invalid);assert.throws(()=>validate(invalid));}
console.log('PASS: rotated spring pins and angular rates, energy-gradient torque, pinned/fixed reactions, rotational/coupled damping, energy and linear/angular momentum, replay measurements and legacy attachment validation');
