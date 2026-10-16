import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {fromRoot} from './project-root.mjs';
const out=fromRoot('artifacts','vehicle-contact');await mkdir(out,{recursive:true});
const report={kind:'actual-vehicle-contact',passed:false,scope:'Upright measured opaque vehicle bounds, loaded assets, controlled pair contacts and 20 simulated seconds of actual Namal engine driving. Not swept collision, suspension tilt, full race, device performance or calibrated rigid-body acceptance.',errors:[]};
const persist=()=>writeFile(fromRoot('artifacts','vehicle-contact','summary.json'),JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{
 browser=await chromium.launch({headless:process.env.NATIVE_DIAGNOSTIC!=='1'});const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>report.errors.push(String(e)));
 await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 await page.locator('[data-game-ready="true"]').waitFor();await page.getByRole('button',{name:/בחר מסלול/}).click();await page.locator('button').filter({hasText:/^הכל$/}).click();await page.locator('button').filter({hasText:/נמל תל אביב/}).click();await page.waitForFunction(()=>!!window.__controlsTest?.resetStart,null,{timeout:60000});
 await page.evaluate(async()=>{const url=performance.getEntriesByType('resource').map(r=>r.name).find(url=>url.includes('/src/game/engine.ts'));if(!url)throw Error('Actual loaded engine module missing');window.__contactEngineURL=url;const{RaceEngine}=await import(url),original=RaceEngine.prototype.fixed;RaceEngine.prototype.fixed=function(...args){window.__contactEngine=this;return original.apply(this,args)}});
 await page.waitForFunction(()=>!!window.__contactEngine,null,{timeout:60000});
 const result=await page.evaluate(async()=>{
  const e=window.__contactEngine;e.renderer.setAnimationLoop(null);e.restartRace();e.countdown=0;e.racing=true;e.input.keys.add('KeyW');
  const source=await(await fetch(window.__contactEngineURL)).text(),dependencies=[...source.matchAll(/from "([^"]+)"/g)].map(m=>m[1]);
  const dependency=name=>{const url=dependencies.find(url=>url.split('?')[0].endsWith('/'+name));if(!url)throw Error('Actual engine dependency missing: '+name);return url};
  const THREE=await import(dependency('three.js')),{OBB}=await import('/node_modules/three/examples/jsm/math/OBB.js');
  const{createCarVisual,carContactBounds,disposeCarVisual}=await import(dependency('car-mesh.ts')),{ArcadeCar,separateCars}=await import(dependency('vehicle.ts')),{CARS}=await import(dependency('cars.ts'));
  const physicalBounds=(visual,bodyOnly=false)=>{
   // Independent actual-vertex oracle, without production carContactBounds.
   visual.group.position.set(0,0,0);visual.group.rotation.set(0,0,0);visual.group.updateMatrixWorld(true);const points=[];
   visual.group.traverse(mesh=>{if(!mesh.isMesh||(bodyOnly&&mesh.name!=='body'))return;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];if(!bodyOnly&&materials.every(m=>m.transparent))return;const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);points.push([-point.x,point.y,-point.z])}});
   const values=axis=>points.map(p=>p[axis]);return{minX:Math.min(...values(0)),maxX:Math.max(...values(0)),minY:Math.min(...values(1)),maxY:Math.max(...values(1)),minZ:Math.min(...values(2)),maxZ:Math.max(...values(2))};
  };
  const box=(car,b)=>{const rotation=new THREE.Matrix4().makeRotationY(car.yaw),center=new THREE.Vector3((b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2).applyMatrix4(rotation).add(new THREE.Vector3(car.x,car.y,car.z));return new OBB(center,new THREE.Vector3((b.maxX-b.minX)/2-1e-6,(b.maxY-b.minY)/2-1e-6,(b.maxZ-b.minZ)/2-1e-6),new THREE.Matrix3().setFromMatrix4(rotation))};
  const variants=[];
  try{
   const defs=[...CARS.map(d=>({d,scale:[1,1,1],name:d.body})),{d:CARS.find(d=>d.body==='hatch'),scale:[1.12,1.22,1.38],name:'bus'},{d:CARS.find(d=>d.body==='muscle'),scale:[1.18,1.28,1.42],name:'truck'},{d:CARS.find(d=>d.body==='gt'),scale:[1,1,1],name:'police',police:true}];
   for(const{d,scale,name,police}of defs){const visual=createCarVisual(d.color,d.accent,false,false,d.body,police);visual.group.scale.set(...scale);const bounds=carContactBounds(visual),expected=physicalBounds(visual);for(const key of Object.keys(bounds))if(Math.abs(bounds[key]-expected[key])>1e-6)throw Error('Actual vertex bounds mismatch: '+name+'/'+key);variants.push({visual,d,name,bounds})}
   let controlledContacts=0;
   for(const a of variants)for(const b of variants)for(const yaw of [0,Math.PI/4,Math.PI/2]){
    const ca=new ArcadeCar(a.d,a.name),cb=new ArcadeCar(b.d,b.name);ca.contactBounds=a.bounds;cb.contactBounds=b.bounds;ca.yaw=.37;cb.yaw=.37+yaw;
    if(!box(ca,a.bounds).intersectsOBB(box(cb,b.bounds),1e-10))throw Error('Controlled bodies did not overlap');separateCars([ca,cb]);if(box(ca,a.bounds).intersectsOBB(box(cb,b.bounds),1e-10))throw Error('Controlled loaded-body penetration: '+a.name+'/'+b.name+'/'+yaw);controlledContacts++;
   }
   const vehicles=[...e.racers,...e.traffic,...e.cops],visuals=[...e.visuals,...e.trafficVis,...e.copVis];if(vehicles.length!==visuals.length)throw Error('Actual vehicle/visual count mismatch');
   const solids=visuals.map(v=>physicalBounds(v)),bodies=visuals.map(v=>physicalBounds(v,true));for(let i=0;i<vehicles.length;i++){if(!vehicles[i].contactBounds)throw Error('Actual engine vehicle missing measured bounds');for(const key of Object.keys(solids[i]))if(Math.abs(solids[i][key]-vehicles[i].contactBounds[key])>1e-6)throw Error('Actual engine solid bounds mismatch: '+i+'/'+key)}
   const penetrations=[],snapshots=[];
   for(let tick=1;tick<=2400;tick++){
    e.fixed(1/120);e.present(1/120);
    for(let i=0;i<vehicles.length;i++)for(let j=i+1;j<vehicles.length;j++)if(box(vehicles[i],solids[i]).intersectsOBB(box(vehicles[j],solids[j]),1e-10)){
     if(penetrations.length<50)penetrations.push({tick,i,j,bodyOverlap:box(vehicles[i],bodies[i]).intersectsOBB(box(vehicles[j],bodies[j]),1e-10)});
    }
    if(tick%120===0)snapshots.push({tick,time:e.totalTime,vehicles:vehicles.map(c=>({x:c.x,y:c.y,z:c.z,yaw:c.yaw,damage:c.damage,vx:c.vx,vz:c.vz}))});
   }
   const initialCops=e.cops.length;e.spawnCops();const initialCopsAdded=e.cops.length-initialCops;e.addCop(e.cops.length);const dynamicCopAdded=e.cops.length-initialCops-initialCopsAdded;
   if(!initialCopsAdded||dynamicCopAdded!==1)throw Error('Actual cop creation paths not exercised');
   for(let i=initialCops;i<e.cops.length;i++){const expected=physicalBounds(e.copVis[i]),actual=e.cops[i].contactBounds;if(!actual)throw Error('Actual cop missing measured bounds');for(const key of Object.keys(expected))if(Math.abs(expected[key]-actual[key])>1e-6)throw Error('Actual cop solid bounds mismatch')}
   e.present(.016);e.pushHud();e.post.render();const gl=e.renderer.getContext();gl.finish();const ext=gl.getExtension('WEBGL_debug_renderer_info');return{initialCopsAdded,dynamicCopAdded,physicsVersion:window.__controlsTest.getPhysicsVersion(),variants:variants.map(v=>({name:v.name,bounds:v.bounds})),controlledContacts,actualVehicles:vehicles.length,actualEngineTicks:2400,simulatedSeconds:e.totalTime,penetrations,snapshots,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),glError:gl.getError(),state:JSON.parse(window.render_game_to_text())};
  }finally{for(const variant of variants)disposeCarVisual(variant.visual)}
 });
 Object.assign(report,result);await page.locator('canvas').first().screenshot({path:fromRoot('artifacts','vehicle-contact','namal-20s.png')});report.passed=result.controlledContacts===192&&result.actualEngineTicks===2400&&!result.penetrations.length&&!result.glError&&!report.errors.length;await persist();if(!report.passed)throw Error('Actual vehicle contact gate failed');console.log(JSON.stringify({passed:report.passed,physicsVersion:result.physicsVersion,controlledContacts:result.controlledContacts,actualEngineTicks:result.actualEngineTicks,penetrations:result.penetrations,renderer:result.renderer,errors:report.errors}));
}catch(error){report.passed=false;report.error=String(error);await persist();throw error}finally{if(browser)try{await browser.close()}catch(error){report.passed=false;report.cleanupError=String(error);await persist();process.exitCode=1}}
