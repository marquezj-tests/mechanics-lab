// Runs actual inline application code. DOM/canvas are stubs, not a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
function app(){
 const nodes=new Map(),listeners={},ctx=new Proxy({}, {get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function node(id){if(!nodes.has(id)){const classes=new Set();nodes.set(id,{value:id==='speed'?'1':'',checked:false,style:{},dataset:{},innerHTML:'',textContent:'',listeners:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x){if(classes.has(x)){classes.delete(x);return false;}classes.add(x);return true;}},addEventListener(t,f){this.listeners[t]=f;},getContext:()=>ctx,getBoundingClientRect:()=>({width:1000,height:600,left:0,top:0}),setPointerCapture(){},setAttribute(k,v){this[k]=v;},querySelectorAll:()=>[],querySelector:()=>null,showModal(){this.open=true;},close(){this.open=false;},focus(){},select(){},reportValidity(){},click(){this.onclick?.();}});}return nodes.get(id);}
 const context=vm.createContext({console,document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener(){}},window:{devicePixelRatio:1,addEventListener:(t,f)=>listeners[t]=f},ResizeObserver:class{observe(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}});
 const run=code=>vm.runInContext(code,context);
 run(html.match(/<script>([\s\S]*)<\/script>/)[1]);
 run('globalThis.downloads=[];download=(text,type,name)=>downloads.push({text,type,name});');
 return {run,node,listeners,context};
}
module.exports={app,html};
