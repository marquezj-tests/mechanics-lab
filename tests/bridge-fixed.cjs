const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const code=html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='));
const validation=html.slice(html.indexOf('function validate(raw)'),html.indexOf("\n$('file').onchange"));
const {Physics,Joints,PlotAxes,AttachedMonitors,validate}=vm.runInNewContext(code+';'+validation+';({Physics,Joints,PlotAxes,AttachedMonitors,validate})');
const load=file=>validate(JSON.parse(fs.readFileSync(path.join(__dirname,'../examples',file),'utf8')));
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
let m=load('bridge-monitored.json');delete m.bodies.find(b=>b.id==='mass21').constraint;delete m.bodies.find(b=>b.id==='mass21').support;
for(let i=0;i<120;i++)Physics.step(m);
assert.ok(m.bodies.find(b=>b.id==='mass21').y<-.1,'free bridge on a pin rotates/falls');
m=load('bridge-fixed-left.json');const positions=m.bodies.map(b=>({x:b.x,y:b.y}));
Physics.prepare(m);for(let i=0;i<1200;i++){Physics.step(m);for(let j=0;j<m.bodies.length;j++){near(m.bodies[j].x,positions[j].x);near(m.bodies[j].y,positions[j].y);}assert.ok(Joints.maxError(m)<1e-8);}
const left=m.bodies[0].supportReaction;near(left.fx,0);near(left.fy,69.05);near(left.moment,236.58);
// Support torque includes the clamping couples, not only the force at the node.
const frame={t:5,states:m.bodies,supports:m.bodies.filter(b=>b.supportReaction).map(b=>({id:b.id,...b.supportReaction})),reactions:m.bars.map(b=>({id:b.id,...b.reaction}))};
near(PlotAxes.value(m,frame,'support:anchor4:moment'),236.58);
for(const r of m.canvasMonitors)assert.ok(Number.isFinite(AttachedMonitors.display(m,frame,r).value));
const saved=validate(JSON.parse(JSON.stringify(m)));for(let i=0;i<60;i++)Physics.step(saved);near(saved.bodies[0].supportReaction.moment,236.58);
// Removing the fixed support restores free bar pins and the rigid rotation mode.
m.bodies[0].support.kind='pinned';m.bodies[0].fixed=false;for(let i=0;i<120;i++)Physics.step(m);assert.ok(m.bodies.find(b=>b.id==='mass21').y<-.1);assert.equal(m.bars[0].supportAngleA,undefined);
assert.throws(()=>{const bad=load('bridge-fixed-left.json');bad.bars[0].supportAngleA=NaN;validate(bad);});
console.log('PASS: free-end bridge falls on a pin, stays stationary with a fixed support, balances 69.05 N and 236.58 N·m, readouts, clamp persistence and release');
