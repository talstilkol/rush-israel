/** Actual landmark geometry and real-car contacts; no visual/device acceptance. */
import {chromium} from 'playwright';
import{mkdir,readFile,writeFile}from'node:fs/promises';
import{fromRoot}from'./project-root.mjs';
const output=fromRoot('artifacts','landmark-alignment');await mkdir(output,{recursive:true});
const prior=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','landmark-alignment','prior-collider.json'),'utf8'));
const report={kind:'actual-landmark-collider-alignment',scope:'Actual Hermon/Ashkelon meshes and ArcadeCar contacts at actual landmark/old collider coordinates. Controlled contact inputs; no complete track,art,terrain alignment,performance or device acceptance.',passed:false,errors:[]};
const persist=()=>writeFile(output+'/summary.json',JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});
report.actual=await page.evaluate(async prior=>{
    const worldSource = await (await fetch('/src/game/world.ts')).text();
    const imports = [...worldSource.matchAll(/from "([^"]+)"/g)].map(match => match[1]);
    const dependency = name => imports.find(url => url.split('?')[0].endsWith(`/${name}`)) || `/src/game/${name}`;
    const THREE = await import(dependency('three.js'));
    const { TRACKS } = await import(dependency('tracks.ts'));
    const { buildTrack, closestSample } = await import(dependency('spline.ts'));
    const { createWorld } = await import('/src/game/world.ts');
    const { ArcadeCar } = await import('/src/game/vehicle.ts');
    const { CARS } = await import('/src/game/cars.ts');
    const modules = ['arrow', 'beam', 'blob', 'clock', 'curb', 'facade', 'flag', 'flake', 'flare', 'foam', 'ground', 'road', 'sign', 'sky', 'stone', 'tree', 'walk', 'water'];
    const cachedTextures = new Set();
    const collect = value => {
      if (value?.isTexture) cachedTextures.add(value);
      else if (value && typeof value === 'object') for (const item of Object.values(value)) if (item?.isTexture) cachedTextures.add(item);
    };
    const kinds = [undefined, 3, 4, 8, 'city', 'stone', 'dirt', 'sand', 'blue', 'teal', 'dark', 'gold', 'white', 'stop', 'yield', 'none', 'speed50', 'speed80', 'speed90', 'speed120'];
    for (const name of modules) {
      const module = await import(dependency(`${name}-assets.ts`));
      for (const [key, load] of Object.entries(module)) {
        if (key.startsWith('load') && key !== 'loadRoadFor') collect(await load());
      }
      for (const [key, get] of Object.entries(module)) if (key.startsWith('get')) for (const kind of kinds) collect(get(kind));
    }

 const ashkelon=TRACKS.find(d=>d.id==='ashkelon'),ashBuilt=buildTrack(ashkelon),ashWorld=await createWorld(ashkelon,ashBuilt,false,false,'clear');
 let ashkelonChecks;
 try{
  const walls=[],towers=[];ashWorld.group.traverse(mesh=>{const p=mesh.geometry?.parameters;if(mesh.isMesh&&mesh.geometry.type==='BoxGeometry'&&p.width===12&&p.height===8&&p.depth===3.2)walls.push(mesh);if(mesh.isMesh&&mesh.geometry.type==='CylinderGeometry'&&p.radiusTop===3.2&&p.radiusBottom===3.8&&p.height===14)towers.push(mesh)});
  if(walls.length!==5||towers.length!==1)throw Error('Actual Ashkelon landmark geometry missing');
  const buildings=ashWorld.colliders.filter(c=>c.kind==='building');
  const contact=(x,y,z,vx)=>{const car=new ArcadeCar(CARS[0],CARS[0].nameEn);car.x=x;car.y=y;car.z=z;car.vx=vx;car.vz=0;car.yaw=vx<0?Math.PI/2:-Math.PI/2;car.speed=20;car.hitColliders(buildings);return{damage:car.damage,impact:car.impact,displacement:Math.hypot(car.x-x,car.z-z)}};
  const wallChecks=walls.map(mesh=>{const p=mesh.geometry.parameters,hx=p.width/2,hz=p.depth/2,top=mesh.position.y+p.height/2;const matching=buildings.filter(c=>Math.hypot(c.x-mesh.position.x,c.z-mesh.position.z)<1e-7&&c.hx===hx&&c.hz===hz&&c.maxY===top);return{position:mesh.position.toArray(),matching:matching.length,contact:contact(mesh.position.x+hx+1.05-.02,mesh.position.y,mesh.position.z,-20),above:contact(mesh.position.x+hx+1.05-.02,top+.1,mesh.position.z,-20)}});
  const tower=towers[0],radius=Math.max(tower.geometry.parameters.radiusTop,tower.geometry.parameters.radiusBottom),top=tower.position.y+tower.geometry.parameters.height/2;
  const towerCollider=buildings.filter(c=>Math.hypot(c.x-tower.position.x,c.z-tower.position.z)<1e-7&&c.r===radius&&c.hx==null&&c.hz==null&&c.maxY===top);
  const towerContact=contact(tower.position.x+radius-.02,tower.position.y,tower.position.z,-20),outsideCircle=contact(tower.position.x+radius*.85,tower.position.y,tower.position.z+radius*.85,-20);
  const old=prior.ashkelon,oldContact=contact(old.x-old.hx-1.05+.02,4,old.z,20);
  ashkelonChecks={walls:wallChecks,tower:{position:tower.position.toArray(),matching:towerCollider.length,contact:towerContact,outsideCircle},oldContact,buildingColliders:buildings,passed:wallChecks.every(r=>r.matching===1&&r.contact.damage>0&&r.above.damage===0&&r.above.displacement===0)&&towerCollider.length===1&&towerContact.damage>0&&outsideCircle.damage===0&&outsideCircle.displacement===0&&oldContact.damage===0&&oldContact.displacement===0};
 }finally{ashWorld.dispose()}
 const definition=TRACKS.find(d=>d.id==='hermon'),built=buildTrack(definition),world=await createWorld(definition,built,true,true,'clear');
 try{
  const lodges=[];world.group.traverse(mesh=>{const p=mesh.geometry?.parameters;if(mesh.isMesh&&mesh.geometry.type==='BoxGeometry'&&p.width===16&&p.height===5.4&&p.depth===10)lodges.push(mesh)});
  if(lodges.length!==1)throw Error('Expected one actual lodge');const lodge=lodges[0],dimensions=lodge.geometry.parameters,hx=dimensions.width/2,hz=dimensions.depth/2;
  const roof=[];world.group.traverse(mesh=>{if(mesh.isMesh&&mesh.geometry.type==='ConeGeometry'&&mesh.geometry.parameters.radius===11&&Math.hypot(mesh.position.x-lodge.position.x,mesh.position.z-lodge.position.z)<1e-7)roof.push(mesh)});
  if(roof.length!==1)throw Error('Expected actual lodge roof');const top=roof[0].position.y+roof[0].geometry.parameters.height/2;
  const bodies=[];world.group.traverse(mesh=>{const p=mesh.geometry?.parameters;if(mesh.isMesh&&mesh.name!=='rush-hermon-foundation'&&mesh.geometry.type==='BoxGeometry'&&((p.width===6.4&&p.height===4.2&&p.depth===7.4)||(p.width===16&&p.height===5.4&&p.depth===10)||(p.width===16&&p.height===9&&p.depth===12)||(p.width===7&&p.height===14&&p.depth===7)))bodies.push(mesh)});
  world.group.updateMatrixWorld(true);const grounds=[world.group.getObjectByName('rush-terrain'),world.group.getObjectByName('rush-base-ground')].filter(Boolean),ray=new THREE.Raycaster();
  const foundations=[];world.group.traverse(mesh=>{if(mesh.name==='rush-hermon-foundation')foundations.push(mesh)});
  const anchors=bodies.map(mesh=>{
   const bounds=new THREE.Box3().setFromObject(mesh),p=mesh.geometry.parameters;
   const matching=foundations.filter(base=>Math.hypot(base.position.x-mesh.position.x,base.position.z-mesh.position.z)<1e-7&&base.geometry.parameters.width===p.width&&base.geometry.parameters.depth===p.depth);
   const support=matching.length===1?new THREE.Box3().setFromObject(matching[0]):null;
   const rays=[];
   for(const u of[0,.25,.5,.75,1])for(const v of[0,.25,.5,.75,1]){
    const x=bounds.min.x+(bounds.max.x-bounds.min.x)*u,z=bounds.min.z+(bounds.max.z-bounds.min.z)*v;
    ray.set(new THREE.Vector3(x,mesh.position.y+2000,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObjects(grounds)[0];if(!hit)throw Error('Actual terrain/base ground missing beneath building');
    rays.push({x,z,groundY:hit.point.y,supported:!!support&&support.min.y<=hit.point.y+1e-4&&support.max.y>=hit.point.y-1e-4});
   }
   return{position:mesh.position.toArray(),dimensions:p,foundationMatches:matching.length,foundation: support?{min:support.min.toArray(),max:support.max.toArray()}:null,baseY:bounds.min.y,joined:!!support&&Math.abs(bounds.min.y-support.max.y)<1e-4,rays,passed:matching.length===1&&!!support&&Math.abs(bounds.min.y-support.max.y)<1e-4&&rays.every(r=>r.supported)};
  });
  const grounding={count:anchors.length,anchors,passed:anchors.length===9&&anchors.every(x=>x.passed),scope:'Nine actual building/foundation joins and225 footprint rays against rendered terrain/base meshes. Bounds use actual clipped terrain triangles; no surveyed data or final art acceptance.'};
  const lights=[];world.group.traverse(light=>{if(light.isPointLight&&Math.hypot(light.position.x-lodge.position.x,light.position.z-lodge.position.z)<1e-7&&light.intensity>0)lights.push({position:light.position.toArray(),intensity:light.intensity})});
  const buildings=world.colliders.filter(c=>c.kind==='building');
  const matching=buildings.filter(c=>Math.hypot(c.x-lodge.position.x,c.z-lodge.position.z)<1e-7&&Math.abs(c.hx-hx)<1e-7&&Math.abs(c.hz-hz)<1e-7&&c.maxY===top);
  const contact=(x,y,z,colliders)=>{const car=new ArcadeCar(CARS[0],CARS[0].nameEn);car.x=x;car.y=y;car.z=z;car.vx=-20;car.vz=0;car.yaw=Math.PI/2;car.speed=20;car.hitColliders(colliders);return{damage:car.damage,impact:car.impact,displacement:Math.hypot(car.x-x,car.z-z)}};
  const ghost=prior.collider,ghostY=built.samples[closestSample(built.samples,ghost.x,ghost.z).index].y;
  const oldContact=contact(ghost.x+ghost.hx+1.05-.02,ghostY,ghost.z,buildings);
  const solidContact=contact(lodge.position.x+hx+1.05-.02,lodge.position.y,lodge.position.z,buildings);
  const aboveRoof=contact(lodge.position.x+hx+1.05-.02,top+.1,lodge.position.z,buildings);
  const noOldCollider=!buildings.some(c=>Math.hypot(c.x-ghost.x,c.z-ghost.z)<1e-7);
  return{ashkelon:ashkelonChecks,grounding,lodge:{position:lodge.position.toArray(),dimensions},roofTop:top,buildingColliders:buildings,lightsAtLodge:lights,matching:matching.length,noOldCollider,oldContact,solidContact,aboveRoof,passed:grounding.passed&&ashkelonChecks.passed&&lights.length===1&&matching.length===1&&noOldCollider&&oldContact.damage===0&&oldContact.displacement===0&&solidContact.damage>0&&solidContact.impact>0&&aboveRoof.damage===0&&aboveRoof.displacement===0};
 }finally{world.dispose()}
},prior);
await browser.close();browser=undefined;report.passed=report.actual.passed&&!report.errors.length;await persist();console.log(JSON.stringify(report));if(!report.passed)throw Error('Actual landmark/collider alignment regression');
}catch(error){report.passed=false;report.error=String(error);await persist();throw error}finally{if(browser)await browser.close()}
