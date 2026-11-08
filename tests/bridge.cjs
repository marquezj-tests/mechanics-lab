const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const code=html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='));
const validation=html.slice(html.indexOf('function validate(raw)'),html.indexOf("\n$('file').onchange"));
const {Physics,Joints,PlotAxes,AttachedMonitors,validate}=vm.runInNewContext(code+';'+validation+';({Physics,Joints,PlotAxes,AttachedMonitors,validate})');
const m=validate(JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/bridge-monitored.json'),'utf8')));
assert.equal(m.canvasMonitors.length,15);assert.equal(m.bars.length,9);
Physics.prepare(m);for(let i=0;i<240;i++)Physics.step(m);
const left=m.bodies.find(b=>b.id==='anchor4').supportReaction,right=m.bodies.find(b=>b.id==='mass21').supportReaction;
assert.ok(Math.abs(left.fx)<1e-8&&Math.abs(right.fx)<1e-8);
assert.ok(Math.abs(left.fy-29.62)<1e-6);assert.ok(Math.abs(right.fy-39.43)<1e-6);
assert.ok(Math.abs(left.fy+right.fy-(5*9.81+20))<1e-6,'supports balance the five masses and both loads');
assert.ok(Math.abs(right.fy*6-(2*9.81*2+2*9.81*4+9.81*6+10*2+10*4))<1e-6,'support reactions balance moments');
assert.ok(Math.abs(left.moment)<1e-12);assert.ok(Math.abs(right.moment)<1e-12);assert.ok(Joints.maxError(m)<1e-6);
const f={t:1,energy:Physics.energy(m),states:m.bodies.filter(b=>b.type==='mass'),reactions:m.bars.map(b=>({id:b.id,...b.reaction})),supports:m.bodies.filter(b=>b.supportReaction).map(b=>({id:b.id,...b.supportReaction}))};
for(const monitor of m.canvasMonitors){const display=AttachedMonitors.display(m,f,monitor);assert.ok(display&&Number.isFinite(display.value));assert.ok(AttachedMonitors.anchor(m,monitor.target));assert.equal(display.unit,monitor.variable.endsWith(':moment')?'N·m':'N');}
assert.ok(PlotAxes.value(m,f,'bar:bar15:tension')<0,'diagonal is in compression');assert.ok(PlotAxes.value(m,f,'bar:bar10:tension')>0,'bottom chord is in tension');assert.ok(Math.abs(PlotAxes.value(m,f,'bar:bar32:tension'))<1e-6,'central diagonal has zero force for this loading');
console.log('PASS: monitored bridge file, all 15 readouts, force/moment equilibrium, pin/roller torque, reaction units, bar tension/compression and fixed lengths. Supports:',left.fy,right.fy,'N');
