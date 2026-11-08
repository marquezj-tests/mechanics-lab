const assert=require('node:assert/strict');
const {app}=require('./helpers/app.cjs');
const {run,node}=app();
run("replaceExperiment({...example(),bodies:[{id:'a',type:'anchor',name:'Anchor',x:-3,y:2}],springs:[]});createSolid('rectangle',{x:0,y:0});globalThis.solidId=selected;W=1000;H=600;setTool('spring');");
function click(x,y){const p=run(`screen(${x},${y})`);node('scene').listeners.pointerdown({button:0,clientX:p.x,clientY:p.y,pointerId:1,pointerType:'mouse'});node('scene').listeners.pointerup({type:'pointerup'});}
click(-3,2);assert.equal(run('pending.id'),'a');click(.7,.45);
assert.equal(run('model.springs.length'),1);assert.ok(run('Math.abs(model.springs[0].localB.x-.7)<1e-12'));assert.ok(run('Math.abs(model.springs[0].localB.y-.45)<1e-12'));
assert.ok(run('Math.abs(model.springs[0].rest-Math.hypot(3.7,-1.55))<1e-12'));
assert.match(node('properties').innerHTML,/Attachment A x/);assert.match(node('properties').innerHTML,/Attachment B y/);
run('const spring=model.springs[0];globalThis.springId=spring.id;const ends=linkEnds(spring);globalThis.mid={x:(ends.a.x+ends.b.x)/2,y:(ends.a.y+ends.b.y)/2};draw();');
assert.equal(run('nearest(screen(mid.x,mid.y).x,screen(mid.x,mid.y).y).id'),run('springId'));
assert.ok(run('boxSelection(screen(mid.x-.05,mid.y+.05),screen(mid.x+.05,mid.y-.05)).includes(springId)'));
assert.ok(run('Math.abs(AttachedMonitors.anchor(model,springId).x-mid.x)<1e-12'));
// Inspector edits the real local attachment coordinates, including legacy fields.
const input={dataset:{key:'bx'},type:'number',value:'1.1',min:'',max:'',validity:{badInput:false},listeners:{},addEventListener(k,f){this.listeners[k]=f;}};
node('properties').querySelectorAll=selector=>selector==='[data-key]'?[input]:[];run('properties();');input.listeners.change();assert.equal(run('model.springs[0].localB.x'),1.1);node('properties').querySelectorAll=()=>[];
run('const previous=copy(body(solidId));body(solidId).width*=2;body(solidId).height*=.5;scaleBarAttachments(body(solidId),previous);edited();');
assert.equal(run('model.springs[0].localB.x'),2.2);assert.equal(run('model.springs[0].localB.y'),.225);
run('selected=springId;addCanvasMonitor(springId,"spring:"+springId+":momentB");copySelection();pasteSelection();draw();');assert.equal(run('model.springs.length'),2);
assert.equal(run('model.springs[1].localB.x'),2.2);assert.equal(run('model.canvasMonitors.length'),2);
node('saveFilename').value='off-center';node('saveForm').listeners.submit({preventDefault(){}});
assert.equal(JSON.parse(run('downloads.at(-1).text')).springs[1].localB.x,2.2);
run('validate(JSON.parse(JSON.stringify(initial)));selected=solidId;deleteSelected();');assert.equal(run('model.springs.length'),1);
node('undo').onclick();assert.equal(run('model.springs.length'),2);assert.equal(run('model.springs[0].localB.x'),2.2);
// The educational preset exercises spring torque and optional angular damping.
node('offCenterSpringPreset').onclick();assert.equal(run('model.springs[0].localB.x'),1);assert.equal(run('body("beam").support.kind'),'pinned');
run('const initialAngle=body("beam").angle;for(let i=0;i<30;i++)advance();draw();');assert.equal(run('tick'),120);assert.ok(run('Math.abs(body("beam").angle-initialAngle)>.05'));
assert.ok(run('frames.some(f=>Math.abs(PlotAxes.reaction(model,f,"spring1").momentB)>.01)'));
const es=app({language:null});es.node('offCenterSpringPreset').onclick();assert.match(es.run('model.name'),/resorte excéntrico/);es.run('selected="spring1";properties();');assert.match(es.node('properties').innerHTML,/unión giran con cada cuerpo/);
console.log('PASS: spring attachment clicks/rest length, rendered picking/box selection and monitor position, inspector edits, resizing, copy/paste/save/delete/undo, off-center oscillator and Spanish UI');
