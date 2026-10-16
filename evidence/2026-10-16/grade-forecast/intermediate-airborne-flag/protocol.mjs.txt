import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fromRoot} from './project-root.mjs';
const parent=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','grade-forecast','actual-parent.json'),'utf8'));
const hazards=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','grade-forecast','actual-hazards.json'),'utf8'));
const out=fromRoot('artifacts','grade-forecast');await mkdir(out,{recursive:true});
const report={kind:'actual-road-relative-grade-forecast',passed:false,scope:'Actual dd1 Haifa approach states and one full assisted Haifa race using actual engine/traffic. Clear weather/default setup only. Not calibrated braking,competitive pace,human driving,art,all conditions ordevice acceptance.',errors:[]};
const persist=()=>writeFile(fromRoot('artifacts','grade-forecast','summary.json'),JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{
 browser=await chromium.launch({headless:process.env.NATIVE_DIAGNOSTIC!=='1'});const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.locator('[data-game-ready="true"]').waitFor();await page.getByRole('button',{name:/בחר מסלול/}).click();await page.locator('button').filter({hasText:/^הכל$/}).click();await page.locator('button').filter({hasText:/ירידת הכרמל/}).click();await page.waitForFunction(()=>!!window.__controlsTest?.followRoad,null,{timeout:60000});
 const forecasts=await page.evaluate(async({parent,hazards})=>{
  const url=performance.getEntriesByType('resource').map(r=>r.name).findLast(url=>new URL(url).pathname.endsWith('/engine.ts'));if(!url)throw Error('Actual engine module missing');const{RaceEngine}=await import(url),original=RaceEngine.prototype.restartRace;
  RaceEngine.prototype.restartRace=function(...args){window.__gradeEngine=this;return original.apply(this,args)};try{window.__controlsTest.resetStart()}finally{RaceEngine.prototype.restartRace=original}
  const e=window.__gradeEngine;if(!e||e.trackDef.id!=='haifa')throw Error('Actual Haifa engine missing');e.renderer.setAnimationLoop(null);
  const source=await(await fetch(url)).text(),dependencies=[...source.matchAll(/from "([^"]+)"/g)].map(m=>m[1]);const vehicleUrl=dependencies.find(url=>url.split('?')[0].endsWith('/vehicle.ts'));if(!vehicleUrl)throw Error('Actual vehicle module missing');const{ArcadeCar,aiInput,trafficInput}=await import(vehicleUrl);
  const rows=[];
  if(parent.sourceHead!=='dd1d3c79bb9d189ed8509ed4d7edba3a2fe43f49'||hazards.length!==19)throw Error('Actual parent fixture authority changed');
  for(const observed of hazards){const frame=parent.hazards.find(f=>Math.abs(f.time-observed.time)<1e-9);if(!frame)throw Error('Actual parent state missing');
   const cars=frame.cars.map((row,i)=>{const c=new ArcadeCar(row.stats,row.stats.id);c.load(row.state);c.contactBounds=row.bounds;c.isAi=i!==0;return c});const a=cars[0],b=cars[observed.other];const relativeLevel=(b.y-e.built.samples[b.sampleIndex].y)-(a.y-e.built.samples[a.sampleIndex].y);
   if(Math.abs(b.y-a.y)<=4||Math.abs(relativeLevel)>=1||frame.input.throttle!==1||frame.input.brake!==0)throw Error('Recorded missed grade hazard no longer matches actual road');
   for(const control of [aiInput,trafficInput]){const input=control===aiInput?control(a,e.built,undefined,cars):control(a,e.built,cars);if(input.throttle!==0||!(input.brake>0)||input.nitro||input.drift)throw Error('Actual grade hazard ignored: '+observed.time+'/'+control.name);rows.push({time:observed.time,controller:control.name,relativeLevel,verticalDifference:b.y-a.y,input})}
  }
  e.restartRace();window.__controlsTest.skipCountdown();e.assisted=true;return rows;
 },{parent,hazards});
 report.forecasts=forecasts;let result,approachCaptured=false;const batches=[];
 for(let batch=0;batch<600;batch++){
  result=await page.evaluate(()=>{const e=window.__gradeEngine,t=window.__controlsTest;let maxJump=0,maxGroundedVerticalJump=0;for(let step=0;step<40&&!t.isFinished();step++){const x=t.getX(),z=t.getZ(),y=t.getY(),air=t.getAirborne();t.followRoad();t.advanceTime(50);if(t.isFinished())break;maxJump=Math.max(maxJump,Math.hypot(t.getX()-x,t.getZ()-z));if(!air&&!t.getAirborne())maxGroundedVerticalJump=Math.max(maxGroundedVerticalJump,Math.abs(t.getY()-y))}e.present(.016);e.pushHud();e.post.render();return{...JSON.parse(window.render_game_to_text()),maxJump,maxGroundedVerticalJump}});
  batches.push({time:result.totalTime,damage:result.damage,maxJump:result.maxJump,maxGroundedVerticalJump:result.maxGroundedVerticalJump});
  if(result.maxJump>10||result.maxGroundedVerticalJump>1.5||![result.totalTime,result.damage,result.position.x,result.position.y,result.position.z].every(Number.isFinite)||report.errors.length)throw Error('Actual race discontinuity/error');
  if(!approachCaptured&&result.totalTime>=6){await page.locator('canvas').first().screenshot({path:fromRoot('artifacts','grade-forecast','approach.png')});report.approach=result;approachCaptured=true}
  if(result.finished)break;
 }
 report.race=result;report.batches=batches;
 if(!result?.finished||result.damage!==0||!approachCaptured||forecasts.length!==38||report.errors.length)throw Error('Actual assisted Haifa must finish without damage after the grade fix');
 const gpu=await page.evaluate(()=>{const e=window.__gradeEngine,gl=e.renderer.getContext();gl.finish();const ext=gl.getExtension('WEBGL_debug_renderer_info');return{renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),glError:gl.getError(),physicsVersion:window.__controlsTest.getPhysicsVersion()}});Object.assign(report,gpu);if(gpu.glError||(process.env.NATIVE_DIAGNOSTIC==='1'&&!gpu.renderer.includes('Metal')))throw Error('GPU diagnostic backend/error');
 await page.evaluate(()=>window.__controlsTest.skipReplay());await page.getByRole('dialog').getByRole('heading',{level:2}).waitFor();await page.screenshot({path:fromRoot('artifacts','grade-forecast','finish.png')});
 // Never expose a green verdict before both capture and browser cleanup finish.
 await browser.close();browser=undefined;report.passed=true;await persist();console.log(JSON.stringify({passed:true,recordedForecasts:forecasts.length,seconds:result.totalTime,damage:result.damage,...gpu}));
}catch(error){report.passed=false;report.error=String(error);await persist();throw error}finally{if(browser)try{await browser.close()}catch(error){report.passed=false;report.cleanupError=String(error);await persist();process.exitCode=1}}
