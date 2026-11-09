// Dependency-free FFT feasibility benchmark. No changes to the simulator runtime.
// node scripts/benchmark-spectra.cjs [--recording /path/to/pendulum-position-recording.json]
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os');
const {performance}=require('node:perf_hooks');
const sampleRate=60;
class Spectrum {
 constructor(n){
  assert.ok(n>=4&&(n&(n-1))===0);this.n=n;this.re=new Float64Array(n);this.im=new Float64Array(n);this.amplitude=new Float64Array(n/2+1);this.window=new Float64Array(n);this.reverse=new Uint32Array(n);this.cos=new Float64Array(n/2);this.sin=new Float64Array(n/2);this.gain=0;this.windowCount=n;
  const bits=Math.log2(n);for(let i=0;i<n;i++){let k=i,r=0;for(let j=0;j<bits;j++){r=(r<<1)|(k&1);k>>>=1;}this.reverse[i]=r;this.window[i]=.5-.5*Math.cos(2*Math.PI*i/(n-1));this.gain+=this.window[i];}
  for(let i=0;i<n/2;i++){this.cos[i]=Math.cos(2*Math.PI*i/n);this.sin[i]=-Math.sin(2*Math.PI*i/n);}
 }
 compute(samples,offset=0){
  const count=Math.min(this.n,samples.length-offset);assert.ok(count>=4);
  if(count!==this.windowCount){this.gain=0;for(let i=0;i<count;i++){this.window[i]=.5-.5*Math.cos(2*Math.PI*i/(count-1));this.gain+=this.window[i];}this.windowCount=count;}
  const {n,re,im,reverse,window,cos,sin,amplitude,gain}=this;let mean=0;for(let i=0;i<count;i++)mean+=samples[offset+i];mean/=count;
  for(let i=0;i<n;i++){re[reverse[i]]=i<count?(samples[offset+i]-mean)*window[i]:0;im[i]=0;}
  for(let size=2;size<=n;size*=2){const half=size/2,step=n/size;for(let base=0;base<n;base+=size)for(let j=0;j<half;j++){const a=base+j,b=a+half,c=cos[j*step],s=sin[j*step],tr=c*re[b]-s*im[b],ti=s*re[b]+c*im[b];re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti;}}
  for(let k=0;k<=n/2;k++)amplitude[k]=Math.hypot(re[k],im[k])*(k===0||k===n/2?1:2)/gain;
  return amplitude;
 }
}
function peak(a){let k=1;for(let j=2;j<a.length;j++)if(a[j]>a[k])k=j;return {bin:k,amplitude:a[k]};}
function verify(){
 const n=4096,plan=new Spectrum(n),k1=85,k2=257,samples=Float64Array.from({length:n},(_,i)=>12+2*Math.sin(2*Math.PI*k1*i/n)+.5*Math.cos(2*Math.PI*k2*i/n));
 const out=plan.compute(samples);assert.equal(peak(out).bin,k1);assert.ok(Math.abs(out[k1]-2)<1e-5);assert.ok(Math.abs(out[k2]-.5)<1e-5);assert.ok(out[0]<1e-7);
 const nyquist=Float64Array.from({length:n},(_,i)=>3*(i%2?1:-1));assert.ok(Math.abs(plan.compute(nyquist)[n/2]-3)<1e-10);
 const padded=new Spectrum(8192),short=Float64Array.from({length:2048},(_,i)=>7+1.7*Math.sin(2*Math.PI*37*i/2048)),p=peak(padded.compute(short));assert.equal(p.bin,148);assert.ok(Math.abs(p.amplitude-1.7)<1e-5);
 const zero=new Float64Array(n);assert.ok(plan.compute(zero).every(v=>v===0));
 console.log('PASS: known two-tone frequencies/amplitudes, DC removal, Nyquist amplitude, correct window-before-padding and zero signal');
}
function benchmark(n,channels,count=n){
 const start=performance.now(),plan=new Spectrum(n),samples=Array.from({length:channels},(_,c)=>Float64Array.from({length:count},(_,i)=>2+Math.sin(2*Math.PI*(.3+c*.13)*i/sampleRate)+.2*Math.cos(2*Math.PI*2.7*i/sampleRate))),setupMs=performance.now()-start;
 const outputs=Array.from({length:channels},()=>new Float64Array(n/2+1));
 const update=()=>{for(let c=0;c<channels;c++)outputs[c].set(plan.compute(samples[c]));};for(let i=0;i<12;i++)update();
 const batches=[];let iterations=1;let t=performance.now();update();let estimate=performance.now()-t;iterations=Math.max(1,Math.min(1000,Math.ceil(12/Math.max(.01,estimate))));
 for(let b=0;b<9;b++){t=performance.now();for(let j=0;j<iterations;j++)update();batches.push((performance.now()-t)/iterations);}
 batches.sort((a,b)=>a-b);const medianMs=batches[4];
 return {samples:n,recordedSamples:count,channels,windowSeconds:count/sampleRate,binHz:sampleRate/n,medianMs,p95BatchMs:batches[8],cpuPercentAt10Hz:medianMs,cpuPercentAt60Hz:medianMs*6,cpuPercentAt240Hz:medianMs*24,setupMs,signalAndOutputKiB:channels*(count*8+(n/2+1)*8)/1024,workspaceKiB:(plan.re.byteLength+plan.im.byteLength+plan.amplitude.byteLength+plan.window.byteLength+plan.reverse.byteLength+plan.cos.byteLength+plan.sin.byteLength)/1024};
}
verify();
console.log(JSON.stringify({runtime:process.version,cpu:os.cpus()[0].model,sampleRate,notes:'Single-thread Node timings; FFT + mean removal + Hann window + one-sided amplitudes. No canvas, worker transfer, variable lookup or simulation cost. Includes per-channel output copy. Batches reuse buffers/plans.'}));
const rows=[];for(const n of [1024,4096,8192,32768,65536])for(const channels of [1,4,16]){const row=benchmark(n,channels,n===65536?36001:n);rows.push(row);console.log(JSON.stringify(row));}
console.log(JSON.stringify({case:'postrun120s',...benchmark(8192,4,7201)}));
const arg=process.argv.indexOf('--recording');if(arg>=0){const recording=JSON.parse(fs.readFileSync(process.argv[arg+1],'utf8')),n=4096,plan=new Spectrum(n);assert.ok(recording.points.length>=n);for(const axis of ['x','y']){const samples=Float64Array.from(recording.points.slice(-n),p=>p[axis]),out=plan.compute(samples),p=peak(out);console.log(JSON.stringify({recordingAxis:axis,samples:n,dominantBinHz:p.bin*sampleRate/n,amplitude:p.amplitude,finite:out.every(Number.isFinite)}));}}
