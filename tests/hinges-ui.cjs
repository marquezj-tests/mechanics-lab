const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {app,html}=require('./helpers/app.cjs');const {run,node}=app();
assert.match(html,/data-tool="hinge"[^>]*aria-label="Hinge"/);
run("replaceExperiment({...example(),bodies:[{id:'a',type:'anchor',name:'Anchor',x:-3,y:1}],springs:[]});createSolid('rectangle',{x:0,y:0});globalThis.solidId=selected;W=1000;H=600;setTool('hinge');");
function click(x,y){const p=run(`screen(${x},${y})`);node('scene').listeners.pointerdown({button:0,clientX:p.x,clientY:p.y,pointerId:1,pointerType:'mouse'});node('scene').listeners.pointerup({type:'pointerup'});}
click(-3,1);click(.7,.3);assert.equal(run('model.bars.length'),1);assert.equal(run('model.bars[0].joint'),'hinge');assert.equal(run('model.bars[0].length'),0);assert.ok(run('Math.abs(model.bars[0].localB.x-.7)<1e-12'));assert.match(node('properties').innerHTML,/Ideal hinge/);assert.doesNotMatch(node('properties').innerHTML,/data-key="length"/);
run("globalThis.hingeId=selected;setTool('select');const ends=linkEnds(object(hingeId));globalThis.mid={x:(ends.a.x+ends.b.x)/2,y:(ends.a.y+ends.b.y)/2};draw();");
assert.equal(run('nearest(screen(mid.x,mid.y).x,screen(mid.x,mid.y).y).id'),run('hingeId'));assert.ok(run('boxSelection(screen(mid.x-.1,mid.y+.1),screen(mid.x+.1,mid.y-.1)).includes(hingeId)'));
run("addCanvasMonitor(hingeId,'bar:'+hingeId+':magnitude');copySelection();pasteSelection();");assert.equal(run('model.bars.length'),2);assert.equal(run('model.bars[1].joint'),'hinge');assert.equal(run('model.canvasMonitors.length'),2);assert.ok(run('model.canvasMonitors[1].variable.includes(encodeURIComponent(model.bars[1].id))'));
node('saveFilename').value='hinge';node('saveForm').listeners.submit({preventDefault(){}});assert.equal(JSON.parse(run('downloads.at(-1).text')).bars[1].joint,'hinge');
run('validate(copy(initial));selected=hingeId;deleteSelected();');assert.equal(run('model.bars.length'),1);node('undo').onclick();assert.equal(run('model.bars.length'),2);
// Resize keeps local pins attached to geometry; inspector coordinates stay editable.
run('selected=hingeId;const previous=copy(body(solidId));body(solidId).width*=2;scaleBarAttachments(body(solidId),previous);edited();');assert.ok(run('Math.abs(object(hingeId).localB.x-1.4)<1e-12'));
const input={dataset:{key:'by'},type:'number',value:'.2',min:'',max:'',validity:{badInput:false},listeners:{},addEventListener(k,f){this.listeners[k]=f;}};
node('properties').querySelectorAll=selector=>selector==='[data-key]'?[input]:[];run('properties();');input.listeners.change();assert.equal(run('object(hingeId).localB.y'),.2);node('properties').querySelectorAll=()=>[];
// Preset runs, records, replays and resets; hinge picks work even inside a solid.
node('hingePreset').onclick();run("setTool('select');selected='middleHinge';properties();globalThis.pivotPoint=AttachedMonitors.anchor(model,selected);");assert.equal(run('nearest(screen(pivotPoint.x,pivotPoint.y).x,screen(pivotPoint.x,pivotPoint.y).y).id'),'middleHinge');
assert.match(node('properties').innerHTML,/reaction magnitude/);assert.doesNotMatch(run("AttachedMonitors.options(model,'middleHinge').map(o=>o.value).join(',')"),/:tension/);
const original=run('JSON.stringify(model.bodies)');run('for(let i=0;i<30;i++)advance();draw();');assert.equal(run('tick'),120);assert.ok(run('frames[30].reactions.some(r=>r.id==="middleHinge"&&Math.hypot(r.fx,r.fy)>0)'));
run('restoreFrame(0);draw();');assert.equal(run('JSON.stringify(model.bodies.map(b=>[b.x,b.y,b.angle]))'),run('JSON.stringify(initial.bodies.map(b=>[b.x,b.y,b.angle]))'));
run('reset();');assert.equal(run('JSON.stringify(model.bodies)'),original);
run("model.monitor='middleHinge';advance();");node('csv').onclick();assert.match(run('downloads.at(-1).text'),/reaction_magnitude_N/);
// Overlapping attachment workflow: second click selects the OTHER body.
run("replaceExperiment(hingeExample());model.bars=[];model.canvasMonitors=[];edited();setTool('hinge');globalThis.shared=Joints.endpoint(body('upper'),{x:0,y:-.8});");const shared=run('shared');click(shared.x,shared.y);const first=run('pending.id');click(shared.x,shared.y);assert.equal(run('model.bars.length'),1);assert.notEqual(run('model.bars[0].a'),run('model.bars[0].b'));assert.equal(run('model.bars[0].a'),first);
// File is exactly the built-in example in English and works offline in Spanish.
const saved=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/hinged-double-pendulum.json')));assert.deepEqual(JSON.parse(run('JSON.stringify(hingeExample())')),saved);
const es=app({language:null});es.node('hingePreset').onclick();assert.equal(es.run('model.name'),'Péndulo doble articulado');es.run("selected='middleHinge';properties();");assert.match(es.node('properties').innerHTML,/Articulación ideal/);assert.equal(es.run("plotLabel('bar:middleHinge:relativeAngle')"),'Articulación 2 · rotación relativa (rad)');
console.log('PASS: hinge builder/overlap picking, drawing/selection, attachment editing/resizing, copy/readout remapping, save/delete/undo, bilingual example, recording/replay/reset and CSV');
