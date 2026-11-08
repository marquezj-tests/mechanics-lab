const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const geometry=html.match(/const Geometry = \(\(\)=>\{[\s\S]*?\n\}\)\(\);/)[0];
const source=html.match(/const Physics = \(\(\)=>\{[\s\S]*?\n\}\)\(\);/)[0];
const Geometry=vm.runInNewContext(geometry+';Geometry');
assert.ok(Math.abs(Geometry.inertia({shape:'rectangle',mass:3,width:4,height:2})-5)<1e-12);
assert.equal(Geometry.inertia({shape:'circle',mass:2,radius:3}),9);
const poly=Geometry.polygon([{x:0,y:0},{x:4,y:0},{x:0,y:3}]);
assert.ok(Math.abs(poly.cx-4/3)<1e-12);assert.equal(poly.cy,1);
assert.ok(Math.abs(Geometry.inertia({shape:'triangle',mass:1,vertices:poly.vertices})-25/18)<1e-12);
assert.throws(()=>Geometry.polygon([{x:0,y:0},{x:2,y:2},{x:0,y:2},{x:2,y:0}]));
assert.throws(()=>Geometry.polygon([{x:0,y:0},{x:1,y:0},{x:2,y:0}]));
const concave=Geometry.polygon([{x:0,y:0},{x:3,y:0},{x:3,y:3},{x:1.5,y:1},{x:0,y:3}]);
assert.equal(concave.vertices.length,5);
const b={shape:'rectangle',mass:1,width:2,height:1,x:3,y:-2,angle:.7};
assert.ok(Geometry.contains(b,Geometry.world(b,{x:.5,y:0})));
assert.ok(!Geometry.contains(b,Geometry.world(b,{x:2,y:0})));
const local=Geometry.local(b,Geometry.world(b,{x:.2,y:.3}));assert.ok(Math.abs(local.x-.2)<1e-12&&Math.abs(local.y-.3)<1e-12);
// Headless DOM/canvas stubs exercise the real builder event handlers and drawing.
const windowListeners={};
const nodes=new Map(),context2d=new Proxy({}, {get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function node(id){if(!nodes.has(id))nodes.set(id,{value:id==='speed'?'1':'',checked:false,style:{},dataset:{},innerHTML:'',textContent:'',listeners:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},addEventListener(type,fn){this.listeners[type]=fn;},getContext(){return context2d;},getBoundingClientRect(){return {width:1000,height:600,left:0,top:0};},setPointerCapture(){},setAttribute(name,value){this[name]=value;},querySelectorAll(){return [];},querySelector(){return null;}});return nodes.get(id);}
const c=vm.createContext({console,localStorage:{getItem:()=>"en",setItem(){}},document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener(){}},window:{devicePixelRatio:1,addEventListener(type,fn){windowListeners[type]=fn;}},ResizeObserver:class {observe(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}});
vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],c);
const run=code=>vm.runInContext(code,c);
run("replaceExperiment({...example(),bodies:[],springs:[]});W=1000;H=600;createSolid('rectangle',{x:0,y:0});draw();");
assert.equal(run('body(selected).shape'),'rectangle');
run("let controls=solidControls(body(selected));let corner=controls[0].point;");
node('scene').listeners.pointerdown({button:0,clientX:run('corner.x'),clientY:run('corner.y'),pointerId:1});
node('scene').listeners.pointermove({clientX:run('corner.x-50'),clientY:run('corner.y+30')});
node('scene').listeners.pointerup({});
assert.ok(run('body(selected).width')>1.6);assert.ok(run('body(selected).height')>1);
run('controls=solidControls(body(selected));let r=controls[0].rotation;let center=screen(0,0);');
node('scene').listeners.pointerdown({button:0,clientX:run('r.x'),clientY:run('r.y'),pointerId:1});
node('scene').listeners.pointermove({clientX:run('center.x+(r.y-center.y)'),clientY:run('center.y-(r.x-center.x)')});
node('scene').listeners.pointerup({});
assert.ok(Math.abs(run('body(selected).angle')-Math.PI/2)<1e-12);
run("createSolid('circle',{x:3,y:0});createSolid('triangle',{x:0,y:3});polygonDraft=[{x:-4,y:0},{x:-2,y:0},{x:-3,y:2}];finishPolygon();draw();");
assert.equal(run('model.bodies.length'),4);
assert.equal(run('body(selected).shape'),'polygon');
run("let roundTrip=validate(JSON.parse(JSON.stringify(model)));replaceExperiment(roundTrip);body(selected).omega=1.2;let startAngle=body(selected).angle;edited();advance();");
assert.ok(Math.abs(run('body(selected).angle-startAngle')-.02)<1e-12);
run('restoreFrame(0);');assert.equal(run('body(selected).angle-startAngle'),0);
run('restoreFrame(1);');assert.ok(Math.abs(run('body(selected).angle-startAngle')-.02)<1e-12);
run("const saved=validate(JSON.parse(JSON.stringify(initial)));if(saved.bodies.length!==4)throw Error('Missing shapes');for(const b of saved.bodies)if(!(b.inertia>0))throw Error('Missing inertia');");
console.log('PASS: shape inertia, polygon centroids and validation, rotated picking, builder creation, corner resize/rotation, rendering, shape save/load, angular integration and replay');
run("document.getElementById('collisionPreset').onclick();draw();for(let i=0;i<120;i++)advance();const collisionFile=validate(JSON.parse(JSON.stringify(initial)));if(!collisionFile.bodies.find(b=>b.fixed))throw Error('Floor not saved');if(collisionFile.bodies[0].restitution!==.8||collisionFile.bodies[0].friction!==.35)throw Error('Collision properties not saved');if(model.bodies.some(b=>!Number.isFinite(b.x+b.y+b.angle+b.omega)))throw Error('Demo unstable');");
run("for(const property of ['restitution','friction']){const invalid=JSON.parse(JSON.stringify(initial));invalid.bodies[0][property]=-1;let rejected=false;try{validate(invalid);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid collision material accepted');}");
console.log('PASS: collision example, floor persistence, collision material round-trip and validation');
run("replaceExperiment({...example(),bodies:[{id:'pin',type:'anchor',name:'Pin',x:-2,y:0}],springs:[],bars:[]});createSolid('rectangle',{x:2,y:0});W=1000;H=600;setTool('bar');");
function clickWorld(x,y){const p=run(`screen(${x},${y})`);node('scene').listeners.pointerdown({button:0,clientX:p.x,clientY:p.y,pointerId:1});node('scene').listeners.pointerup({});}
clickWorld(-2,0);clickWorld(2.5,.4);
assert.equal(run('model.bars.length'),1);
assert.ok(Math.abs(run('model.bars[0].localB.x')-.5)<1e-12);
run("draw();let barSave=validate(JSON.parse(JSON.stringify(model)));if(barSave.bars.length!==1||Math.abs(barSave.bars[0].localB.y-.4)>1e-10)throw Error('Bar round-trip failed');document.getElementById('duplicate').onclick();");
assert.equal(run('model.bars.length'),2);
run("selected=model.bodies.find(b=>b.shape).id;deleteSelected();");assert.equal(run('model.bars.length'),0);
run("document.getElementById('undo').onclick();");assert.equal(run('model.bars.length'),2);
run("document.getElementById('barPreset').onclick();for(let i=0;i<30;i++)advance();draw();if(validate(JSON.parse(JSON.stringify(initial))).bars.length!==1)throw Error('Bar example missing');");
run("for(const mutate of [x=>x.bars[0].length=-1,x=>x.bars[0].a='missing',x=>x.bars[0].localA.x=1,x=>x.bars[0].id=x.bodies[0].id]){const bad=JSON.parse(JSON.stringify(initial));mutate(bad);let rejected=false;try{validate(bad);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid bar accepted');}");
console.log('PASS: bar creation by endpoint clicks, off-center pins, rendering, save/load, duplication, deletion cascade, undo, pendulum example and validation');
run("replaceExperiment(example());advance();advance();addPlot();let phasePlot=model.plots[0];phasePlot.x='body:mass1:x';phasePlot.y='body:mass1:vx';syncPlotWindows();draw();let phaseSamples=plotSamples(phasePlot);if(phaseSamples.length!==frames.length||phaseSamples[1].x!==frames[1].states[0].x||phaseSamples[1].y!==frames[1].states[0].vx)throw Error('Phase data mismatch');if(validate(JSON.parse(JSON.stringify(model))).plots[0].x!==phasePlot.x)throw Error('Plot axes not saved');reset();if(model.plots[0].x!=='body:mass1:x')throw Error('Axes lost on reset');");
run("model.plots[0].x='spring:spring1:extension';draw();selected='spring1';deleteSelected();if(model.plots[0].x!=='time')throw Error('Deleted axis source must revert to time');");
run("const legacy=example();delete legacy.plots;if(validate(legacy).plots.length)throw Error('Old files should not reserve plot space');model.plots[0].x='body:missing:x';if(validate(model).plots[0].x!=='time')throw Error('Unknown source must revert to time');model.plots[0].x='time';draw();");
console.log('PASS: phase graph sampling/rendering, axis save/load and reset, deleted sources, legacy/invalid axis defaults');
run("replaceExperiment({...example(),bodies:[],springs:[],bars:[],forces:[]});createSolid('rectangle',{x:0,y:0});W=1000;H=600;setTool('force');");clickWorld(.5,.3);
assert.equal(run('model.forces.length'),1);assert.equal(run('object(selected).type'),'force');
run('let loadGeometry=forceGeometry(object(selected));');
node('scene').listeners.pointerdown({button:0,clientX:run('loadGeometry.tip.x'),clientY:run('loadGeometry.tip.y'),pointerId:1});
node('scene').listeners.pointermove({clientX:run('loadGeometry.tip.x+20'),clientY:run('loadGeometry.tip.y-10')});node('scene').listeners.pointerup({});
assert.ok(run('model.forces[0].fx')>10);assert.ok(run('model.forces[0].fy')>0);
run("let loadSave=validate(JSON.parse(JSON.stringify(initial)));if(loadSave.forces.length!==1||loadSave.forces[0].local.x!==.5)throw Error('Force save/load failed');selected=model.bodies[0].id;deleteSelected();if(model.forces.length)throw Error('Force deletion cascade failed');document.getElementById('undo').onclick();if(model.forces.length!==1)throw Error('Force undo failed');");
run("document.getElementById('forcePreset').onclick();for(let i=0;i<10;i++)advance();draw();if(model.monitor!=='leftBar'||plotSamples({x:'time',y:'bar:leftBar:tension'}).length!==frames.length)throw Error('Link monitor not recording');const recordedReaction=frames[frames.length-1].reactions[0].fy;restoreFrame(0);draw();restoreFrame(frames.length-1);draw();if(frames[cursor].reactions[0].fy!==recordedReaction)throw Error('Reaction replay lost');if(validate(JSON.parse(JSON.stringify(initial))).monitor!=='leftBar')throw Error('Link monitor save failed');addPlot();model.plots[0].y='body:beam:angularMomentum';draw();model.monitor='load';syncUI();draw();");
run("for(const mutate of [x=>x.forces[0].target='missing',x=>x.forces[0].fx=Infinity,x=>x.forces[0].local=null,x=>x.forces[0].id=x.bodies[0].id]){const invalid=JSON.parse(JSON.stringify(initial));mutate(invalid);let rejected=false;try{validate(invalid);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid applied force accepted');}");
console.log('PASS: force creation/arrow dragging, save/load, deletion/undo, link/force monitor graphs, angular momentum axis, reaction replay and import validation');
run("replaceExperiment(example());advance();advance();const savedCount=frames.length;addCanvasMonitor('mass1','body:mass1:vx');if(frames.length!==savedCount)throw Error('Attaching a readout reset recording');addCanvasMonitor('spring1','spring:spring1:tension');draw();let attached=model.canvasMonitors[0];let labelBox=canvasMonitorHitboxes.find(b=>b.id===attached.id);let initialOffset=attached.offset.x;let oldAnchor=AttachedMonitors.anchor(model,'mass1');");
assert.equal(run('model.canvasMonitors.length'),2);
assert.equal(run('canvasMonitorHitboxes.length'),2);
node('scene').listeners.pointerdown({button:0,clientX:run('labelBox.x+10'),clientY:run('labelBox.y+10'),pointerId:1});
node('scene').listeners.pointermove({clientX:run('labelBox.x+35'),clientY:run('labelBox.y+25')});node('scene').listeners.pointerup({});
assert.equal(run('model.canvasMonitors[0].offset.x-initialOffset'),25);
assert.ok(run('frames.length')>1);
run("advance();const movingAnchor=AttachedMonitors.anchor(model,'mass1');if(movingAnchor.x===oldAnchor.x&&movingAnchor.y===oldAnchor.y)throw Error('Monitor did not follow body');draw();const monitorSaved=validate(JSON.parse(JSON.stringify({...initial,canvasMonitors:model.canvasMonitors})));if(monitorSaved.canvasMonitors.length!==2)throw Error('Readouts not saved');restoreFrame(0);const zeroValue=AttachedMonitors.display(model,frames[0],model.canvasMonitors[0]).value;if(zeroValue!==frames[0].states[0].vx)throw Error('Readout ignored replay');selected='mass1';deleteSelected();if(model.canvasMonitors.length!==0)throw Error('Orphan readout left after deletion');");
run("document.getElementById('forcePreset').onclick();advance();addCanvasMonitor('leftBar','bar:leftBar:tension');draw();const linkLabel=AttachedMonitors.display(model,frames[cursor],model.canvasMonitors[0]);if(Math.abs(linkLabel.value-10.81)>1e-4||linkLabel.unit!=='N')throw Error('Tension readout wrong');const linkAnchor=AttachedMonitors.anchor(model,'leftBar');if(Math.abs(linkAnchor.x+.8)>1e-6||Math.abs(linkAnchor.y-.5)>1e-6)throw Error('Readout not at bar midpoint');");
run("for(const mutate of [x=>x.canvasMonitors[0].target='missing',x=>x.canvasMonitors[0].variable='body:beam:vx',x=>x.canvasMonitors[0].offset.x=Infinity,x=>x.canvasMonitors[0].precision=7,x=>x.canvasMonitors[0].id=x.bodies[0].id]){const bad=JSON.parse(JSON.stringify(initial));mutate(bad);let rejected=false;try{validate(bad);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid attached monitor accepted');}removeCanvasMonitor(model.canvasMonitors[0].id);if(model.canvasMonitors.length)throw Error('Readout removal failed');");
run("replaceExperiment(example());setTool('monitor');W=1000;H=600;");clickWorld(1.2,.65);assert.equal(run('model.canvasMonitors.length'),1);
console.log('PASS: attached monitor tool, multiple values, recording preservation, label dragging, moving body/link anchors, tension units, replay, save/load, removal/deletion cascade and validation');
run("replaceExperiment(example());advance();let plotRecordingCount=frames.length,physicalBodyCount=model.bodies.length;document.getElementById('addPlot').onclick();document.getElementById('addPlot').onclick();if(model.plots.length!==2||model.bodies.length!==physicalBodyCount||frames.length!==plotRecordingCount)throw Error('Adding plots changed physics/recording');let fixedPlot=model.plots[0];document.getElementById('plotX:'+fixedPlot.id).value='body:mass1:vx';document.getElementById('plotX:'+fixedPlot.id).onchange();document.getElementById('plotY:'+fixedPlot.id).value='time';document.getElementById('plotY:'+fixedPlot.id).onchange();if(fixedPlot.y!=='time'||fixedPlot.x!=='body:mass1:vx'||model.plots[1].x!=='time')throw Error('Independent axes failed');draw();let fixedLeft=fixedPlot.left,fixedTop=fixedPlot.top;");
run("model.gravityOn=true;advance();model.view.x+=1;model.view.scale*=1.1;draw();if(fixedPlot.left!==fixedLeft||fixedPlot.top!==fixedTop)throw Error('Plot moved with gravity or camera');");
const plotDragTarget=run("document.getElementById('plotHeader:'+fixedPlot.id)");
plotDragTarget.listeners.pointerdown({button:0,target:{closest:()=>null},clientX:10,clientY:10,pointerId:1,preventDefault(){},stopPropagation(){}});
plotDragTarget.listeners.pointermove({clientX:40,clientY:30});plotDragTarget.listeners.pointerup({});
assert.equal(run('fixedPlot.left-fixedLeft'),30);assert.equal(run('fixedPlot.top-fixedTop'),20);
const plotResizeTarget=run("document.getElementById('plotResize:'+fixedPlot.id)");
run('let oldPlotWidth=fixedPlot.width;');
plotResizeTarget.listeners.pointerdown({button:0,target:{closest:()=>null},clientX:10,clientY:10,pointerId:1,preventDefault(){},stopPropagation(){}});
plotResizeTarget.listeners.pointermove({clientX:60,clientY:40});plotResizeTarget.listeners.pointerup({});
assert.equal(run('fixedPlot.width-oldPlotWidth'),50);
run("document.getElementById('plotMinimize:'+fixedPlot.id).onclick();if(!fixedPlot.collapsed)throw Error('Minimize failed');document.getElementById('plotMinimize:'+fixedPlot.id).onclick();if(fixedPlot.collapsed)throw Error('Expand failed');const plotFile=validate(JSON.parse(JSON.stringify({...initial,plots:model.plots})));if(plotFile.plots.length!==2||plotFile.plots[0].x!=='body:mass1:vx'||plotFile.plots[0].y!=='time'||plotFile.plots[0].width!==fixedPlot.width)throw Error('Plot save failed');document.getElementById('plotClose:'+fixedPlot.id).onclick();if(model.plots.length!==1)throw Error('Close plot failed');");
run("for(const mutate of [x=>x.plots[0].width=-1,x=>x.plots[0].left=Infinity,x=>x.plots[0].id=x.bodies[0].id]){const bad=JSON.parse(JSON.stringify({...initial,plots:model.plots}));mutate(bad);let rejected=false;try{validate(bad);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid plot accepted');}");
console.log('PASS: optional independent plots, time on either axis, physics/recording independence, fixed screen position, drag/resize, minimize/expand/close, save/load and validation');
run("replaceExperiment(example());advance();advance();addPlot();let comparison=model.plots[0];document.getElementById('plotY:'+comparison.id).value='energy';document.getElementById('plotY:'+comparison.id).onchange();let beforeLineFrames=frames.length;document.getElementById('plotAddLine:'+comparison.id).onclick();if(comparison.lines.length!==2||comparison.lines[1].y!=='kineticEnergy'||frames.length!==beforeLineFrames)throw Error('Add line or default energy comparison failed');if(comparison.lines[0].color===comparison.lines[1].color)throw Error('Lines need distinct colors');draw();let kineticLine=comparison.lines[1];document.getElementById('plotColor:'+comparison.id+':'+kineticLine.id).value='#118866';document.getElementById('plotColor:'+comparison.id+':'+kineticLine.id).onchange();if(kineticLine.color!=='#118866')throw Error('Color control failed');");
run("const comparisonSamples=plotSamples(comparison,comparison.lines[1]);if(comparisonSamples[1].y!==frames[1].kineticEnergy)throw Error('Line samples wrong');if(!document.getElementById('plotLayer').innerHTML.includes('Mechanical energy')||!document.getElementById('plotLayer').innerHTML.includes('Kinetic energy'))throw Error('Legend missing');const csvRows=plotCsv(comparison).split('\\n');if(csvRows.length!==frames.length+1||csvRows[1].split(',').length!==4)throw Error('Multi-line CSV lost columns');const comparisonFile=validate(JSON.parse(JSON.stringify({...initial,plots:model.plots})));if(comparisonFile.plots[0].lines.length!==2||comparisonFile.plots[0].lines[1].color!=='#118866')throw Error('Multi-line save failed');");
run("document.getElementById('plotVisible:'+comparison.id+':'+kineticLine.id).checked=false;document.getElementById('plotVisible:'+comparison.id+':'+kineticLine.id).onchange();draw();if(kineticLine.visible)throw Error('Hide line failed');document.getElementById('plotVisible:'+comparison.id+':'+comparison.lines[0].id).checked=false;document.getElementById('plotVisible:'+comparison.id+':'+comparison.lines[0].id).onchange();draw();if(plotCsv(comparison).split('\\n')[1].split(',').length!==4)throw Error('Hidden line omitted from export');removePlotLine(comparison,comparison.lines[0].id);if(comparison.lines.length!==1||comparison.y!=='kineticEnergy')throw Error('Removing first line lost second line');removePlotLine(comparison,comparison.lines[0].id);if(comparison.lines.length!==1)throw Error('Removed final line');");
run("const oldPlotFile=JSON.parse(JSON.stringify(initial));delete oldPlotFile.plots[0].lines;oldPlotFile.plots[0].y='energy';const migrated=validate(oldPlotFile);if(migrated.plots[0].lines.length!==1||migrated.plots[0].lines[0].y!=='energy')throw Error('Single-line migration failed');for(const mutate of [x=>x.plots[0].lines=[],x=>x.plots[0].lines[0].color='red; background:black',x=>x.plots[0].lines[0].visible='yes',x=>x.plots[0].lines.push({...x.plots[0].lines[0]})]){const invalid=JSON.parse(JSON.stringify({...initial,plots:model.plots}));mutate(invalid);let rejected=false;try{validate(invalid);}catch(e){rejected=true;}if(!rejected)throw Error('Invalid plot line accepted');}");
console.log('PASS: multi-line plot controls, colors/legend, mechanical-versus-kinetic samples, shared scale rendering, visibility/removal, full CSV, save/load and legacy migration');
// Support palette tools, editing, persistence, symbols and legacy anchors.
run("replaceExperiment({...example(),bodies:[],springs:[],bars:[],forces:[],canvasMonitors:[],plots:[]});W=1000;H=600;createSolid('rectangle',{x:0,y:0});setTool('anchor');");
clickWorld(0,0);
assert.equal(run('model.bodies[0].support.kind'),'pinned');
for(const kind of ['rollerX','rollerY','fixedSupport']){run(`setTool('${kind}')`);clickWorld(0,0);assert.equal(run('model.bodies[0].support.kind'),kind==='fixedSupport'?'fixed':kind);run('draw();');const loaded=run('validate(JSON.parse(JSON.stringify(initial)))');assert.equal(loaded.bodies[0].support.kind,kind==='fixedSupport'?'fixed':kind);}
run("setTool('anchor')");clickWorld(3,0);assert.equal(run('model.bodies[1].name'),'Pinned support 1');
run("setTool('fixedSupport')");clickWorld(5,0);assert.equal(run('model.bodies[2].support.kind'),'fixed');
run("selected=model.bodies[0].id;setSupport(body(selected),'pinned');edited();setTool('select');draw();");
clickWorld(0,0); // select without changing its restraint
run("body(selected).support.x=1;body(selected).x=1;edited();draw();");
assert.equal(run('body(selected).x'),1);
assert.throws(()=>run("const badSupport=JSON.parse(JSON.stringify(initial));badSupport.bodies[0].support.kind='invalid';validate(badSupport)"));
run("setSupport(body(selected),'none');edited();");assert.equal(run('body(selected).support'),undefined);
console.log('PASS: support tools, symbol rendering, pinned naming, support save/load and validation, editing and removal');
run("setSupport(body(selected),'pinned');edited();draw();let supportStart=screen(body(selected).x,body(selected).y);");
node('scene').listeners.pointerdown({button:0,clientX:run('supportStart.x'),clientY:run('supportStart.y'),pointerId:1});
node('scene').listeners.pointermove({clientX:run('supportStart.x+70'),clientY:run('supportStart.y-35')});
node('scene').listeners.pointerup({});
assert.ok(run('body(selected).x')>1);
assert.equal(run('body(selected).x'),run('body(selected).support.x'));
assert.equal(run('body(selected).y'),run('body(selected).support.y'));
console.log('PASS: dragging a pinned body updates its support position');

// Desktop box selection, group edits and offline component clipboard.
run("replaceExperiment({...example(),gravityOn:false,bodies:[{id:'copyA',type:'mass',name:'A',mass:2,x:0,y:0,vx:0,vy:0,support:{kind:'pinned',x:0,y:0}},{id:'copyB',type:'mass',name:'B',mass:1,x:2,y:0,vx:1,vy:0}],springs:[{id:'copySpring',type:'spring',name:'Spring',a:'copyA',b:'copyB',k:10,rest:2,damping:1}],bars:[],forces:[{id:'copyForce',type:'force',name:'Force',target:'copyB',fx:2,fy:0,local:{x:0,y:0},bodyFrame:false}],canvasMonitors:[{id:'copyMonitor',target:'copySpring',variable:'spring:copySpring:tension',offset:{x:30,y:20},precision:2,caption:''}],plots:[]});W=1000;H=600;draw();");
const pointer=(kind,x,y,extra={})=>{const q=run(`screen(${x},${y})`);node('scene').listeners[kind]({button:0,pointerType:'mouse',pointerId:1,clientX:q.x,clientY:q.y,...extra});};
const recordedBefore=run('frames');const historyBefore=run('history.length');
pointer('pointerdown',-1,-1);pointer('pointermove',3,1);run('draw();');pointer('pointerup',3,1);
assert.equal(run('selectionIds().size'),4);
assert.equal(run('history.length'),historyBefore,'selection is not a physical edit');assert.equal(run('frames'),recordedBefore);
const viewBefore=run('model.view.x');pointer('pointerdown',-1,-1,{altKey:true});pointer('pointermove',-2,-1);pointer('pointerup',-2,-1);assert.notEqual(run('model.view.x'),viewBefore);
// Shift-click toggles without dragging a body.
pointer('pointerdown',0,0,{shiftKey:true});pointer('pointerup',0,0);assert.equal(run("selectionIds().has('copyA')"),false);
pointer('pointerdown',0,0,{shiftKey:true});pointer('pointerup',0,0);assert.equal(run("selectionIds().has('copyA')"),true);
node('copySelection').onclick();node('pasteSelection').onclick();
assert.equal(run('model.bodies.length'),4);assert.equal(run('model.springs.length'),2);assert.equal(run('model.forces.length'),2);assert.equal(run('model.canvasMonitors.length'),2);
assert.equal(run('model.springs[1].a'),run('model.bodies[2].id'));assert.equal(run('model.springs[1].b'),run('model.bodies[3].id'));
assert.equal(run('model.forces[1].target'),run('model.bodies[3].id'));assert.equal(run('model.canvasMonitors[1].target'),run('model.springs[1].id'));
assert.equal(run('model.canvasMonitors[1].variable'),run("'spring:'+encodeURIComponent(model.springs[1].id)+':tension'"));
assert.equal(run('model.bodies[2].support.x'),.4);assert.equal(run('model.bodies[2].x'),.4);
run('validate(JSON.parse(JSON.stringify(initial)));');
// Move the pasted group without changing relative geometry or pin origins.
pointer('pointerdown',.4,.4);pointer('pointermove',1.4,1.4);pointer('pointerup',1.4,1.4);
assert.ok(Math.abs(run('model.bodies[2].x')-1.4)<1e-10);assert.ok(Math.abs(run('model.bodies[3].x-model.bodies[2].x')-2)<1e-10);assert.equal(run('model.bodies[2].support.x'),run('model.bodies[2].x'));
run('deleteSelected()');assert.equal(run('model.bodies.length'),2);assert.equal(run('model.springs.length'),1);assert.equal(run('model.forces.length'),1);assert.equal(run('model.canvasMonitors.length'),1);
node('undo').onclick();assert.equal(run('model.bodies.length'),4);node('redo').onclick();assert.equal(run('model.bodies.length'),2);
// Keyboard shortcuts ignore text fields, select all, and preserve the copied initial conditions.
const keyboard=(key,tagName='BODY',extra={})=>windowListeners.keydown({key,ctrlKey:true,target:{tagName},preventDefault(){},...extra});
keyboard('a');assert.equal(run('selectionIds().size'),4);keyboard('c');keyboard('v','INPUT');assert.equal(run('model.bodies.length'),2);keyboard('v');assert.equal(run('model.bodies.length'),4);keyboard('v');assert.equal(run('model.bodies.length'),6);
assert.equal(new Set(run('model.bodies.map(b=>b.id)')).size,6);
run('validate(JSON.parse(JSON.stringify(initial)));');
// Touch and compact screens retain drag-to-pan.
const oldView=run('model.view.x');pointer('pointerdown',-4,-4,{pointerType:'touch'});pointer('pointermove',-3,-4,{pointerType:'touch'});pointer('pointerup',-3,-4,{pointerType:'touch'});assert.notEqual(run('model.view.x'),oldView);
console.log('PASS: marquee and Shift selection, group dragging/deletion/undo, pan and touch behavior, copy/paste buttons and keyboard, dependency/readout remapping, initial states and unique IDs');
// Link-only copying includes endpoints; repeated paste remains valid, even across experiments.
run("replaceExperiment(barExample());selectIds([model.bars[0].id]);copySelection();const copiedBarX=componentClipboard.bodies[1].x;model.bodies[1].x+=10;copySelection();");
assert.equal(run('componentClipboard.bodies[1].x'),run('copiedBarX'),'copy uses initial positions during replay');
run("replaceExperiment({...example(),bodies:[],springs:[],bars:[],forces:[],canvasMonitors:[],plots:[]});pasteSelection();validate(JSON.parse(JSON.stringify(initial)));");
assert.equal(run('model.bars.length'),1);assert.equal(run('model.bodies.length'),2);
assert.equal(run('model.bars[0].a'),run('model.bodies.find(b=>b.type===\'anchor\').id'));
run("selectedGroup.clear();selected=null;componentClipboard=null;copySelection();pasteSelection();");assert.equal(run('model.bodies.length'),2);
console.log('PASS: link endpoint dependencies, copy from initial conditions, paste across experiments and empty clipboard handling');
// Built-in support comparison is also shipped as an external experiment.
node('supportPreset').onclick();
assert.equal(run('model.bodies.length'),2);assert.equal(run('model.canvasMonitors.length'),6);
assert.equal(run('model.bodies[0].support.kind'),'pinned');assert.equal(run('model.bodies[1].support.kind'),'fixed');
run('draw();validate(JSON.parse(JSON.stringify(initial)));advance();');
assert.ok(run('model.bodies[0].angle')<0);assert.equal(run('model.bodies[1].angle'),0);
assert.ok(Math.abs(run('model.bodies[1].supportReaction.moment')-2)<1e-10);
assert.equal(run('model.bodies[0].supportReaction.moment'),0);
assert.deepEqual(JSON.parse(JSON.stringify(run('validate(supportExample())'))),JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../examples/pinned-vs-fixed.json'),'utf8')));
console.log('PASS: support comparison preset, attached readouts, import/export, pinned rotation and fixed balancing torque');
// Reproduce the user's bridge edits through the actual inspector and support tool.
run("replaceExperiment(validate(JSON.parse("+JSON.stringify(fs.readFileSync(require('node:path').join(__dirname,'../examples/bridge-monitored.json'),'utf8'))+")));selected='mass21';properties();");
node('removeConstraint').onclick();
assert.equal(run("body('mass21').constraint"),undefined);
assert.equal(run("model.canvasMonitors.filter(m=>m.target==='mass21').length"),0,'obsolete support readouts are removed with the constraint');
run("setTool('fixedSupport');");clickWorld(-4,0);
assert.equal(run("body('anchor4').support.kind"),'fixed');
assert.ok(Number.isFinite(run("model.bars.find(b=>b.id==='bar10').supportAngleA")));
run('const fixedBridgeSaved=validate(JSON.parse(JSON.stringify(initial)));for(let i=0;i<60;i++)advance();draw();');
assert.ok(Math.abs(run("body('mass21').y"))<1e-8);
assert.ok(Math.abs(run("body('anchor4').supportReaction.moment")-236.58)<1e-6);
run('restoreFrame(1);');
assert.ok(Math.abs(run("frames[cursor].supports.find(r=>r.id==='anchor4').moment")-236.58)<1e-6);
console.log('PASS: bridge constraint removal, obsolete readout cleanup, fixed support tool, saved clamping angles and recorded torque replay');
node('latticePreset').onclick();
assert.equal(run('model.bodies.length'),9);assert.equal(run('model.springs.length'),12);
assert.equal(run('model.gravityOn'),false);assert.equal(run('model.bodies[0].vx'),.5);assert.equal(run('model.bodies[0].vy'),-.35);
assert.deepEqual(JSON.parse(JSON.stringify(run('latticeExample()'))),JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../examples/spring-lattice-3x3.json'),'utf8')));
run('draw();validate(JSON.parse(JSON.stringify(initial)));for(let i=0;i<30;i++)advance();draw();');
assert.ok(run("Math.hypot(body('circle5').vx,body('circle5').vy)")>.001);
run('reset();');assert.equal(run('model.bodies[0].vx'),.5);assert.equal(run('model.bodies[0].x'),-1.5);
console.log('PASS: lattice preset, fixture consistency, rendering, recording, center motion, reset and save/load');
// A browser uses the original value as the native step base when min is absent:
// -0.35 with step=0.1 makes zero a step mismatch, although zero is valid physics.
run("replaceExperiment(latticeExample());selected='circle1';");
const velocityInput={type:'number',dataset:{key:'vy'},value:'0',min:'',max:'',validity:{stepMismatch:true,badInput:false},checkValidity(){return false;},addEventListener(type,fn){this[type]=fn;}};
const originalQuery=node('properties').querySelectorAll;node('properties').querySelectorAll=selector=>selector==='[data-key]'?[velocityInput]:[];
run('properties();');velocityInput.change();
assert.equal(run("body('circle1').vy"),0);assert.equal(run("initial.bodies[0].vy"),0);
velocityInput.dataset.key='vx';velocityInput.value='0';velocityInput.change();assert.equal(run("body('circle1').vx"),0);
node('properties').querySelectorAll=originalQuery;
assert.equal(run("numericFieldValue({value:'0',min:'',max:'',validity:{stepMismatch:true}})"),0);
assert.equal(run("numericFieldValue({value:'-0.035',min:'',max:'',validity:{stepMismatch:true}})"),-.035);
for(const expression of ["{value:'',min:'',max:''}","{value:' ',min:'',max:''}","{value:'Infinity'}","{value:'NaN'}","{value:'1e9'}","{value:'0',min:'.001'}","{value:'1.1',min:'0',max:'1'}","{value:'0',validity:{badInput:true}}"]){assert.equal(run('numericFieldValue('+expression+')'),null);}
run('validate(JSON.parse(JSON.stringify(initial)));');
console.log('PASS: zero vx/vy from off-step initial velocities, persisted initial conditions, arbitrary finite decimals, actual bounds and invalid/empty input rejection');
// Place and route strings with the real icon tool event handlers.
run("replaceExperiment({...example(),bodies:[],springs:[],bars:[],strings:[],forces:[],canvasMonitors:[],plots:[]});W=1000;H=600;setTool('mass');");clickWorld(-.5,-1);clickWorld(.5,-1);
run("setTool('pulley');");clickWorld(0,2);
assert.equal(run('model.bodies[2].pulley'),true);assert.equal(run('model.bodies[2].radius'),.5);
run("setTool('string');");clickWorld(-.5,-1);clickWorld(0,2);run('draw();');clickWorld(.5,-1);
assert.equal(run('model.strings.length'),1);assert.equal(run('model.strings[0].via.length'),1);
assert.ok(Math.abs(run('model.strings[0].length')-(6+Math.PI*.5))<1e-10);
run("const routeId=model.strings[0].id;selected=routeId;properties();draw();validate(JSON.parse(JSON.stringify(initial)));addCanvasMonitor(routeId,'string:'+encodeURIComponent(routeId)+':tension');addPlot();");
assert.equal(run('model.plots[0].y'),run("'string:'+encodeURIComponent(routeId)+':tension'"));
assert.equal(run('model.canvasMonitors.length'),1);
run('copySelection();pasteSelection();');assert.equal(run('model.strings.length'),2);assert.equal(run('model.bodies.filter(b=>b.pulley).length'),2);
assert.notEqual(run('model.strings[0].via[0].id'),run('model.strings[1].via[0].id'));assert.equal(run('model.canvasMonitors[1].target'),run('model.strings[1].id'));
run('validate(JSON.parse(JSON.stringify(initial)));selectIds([model.strings[1].via[0].id]);deleteSelected();');assert.equal(run('model.strings.length'),1);assert.equal(run('model.canvasMonitors.length'),1);
node('undo').onclick();assert.equal(run('model.strings.length'),2);node('redo').onclick();assert.equal(run('model.strings.length'),1);
// Straight strings need no pulley; changing their length allows slack.
run("setTool('string');");clickWorld(-.5,-1);clickWorld(.5,-1);assert.equal(run('model.strings[1].via.length'),0);
run('object(selected).length+=1;edited();draw();');assert.ok(run("PlotAxes.value(model,snapshot(),'string:'+encodeURIComponent(selected)+':slack')")>.9);
node('pulleyPreset').onclick();assert.equal(run('model.strings.length'),1);assert.equal(run('model.canvasMonitors.length'),4);
assert.deepEqual(JSON.parse(JSON.stringify(run('pulleyExample()'))),JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../examples/pulley-oscillator.json'),'utf8')));
run('draw();for(let i=0;i<30;i++)advance();draw();');assert.ok(run("object('rope').reaction.tension")>9);
run('restoreFrame(1);');assert.ok(run("PlotAxes.value(model,frames[cursor],'string:rope:tension')")>9);
run('reset();');assert.equal(run("body('leftMass').y"),-1);assert.equal(run("body('leftMass').vy"),.5);
console.log('PASS: string/pulley tools, routed and straight creation, finite rim drawing, properties, monitors/plots, copy/paste guide remapping, deletion/undo, slack drawing, oscillator preset and replay');
// Winding edits made after playback use the restored initial geometry.
run("for(let i=0;i<15;i++)advance();selected='rope';changeStringWrap(0,-1);draw();");
assert.equal(run("object('rope').via[0].side"),-1);
assert.ok(Math.abs(run("Cables.geometry(initial,object('rope')).length-object('rope').length"))<1e-10);
run('validate(JSON.parse(JSON.stringify(initial)));');
console.log('PASS: wrap direction edits after playback restore a consistent initial route');
// Movable axle tools, mode switching and connections to the axle or rim.
run("replaceExperiment({...example(),bodies:[],springs:[],bars:[],strings:[],forces:[],canvasMonitors:[],plots:[]});W=1000;H=600;setTool('movablePulley');");clickWorld(0,0);
assert.equal(run('body(selected).pulley'),true);assert.equal(run('body(selected).type'),'mass');assert.equal(run('body(selected).mass'),1);
run('const movingId=selected;draw();properties();');
node('pulleyMotion').value='fixed';node('pulleyMotion').onchange();assert.equal(run('pulleyIsMovable(body(selected))'),false);
run('validate(JSON.parse(JSON.stringify(initial)));');node('pulleyMotion').value='movable';node('pulleyMotion').onchange();assert.equal(run('pulleyIsMovable(body(selected))'),true);
// A point mass can become a movable pulley, retaining its load mass.
run("setTool('mass');");clickWorld(2,0);run('body(selected).mass=3;edited();setTool(\'movablePulley\');');clickWorld(2,0);assert.equal(run('body(selected).pulley'),true);assert.equal(run('body(selected).mass'),3);
// The axle button starts a string; Alt-click can finish one at another axle.
run('selected=movingId;properties();');node('stringAxle').onclick();assert.equal(run('pending.id'),run('movingId'));
const axlePoint=run('screen(2,0)');node('scene').listeners.pointerdown({button:0,clientX:axlePoint.x,clientY:axlePoint.y,pointerId:1,altKey:true});node('scene').listeners.pointerup({});
assert.equal(run('model.strings.length'),1);assert.equal(run('model.strings[0].via.length'),0);run('draw();validate(JSON.parse(JSON.stringify(initial)));');
// Rim routing still works and both preset files match the built-in examples.
for(const movable of [false,true]){node(movable?'movableAtwoodPreset':'atwoodPreset').onclick();assert.deepEqual(JSON.parse(JSON.stringify(run('atwoodExample('+movable+')'))),JSON.parse(fs.readFileSync(require('node:path').join(__dirname,movable?'../examples/atwood-movable-pulley.json':'../examples/atwood-machine.json'),'utf8')));run('draw();for(let i=0;i<30;i++)advance();draw();');const key=movable?'movingWheel':'lightMass',expected=movable?-9.81/7:3.27;assert.ok(Math.abs(run("body('"+key+"').acceleration.y")-expected)<1e-8);run('restoreFrame(0);');assert.equal(run("body('"+key+"').acceleration.y"),0);run('restoreFrame(1);');assert.ok(Math.abs(run("PlotAxes.value(model,frames[cursor],'body:"+key+":ay')")-expected)<1e-8);run("selectIds(['atwoodString']);copySelection();pasteSelection();validate(JSON.parse(JSON.stringify(initial)));");assert.equal(run('model.strings.length'),2);run('reset();');}
console.log('PASS: movable pulley icon, point-mass conversion, axle modes, axle button/Alt-click attachments, Atwood presets, acceleration recording/replay and movable-guide copy/paste');
