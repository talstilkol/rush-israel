#!/usr/bin/env node
/** Loaded car geometry regression and bounded car-resource cycles; no art/device acceptance. */
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {fromRoot} from './project-root.mjs';

export async function verifyCarGlazing() {
 const output=fromRoot('artifacts','car-glazing');await mkdir(output,{recursive:true});
 const browser=await chromium.launch({headless:process.env.GLAZING_NATIVE!=='1'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
  await page.locator('[data-game-ready="true"]').waitFor();await page.getByRole('button',{name:/בחר מסלול/}).click();await page.locator('button').filter({hasText:/^הכל$/}).click();await page.locator('button').filter({hasText:/נתיבי איילון/}).click();await page.waitForFunction(()=>!!window.__controlsTest?.resetStart,{timeout:40000});
  const result=await page.evaluate(async()=>{
   const url=performance.getEntriesByType('resource').map(x=>x.name).findLast(x=>new URL(x).pathname.endsWith('/src/game/engine.ts'));if(!url)throw Error('Actual engine module unavailable');
   const {RaceEngine}=await import(url),old=RaceEngine.prototype.restartRace;RaceEngine.prototype.restartRace=function(...args){window.__glazingEngine=this;return old.apply(this,args);};window.__controlsTest.resetStart();
   const e=window.__glazingEngine;e.renderer.setAnimationLoop(null);e.present(0);e.snapCamera(true);e.post.render();
   const THREE=await import(new URL((await(await fetch(url)).text()).match(/import \* as THREE from ["']([^"']+)["']/)[1],location.href).href);
   const {CARS}=await import(new URL('/src/game/cars.ts',location.href).href),{createCarVisual,disposeCarVisual}=await import(new URL('/src/game/car-mesh.ts',location.href).href);
   const inspect=v=>{
    v.group.updateMatrixWorld(true);const body=v.group.getObjectByName('body');if(!body)throw Error('Actual loaded body missing');body.geometry.computeBoundingBox();const center=body.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(body.matrixWorld);
    const panes=v.group.children.filter(m=>m.name.startsWith('window-')||(m.isMesh&&m.material.transparent&&m.material.opacity===.38&&m.material.roughness===.07&&m.geometry.parameters.width>.1));
    return panes.map(p=>{p.geometry.computeBoundingBox();const point=p.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(p.matrixWorld),normal=new THREE.Vector3(0,0,1).applyQuaternion(p.getWorldQuaternion(new THREE.Quaternion()));if(normal.dot(point.clone().sub(center))<0)normal.negate();const first=new THREE.Raycaster(point.clone().addScaledVector(normal,3),normal.negate()).intersectObjects([p,body],false)[0]?.object;return{name:p.name,visibleBeforeBody:first===p,vertices:p.geometry.attributes.position.count,opaque:!p.material.transparent};});
   };
   const cars=[];for(const def of CARS){const t=performance.now(),v=createCarVisual(def.color,def.accent,true,false,def.body);cars.push({id:def.id,constructionMs:performance.now()-t,windows:inspect(v)});disposeCarVisual(v);}
   const allVisible=cars.length===5&&cars.every(c=>c.windows.length===4&&c.windows.every(w=>w.visibleBeforeBody&&w.opaque));
   const samples=[],construction=[];
   if(allVisible){
    for(let cycle=-2;cycle<20;cycle++){
     for(const def of CARS){const t=performance.now(),v=createCarVisual(def.color,def.accent,true,false,def.body);if(cycle>=0)construction.push(performance.now()-t);v.group.position.copy(e.visuals[0].group.position);v.group.rotation.copy(e.visuals[0].group.rotation);e.scene.add(v.group);e.post.render();e.scene.remove(v.group);disposeCarVisual(v);}
     e.post.render();if(cycle>=0)samples.push({cycle:cycle+1,...e.renderer.info.memory,programs:e.renderer.info.programs.length});
    }
   }
   const stable=samples.length===20&&samples.every(s=>s.geometries===samples[0].geometries&&s.textures===samples[0].textures&&s.programs===samples[0].programs);
   e.camMode=0;e.enterPhoto();e.photoYaw=e.player.yaw+Math.PI*.65;e.photoDist=5.4;e.photoPitch=.18;e.stepPhoto(0);e.post.render();
   const gl=e.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');construction.sort((a,b)=>a-b);
   return{cars,allVisible,resourceScope:'20 measured cycles after 2 warmups, each creating/rendering/disposing all five actual car visuals in the actual scene. Not whole-race enter/exit or complete memory acceptance.',samples,stable,construction:{samples:construction.length,p95Ms:construction.length?construction[Math.ceil(construction.length*.95)-1]:null,scope:'Hot CPU createCarVisual duration only; not frame time or full load latency.'},graphics:{renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),render:[gl.drawingBufferWidth,gl.drawingBufferHeight]},passed:allVisible&&stable};
  });
  await page.screenshot({path:output+'/hero.png'});await writeFile(output+'/text-state.json',await page.evaluate(()=>window.render_game_to_text()));
  await writeFile(output+'/summary.json',JSON.stringify({kind:'loaded-car-glazing-and-resource-regression',scope:'Actual production models/materials. No human/art/device/performance acceptance.',...result,errors,passed:result.passed&&!errors.length},null,2)+'\n');
  console.log(JSON.stringify({cars:result.cars.map(c=>({id:c.id,visible:c.windows.filter(w=>w.visibleBeforeBody).length})),stable:result.stable,samples:result.samples.length,construction:result.construction,graphics:result.graphics,errors}));
  if(!result.passed||errors.length)throw Error('Car glazing or car-resource regression; inspect artifacts/car-glazing/summary.json');
 }finally{await browser.close();}
}
