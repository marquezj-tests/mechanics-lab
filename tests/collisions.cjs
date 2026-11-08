const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('const Geometry ='),end=html.indexOf('const copy=');
const {Geometry,Physics}=vm.runInNewContext(html.slice(start,end)+';({Geometry,Physics})');
let serial=0;
function circle(x,y,vx=0,vy=0,extra={}){const b={id:'b'+serial++,type:'mass',shape:'circle',x,y,vx,vy,angle:0,omega:0,mass:1,radius:.5,restitution:1,friction:0,...extra};b.inertia=Geometry.inertia(b);return b;}
function rectangle(x,y,width,height,extra={}){const b={...circle(x,y),shape:'rectangle',width,height,...extra};b.inertia=Geometry.inertia(b);return b;}
const model=bodies=>({bodies,springs:[],gravityOn:false,gravity:9.81});
const evolve=(m,t)=>{for(let i=0;i<Math.round(t/Physics.dt);i++)Physics.step(m);};
let a=circle(-1,0,1),b=circle(1,0,-1),m=model([a,b]);evolve(m,1);assert.ok(Math.abs(a.vx+1)<1e-10&&Math.abs(b.vx-1)<1e-10,'elastic equal masses exchange velocities');
a=circle(-1,0,2,0,{mass:2});b=circle(1,0,0);m=model([a,b]);const initialEnergy=Physics.energy(m);evolve(m,1);assert.ok(Math.abs(a.vx-2/3)<1e-8&&Math.abs(b.vx-8/3)<1e-8);assert.ok(Math.abs(Physics.energy(m)-initialEnergy)<1e-8);
a=circle(-1,0,1,0,{restitution:0});b=circle(1,0,-1,0,{restitution:0});m=model([a,b]);evolve(m,1);assert.ok(Math.abs(a.vx)<1e-10&&Math.abs(b.vx)<1e-10);
a=circle(0,2,0,-3);b=rectangle(0,0,10,.5,{fixed:true});m=model([a,b]);evolve(m,.6);assert.ok(a.vy>2.9,'circle bounces off fixed floor');assert.equal(b.y,0);assert.equal(b.vy,0);
a=rectangle(-1,0,1,1,{vx:1});b=rectangle(1,0,1,1,{vx:-1});m=model([a,b]);evolve(m,1);assert.ok(a.vx<-.99&&b.vx>.99,'face-to-face rectangles bounce symmetrically');assert.ok(Math.abs(a.omega)<1e-4&&Math.abs(b.omega)<1e-4,'centered impact adds no spin');
a=circle(-2,.45,3);b=rectangle(0,0,1,1);m=model([a,b]);evolve(m,.8);assert.ok(Math.abs(b.omega)>.1,'off-center impact generates angular motion');assert.ok(Math.abs(a.vx+b.vx-3)<1e-8&&Math.abs(a.vy+b.vy)<1e-8,'impact conserves linear momentum');
a=circle(0,.76,2,-1,{friction:1});b=rectangle(0,0,10,.5,{fixed:true,friction:1});m=model([a,b]);evolve(m,.05);assert.ok(a.vx<1.9,'friction reduces tangential speed');assert.ok(Math.abs(a.omega)>.1,'friction spins disk');
a=circle(0,2,0,0,{restitution:0,friction:.5});b=rectangle(0,0,10,.5,{fixed:true,restitution:0});m=model([a,b]);m.gravityOn=true;evolve(m,4);assert.ok(Math.abs(a.y-.75)<.015,'resting disk remains supported');assert.ok(Math.abs(a.vy)<.05);
a=rectangle(0,2,1,1,{restitution:0});b=rectangle(0,0,10,.5,{fixed:true,restitution:0});m=model([a,b]);m.gravityOn=true;evolve(m,4);assert.ok(Math.abs(a.y-.75)<.02,'resting rectangle remains supported');assert.ok(Math.abs(a.omega)<.02);
// A concave L must leave its empty upper-right notch accessible.
const poly=Geometry.polygon([{x:0,y:0},{x:3,y:0},{x:3,y:1},{x:1,y:1},{x:1,y:3},{x:0,y:3}]);
b={...circle(poly.cx,poly.cy),shape:'polygon',vertices:poly.vertices,fixed:true};b.inertia=Geometry.inertia(b);a=circle(2,2,0,0,{radius:.2});m=model([a,b]);evolve(m,.1);assert.equal(a.x,2);assert.equal(a.y,2);
a=circle(2,1.8,0,-1,{radius:.2});m=model([a,b]);evolve(m,1);assert.ok(a.vy>.9,'disk hits concave polygon arm');
a=circle(-1,0,1,0,{constraint:{x:0,y:0,angle:0}});b=rectangle(1,0,1,4,{fixed:true,angle:.3});m=model([a,b]);evolve(m,2);assert.ok(Math.abs(a.y)<1e-12&&Math.abs(a.vy)<1e-12,'collision respects linear constraint');
console.log('PASS: elastic/inelastic impacts, unequal masses, energy and momentum, fixed floors, rectangle manifolds, angular response, friction, resting contacts, concave polygons, and constraints');
a=circle(-1,0,200,0,{radius:.05});a.inertia=Geometry.inertia(a);b=rectangle(0,0,.05,4,{fixed:true});m=model([a,b]);evolve(m,.02);assert.ok(a.vx<0,'adaptive substeps catch a fast disk and thin wall');
console.log('PASS: fast disk versus thin wall with adaptive substeps');
