import {chromium} from 'playwright';
import {fromRoot} from './project-root.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
export async function verifyVehicleVisualFeedback() {
const out=fromRoot('artifacts','visual-feedback'),base=process.env.SMOKE_URL || 'http://127.0.0.1:8080/';await mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true});
try{
const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await p.goto(base);await p.locator('[data-game-ready="true"]').waitFor();await p.getByRole('button',{name:/בחר מסלול/}).click();await p.locator('button').filter({hasText:/^הכל$/}).click();await p.locator('button').filter({hasText:/הכרמל/}).first().click();await p.waitForFunction(()=>!!window.__controlsTest?.resetStart);
const result=await p.evaluate(async()=>{
 const urls=performance.getEntriesByType('resource').map(x=>x.name),url=urls.findLast(x=>new URL(x).pathname.endsWith('/src/game/engine.ts'));if(!url)throw Error('Real engine not observed');
 const {RaceEngine}=await import(url),{aiInput,ArcadeCar}=await import(new URL('/src/game/vehicle.ts',location.href).href);
 const restart=RaceEngine.prototype.restartRace;RaceEngine.prototype.restartRace=function(...args){window.__visualEngine=this;return restart.apply(this,args);};window.__controlsTest.resetStart();window.__controlsTest.skipCountdown();
 const e=window.__visualEngine;e.renderer.setAnimationLoop(null);e.ensureCops(1);
 const rows=[];for(const [family,c,v]of [['racer',e.racers[1],e.visuals[1]],['traffic',e.traffic[0],e.trafficVis[0]],['cop',e.cops[0],e.copVis[0]]]){
  if(!c||!v)throw Error('Actual family unavailable '+family);
  c.spawn(e.built,.2,0);c.speed=25;c.vx=-Math.sin(c.yaw)*25;c.vz=-Math.cos(c.yaw)*25;
  const lead=new ArcadeCar(c.stats,c.stats.nameEn);lead.spawn(e.built,.2,0);lead.x-=Math.sin(c.yaw)*12;lead.z-=Math.cos(c.yaw)*12;
  const input=aiInput(c,e.built,undefined,[c,lead]);if(input.brake<=.15)throw Error('Actual hazard did not require brake');
  c.step(1/120,input,e.built,true);e.present(0);const lit=v.brakeLights.map(x=>x.material.emissiveIntensity),pack=e.takePack();
  c.step(1/120,{...input,brake:0,steer:0},e.built,true);e.present(0);const coast=v.brakeLights.map(x=>x.material.emissiveIntensity);
  e.applyPack(pack);e.present(0);const replay=v.brakeLights.map(x=>x.material.emissiveIntensity);
  rows.push({family,input,lit,coast,replay,passed:lit.every(x=>x===4.6)&&coast.every(x=>x===.45)&&replay.every(x=>x===4.6)});
 }
 const c=e.player;let index=2,best=0;for(let i=2;i<e.built.samples.length-3;i++){const a=e.built.samples[i],n=e.built.samples[i+1],g=(n.y-a.y)/Math.hypot(n.x-a.x,n.z-a.z);if(Math.abs(g)>Math.abs(best)){best=g;index=i;}}
 c.spawn(e.built,(index+.01)/(e.built.closed?e.built.samples.length:e.built.samples.length-1),0);c.speed=20;c.vx=-Math.sin(c.yaw)*20;c.vz=-Math.cos(c.yaw)*20;
 for(let i=0;i<24;i++)c.step(1/120,{steer:.2,throttle:0,brake:0,drift:false,nitro:false},e.built,true,[],[],e.world.ramps);
 if(Math.abs(c.pitch)<.01||Math.abs(c.roll)<.01)throw Error('Actual slope/bank not exercised');
 e.present(0);const v=e.visuals[0],before=v.group.rotation.toArray(),wheelBefore=v.spins.map(x=>x.rotation.x),state=c.snap();
 e.enterPhoto();e.stepPhoto(.1);e.stepPhoto(.1);e.post.render();
 const after=v.group.rotation.toArray(),wheelAfter=v.spins.map(x=>x.rotation.x),photo={track:e.trackDef.id,roadGrade:best,pitch:c.pitch,roll:c.roll,before,after,wheelsFrozen:JSON.stringify(wheelBefore)===JSON.stringify(wheelAfter),carFrozen:JSON.stringify(state)===JSON.stringify(c.snap())};
 photo.passed=Math.abs(after[0]-c.pitch*.55)<1e-12&&Math.abs(after[2]-c.roll)<1e-12&&photo.wheelsFrozen&&photo.carFrozen;
 return{rows,photo};
});
await p.screenshot({path:out+'/photo.png'});await writeFile(out+'/text-state.json',await p.evaluate(()=>window.render_game_to_text()));
await writeFile(out+'/summary.json',JSON.stringify({scope:'Controlled real engine/material integration. Actual route/vehicles, not human/device/art acceptance; braking response tested with production controller for each actual visual family.',...result,errors,passed:result.rows.every(x=>x.passed)&&result.photo.passed&&!errors.length},null,2));
console.log(JSON.stringify({rows:result.rows.map(x=>[x.family,x.passed]),photo:result.photo,errors}));
if(!result.rows.every(x=>x.passed)||!result.photo.passed||errors.length)throw Error('Vehicle visual feedback or Photo pose regression');
}finally{await b.close();}

}
