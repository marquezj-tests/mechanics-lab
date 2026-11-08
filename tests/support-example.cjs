const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const {Physics,AttachedMonitors}=vm.runInNewContext(html.slice(html.indexOf('const Geometry ='),html.indexOf('const copy='))+';({Physics,AttachedMonitors})');
const m=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/pinned-vs-fixed.json'),'utf8'));
const [p,f]=m.bodies;for(const key of ['mass','width','height','vx','vy','angle','omega','inertia','restitution','friction'])assert.equal(p[key],f[key]);
assert.equal(p.support.kind,'pinned');assert.equal(f.support.kind,'fixed');
assert.deepEqual(m.forces[0].local,m.forces[1].local);for(const key of ['fx','fy','bodyFrame'])assert.equal(m.forces[0][key],m.forces[1][key]);
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
Physics.step(m);near(p.omega/Physics.dt,-2/p.inertia,1e-7);
for(let i=0;i<2400;i++){Physics.step(m);near(p.x,-2);near(p.y,0);near(f.x,2);near(f.y,0);near(f.angle,0);near(f.omega,0);near(p.supportReaction.moment,0);near(f.supportReaction.moment,2);near(p.supportReaction.fy,21.62);near(f.supportReaction.fy,21.62);near(p.supportReaction.fx,0);near(f.supportReaction.fx,0);}
const frame={t:10,states:m.bodies,supports:m.bodies.map(b=>({id:b.id,...b.supportReaction}))};
assert.equal(m.canvasMonitors.length,6);for(const monitor of m.canvasMonitors){const display=AttachedMonitors.display(m,frame,monitor);assert.ok(display&&Number.isFinite(display.value));}
console.log('PASS: comparison fixture, equal beam/load parameters, initial angular acceleration, ten-second support force/torque balance and monitor quantities');
