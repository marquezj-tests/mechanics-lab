const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.match(/const Physics = \(\(\)=>\{[\s\S]*?\n\}\)\(\);/)[0];
const Physics=vm.runInNewContext(source+';Physics');
const clone=x=>JSON.parse(JSON.stringify(x));
const oscillator=()=>({gravityOn:false,gravity:9.81,bodies:[{id:'a',type:'anchor',x:0,y:0},{id:'m',type:'mass',mass:1,x:3,y:0,vx:0,vy:0}],springs:[{a:'a',b:'m',k:4,rest:2}]});
function evolve(m,seconds){for(let i=0;i<Math.round(seconds/Physics.dt);i++)Physics.step(m);}
let m=oscillator();evolve(m,Math.PI);assert.ok(Math.abs(m.bodies[1].x-3)<1e-4,'oscillator returns after analytical period');
m=oscillator();let e=Physics.energy(m),drift=0;for(let i=0;i<240*60;i++){Physics.step(m);drift=Math.max(drift,Math.abs(Physics.energy(m)-e)/e);}assert.ok(drift<.00002,'bounded oscillator energy drift');console.log('60 s oscillator maximum relative energy drift:',drift);
m=oscillator();m.gravityOn=true;m.springs=[];m.bodies[1].x=0;m.bodies[1].y=0;evolve(m,1);assert.ok(Math.abs(m.bodies[1].y+4.905)<1e-10);assert.ok(Math.abs(m.bodies[1].vy+9.81)<1e-10);
m=oscillator();m.gravityOn=true;m.bodies[1].x=0;m.bodies[1].y=-(2+9.81/4);const equilibrium=m.bodies[1].y;evolve(m,3);assert.ok(Math.abs(m.bodies[1].y-equilibrium)<1e-10);
for(const angle of [0,90,37]){m=oscillator();const b=m.bodies[1];b.constraint={x:1,y:-1,angle};Physics.project(b);const a=angle*Math.PI/180;for(let i=0;i<2400;i++){Physics.step(m);assert.ok(Math.abs(-(b.x-1)*Math.sin(a)+(b.y+1)*Math.cos(a))<1e-12);assert.ok(Math.abs(-b.vx*Math.sin(a)+b.vy*Math.cos(a))<1e-12);}}
m=oscillator();m.bodies[0]={id:'a',type:'mass',mass:2,x:0,y:0,vx:0,vy:0};evolve(m,2);assert.ok(Math.abs(2*m.bodies[0].vx+m.bodies[1].vx)<1e-10,'internal forces conserve momentum');
m=oscillator();m.bodies[1].x=0;Physics.step(m);assert.ok(Number.isFinite(m.bodies[1].x),'coincident endpoints remain finite');
const validation=html.match(/function validate\(raw\)\{[\s\S]*?\n\$\('file'\)/)[0].split("\n$('file')")[0];
const axes=html.match(/const PlotAxes = \(\(\)=>\{[\s\S]*?\n\}\)\(\);/)[0];
const validate=vm.runInNewContext(source+';'+axes+';'+validation+';validate');
const good={version:1,name:'test',...oscillator(),monitor:'m',monitorType:'xy',view:{x:0,y:0,scale:80}};good.springs[0].id='s';good.bodies.forEach(b=>b.name=b.id);
assert.equal(validate(good).bodies.length,2);
for(const mutate of [x=>x.version=2,x=>x.bodies[1].mass=-1,x=>x.springs[0].a='missing',x=>x.bodies[1].x=Infinity,x=>x.bodies[1].id='a',x=>x.springs[0].id='m']){const bad=clone(good);mutate(bad);assert.throws(()=>validate(bad));}
console.log('PASS: analytical period, energy, free fall, equilibrium, constraints, momentum, coincident endpoints, file validation');
const recording=html.slice(html.indexOf('function snapshot()'),html.indexOf('function stop()'));
const advance=html.slice(html.indexOf('function advance()'),html.indexOf('function animate('));
vm.runInNewContext(source+`
let model=${JSON.stringify(oscillator())}, tick=0, frames=[],cursor=0,dirty=false;
const stop=()=>{},toast=()=>{},$=()=>({});
const body=id=>model.bodies.find(b=>b.id===id);
${recording}
${advance}
frames=[snapshot()];advance();advance();
const latest=JSON.stringify(frames[2]);
restoreFrame(0);
if(model.bodies[1].x!==3)throw Error('Rewind failed');
advance();
if(cursor!==1||frames.length!==3)throw Error('Replay must use recorded states');
advance();
if(JSON.stringify(frames[2])!==latest||cursor!==2)throw Error('Replay changed the recording');
advance();
if(frames.length!==4||tick!==12)throw Error('Simulation must continue after replay');
`);
console.log('PASS: rewind restores state, replay preserves recording, simulation continues at recording end');
// Damped oscillator: x'' + c*x' + k*x = 0 for unit mass.
m=oscillator();m.springs[0].damping=.6;
const damping=.6,omega=Math.sqrt(4-damping*damping/4),duration=2;
evolve(m,duration);
const expected=2+Math.exp(-damping*duration/2)*(Math.cos(omega*duration)+damping/(2*omega)*Math.sin(omega*duration));
assert.ok(Math.abs(m.bodies[1].x-expected)<2e-5,'damped motion matches analytical solution');
m=oscillator();m.springs[0].k=0;m.springs[0].damping=2;m.bodies[1].vx=1;
evolve(m,1);assert.ok(Math.abs(m.bodies[1].vx-Math.exp(-2))<1e-12,'axial drag decays velocity exponentially');
m=oscillator();m.springs[0].k=0;m.springs[0].damping=100000;m.bodies[1].vy=1;Physics.step(m);
// No initial axial velocity: tangential motion is unaffected by the first half-step.
assert.ok(m.bodies[1].vy>.99,'spring damping is axial rather than ambient drag');
m=oscillator();m.bodies[0]={id:'a',type:'mass',mass:2,x:0,y:0,vx:1,vy:0};m.bodies[1].vx=-1;m.springs[0].damping=3;
e=Physics.energy(m);evolve(m,2);assert.ok(Math.abs(2*m.bodies[0].vx+m.bodies[1].vx-1)<1e-10);assert.ok(Physics.energy(m)<e,'damping dissipates energy while preserving momentum');
m=oscillator();m.springs[0].damping=100000;m.bodies[1].constraint={x:3,y:0,angle:37};m.bodies[1].vx=1;Physics.project(m.bodies[1]);evolve(m,1);assert.ok(Number.isFinite(m.bodies[1].vx));assert.ok(Math.abs(-m.bodies[1].vx*Math.sin(37*Math.PI/180)+m.bodies[1].vy*Math.cos(37*Math.PI/180))<1e-12);
assert.equal(validate(good).springs[0].damping,0,'older files default to zero drag');
const dampedFile=clone(good);dampedFile.springs[0].damping=.8;assert.equal(validate(JSON.parse(JSON.stringify(validate(dampedFile)))).springs[0].damping,.8);
for(const c of [-1,Infinity,'1',null]){const bad=clone(good);bad.springs[0].damping=c;assert.throws(()=>validate(bad));}
console.log('PASS: analytical damping, axial-only drag, momentum, energy dissipation, strong damping with constraints, damping file round-trip and validation');
