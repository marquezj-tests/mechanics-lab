// Regenerate distributable initial-condition files from the embedded English presets.
const fs=require('node:fs'),path=require('node:path');
const {app}=require('../tests/helpers/app.cjs');const {run}=app({language:'en'});
for(const {file,scene}of run('ExampleCatalog.map(e=>({file:e.file,scene:e.create()}))')){
 fs.writeFileSync(path.join(__dirname,'../examples',file),JSON.stringify(scene,null,2)+'\n');
 console.log(file);
}
