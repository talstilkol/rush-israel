import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const out='artifacts/attribution';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results={baseline:'b0e3e525689955e6ff944b49f08c814e49cf03fa',current:'46d361365ccde29d528861051f9529c08ec725ab',baselineUpdates:0,acceptance:false,method:'diagnostic direct-engine replay; same locked dependencies; original historical assets; instant camera; no HUD; NOT original golden protocol',cases:[]};
try{
 for(const source of ['historical','current']){
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('requestfailed',r=>requests.push(r.url()));
  if(source==='historical')await page.route(url=>url.pathname.startsWith('/game/'),async route=>{
   const rel=new URL(route.request().url()).pathname;if(rel.includes('..'))return route.abort();
   try{const bytes=await readFile('artifacts/history/public'+rel);await route.fulfill({status:200,body:bytes,contentType:rel.endsWith('.png')?'image/png':rel.endsWith('.jpg')?'image/jpeg':'application/octet-stream'});}
   catch{await route.fulfill({status:404,body:'historical asset absent'});}
  });
  let setup,frames=[];
  try{
   await page.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle',timeout:45000});
   setup=await page.evaluate(async source=>{
    const module=source==='historical'?await import('/artifacts/history/src/game/engine.ts'):await import('/src/game/engine.ts');
    const canvas=document.createElement('canvas');canvas.id='attribution';canvas.style.cssText='position:fixed;inset:0;width:1280px;height:800px;z-index:100000';document.body.append(canvas);
    const engine=new module.RaceEngine(canvas,{trackId:'ayalon',carId:'sabra',quality:'high',night:false,langHe:true,onHud(){},onFinish(){}});window.__attrib={engine,canvas};await engine.ready;engine.renderer.setAnimationLoop(null);
    return{ramps:engine.world.ramps.length,colliders:engine.world.colliders.length,samples:engine.built.samples.length,trackLength:engine.built.length,renderer:engine.renderer.getContext().getParameter(engine.renderer.getContext().VERSION),soft:engine.soft};
   },source);
   for(const [id,t,night]of[['g01',0.04,false],['g05',0.46,false],['g07',0.62,false],['g08',0.48,true]]){
    const state=await page.evaluate(({t,night})=>{
     const{engine}=window.__attrib;engine.setNight(night);engine.player.spawn(engine.built,t,0);engine.snapCamera(true);engine.present(0);engine.snapCamera(true);engine.renderer.setAnimationLoop(()=>engine.renderer.render(engine.scene,engine.camera));
     return{position:[engine.player.x,engine.player.y,engine.player.z],yaw:engine.player.yaw,camera:{position:engine.camera.position.toArray(),quaternion:engine.camera.quaternion.toArray(),fov:engine.camera.fov},ramps:engine.world.ramps.filter(r=>Math.abs(r.z-engine.player.z)<100).map(r=>({x:r.x,z:r.z,half:r.half,len:r.len,y0:r.y0,y1:r.y1})),night};
    },{t,night});
    await page.waitForTimeout(500);const png=await page.locator('#attribution').screenshot();await writeFile(`${out}/${source}-${id}.png`,png);await page.evaluate(()=>window.__attrib.engine.renderer.setAnimationLoop(null));frames.push({id,...state,pngSha256:createHash('sha256').update(png).digest('hex')});
   }
   results.cases.push({source,status:'captured_for_diagnosis_only',setup,frames,errors,failedRequests:requests});
  }catch(e){results.cases.push({source,status:'failed',setup,frames,error:String(e),errors,failedRequests:requests});}
  finally{await page.evaluate(()=>{window.__attrib?.engine?.dispose();window.__attrib?.canvas?.remove();}).catch(()=>{});await page.close();}
 }
}finally{await browser.close();await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));}
if(results.cases.some(c=>c.status==='failed'))process.exitCode=1;
