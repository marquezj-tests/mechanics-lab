const assert=require('node:assert/strict');
const {app}=require('./helpers/app.cjs');
const {run,node}=app();
const errors=[];
for(const quality of ['standard','high','veryHigh']){
 run(`replaceExperiment({...example(),solverPrecision:'${quality}',bodies:[{id:'a',type:'anchor',name:'Anchor',x:0,y:0},{id:'m',type:'mass',name:'Mass',mass:1,x:2.5,y:0,vx:0,vy:0}],springs:[{id:'s',type:'spring',name:'Spring',a:'a',b:'m',k:64,rest:2,damping:0}]});globalThis.error=0;for(let i=1;i<=1200;i++){Physics.step(model);error=Math.max(error,Math.abs(model.bodies[1].x-(2+.5*Math.cos(8*i*Physics.dt))));}`);
 errors.push(run('error'));
 assert.equal(run('validate(JSON.parse(JSON.stringify(model))).solverPrecision'),quality);
}
assert.ok(errors[1]<errors[0]/3.8,JSON.stringify(errors));assert.ok(errors[2]<errors[1]/3.8,JSON.stringify(errors));
run('replaceExperiment(example());advance();advance();globalThis.originalX=initial.bodies[1].x;');
node('solverPrecision').value='high';node('solverPrecision').onchange();
assert.equal(run('model.solverPrecision'),'high');assert.equal(run('initial.solverPrecision'),'high');
assert.equal(run('tick'),0);assert.equal(run('frames.length'),1);assert.equal(run('model.bodies[1].x'),run('originalX'));
run('advance();advance();');assert.equal(run('frames[2].t'),2/60);
node('saveFilename').value='precision';node('saveForm').listeners.submit({preventDefault(){}});
assert.equal(JSON.parse(run('downloads.at(-1).text')).solverPrecision,'high');
run('reset();');assert.equal(run('model.solverPrecision'),'high');
node('solverPrecision').value='invalid';node('solverPrecision').onchange();assert.equal(run('model.solverPrecision'),'high');
run('document.getElementById("undo").onclick();');assert.equal(run("model.solverPrecision||'standard'"),'standard');
run("const old=example();delete old.solverPrecision;if((validate(old).solverPrecision||'standard')!=='standard')throw Error('Legacy default');for(const invalid of ['fast',null,2,{}]){let rejected=false;try{validate({...example(),solverPrecision:invalid});}catch(e){rejected=true;}if(!rejected)throw Error('Invalid precision accepted');}");
// Constraint forces are averaged over the base step regardless of refinement.
for(const quality of ['standard','high','veryHigh']){
 run(`replaceExperiment({...atwoodExample(false),solverPrecision:'${quality}'});for(let i=0;i<10;i++)advance();`);
 assert.ok(run('Math.abs(model.strings[0].reaction.tension-2*1*2*9.81/3)<1e-6'));
 assert.equal(run('model.strings[0].reaction.interval'),1/240);
}
console.log('PASS: precision convergence',errors,'; persistence, legacy validation, reset/undo, recording clock and constraint-force averaging');
