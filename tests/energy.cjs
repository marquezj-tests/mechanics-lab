const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const {Physics,Joints,Geometry}=vm.runInNewContext(html.slice(html.indexOf('const Geometry ='),html.indexOf('const PlotAxes ='))+';({Physics,Joints,Geometry})');
const mass=(id,x,y)=>({id,type:'mass',mass:1,x,y,vx:0,vy:0});
const anchor=(id,x,y)=>({id,type:'anchor',x,y});
const rod=(id,a,b,length,extra={})=>({id,a,b,length,localA:{x:0,y:0},localB:{x:0,y:0},...extra});
function benchmark(name,m,seconds,scale){Physics.prepare(m);const e0=Physics.energy(m);let max=0,lengthError=0;for(let i=0;i<Math.round(seconds/Physics.dt);i++){Physics.step(m);max=Math.max(max,Math.abs(Physics.energy(m)-e0)/scale);lengthError=Math.max(lengthError,Joints.maxError(m));}assert.ok(max<1e-5,`${name}: relative energy error ${max}`);assert.ok(lengthError<1e-9,`${name}: length error ${lengthError}`);console.log(name+':',JSON.stringify({seconds,maxRelativeEnergyError:max,finalRelativeEnergyChange:(Physics.energy(m)-e0)/scale,maxLengthError:lengthError}));}
const single=()=>({bodies:[anchor('a',0,1.5),mass('b',1.2,-.1)],bars:[rod('r','a','b',2)],springs:[],forces:[],gravityOn:true,gravity:9.81});
benchmark('Single pendulum',single(),120,3.924);
const double={bodies:[anchor('a',0,0),mass('b',1.2,-1.6),mass('c',2.4,-3.2)],bars:[rod('r','a','b',2),rod('s','b','c',2)],springs:[],forces:[],gravityOn:true,gravity:9.81};
benchmark('Double pendulum',double,30,11.772);
const b={...mass('b',1.5,-1.5),shape:'rectangle',width:1,height:1,angle:0,omega:0};b.inertia=Geometry.inertia(b);
benchmark('Off-center rigid pendulum',{bodies:[anchor('a',0,0),b],bars:[rod('r','a','b',Math.SQRT2,{localB:{x:-.5,y:.5}})],springs:[],forces:[],gravityOn:true,gravity:9.81},30,9.81*(Math.SQRT2+Math.SQRT1_2));
const triangle=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/two_mass_pendulum.json'),'utf8'));Physics.prepare(triangle);const masses=triangle.bodies.filter(b=>b.type==='mass'),sx=masses.reduce((s,b)=>s+b.mass*b.x,0),sy=masses.reduce((s,b)=>s+b.mass*b.y,0),excitation=Physics.energy(triangle)+9.81*Math.hypot(sx,sy);
benchmark('User triangular pendulum',triangle,30,excitation);
const reversible=single();Physics.prepare(reversible);const state=JSON.parse(JSON.stringify(reversible.bodies[1]));for(let i=0;i<240;i++)Physics.step(reversible);reversible.bodies[1].vx*=-1;reversible.bodies[1].vy*=-1;for(let i=0;i<240;i++)Physics.step(reversible);assert.ok(Math.hypot(reversible.bodies[1].x-state.x,reversible.bodies[1].y-state.y)<1e-8,'conservative motion should be time-reversible');
console.log('PASS: long-run constrained energy, coupled/rigid pendulums, fixed lengths, and time reversal');
