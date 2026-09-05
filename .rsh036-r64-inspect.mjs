import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out='artifacts/scene-diagnostic'; await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}); const page=await browser.newPage({viewport:{width:1280,height:800}}); const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
try {
 await page.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle'});
 const src=await (await page.request.get('http://127.0.0.1:8080/src/game/world.ts')).text(); const three=src.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1]; if(!three)throw Error('THREE path missing');
 const report=await page.evaluate(async path=>{
  const THREE=await import(path); const {RaceEngine}=await import('/src/game/engine.ts'); const canvas=document.createElement('canvas'); canvas.style.cssText='position:fixed;inset:0;width:1280px;height:800px;z-index:1000'; document.body.append(canvas); let e;
  try {
   e=new RaceEngine(canvas,{trackId:'rothschild',carId:'sabra',quality:'low',night:false,langHe:true,onHud(){},onFinish(){}}); await e.ready; await new Promise(r=>setTimeout(r,2000)); e.renderer.setAnimationLoop(null);
   const gl=e.renderer.getContext(); const pix=new Uint8Array(4); const rows=[]; const original=[];e.world.group.traverse(o=>{if(o.isMesh||o.isPoints||o.isSprite||o.isLine)original.push({o,visible:o.visible,before:o.onBeforeRender});});
   const snap=label=>{e.renderer.render(e.scene,e.camera); let black=0,lit=0; const samples=[];for(let y=1;y<8;y++)for(let x=1;x<8;x++){gl.readPixels(Math.floor(gl.drawingBufferWidth*x/8),Math.floor(gl.drawingBufferHeight*y/8),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pix);const a=Array.from(pix);samples.push(a);if(a.slice(0,3).every(v=>v<3))black++;else lit++;}const row={label,black,lit,samples,glError:gl.getError()};rows.push(row);return row;};
   snap('original');
   for(const kind of ['MeshBasicMaterial','MeshStandardMaterial','MeshPhysicalMaterial','ShaderMaterial','PointsMaterial']){for(const {o,visible}of original){const mats=Array.isArray(o.material)?o.material:[o.material];o.visible=visible&&!mats.some(m=>m?.type===kind);}snap('without-'+kind);for(const {o,visible}of original)o.visible=visible;}
   for(const {o}of original)o.onBeforeRender=()=>{};snap('without-render-callbacks');for(const {o,before}of original)o.onBeforeRender=before;
   const env=e.scene.environment;e.scene.environment=null;snap('without-environment');e.scene.environment=env;
   const fog=e.scene.fog;e.scene.fog=null;snap('without-fog');e.scene.fog=fog;
   const override=new THREE.MeshNormalMaterial();e.scene.overrideMaterial=override;snap('normal-material-override');e.scene.overrideMaterial=null;override.dispose();
   const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),e.camera);const hits=ray.intersectObjects(e.world.group.children,true).slice(0,8).map(h=>({distance:h.distance,type:h.object.type,material:h.object.material?.type,color:h.object.material?.color?.getHex(),geometry:h.object.geometry?.type,parameters:h.object.geometry?.parameters,position:h.object.position.toArray(),scale:h.object.scale.toArray()}));
   snap('restored'); window.__r64DiagnosticEngine=e;return {track:'rothschild',rows,hits,renderables:original.length,renderer:gl.getParameter(gl.RENDERER)};
  }catch(err){e?.dispose();canvas.remove();throw err;}
 },three);
 await page.screenshot({path:out+'/scene.png'}); await writeFile(out+'/report.json',JSON.stringify({report,errors},null,2)); console.log(JSON.stringify({rows:report.rows.map(({label,black,lit})=>({label,black,lit})),hits:report.hits,errors}));
 await page.evaluate(()=>window.__r64DiagnosticEngine.dispose());
} finally {await browser.close();}
