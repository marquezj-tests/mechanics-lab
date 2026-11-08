const assert=require('node:assert/strict');
const {app}=require('./helpers/app.cjs');
const {run,node}=app();
run("replaceExperiment({...example(),bodies:[-2,0,2].map((x,i)=>({id:'m'+i,type:'mass',name:'Mass '+i,x,y:0,mass:1,vx:0,vy:0})),springs:[{id:'s',type:'spring',name:'Spring',a:'m0',b:'m1',k:8,rest:2,damping:0}]});W=1000;H=600;selectIds([]);");
const event=(x,y)=>{const p=run(`screen(${x},${y})`);return {button:0,clientX:p.x,clientY:p.y,pointerId:1,pointerType:'touch',preventDefault(){}};};
const down=(x,y)=>node('scene').listeners.pointerdown(event(x,y));
const move=(x,y)=>node('scene').listeners.pointermove(event(x,y));
const up=()=>node('scene').listeners.pointerup({type:'pointerup'});
const ids=()=>run('JSON.stringify([...selectionIds()].sort())');
// Existing default: an empty touch drag pans rather than selecting.
down(-3,-1);move(-2,-.5);assert.equal(run('!!drag.pan'),true);up();assert.equal(ids(),'[]');
run('model.view.x=0;model.view.y=0;');
node('boxSelect').onclick();assert.equal(node('boxSelect')['aria-pressed'],'true');
const history=run('history.length');
down(-2,0);up();down(0,0);up();assert.equal(ids(),'["m0","m1"]');
down(-2,0);up();assert.equal(ids(),'["m1"]');
// Box selection adds objects and links without requiring Shift.
down(-3,-1);move(.5,1);up();assert.equal(ids(),'["m0","m1","s"]');
assert.equal(run('history.length'),history);
node('copySelection').onclick();node('pasteSelection').onclick();
assert.equal(run('model.bodies.length'),5);assert.equal(run('model.springs.length'),2);
node('undo').onclick();assert.equal(run('model.bodies.length'),3);
// Toggle off to move the selected group using normal direct manipulation.
node('boxSelect').onclick();run("selectIds(['m0','m1']);");node('boxSelect').onclick();
assert.equal(node('boxSelect')['aria-pressed'],'false');
down(-2,0);move(-1,1);up();assert.equal(run('body("m0").x'),-1);assert.equal(run('body("m1").y'),1);
// Explicit pan works even when starting on a body, without editing its pose.
node('panCanvas').onclick();assert.equal(node('panCanvas')['aria-pressed'],'true');
const x=run('body("m0").x'),count=run('history.length');down(-1,1);move(0,2);assert.equal(run('!!drag.pan'),true);up();assert.equal(run('body("m0").x'),x);assert.equal(run('history.length'),count);
run("setTool('spring');");assert.equal(node('panCanvas')['aria-pressed'],'false');
// Selection during playback inspection preserves recording and time.
run('replaceExperiment(example());advance();advance();selectIds([]);');node('boxSelect').onclick();
const tick=run('tick'),frames=run('frames.length');
down(-5,-3);move(5,3);up();assert.ok(run('selectionIds().size')>=2);assert.equal(run('tick'),tick);assert.equal(run('frames.length'),frames);
const selected=ids();down(-5,-3);move(0,0);node('scene').listeners.pointercancel({type:'pointercancel'});assert.equal(ids(),selected);
// An empty tap clears selection, while cancelled gestures leave it alone.
down(-5,-3);up();assert.equal(ids(),'[]');
run("setTool('select');");assert.equal(node('boxSelect')['aria-pressed'],'false');
console.log('PASS: touch additive taps/boxes, clear/cancel, group copy/paste/undo/move, explicit pan, tool reset, and recording-preserving selection');
