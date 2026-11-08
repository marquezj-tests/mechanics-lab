const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const modules=html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='));
const validation=html.slice(html.indexOf('function validate(raw)'),html.indexOf("\n$('file').onchange"));
const {Physics,AttachedMonitors,validate}=vm.runInNewContext(modules+validation+';({Physics,AttachedMonitors,validate})');
const raw=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/spring-lattice-3x3.json'),'utf8')),m=validate(raw);
assert.equal(m.bodies.length,9);assert.equal(m.springs.length,12);assert.equal(m.gravityOn,false);
assert.equal(m.bodies.filter(b=>Math.hypot(b.vx,b.vy)>0).length,1);
const lookup=new Map(m.bodies.map(b=>[b.id,b]));let horizontal=0,vertical=0;
for(const s of m.springs){const a=lookup.get(s.a),b=lookup.get(s.b);assert.equal(s.damping,0);assert.equal(Math.hypot(a.x-b.x,a.y-b.y),s.rest);if(a.y===b.y)horizontal++;else if(a.x===b.x)vertical++;else assert.fail('Unexpected diagonal spring');}
assert.equal(horizontal,6);assert.equal(vertical,6);
const e0=Physics.energy(m),centroid=()=>m.bodies.reduce((v,b)=>({x:v.x+b.x/9,y:v.y+b.y/9}),{x:0,y:0}),c0=centroid();let centerMoved=false,maxEnergyError=0;
for(let i=0;i<2400;i++){Physics.step(m);centerMoved||=Math.hypot(lookup.get('circle5').vx,lookup.get('circle5').vy)>.005;maxEnergyError=Math.max(maxEnergyError,Math.abs(Physics.energy(m)/e0-1));}
assert.ok(centerMoved,'corner kick propagates to the central circle');assert.ok(maxEnergyError<.001,'undamped lattice conserves energy');
const sum=key=>m.bodies.reduce((v,b)=>v+b.mass*b[key],0);assert.ok(Math.abs(sum('vx')-.5)<1e-8);assert.ok(Math.abs(sum('vy')+.35)<1e-8);
const c=centroid();assert.ok(Math.abs(c.x-c0.x-.5/9*10)<1e-8);assert.ok(Math.abs(c.y-c0.y+.35/9*10)<1e-8);
for(const monitor of m.canvasMonitors)assert.ok(Number.isFinite(AttachedMonitors.display(m,{t:10,states:m.bodies},monitor).value));
validate(JSON.parse(JSON.stringify(m)));
console.log('PASS: nine-circle lattice, six horizontal/six vertical springs, one initial kick, propagation, momentum, center-of-mass drift, energy and monitor/save-load validity');
