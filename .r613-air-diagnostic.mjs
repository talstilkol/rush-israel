import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const report={authority:false,sourceTree:'ecf736ff767a18ddb1d3339e01a072dc72c5d6b9',protocol:'Compare original50+900ms wall waits with6+107 explicit120Hz physics steps on the actual Ayalon engine; no product changes',trials:[],pageErrors:[]};
const page=await browser.newPage({viewport:{width:1280,height:800}});
page.on('pageerror',e=>report.pageErrors.push(String(e)));
const snap=()=>page.evaluate(()=>{const t=window.__controlsTest;return{tick:t.getTick(),hz:t.getPhysicsHz(),x:t.getX(),z:t.getZ(),y:t.getY(),airborne:t.getAirborne(),onTrack:t.getOnTrack(),speed:t.getSpeed()};});
try{
 await page.goto(process.env.SMOKE_URL??'http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle',timeout:40000});await page.waitForTimeout(500);
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(n=>/בחר מסלול/.test(n.textContent||''))?.click());await page.waitForTimeout(250);
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(n=>/^הכל$/.test((n.textContent||'').trim()))?.click());await page.waitForTimeout(200);
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(n=>/נתיבי איילון/.test(n.textContent||''))?.click());
 await page.waitForFunction(()=>!!window.__controlsTest,null,{timeout:35000});
 for(let trial=1;trial<=3;trial++){
  await page.evaluate(()=>window.__controlsTest.resetStart());await page.waitForTimeout(80);
  await page.evaluate(()=>{const t=window.__controlsTest;t.teleport(t.getX(),t.getZ(),t.getYaw(),t.getY()+2.2);});
  const start=await snap();await page.waitForTimeout(50);const mid=await snap();await page.waitForTimeout(900);const end=await snap();
  const controlled=await page.evaluate(()=>{const t=window.__controlsTest;t.resetStart();t.skipCountdown();t.advanceTime(80);t.teleport(t.getX(),t.getZ(),t.getYaw(),t.getY()+2.2);const s=()=>({tick:t.getTick(),hz:t.getPhysicsHz(),x:t.getX(),z:t.getZ(),y:t.getY(),airborne:t.getAirborne(),onTrack:t.getOnTrack(),speed:t.getSpeed()});const start=s();t.advanceTime(50);const mid=s();t.advanceTime(900);return{start,mid,end:s()};});
  report.trials.push({trial,wall:{start,mid,end,elapsedPhysicsSeconds:(end.tick-start.tick)/start.hz},controlled:{...controlled,elapsedPhysicsSeconds:(controlled.end.tick-controlled.start.tick)/controlled.start.hz}});
 }
} catch(error){report.error=String(error);process.exitCode=1;}
finally{await browser.close();await mkdir('artifacts/air-diagnosis',{recursive:true});await writeFile('artifacts/air-diagnosis/results.json',JSON.stringify(report,null,2));await writeFile('artifacts/air-diagnosis/diagnostic-source.mjs',await readFile('.r613-air-diagnostic.mjs'));console.log(JSON.stringify(report));}
if(report.trials.length!==3||report.trials.some(t=>!t.controlled.mid.airborne||t.controlled.end.airborne||!t.controlled.end.onTrack)||report.pageErrors.length)process.exitCode=1;
