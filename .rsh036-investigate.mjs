import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const output='artifacts/rsh036-investigation';
await mkdir(output,{recursive:true});
const report={source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),samples:[]};
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{
  const {RendererFacade}=await import('/src/rendering/RendererFacade.ts');
  const init=RendererFacade.init;
  RendererFacade.init=function(...args){const gfx=init.apply(this,args);window.__investigationGfx=gfx;return gfx;};
 });
 await page.getByRole('button',{name:/בחר מסלול/}).click();
 const all=page.getByRole('button',{name:/^הכל$/});if(await all.count())await all.click();
 await page.getByRole('button',{name:/שדרות רוטשילד/}).click();
 await page.waitForFunction(()=>!!window.__controlsTest,{timeout:60000});
 for(const delay of [0,250,1500]){
  if(delay)await page.waitForTimeout(delay);
  const bytes=await page.screenshot({path:`${output}/rothschild-${delay}.png`});
  const p=PNG.sync.read(bytes);let visible=0,total=0;const colors=new Set();
  for(let y=110;y<580;y+=2)for(let x=160;x<1120;x+=2){const i=(y*p.width+x)*4;const [r,g,b]=p.data.subarray(i,i+3);total++;if(Math.max(r,g,b)>12)visible++;colors.add((r>>4)*256+(g>>4)*16+(b>>4));}
  const gfx=await page.evaluate(()=>{const gl=window.__investigationGfx.gl;const c=document.querySelector('canvas');return {frame:gl.info.render.frame,calls:gl.info.render.calls,contextLost:gl.getContext().isContextLost(),width:c.width,height:c.height};});
  report.samples.push({delay,visibleFraction:visible/total,colorBins:colors.size,...gfx});
 }
 report.pageErrors=errors;await page.close();
 const p2=await browser.newPage();await p2.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle'});
 report.constructor=await p2.evaluate(async()=>{
  const {RendererFacade}=await import('/src/rendering/RendererFacade.ts');const {RaceEngine}=await import('/src/game/engine.ts');
  const init=RendererFacade.init;let resource,disposed=0,error='';const c=document.createElement('canvas');c.style.cssText='width:800px;height:600px';document.body.append(c);
  RendererFacade.init=function(...args){resource=init.apply(this,args);const release=resource.dispose.bind(resource);resource.dispose=()=>{disposed++;release();};return resource;};
  try{new RaceEngine(c,{trackId:'ayalon',carId:'sabra',quality:'low',night:false,langHe:true,onHud(){},onFinish(){},onBoot(){throw new Error('injected constructor interruption');}});}catch(e){error=String(e);}finally{RendererFacade.init=init;}
  const result={error,automaticDisposals:disposed};if(resource&&disposed===0)resource.dispose();c.remove();return result;
 });await p2.close();
 const p3=await browser.newPage();await p3.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle'});
 const source=await(await p3.request.get('http://127.0.0.1:8080/src/game/road-assets.ts')).text();
 const three=source.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];if(!three)throw new Error('Cannot resolve actual Vite three import');
 report.texture=await p3.evaluate(async threePath=>{
  const THREE=await import(threePath);const road=await import('/src/game/road-assets.ts');const load=THREE.TextureLoader.prototype.loadAsync;let created=0,disposed=0,error='';
  THREE.TextureLoader.prototype.loadAsync=function(url){if(url.includes('-bump'))return new Promise((_,reject)=>setTimeout(()=>reject(new Error('injected batch failure')),5));return new Promise(resolve=>setTimeout(()=>{const t=new THREE.Texture();created++;t.addEventListener('dispose',()=>disposed++);resolve(t);},url.includes('-rough')?40:1));};
  try{await road.loadHwyRoad();}catch(e){error=String(e);}await new Promise(r=>setTimeout(r,80));THREE.TextureLoader.prototype.loadAsync=load;
  return {error,created,disposed,committed:!!road.getBakedRoad(4)};
 },three);await p3.close();
} catch(error){report.error=String(error);process.exitCode=1;} finally{await browser.close();await writeFile(`${output}/report.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
