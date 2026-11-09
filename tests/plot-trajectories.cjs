const assert=require('node:assert/strict');
const {app}=require('./helpers/app.cjs');const {run,node,context}=app();
node('plotCanvas:trajectory').getBoundingClientRect=()=>({width:360,height:220,left:0,top:0});
run(`replaceExperiment(invertedPendulumExample());
 globalThis.trace=[];globalThis.path=[];
 ctx.beginPath=()=>path=[];ctx.moveTo=(x,y)=>path.push({x,y});ctx.lineTo=(x,y)=>path.push({x,y});ctx.stroke=()=>{if(ctx.strokeStyle==='#286cdb')trace.push(path.slice());};
 frames=Array.from({length:7201},(_,i)=>({t:i/60,states:[{id:'mass1',x:Math.cos(i*.2),y:Math.sin(i*.2)}]}));cursor=7200;
 globalThis.trajectory={id:'trajectory',x:'body:mass1:x',y:'body:mass1:y',lines:[{id:'line1',y:'body:mass1:y',color:'#286cdb',visible:true}]};
 drawPlot(trajectory);`);
let points=run('trace.at(-1)');assert.equal(points.length,7202,'XY curves must retain recorded samples, including the final endpoint');
// Equal distance scales must draw a circular trajectory as a circle at any aspect ratio.
const xmin=Math.min(...points.map(p=>p.x)),xmax=Math.max(...points.map(p=>p.x)),ymin=Math.min(...points.map(p=>p.y)),ymax=Math.max(...points.map(p=>p.y));
assert.ok(Math.abs((xmax-xmin)/(ymax-ymin)-1)<1e-5,'position trajectory must have equal pixels per metre');
const radius=(ymax-ymin)/2,cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
assert.ok(Math.max(...points.map(p=>Math.abs(Math.hypot(p.x-cx,p.y-cy)-radius)))<.001);
// A late turn must not become a large chord merely because the recording grew.
for(let i=1;i<points.length;i++)assert.ok(Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y)<radius*.21);
run('trace=[];trajectory.x="time";drawPlot(trajectory);');assert.ok(run('trace.at(-1).length')<7201,'time-series rendering retains its bounded drawing cost');
run('trace=[];trajectory.x="body:mass1:y";trajectory.y="body:mass1:x";trajectory.lines[0].y=trajectory.y;drawPlot(trajectory);');assert.equal(run('trace.at(-1).length'),7202);
assert.equal(run('plotCsv(trajectory).split("\\n").length'),7202);
run('restoreFrame(100);trace=[];drawPlot(trajectory);');assert.equal(run('trace.at(-1).length'),7202,'replay must not alter trajectory samples');
console.log('PASS: long XY trajectories retain every sample, equal distance scales, swapped axes, time-series reduction, CSV and replay');
