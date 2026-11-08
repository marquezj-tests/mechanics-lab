const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {app}=require('./helpers/app.cjs');
const {run,node}=app(),{Geometry,Physics,Joints,PlotAxes,AttachedMonitors,validate}=run('({Geometry,Physics,Joints,PlotAxes,AttachedMonitors,validate})');
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b} (tol ${tol})`),clone=x=>JSON.parse(JSON.stringify(x));
const anchor=(id,x=0,y=0)=>({id,type:'anchor',name:id,x,y});
function solid(id,x,y){const b={id,type:'mass',name:id,x,y,mass:2,vx:0,vy:0,shape:'rectangle',width:2,height:.2,angle:0,omega:0,restitution:1,friction:0};b.inertia=Geometry.inertia(b);return b;}
const hinge=(a,b,localA={x:0,y:0},localB={x:-1,y:0})=>({id:'h',type:'bar',joint:'hinge',name:'Hinge',a,b,localA,localB,length:0,collideConnected:false});
const model=(bodies,bars)=>({version:1,name:'Test',bodies,bars,springs:[],forces:[],gravityOn:true,gravity:9.81,solverPrecision:'high',plots:[],canvasMonitors:[],view:{x:0,y:0,scale:70}});
// Physical pendulum about an end: alpha=-mgL/(I_com+mL²), with a free hinge.
let a=anchor('a'),b=solid('b',1,0),m=model([a,b],[hinge('a','b')]);
Physics.step(m,1e-7);const alpha=-b.mass*9.81/(b.inertia+b.mass);near(b.omega/1e-7,alpha,1e-8);near(b.vy/1e-7,alpha,1e-8);near(Joints.maxError(m),0);near(a.supportReaction.moment,0);near(m.bars[0].reaction.momentB,m.bars[0].reaction.fy);near(b.mass*b.acceleration.y,-9.81*b.mass-m.bars[0].reaction.fy,1e-7);
assert.equal(Joints.reference(m).rows.length,2);assert.ok(!('supportAngleA' in m.bars[0]));
// A fixed ground support still allows hinge rotation: no accidental clamp row.
a=anchor('a');a.support={kind:'fixed',x:0,y:0};a.fixed=true;b=solid('b',1,0);m=model([a,b],[hinge('a','b')]);Physics.step(m,1e-7);near(b.omega/1e-7,alpha,1e-8);assert.equal(Joints.reference(m).rows.length,2);near(a.supportReaction.moment,0);
// Equilibrium reaction and moments: a vertical beam hangs below its pin.
a=anchor('a');b=solid('b',0,-1);b.angle=-Math.PI/2;m=model([a,b],[hinge('a','b')]);Physics.step(m);near(a.supportReaction.fy,19.62,1e-8);near(m.bars[0].reaction.fy,-19.62,1e-8);near(m.bars[0].reaction.momentB,0);near(b.omega,0);
// Assembling mismatched pins is an initial-condition edit, not an impulse.
a=anchor('a');b=solid('b',2,1);m=model([a,b],[hinge('a','b')]);assert.ok(Physics.prepare(m)>1);near(Joints.maxError(m),0);near(b.vx,0);near(b.omega,0);
a=anchor('a');b=solid('b',1,0);b.fixed=true;m=model([a,b],[hinge('a','b',{x:0,y:0},{x:0,y:0})]);assert.throws(()=>Physics.prepare(m),/constraints cannot be satisfied/);
// Two freely moving hinged beams conserve linear/angular momentum and energy.
a=solid('a',-1,0);b=solid('b',1,0);a.vx=b.vx=.2;a.vy=.5;b.vy=-.3;a.omega=-.5;b.omega=-.3;
m=model([a,b],[hinge('a','b',{x:1,y:0},{x:-1,y:0})]);m.gravityOn=false;Physics.prepare(m);
const momentum=m=>m.bodies.reduce((v,b)=>({x:v.x+b.mass*b.vx,y:v.y+b.mass*b.vy,L:v.L+b.mass*(b.x*b.vy-b.y*b.vx)+b.inertia*b.omega}),{x:0,y:0,L:0});
const p0=momentum(m),e0=Physics.energy(m),angle0=b.angle-a.angle;let peak=0;
for(let i=0;i<720;i++){Physics.step(m);peak=Math.max(peak,Math.abs(Physics.energy(m)-e0)/e0);assert.ok(Joints.maxError(m)<1e-9);}
const p=momentum(m);near(p.x,p0.x,1e-9);near(p.y,p0.y,1e-9);near(p.L,p0.L,1e-8);assert.ok(peak<1e-5,`energy error ${peak}`);assert.ok(Math.abs(b.angle-a.angle-angle0)>.1,'relative rotation must remain free');
// Constraint-aware impact response respects BOTH pin velocity coordinates.
const r=Joints.impactResponse(m,a,{x:0,y:0},b,{x:0,y:0},{x:.6,y:.8}).response;
const localVelocity=(body,local,i)=>{const p=Geometry.world(body,local),rx=p.x-body.x,ry=p.y-body.y;return {x:r[i]-r[i+2]*ry,y:r[i+1]+r[i+2]*rx};};
const va=localVelocity(a,{x:1,y:0},0),vb=localVelocity(b,{x:-1,y:0},3);near(va.x,vb.x);near(va.y,vb.y);
// A taut string and a coincident pair share the same coupled constraint solve.
a={id:'a',type:'mass',name:'a',x:1,y:0,mass:1,vx:0,vy:1};b={...a,id:'b',name:'b',mass:2};m=model([anchor('g'),a,b],[hinge('a','b',{x:0,y:0},{x:0,y:0})]);m.gravityOn=false;m.strings=[{id:'rope',type:'string',a:'g',b:'a',length:1,via:[],localA:{x:0,y:0},localB:{x:0,y:0}}];
for(let i=0;i<240;i++)Physics.step(m);near(Physics.energy(m),1.5,1e-9);near(Joints.maxError(m),0,1e-9);near(m.strings[0].reaction.tension,3,1e-6);
// Actual elastic contact on a hinged beam conserves energy through the constraint.
a=anchor('a');b=solid('b',1,0);b.mass=1;b.inertia=Geometry.inertia(b);const ball={id:'ball',type:'mass',name:'Ball',shape:'circle',radius:.15,x:1,y:.8,mass:1,vx:0,vy:-1,angle:0,omega:0,restitution:1,friction:0,inertia:.01125};m=model([a,b,ball],[hinge('a','b')]);m.gravityOn=false;
for(let i=0;i<240;i++)Physics.step(m);near(Physics.energy(m),.5,1e-9);assert.ok(ball.vy>0);assert.ok(b.omega<-.1);near(Joints.maxError(m),0,1e-9);
// Example exercises a ground hinge and a moving-body hinge together.
m=run('hingeExample()');Physics.prepare(m);const start=Physics.energy(m);peak=0;for(let i=0;i<1200;i++){Physics.step(m);peak=Math.max(peak,Math.abs(Physics.energy(m)-start)/Math.abs(start));}assert.ok(peak<1e-5,`double pendulum energy ${peak}`);assert.ok(Joints.maxError(m)<1e-9);
const frame={t:5,states:m.bodies.filter(b=>b.type==='mass').map(b=>({...b})),energy:Physics.energy(m),reactions:m.bars.map(h=>({id:h.id,...h.reaction}))};
assert.ok(PlotAxes.options(m).some(o=>o.value==='bar:middleHinge:relativeAngle'));assert.ok(!AttachedMonitors.options(m,'middleHinge').some(o=>/:(tension|angle)$/.test(o.value)));near(PlotAxes.value(m,frame,'bar:middleHinge:relativeAngle'),m.bodies[2].angle-m.bodies[1].angle);assert.ok(PlotAxes.value(m,frame,'bar:middleHinge:magnitude')>0);
const point=AttachedMonitors.anchor(m,'middleHinge'),pin=Joints.endpoint(m.bodies[1],{x:0,y:-.8});near(point.x,pin.x);near(point.y,pin.y);
// Validation preserves joint identity and rejects unsupported or singular encodings.
let raw=clone(run('hingeExample()'));assert.equal(validate(raw).bars[1].joint,'hinge');raw.bars[0].length=.01;assert.throws(()=>validate(raw),/Invalid rigid bar/);raw=clone(run('hingeExample()'));raw.bars[0].joint='unknown';assert.throws(()=>validate(raw),/Invalid rigid bar/);raw=clone(run('hingeExample()'));raw.bars[0].localB.x=Infinity;assert.throws(()=>validate(raw),/attachment/);
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/hinged-double-pendulum.json'))),clone(run('hingeExample()')));
console.log('PASS: two-axis hinge constraints, analytical physical pendulum, fixed-ground freedom, reactions, assembly/conflicts, free momentum/angular momentum/energy, coupled double pendulum, impact response, monitors and validation');
