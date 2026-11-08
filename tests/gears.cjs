const assert=require('node:assert/strict'),fs=require('node:fs');const {app}=require('./helpers/app.cjs');const {run}=app();
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`),clone=x=>JSON.parse(JSON.stringify(x));
// A 1 N m drive sees I_A + r² I_B = 2 kg m²: alpha_A=.5, alpha_B=-.25.
let result=run(`(()=>{const m=gearExample();for(let i=0;i<2400;i++)Physics.step(m);return {m,e:Physics.energy(m),error:Joints.maxError(m)};})()`),m=result.m;
near(m.bodies[0].omega,5);near(m.bodies[1].omega,-2.5);near(m.bodies[0].angle,25);near(m.bodies[1].angle,-12.5);near(result.e,25);near(result.error,0);near(m.bars[0].reaction.momentA,-.5);near(m.bars[0].reaction.momentB,-1);near(m.bars[0].reaction.fx,0);near(m.bars[0].reaction.fy,0);
// Free rotation preserves energy and unwrapped phase for signed, noninteger ratios.
for(const ratio of [-100,-2.3,-.01,.01,.37,100]){
 result=run(`(()=>{const m=gearExample(),g=m.bars[0],a=m.bodies[0],b=m.bodies[1];m.forces=[];g.ratio=${ratio};a.angle=43;b.angle=-22;g.phase=b.angle-g.ratio*a.angle;a.omega=2;b.omega=g.ratio*a.omega;const start=Physics.energy(m);for(let i=0;i<1200;i++)Physics.step(m);return {m,start,end:Physics.energy(m),error:Joints.maxError(m)};})()`);
 near(result.end,result.start,1e-7);assert.ok(result.error<1e-8);near(result.m.bodies[1].omega,ratio*result.m.bodies[0].omega,1e-8);
}
// Three shafts with two ratios compose; power transfer is conservative on each link.
result=run(`(()=>{const m=gearExample(),a=m.bodies[0],b=m.bodies[1],c={...copy(a),id:'third',x:6,support:{kind:'pinned',x:6,y:0}};m.bodies.push(c);m.bars.push({...copy(m.bars[0]),id:'gear2',a:b.id,b:c.id,ratio:2});for(let i=0;i<240;i++)Physics.step(m);return m;})()`);
const [a,b,c]=result.bodies,alpha=1/(a.inertia+.25*b.inertia+c.inertia);near(a.omega,alpha);near(b.omega,-.5*alpha);near(c.omega,-alpha);for(const g of result.bars){near(g.reaction.momentA+g.ratio*g.reaction.momentB,0);const u=result.bodies.find(b=>b.id===g.a),v=result.bodies.find(b=>b.id===g.b);near(g.reaction.momentA*u.omega+g.reaction.momentB*v.omega,0);}
// Angular-only constraint: translation is independent; a fixed shaft holds the other.
result=run(`(()=>{const m=gearExample();m.forces=[];for(const b of m.bodies)delete b.support;m.bodies[0].vx=1;m.bodies[1].vy=2;for(let i=0;i<240;i++)Physics.step(m);return m;})()`);near(result.bodies[0].x,0);near(result.bodies[1].y,2);
result=run(`(()=>{const m=gearExample();m.bodies[1].fixed=true;Physics.step(m);return m;})()`);near(result.bodies[0].omega,0);near(result.bars[0].reaction.momentA,-1);near(result.bars[0].reaction.momentB,-2);
// Velocity preparation removes incompatible initial motion once; integration then stays conservative.
result=run(`(()=>{const m=gearExample();m.forces=[];m.bodies[0].omega=2;Physics.prepare(m);const start=Physics.energy(m);for(let i=0;i<240;i++)Physics.step(m);return {m,start,end:Physics.energy(m)};})()`);near(result.m.bodies[0].omega,1);near(result.m.bodies[1].omega,-.5);near(result.start,result.end);
// Elastic off-center impact uses the inertia of both geared shafts, preserving kinetic energy.
result=run(`(()=>{const m=gearExample();m.forces=[];const ball={...copy(m.bodies[0]),id:'ball',x:10,vx:-1,mass:1,inertia:.5};delete ball.support;m.bodies.push(ball);const before=Physics.energy(m),response=Joints.impactResponse(m,m.bodies[0],{x:0,y:1},ball,{x:0,y:0},{x:1,y:0}),effective=response.response[6]+response.response[2];Joints.applyImpact(m,response,2/effective);return {before,after:Physics.energy(m),m};})()`);near(result.before,result.after);near(result.m.bodies[0].omega,2/3);near(result.m.bodies[1].omega,-1/3);near(result.m.bodies[2].vx,1/3);
assert.throws(()=>run(`(()=>{const m=gearExample();m.bodies.forEach(b=>b.fixed=true);m.bars[0].phase=1;Physics.prepare(m);})()`),/constraint|satisf|conflict/i);
// Saved definitions retain signed ratio/phase; malformed endpoints and singular ratios are rejected.
for(const field of ['ratio','phase'])for(const value of [undefined,null,NaN,Infinity]){const raw=clone(run('gearExample()'));raw.bars[0][field]=value;assert.throws(()=>run(`validate(${JSON.stringify(raw)})`),/Invalid ideal gear/);}
for(const ratio of [0,.001,-.001,101,-101]){const raw=clone(run('gearExample()'));raw.bars[0].ratio=ratio;assert.throws(()=>run(`validate(${JSON.stringify(raw)})`),/Invalid ideal gear/);}
for(const modify of [m=>m.bars[0].localA.x=1,m=>{m.bodies[0]={id:'driver',name:'point',type:'mass',x:-1,y:0,mass:2,vx:0,vy:0};}]){const raw=clone(run('gearExample()'));modify(raw);assert.throws(()=>run(`validate(${JSON.stringify(raw)})`),/Invalid ideal gear/);}
assert.deepEqual(JSON.parse(fs.readFileSync(__dirname+'/../examples/ideal-gear-transmission.json')),clone(run('gearExample()')));
console.log('PASS: analytical gear acceleration/torques, many-turn signed ratios, conservation, three-shaft chains, independent translation, fixed shaft, initial projection and schema validation');
