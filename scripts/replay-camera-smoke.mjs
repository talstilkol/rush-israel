/** Real engine/recorded clip; controlled replay timing is not race/device acceptance. */
import {chromium}from'playwright';
import{mkdir,readFile,writeFile}from'node:fs/promises';
import{fromRoot}from'./project-root.mjs';
export async function verifyReplayCamera(){
 const output=fromRoot('artifacts','replay-camera');await mkdir(output,{recursive:true});
 const trace=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','replay-camera','native-frame-intervals.json'),'utf8'));if(trace.frames.length!==1000)throw Error('Actual timing trace missing');
 const browser=await chromium.launch({headless:process.env.REPLAY_CAMERA_NATIVE!=='1'});const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/');await page.locator('[data-game-ready="true"]').waitFor();await page.getByRole('button',{name:/בחר מסלול/}).click();await page.locator('button').filter({hasText:/^הכל$/}).click();await page.locator('button').filter({hasText:/נתיבי איילון/}).click();await page.waitForFunction(()=>!!window.__controlsTest?.followRoad,{timeout:40000});
  const clip=await page.evaluate(async()=>{
   const url=performance.getEntriesByType('resource').map(x=>x.name).findLast(x=>new URL(x).pathname.endsWith('/src/game/engine.ts'));if(!url)throw Error('Actual engine module missing');const{RaceEngine}=await import(url);const old=RaceEngine.prototype.restartRace;RaceEngine.prototype.restartRace=function(...args){window.__replayCameraEngine=this;return old.apply(this,args)};try{window.__controlsTest.resetStart()}finally{RaceEngine.prototype.restartRace=old}
   const e=window.__replayCameraEngine;e.renderer.setAnimationLoop(null);window.__controlsTest.skipCountdown();for(let i=0;i<120;i++){window.__controlsTest.followRoad();window.__controlsTest.advanceTime(50)}
   if(e.replayBuf.length<30)throw Error('Real driven replay clip not captured');return{track:e.trackDef.id,rows:e.replayBuf.length,first:e.replayBuf[0][0].t,last:e.replayBuf.at(-1)[0].t,assisted:JSON.parse(window.render_game_to_text()).assisted};
  });
  const run=async reducedMotion=>{
   await page.emulateMedia({reducedMotion});return page.evaluate(({frames,reducedMotion})=>{
    const e=window.__replayCameraEngine;e.replaying=true;e.replayT=0;e.camMode=0;e.hood=false;const transitions=[],early=[];let prior=0;
    for(let i=0;i<frames.length&&e.replayT<2.85;i++){
     const before=e.replayT,dt=Math.min(frames[i][1]/1000,.1);e.stepReplay(dt);if(e.camMode!==prior){transitions.push({frame:i,before,after:e.replayT,from:prior,to:e.camMode});prior=e.camMode}if(i<2)early.push({frame:i,replayTime:e.replayT,camMode:e.camMode});
    }
    e.present(0);e.post.render();const gl=e.renderer.getContext();gl.finish();const ext=gl.getExtension('WEBGL_debug_renderer_info');return{reducedMotion,early,transitions,finalReplayTime:e.replayT,finalCamera:e.camMode,passed:e.replayT>=2.8&&(reducedMotion==='reduce'?transitions.length===0:early.every(x=>x.camMode===0)&&transitions.length===1&&transitions[0].before<2.8&&transitions[0].after>=2.8),renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
   },{frames:trace.frames,reducedMotion});
  };
  const normal=await run('no-preference'),reduced=await run('reduce');const result={kind:'controlled-actual-replay-camera',scope:'Actual engine, actual Ayalon driven clip and recorded native frame intervals. Manual replay stepping only; not a completed race, soak, performance or human/device acceptance.',clip,normal,reduced,errors,passed:normal.passed&&reduced.passed&&!errors.length};await writeFile(output+'/summary.json',JSON.stringify(result,null,2)+'\n');await page.screenshot({path:output+'/reduced-motion.png',timeout:30000});console.log(JSON.stringify(result));if(!result.passed)throw Error('Replay camera boundary regression; inspect artifacts/replay-camera/summary.json');
 }finally{await browser.close()}
}
