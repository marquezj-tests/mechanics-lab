const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const{app}=require('./helpers/app.cjs');const{run}=app();const{Geometry,Collisions,Physics,validate}=run('({Geometry,Collisions,Physics,validate})');
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`),clone=x=>JSON.parse(JSON.stringify(x));
const evolve=(m,t)=>{for(let i=0;i<Math.round(t/Physics.dt);i++)Physics.step(m);};
function flat(push=4,vx=0){const m=run('frictionExample()');m.bodies=m.bodies.slice(0,2);m.forces=m.forces.slice(0,1);m.forces[0].fx=push;m.bodies[0].vx=vx;m.bodies[1].width=40;m.bodies[1].inertia=Geometry.inertia(m.bodies[1]);return m;}
// Static friction can hold any push below mu_s*N, without accumulating position drift.
for(const push of [-5.8,-4,0,4,5.8]){const m=flat(push),b=m.bodies[0],x=b.x;for(let i=0;i<480;i++){Physics.step(m);near(b.vx,0);near(b.x,x);near(b.angle,0);}}
// Breakaway uses kinetic friction, not the larger static bound.
for(const push of [-7,7]){const m=flat(push),b=m.bodies[0],x=b.x,a=push-Math.sign(push)*.3*9.81;evolve(m,1);near(b.vx,a);near(b.x,x+.5*a);near(b.omega,0);}
// Once sliding, a force between the kinetic and static limits cannot stop it.
let m=flat(4,1),b=m.bodies[0],x=b.x;evolve(m,1);near(b.vx,1+(4-2.943));near(b.x,x+1+.5*(4-2.943));
// A very small but real sliding speed must not be captured by the static trial.
m=flat(4,1e-5);evolve(m,.5);near(m.bodies[0].vx,1e-5+(4-2.943)*.5);
// A sub-kinetic push decelerates the block until it sticks, without reversing direction.
m=flat(0,2);b=m.bodies[0];x=b.x;const e0=Physics.energy(m);let previous=e0;for(let i=0;i<360;i++){Physics.step(m);assert.ok(b.vx>=-1e-8);assert.ok(Physics.energy(m)<=previous+1e-10);previous=Physics.energy(m);}near(b.vx,0);near(b.x-x,4/(2*.3*9.81),.002);const restX=b.x;evolve(m,1);near(b.x,restX);near(b.omega,0);
// Surface pairs use geometric means independently for both coefficients.
m=flat(7);m.bodies[0].staticFriction=.8;m.bodies[1].staticFriction=.45;m.bodies[0].kineticFriction=.5;m.bodies[1].kineticFriction=.18;evolve(m,.5);near(m.bodies[0].vx,4.057*.5);
// Incline: sticking below the static threshold, sliding above it with the analytic rate.
function incline(theta,muS,muK){const m=flat(0),u={x:Math.cos(theta),y:Math.sin(theta)},n={x:-u.y,y:u.x},b=m.bodies[0],floor=m.bodies[1];floor.x=floor.y=0;floor.angle=theta;floor.width=20;floor.inertia=Geometry.inertia(floor);b.x=n.x*(.4-.0001);b.y=n.y*(.4-.0001);b.angle=theta;for(const obj of [b,floor]){obj.staticFriction=muS;obj.kineticFriction=muK;}return m;}
m=incline(.3,.5,.2);b=m.bodies[0];x=b.x;const y=b.y;evolve(m,1);near(b.x,x,1e-6);near(b.y,y,1e-6);near(b.vx,0,1e-6);near(b.omega,0,1e-6);
m=incline(.4,.3,.2);b=m.bodies[0];evolve(m,.5);const acceleration=9.81*(Math.sin(.4)-.2*Math.cos(.4));near(b.vx,-acceleration*.5*Math.cos(.4),2e-5);near(b.vy,-acceleration*.5*Math.sin(.4),2e-5);
// Frictionless explicit pairs retain elastic energy; no presolve may arrest an impact.
const circle=(id,x,vx)=>{const b={id,type:'mass',name:id,shape:'circle',radius:.5,mass:1,x,y:0,vx,vy:0,angle:0,omega:0,restitution:1,friction:0,staticFriction:0,kineticFriction:0};b.inertia=Geometry.inertia(b);return b;};m={bodies:[circle('a',-1,1),circle('b',1,-1)],springs:[],forces:[],bars:[],gravityOn:false,gravity:9.81};evolve(m,1);near(m.bodies[0].vx,-1);near(m.bodies[1].vx,1);near(Physics.energy(m),1);
// Static friction supports rolling without sliding; it is not a drag on all motion.
let floor={id:'floor',type:'mass',name:'Floor',shape:'rectangle',width:30,height:.3,mass:1,x:0,y:0,vx:0,vy:0,angle:0,omega:0,fixed:true,restitution:0,friction:.2,staticFriction:.5,kineticFriction:.2};floor.inertia=Geometry.inertia(floor);let roller={...circle('roller',0,1),y:.65-.0001,restitution:0,staticFriction:.5,kineticFriction:.2,friction:.2,omega:-2};m={bodies:[roller,floor],springs:[],forces:[],bars:[],gravityOn:true,gravity:9.81};const rollingEnergy=Physics.energy(m);evolve(m,1);near(roller.vx,1,2e-4);near(roller.vx+roller.omega*.5,0,2e-4);near(Physics.energy(m),rollingEnergy,1e-4);
// Joint-coupled friction impulses preserve a welded pair while one part touches the floor.
m=flat(4);const original=m.bodies[0],appendage={...clone(original),id:'appendage',name:'Appendage',x:original.x,y:original.y+1};m.bodies.push(appendage);m.bars=[{id:'weld',type:'bar',joint:'weld',name:'Weld',a:original.id,b:appendage.id,localA:{x:0,y:.5},localB:{x:0,y:-.5},length:0,referenceAngle:0,collideConnected:false}];evolve(m,.5);near(original.vx,0,1e-6);near(appendage.vx,0,1e-6);near(original.x,-3,1e-6);assert.ok(run('Joints').maxError(m)<1e-7);
// New coefficients round-trip; legacy files stay legacy and map one value to both.
let raw=clone(run('frictionExample()')),loaded=validate(raw);near(loaded.bodies[0].staticFriction,.6);near(loaded.bodies[0].kineticFriction,.3);near(loaded.bodies[0].friction,.3);
const legacyRaw=clone(run('collisionExample()'));for(const b of legacyRaw.bodies){delete b.staticFriction;delete b.kineticFriction;}const legacy=validate(legacyRaw);assert.ok(legacy.bodies.every(b=>b.staticFriction===undefined&&b.kineticFriction===undefined));near(Collisions.coefficients(legacy.bodies[0]).static,.35);near(Collisions.coefficients(legacy.bodies[0]).kinetic,.35);
for(const [key,value]of [['staticFriction',-.1],['kineticFriction',-.1],['staticFriction',2.1],['kineticFriction',Infinity],['staticFriction',NaN],['staticFriction',null],['kineticFriction',null],['kineticFriction',.7]]){raw=clone(run('frictionExample()'));raw.bodies[0][key]=value;assert.throws(()=>validate(raw),/Invalid static or kinetic friction/);}
// Both blocks remain finite after the inelastic stop engages.
m=run('frictionExample()');evolve(m,3);assert.ok(m.bodies.every(b=>Number.isFinite(b.x+b.y+b.vx+b.vy)));assert.ok(m.bodies[3].x<4.3);near(m.bodies[0].x,-3,1e-6);
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/static-vs-kinetic-friction.json'))),clone(run('frictionExample()')));
console.log('PASS: static threshold/no creep, signed kinetic acceleration, persistent sliding, stopping/no reversal/energy, material mixing, inclines, explicit-zero elastic contact, stops and legacy/paired validation');
