const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const errors=[];const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');const {Physics,Joints}=vm.runInNewContext(html.slice(html.indexOf('const Geometry ='),html.indexOf('const PlotAxes ='))+';({Physics,Joints})');
for(const solverPrecision of ['standard','high','veryHigh']){
const m={solverPrecision,gravityOn:false,gravity:9.81,bodies:[{id:'a',type:'anchor',x:0,y:0},{id:'b',type:'mass',mass:1,x:2.5,y:0,vx:0,vy:0}],springs:[{a:'a',b:'b',k:64,rest:2,damping:0}],bars:[],forces:[]};const e=Physics.energy(m);let peak=0,error=0;
for(let i=1;i<=600/Physics.dt;i++){Physics.step(m);peak=Math.max(peak,Math.abs(Physics.energy(m)/e-1));error=Math.max(error,Math.abs(m.bodies[1].x-(2+.5*Math.cos(8*i*Physics.dt))));}
assert.ok(peak<.00028);assert.ok(Math.abs(m._time-600)<1e-7);errors.push(error);
console.log(JSON.stringify({solverPrecision,seconds:600,peakRelativeEnergyError:peak,maxPositionError:error,clockError:m._time-600}));}
assert.ok(errors[0]<.112);assert.ok(errors[1]<errors[0]/3.9);assert.ok(errors[2]<errors[1]/3.9);
const m={gravityOn:true,gravity:9.81,bodies:[{id:'a',type:'anchor',x:0,y:1.5},{id:'b',type:'mass',mass:1,x:1.2,y:-.1,vx:0,vy:0}],springs:[],forces:[],bars:[{id:'r',a:'a',b:'b',length:2,localA:{x:0,y:0},localB:{x:0,y:0}}]};Physics.prepare(m);let peak=0,len=0;const e=Physics.energy(m);for(let i=0;i<600/Physics.dt;i++){Physics.step(m);peak=Math.max(peak,Math.abs(Physics.energy(m)-e)/3.924);len=Math.max(len,Joints.maxError(m));}console.log(JSON.stringify({pendulum:true,seconds:600,peakRelativeEnergyError:peak,maxLengthError:len,clockError:m._time-600}));

assert.ok(peak<1e-5);assert.ok(len<1e-9);assert.ok(Math.abs(m._time-600)<1e-7);console.log('PASS: 600 s oscillator energy/phase convergence, constrained pendulum energy/lengths and integration clock');
