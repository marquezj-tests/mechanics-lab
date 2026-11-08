const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {app,html}=require('./helpers/app.cjs');
(async()=>{
 const {run,node,context}=app();
 // An offline release must not fetch code, styles, fonts, or images.
 assert.doesNotMatch(html,/<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=\s*["'](?:https?:|\/\/)/i);
 assert.doesNotMatch(html,/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
 const markup=html.split('<script>')[0];const symbols=new Set([...markup.matchAll(/<symbol\b[^>]*id="([^"]+)"/g)].map(m=>m[1]));
 for(const m of markup.matchAll(/<use href="#([^"]+)"/g))assert.ok(symbols.has(m[1]),`Missing icon ${m[1]}`);
 for(const m of markup.matchAll(/<button\b([^>]*class="[^"]*(?:icon-button|\btool\b)[^"]*"[^>]*)>/g)){
  assert.match(m[1],/title="[^"]+"/);assert.match(m[1],/aria-label="[^"]+"/);
 }
 for(const scale of [20,85,250]){
  run(`replaceExperiment(example());model.snapGrid=true;model.view.scale=${scale};`);
  const step=scale<35?.4:.2,p=run('snapPoint({x:-.51,y:.51})');
  assert.ok(Math.abs(p.x/step-Math.round(p.x/step))<1e-10);
  const v=run('snapVelocity(-.83,.47)'),speed=Math.hypot(v.vx,v.vy),angle=Math.atan2(v.vy,v.vx)*180/Math.PI;
  assert.ok(Math.abs(speed*10-Math.round(speed*10))<1e-10);
  assert.ok(Math.abs(angle/5-Math.round(angle/5))<1e-10);
  const c=run('snapVelocity(-.83,.47,{angle:37})');
  assert.ok(Math.abs(c.vx*Math.sin(37*Math.PI/180)-c.vy*Math.cos(37*Math.PI/180))<1e-12);
 }
 run('replaceExperiment(example());advance();advance();model.view.x=3;addPlot();');
 const initialX=run('initial.bodies[1].x');assert.notEqual(run('model.bodies[1].x'),initialX);
 node('save').onclick();assert.equal(node('saveDialog').open,true);
 node('saveFilename').value='Trial: one.JSON';node('saveForm').listeners.submit({preventDefault(){}});
 const saved=run('downloads.at(-1)');assert.equal(saved.name,'Trial_ one.json');
 const data=JSON.parse(saved.text);assert.equal(data.bodies[1].x,initialX);assert.equal(data.view.x,3);assert.equal(data.plots.length,1);
 assert.equal(node('saveDialog').open,false);assert.equal(run("experimentFileName('...')"),'mechanics-experiment.json');
 const before=run('JSON.stringify(model)'),frameCount=run('frames.length');
 for(const file of [{name:'bad.json',size:10,text:async()=>'{broken'},{name:'huge.json',size:2000001,text:async()=>{throw Error('Must not read oversized file');}},{name:'invalid.json',size:10,text:async()=>'{"version":99}'}]){
  node('file').files=[file];await node('file').onchange();assert.equal(run('JSON.stringify(model)'),before);assert.equal(run('frames.length'),frameCount);
 }
 node('file').files=[{name:'Reloaded.json',size:saved.text.length,text:async()=>saved.text}];await node('file').onchange();
 assert.equal(run('tick'),0);assert.equal(run('model.bodies[1].x'),initialX);assert.equal(run('experimentFilename'),'Reloaded.json');
 for(const name of fs.readdirSync(path.join(__dirname,'../examples')).filter(n=>n.endsWith('.json'))){
  context.fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples',name),'utf8'));
  run('replaceExperiment(validate(fixture));globalThis.start=JSON.stringify(snapshot());for(let i=0;i<4;i++)advance();globalThis.end=JSON.stringify(snapshot());reset();');
  assert.equal(run('JSON.stringify(snapshot())'),run('start'),`${name}: reset`);
  run('for(let i=0;i<4;i++)advance();');assert.equal(run('tick'),16,`${name}: simulation must advance without a swallowed solver error`);assert.equal(run('JSON.stringify(snapshot())'),run('end'),`${name}: deterministic repeat`);
  run('validate(JSON.parse(JSON.stringify(initial)));');
 }
 console.log('PASS: offline packaging/icons, grid and velocity snapping, Save As initial conditions, atomic failed imports, all example round-trips and deterministic reset');
})().catch(e=>{console.error(e);process.exitCode=1;});
