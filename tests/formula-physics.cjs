const assert=require('node:assert/strict');const{app}=require('./helpers/app.cjs');const{run}=app();const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// Driven harmonic oscillator x = A/(omega0²-omega²) * (cos(omega*t)-cos(omega0*t)).
let errors=[];for(const precision of ['standard','high','veryHigh']){const r=run(`(()=>{const m=drivenExample();m.solverPrecision='${precision}';let error=0;for(let i=0;i<2400;i++){Physics.step(m);const analytic=Formulas.evaluate(m.calculations[0].expression,{A:1,f:.25,t:m._time});error=Math.max(error,Math.abs(m.bodies[1].x-analytic));}return {error,t:m._time};})()`);near(r.t,10);errors.push(r.error);}assert.ok(errors[1]<errors[0]/3.5);assert.ok(errors[2]<errors[1]/3.5);assert.ok(errors[2]<5e-6,JSON.stringify(errors));
// Time-dependent acceleration F=2t: v=t², x=t³/3, with Verlet quadrature accuracy.
let r=run(`(()=>{const m=drivenExample();m.springs=[];m.forces[0].expressions.fx='2*t';for(let i=0;i<240;i++)Physics.step(m);return {x:m.bodies[1].x,v:m.bodies[1].vx,t:m._time};})()`);near(r.v,1);near(r.x,1/3,2e-6);near(r.t,1);
// A varying pure torque changes angular momentum without translating the shaft.
r=run(`(()=>{const m=torqueExample();m.forces=m.forces.slice(0,1);m.forces[0].expressions={torque:'2*t'};for(let i=0;i<240;i++)Physics.step(m);return m;})()`);near(r.bodies[0].omega,1);near(r.bodies[0].x,-3);
// Formula motor targets are resolved per substep, with energy recorded as mechanical work.
r=run(`(()=>{const m=motorExample();m.forces[0].expressions={speed:'min(t,1)'};m.forces[0].maxTorque=4;for(let i=0;i<480;i++)Physics.step(m);return {m,e:Physics.energy(m)};})()`);near(r.m.bodies[0].omega,1);near(r.m.bodies[1].omega,-.5);near(r.m.forces[0].reaction.work,r.e,1e-8);
// Blank formulas retain numeric fallbacks even alongside an active formula load.
run(`(()=>{const m=drivenExample();m.forces.push({...copy(m.forces[0]),id:'constant',fx:1,expressions:{},bindings:{}});Physics.step(m);JSON.stringify(m);if(m.forces[1]._values)throw Error('Numeric fallback should not cache itself');})()`);
// Retry rolls back simulation time along with provisional loads and motor work.
r=run(`(()=>{const m=motorExample();m.forces[0].expressions={speed:'t'};const original=Collisions.solve;let retry=true;Collisions.solve=(...args)=>{if(retry){retry=false;const e=Error('retry');e.collisionRetry=true;throw e;}return original(...args);};try{Physics.step(m);}finally{Collisions.solve=original;}return {m,e:Physics.energy(m)};})()`);near(r.m._time,1/240);near(r.m.forces[0].reaction.work,r.e);
// Recorded input evaluation uses frame time and frame body values, independent of live state.
r=run(`(()=>{const m=drivenExample(),f=m.forces[0];f.expressions={fx:'x+u1+t'};f.bindings={u1:'body:mass1:vx'};const record={t:2,states:[{id:'mass1',x:3,vx:4}]};m.bodies[1].x=99;m.bodies[1].vx=99;return PlotAxes.reaction(m,record,f.id).fx;})()`);near(r,9);
console.log('PASS: analytical forced-oscillator convergence',errors,'time-driven force/torque, motor work, retry clock rollback and recorded input evaluation');
