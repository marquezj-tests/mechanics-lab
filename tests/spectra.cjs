const assert=require('node:assert/strict');const {app}=require('./helpers/app.cjs');const {run,node,context}=app();
const transform=(samples,dt=1/60,options={})=>{context.signal=Float64Array.from(samples);context.settings=options;return run(`FrequencyAnalysis.compute(signal,${dt},settings)`);};
const n=4096,bin=256,tone=Array.from({length:n},(_,i)=>12+2*Math.sin(2*Math.PI*bin*i/n));let r=transform(tone);
assert.equal(r.size,n);assert.equal(r.sampleRate,60);assert.equal(r.nyquist,30);assert.equal(r.binHz*bin,3.75);assert.ok(Math.abs(r.amplitude[bin]-2)<1e-6);assert.ok(r.amplitude[0]<1e-7);
r=transform(Array(128).fill(7),1/60,{removeMean:false,hann:false});assert.ok(Math.abs(r.amplitude[0]-7)<1e-12);assert.ok(r.amplitude.slice(1).every(v=>v<1e-12));
r=transform(Array(128).fill(7));assert.ok(r.amplitude.every(v=>v===0));
r=transform(Array.from({length:128},(_,i)=>3*(i%2?1:-1)));assert.ok(Math.abs(r.amplitude[64]-3)<1e-10);
// Compare every output bin against an independent direct DFT, including padding.
const short=Array.from({length:21},(_,i)=>2+Math.sin(.73*i)+.2*Math.cos(.18*i));
for(const hann of [true,false])for(const removeMean of [true,false]){
 const r=transform(short,1/60,{hann,removeMean}),mean=removeMean?short.reduce((s,x)=>s+x,0)/short.length:0,window=short.map((_,i)=>hann?.5-.5*Math.cos(2*Math.PI*i/(short.length-1)):1),gain=window.reduce((s,x)=>s+x,0);
 for(let k=0;k<=r.size/2;k++){let re=0,im=0;for(let i=0;i<short.length;i++){const value=(short[i]-mean)*window[i];re+=value*Math.cos(2*Math.PI*k*i/r.size);im-=value*Math.sin(2*Math.PI*k*i/r.size);}const expected=Math.hypot(re,im)*(k===0||k===r.size/2?1:2)/gain;assert.ok(Math.abs(expected-r.amplitude[k])<1e-11);}
}
for(const bad of [[],Array(7).fill(0),[...Array(8).fill(0),NaN],Array(36002).fill(0)])assert.throws(()=>transform(bad));assert.throws(()=>transform(Array(8).fill(1e308)));for(const dt of [0,-1,Infinity])assert.throws(()=>transform(Array(8).fill(0),dt));
// Maximum supported recording, correctly padded and finite.
r=transform(Array.from({length:36001},(_,i)=>Math.sin(2*Math.PI*.5*i/60)));assert.equal(r.size,65536);assert.ok(r.amplitude.every(Number.isFinite));
run(`replaceExperiment({...example(),bodies:[{id:'m',type:'mass',name:'Mass',mass:1,x:0,y:0,vx:0,vy:0}],springs:[],bars:[],forces:[],canvasMonitors:[]});
 globalThis.p={id:'test',name:'Test',x:'time',y:'body:m:x',lines:[{id:'a',y:'body:m:x',visible:true,color:'#286cdb'},{id:'b',y:'body:m:y',visible:false,color:'#d88424'}],left:0,top:0,width:370,height:280};model.plots=[p];syncUI();`);
assert.match(node('plotLayer').innerHTML,/plotSpectrum:test/);node('plotSpectrum:test').onclick();assert.match(node('toast').textContent,/at least 8 samples/);
run(`frames=Array.from({length:1024},(_,i)=>({t:i/60,energy:0,kineticEnergy:0,states:[{id:'m',x:2*Math.sin(2*Math.PI*64*i/1024),y:3*Math.cos(2*Math.PI*32*i/1024),vx:0,vy:0}],reactions:[],loads:[],supports:[]}));cursor=100;tick=4092;running=true;globalThis.beforeSpectrum=JSON.stringify({model,initial,frames,tick,cursor,history,future});`);
node('plotSpectrum:test').onclick();assert.equal(node('spectrumDialog').open,true);assert.equal(run('running'),false);assert.equal(run('spectrumData.series.length'),1);assert.equal(run('JSON.stringify({model,initial,frames,tick,cursor,history,future})'),run('beforeSpectrum'));
assert.match(node('spectrumSummary').textContent,/0.00–17.05 s/);assert.equal(run('spectrumData.series[0].result.count'),1024);assert.equal(Number(node('spectrumMax').value),30);
run('globalThis.cached=spectrumData.series[0].result;drawSpectrum();');assert.equal(run('cached===spectrumData.series[0].result'),true);
node('spectrumHann').checked=false;node('spectrumHann').onchange();assert.ok(run('Math.abs(spectrumData.series[0].result.amplitude[64]-2)<1e-10'));
node('spectrumMax').value='2';node('spectrumMax').onchange();assert.equal(Number(node('spectrumMax').value),2);node('spectrumMax').value='31';node('spectrumMax').onchange();assert.equal(Number(node('spectrumMax').value),30);
node('spectrumCsv').onclick();const csv=run('downloads.at(-1)');assert.equal(csv.name,'Test-spectrum.csv');assert.match(csv.text,/frequency_Hz,"Amplitude: Mass · x \(m\)"/);assert.equal(csv.text.split('\n').length,514);
run('p.lines[1].visible=true;openSpectra(p);');assert.equal(run('spectrumData.series.length'),2);assert.equal(run('spectrumData.series[1].result.amplitude.length'),513);
node('spectrumClose').onclick();assert.equal(node('spectrumDialog').open,false);
run('p.x="body:m:x";syncUI();openSpectra(p);');assert.doesNotMatch(node('plotLayer').innerHTML,/plotSpectrum:test/);assert.match(node('toast').textContent,/time plots only/);
run('p.x="time";p.lines.forEach(l=>l.visible=false);openSpectra(p);');assert.match(node('toast').textContent,/at least one plot line/);
run('p.lines[0].visible=true;frames[8].t+=.01;openSpectra(p);');assert.match(node('toast').textContent,/uniformly sampled/);
run('frames[8].t=8/60;frames[9].states[0].x=NaN;openSpectra(p);');assert.match(node('toast').textContent,/uniformly sampled/);
run('changeLanguage("es");');assert.equal(run('I18n.text("Compute spectra")'),'Calcular espectros');assert.equal(run('I18n.text("Frequency spectra")'),'Espectros de frecuencia');
console.log('PASS: FFT vs independent DFT, tone/DC/Nyquist amplitudes, Hann/padding, max recording, visible curves, time-only action, frozen recording/replay, zoom/CSV, errors and Spanish labels');
