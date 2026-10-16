import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fromRoot} from './project-root.mjs';
const parent=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','road-edge-height','actual-scopus.json'),'utf8'));
const out=fromRoot('artifacts','road-edge-height');await mkdir(out,{recursive:true});
const report={kind:'actual-road-edge-height',passed:false,scope:'Actual captured Scopus foreign-level contacts, loaded world colliders and upright vehicle bounds; full clear/default assisted Scopus race. Not complete rail hulls, tilted/swept collision, calibrated physics, art, pace, human or device acceptance.',errors:[]};
const persist=()=>writeFile(fromRoot('artifacts','road-edge-height','summary.json'),JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{
 browser=await chromium.launch({headless:process.env.NATIVE_DIAGNOSTIC!=='1'});const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.locator('[data-game-ready="true"]').waitFor();await page.getByRole('button',{name:/בחר מסלול/}).click();await page.locator('button').filter({hasText:/^הכל$/}).click();await page.locator('button').filter({hasText:/הר הצופים/}).click();await page.waitForFunction(()=>!!window.__controlsTest?.followRoad,null,{timeout:60000});
 const contacts=await page.evaluate(async parent=>{
  const url=performance.getEntriesByType('resource').map(r=>r.name).findLast(url=>new URL(url).pathname.endsWith('/engine.ts'));if(!url)throw Error('Actual engine module missing');const{RaceEngine}=await import(url),original=RaceEngine.prototype.restartRace;
  RaceEngine.prototype.restartRace=function(...args){window.__edgeHeightEngine=this;return original.apply(this,args)};try{window.__controlsTest.resetStart()}finally{RaceEngine.prototype.restartRace=original}
  const e=window.__edgeHeightEngine;if(!e||e.trackDef.id!=='scopus')throw Error('Actual Scopus engine missing');e.renderer.setAnimationLoop(null);
  const source=await(await fetch(url)).text(),dependencies=[...source.matchAll(/from "([^"]+)"/g)].map(m=>m[1]);const vehicleUrl=dependencies.find(url=>url.split('?')[0].endsWith('/vehicle.ts'));if(!vehicleUrl)throw Error('Actual vehicle module missing');const{ArcadeCar}=await import(vehicleUrl);
  const rows=[];
  if(parent.sourceHead!=='3d8200ffe961bb24b905932b1393c07a28cc4d75'||parent.worldHits.length!==2)throw Error('Actual parent authority changed');
  const postMeshes=[];e.world.group.traverse(mesh=>{const p=mesh.geometry?.parameters;if(mesh.isInstancedMesh&&p?.height===.78&&p?.radiusTop===.08&&p?.radiusBottom===.1)postMeshes.push(mesh)});
  if(postMeshes.length!==1)throw Error('Actual road-edge post geometry missing');const post=postMeshes[0];post.geometry.computeBoundingBox();
  for(const event of parent.worldHits){const historical=event.near[0],c=e.world.colliders.find(c=>Math.hypot(c.x-historical.x,c.z-historical.z)<1e-7&&c.r===historical.r);if(!c)throw Error('Actual loaded world collider missing');
   const origin=e.built.samples.find(s=>[-1,1].some(side=>Math.hypot(s.x+s.rx*side*(e.built.width/2+1.55)-c.x,s.z+s.rz*side*(e.built.width/2+1.55)-c.z)<1e-7));if(!origin)throw Error('Actual edge origin missing');
   if(!Number.isFinite(c.minY)||!Number.isFinite(c.maxY)||Math.abs(c.minY-origin.y-post.geometry.boundingBox.min.y)>1e-6||Math.abs(c.maxY-origin.y-post.geometry.boundingBox.max.y)>1e-6)throw Error('Actual world strips ormisstates collider height');
   for(const key of Object.keys(event.bounds))if(Math.abs(event.bounds[key]-e.player.contactBounds[key])>1e-6)throw Error('Actual loaded vehicle bounds changed');
   const restore=()=>{const car=new ArcadeCar(e.player.stats,e.player.stats.id);car.load(event.beforeState);car.contactBounds=e.player.contactBounds;return car};
   for(const mode of ['original','same-level','below','overlap-below','above','overlap-above']){
    const car=restore();if(mode==='same-level')car.y=c.minY;if(mode==='below')car.y=c.minY-car.contactBounds.maxY-.01;if(mode==='overlap-below')car.y=c.minY-car.contactBounds.maxY+.01;if(mode==='above')car.y=c.maxY-car.contactBounds.minY+.01;if(mode==='overlap-above')car.y=c.maxY-car.contactBounds.minY-.01;
    const before=car.snap();car.hitColliders([c]);const damaged=car.damage>before.damage,moved=Math.hypot(car.x-before.x,car.z-before.z)>0,expected=['same-level','overlap-below','overlap-above'].includes(mode);
    if(damaged!==expected||moved!==expected)throw Error('Actual edge contact mismatch: '+event.time+'/'+mode);rows.push({time:event.time,mode,collider:c,origin:{index:e.built.samples.indexOf(origin),y:origin.y},beforeY:before.y,bounds:car.contactBounds,damaged,moved});
   }
  }
  e.restartRace();window.__controlsTest.skipCountdown();e.assisted=true;return rows;
 },parent);
 report.contacts=contacts;let result,approachCaptured=false;const batches=[];
 for(let batch=0;batch<600;batch++){
  result=await page.evaluate(()=>{const e=window.__edgeHeightEngine,t=window.__controlsTest;let maxJump=0,maxGroundedVerticalJump=0;for(let step=0;step<40&&!t.isFinished();step++){const x=t.getX(),z=t.getZ(),y=t.getY(),air=t.getAirborne();t.followRoad();t.advanceTime(50);if(t.isFinished())break;maxJump=Math.max(maxJump,Math.hypot(t.getX()-x,t.getZ()-z));if(!air&&!t.getAirborne())maxGroundedVerticalJump=Math.max(maxGroundedVerticalJump,Math.abs(t.getY()-y))}e.present(.016);e.pushHud();e.post.render();return{...JSON.parse(window.render_game_to_text()),maxJump,maxGroundedVerticalJump}});
  batches.push({time:result.totalTime,damage:result.damage,maxJump:result.maxJump,maxGroundedVerticalJump:result.maxGroundedVerticalJump});
  if(result.maxJump>10||result.maxGroundedVerticalJump>1.5||![result.totalTime,result.damage,result.position.x,result.position.y,result.position.z].every(Number.isFinite)||report.errors.length)throw Error('Actual race discontinuity/error');
  if(!approachCaptured&&result.totalTime>=6){await page.locator('canvas').first().screenshot({path:fromRoot('artifacts','road-edge-height','approach.png')});report.approach=result;approachCaptured=true}
  if(result.finished)break;
 }
 report.race=result;report.batches=batches;
 if(!result?.finished||result.damage!==0||!approachCaptured||contacts.length!==12||report.errors.length)throw Error('Actual assisted Scopus must finish without damage after the road-edge height fix');
 const gpu=await page.evaluate(()=>{const e=window.__edgeHeightEngine,gl=e.renderer.getContext();gl.finish();const ext=gl.getExtension('WEBGL_debug_renderer_info');return{renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),glError:gl.getError(),physicsVersion:window.__controlsTest.getPhysicsVersion()}});Object.assign(report,gpu);if(gpu.glError||(process.env.NATIVE_DIAGNOSTIC==='1'&&!gpu.renderer.includes('Metal')))throw Error('GPU diagnostic backend/error');
 await page.evaluate(()=>window.__controlsTest.skipReplay());await page.getByRole('dialog').getByRole('heading',{level:2}).waitFor();await page.screenshot({path:fromRoot('artifacts','road-edge-height','finish.png')});
 // Never expose a green verdict before both capture and browser cleanup finish.
 await browser.close();browser=undefined;report.passed=true;await persist();console.log(JSON.stringify({passed:true,controlledContacts:contacts.length,seconds:result.totalTime,damage:result.damage,...gpu}));
}catch(error){report.passed=false;report.error=String(error);await persist();throw error}finally{if(browser)try{await browser.close()}catch(error){report.passed=false;report.cleanupError=String(error);await persist();process.exitCode=1}}
