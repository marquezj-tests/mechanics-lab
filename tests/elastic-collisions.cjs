const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const {Physics,Geometry,Collisions}=vm.runInNewContext(html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='))+';({Physics,Geometry,Collisions})');
let serial=0;const circle=(x,y,vx=0,vy=0,extra={})=>{const b={id:'elastic'+serial++,name:'Disk',type:'mass',shape:'circle',x,y,vx,vy,mass:1,radius:.5,angle:0,omega:0,restitution:1,friction:0,...extra};b.inertia=Geometry.inertia(b);return b;};
const box=(x,y,width,height,extra={})=>{const b={...circle(x,y),shape:'rectangle',width,height,...extra};b.inertia=Geometry.inertia(b);return b;};
const model=bodies=>({bodies,springs:[],bars:[],gravityOn:false,gravity:9.81});
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const momentum=m=>m.bodies.reduce((p,b)=>({x:p.x+(b.fixed?0:b.mass*b.vx),y:p.y+(b.fixed?0:b.mass*b.vy),angular:p.angular+(b.fixed?0:b.mass*(b.x*b.vy-b.y*b.vx)+b.inertia*b.omega)}),{x:0,y:0,angular:0});
// Elastic restitution must also hold far below the old 0.5 m/s cutoff.
for(const speed of [1e-5,.01,.1,1,10]){const a=circle(-.499999,0,speed),b=circle(.499999,0,0),m=model([a,b]),energy=Physics.energy(m);Collisions.solve(m);near(a.vx,0,speed*1e-10);near(b.vx,speed,speed*1e-10);near(Physics.energy(m)/energy,1);}
// An oblique contact must preserve tangential motion, angular momentum and energy.
let a=circle(-.45,0,.1,.04,{mass:2,omega:.3}),b=circle(.45,.1,-.03,-.02,{mass:3,omega:-.2}),m=model([a,b]),before=momentum(m),energy=Physics.energy(m);
Collisions.solve(m);const after=momentum(m);near(Physics.energy(m),energy);for(const key of ['x','y','angular'])near(after[key],before[key]);
// Simultaneous contacts include an initially separating neighbor. A zero target
// for that neighbor used to violate energy conservation in the contact solve.
for(const velocities of [[.1,0,.05],[.1,0,0],[.1,0,-.1]]){m=model(velocities.map((v,i)=>circle((i-1)*.999999,0,v)));energy=Physics.energy(m);before=momentum(m);Collisions.solve(m);near(Physics.energy(m),energy);near(momentum(m).x,before.x);assert.ok(m.bodies[1].vx>=m.bodies[0].vx-1e-10&&m.bodies[2].vx>=m.bodies[1].vx-1e-10);}
// Two contact points on a box should not turn a centered impact into spin.
a=box(0,.749999,1,1,{vy:-.05});b=box(0,0,10,.5,{fixed:true});m=model([a,b]);energy=Physics.energy(m);Collisions.solve(m);near(a.vy,.05);near(a.omega,0);near(Physics.energy(m),energy);
// A geometric separation must not change a connected spring's potential energy.
a=circle(-.499999,0,.1,0,{friction:.3});b=circle(.499999,0,0);m=model([a,b]);m.bodies.push({id:'anchor',type:'anchor',x:2,y:0});m.springs=[{id:'spring',a:b.id,b:'anchor',k:12,rest:1.5,damping:0}];energy=Physics.energy(m);const positions=m.bodies.map(b=>[b.x,b.y]);Collisions.solve(m);near(Physics.energy(m),energy);assert.deepEqual(m.bodies.map(b=>[b.x,b.y]),positions);
// Bar constraints participate in the impact's effective mass, so a later
// constraint projection cannot discard the kinetic energy of the rebound.
a=circle(-1,0,0,-.1,{radius:.25});b=circle(1,1,0,-.1,{radius:.25});const floor=box(-1,-.7,2,.2,{fixed:true});m=model([a,b,floor]);m.bars=[{id:'bar',a:a.id,b:b.id,localA:{x:0,y:0},localB:{x:0,y:0},length:Math.sqrt(5)}];energy=Physics.energy(m);let barPeak=0;for(let i=0;i<2400;i++){Physics.step(m);barPeak=Math.max(barPeak,Math.abs(Physics.energy(m)/energy-1));}assert.ok(barPeak<1e-5,`bar-connected impact energy error ${barPeak}`);
console.log('PASS: low-speed elastic restitution, unequal/oblique impacts, linear/angular momentum, simultaneous contacts, box manifolds, spring potential and bar-connected elastic impacts');
// The original 10 s test missed substantial loss later in the recording.
m=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/spring-lattice-3x3.json'),'utf8'));energy=Physics.energy(m);before=momentum(m);let peak=0;for(let i=0;i<28800;i++){Physics.step(m);peak=Math.max(peak,Math.abs(Physics.energy(m)/energy-1));}
const final=Physics.energy(m),p=momentum(m);assert.ok(peak<.0002,`120 s peak relative energy error ${peak}`);for(const key of ['x','y','angular'])near(p[key],before[key],1e-8);assert.ok(m._solverRefinements>0,'elastic impact timing was refined');
console.log('PASS: 120 s elastic lattice; '+JSON.stringify({initialEnergy:energy,finalEnergy:final,finalRelativeChange:final/energy-1,peakRelativeError:peak}));
