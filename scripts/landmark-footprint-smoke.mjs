#!/usr/bin/env node
/** Real meshes and real-car contact checks;not full3D or preview-race acceptance. */
import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fromRoot,projectRoot} from './project-root.mjs';
import {execFileSync} from 'node:child_process';
const captureParent=process.argv.includes('--capture-parent');
if(captureParent){
 const git=(...args)=>execFileSync('git',args,{cwd:projectRoot,encoding:'utf8'}).trim();
 if(git('rev-parse','HEAD')!=='1bb8bf2ecce6857796cbd14d7f1b4599be7f3d5f'||git('diff','HEAD','--','src','public')||git('ls-files','--others','--exclude-standard','src','public'))throw Error('Parent capture requires exact clean1bb8bf2 runtime;refuse to overwrite immutable evidence');
}
const directory=fromRoot('artifacts','landmark-footprints');await mkdir(directory,{recursive:true});
const fixturePath=fromRoot('evidence','2026-10-16','landmark-footprints','parent-landmarks.json');
const parent=captureParent?null:JSON.parse(await readFile(fixturePath,'utf8'));
const report={kind:'actual-landmark-box-footprints',scope:'Actual obelisk,hall andfour highway support meshes. Horizontal contact/maximum-height regression only;no complete3D,terrain alignment,all42 envelope or preview-race acceptance.',passed:false,errors:[]};
const persist=()=>writeFile(directory+'/summary.json',JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
 await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 report.actual=await page.evaluate(async({parent,captureParent})=>{
  const source=await(await fetch('/src/game/world.ts')).text(),imports=[...source.matchAll(/from "([^"]+)"/g)].map(m=>m[1]);
  const dependency=name=>imports.find(url=>url.split('?')[0].endsWith(`/${name}`))||`/src/game/${name}`;
  const THREE=await import(dependency('three.js')),{TRACKS,ksb,hdr,hwy6}=await import(dependency('tracks.ts'));
  const{buildTrack}=await import(dependency('spline.ts')),{createWorld}=await import('/src/game/world.ts');
  const{ArcadeCar}=await import('/src/game/vehicle.ts'),{CARS}=await import(dependency('cars.ts'));
  const{PHYSICS_VERSION}=await import(dependency('physics.ts'));
  for(const name of['arrow','beam','blob','clock','curb','facade','flag','flake','flare','foam','ground','road','sign','sky','stone','tree','walk','water']){
   const module=await import(dependency(`${name}-assets.ts`));for(const[key,load]of Object.entries(module))if(key.startsWith('load')&&key!=='loadRoadFor')await load();
  }
  const rows=[];
  const contact=(position,nx,nz,colliders)=>{const car=new ArcadeCar(CARS[0],CARS[0].nameEn);[car.x,car.y,car.z]=position;car.vx=-nx*20;car.vz=-nz*20;car.speed=20;car.yaw=Math.atan2(nx,nz);car.hitColliders(colliders);return{damage:car.damage,displacement:Math.hypot(car.x-position[0],car.z-position[2])}};
  for(const id of['ksaba','hadera','hw6']){
   const definition=TRACKS.find(d=>d.id===id),world=await createWorld(definition,buildTrack(definition),false,false,'clear');
   try{
    world.group.updateMatrixWorld(true);const meshes=[];world.group.traverse(mesh=>{if(mesh.isMesh&&mesh.geometry?.type==='BoxGeometry')meshes.push(mesh)});
    const specifications=id==='ksaba'?[{role:'obelisk',size:[1.4,12,1.4],count:1}]:id==='hadera'?[{role:'hall',size:[28,10,16],count:1}]:[{role:'pier',size:[3.6,9,3.6],count:2},{role:'pole',size:[.6,8.2,.6],count:2}];
    const solids=[];
    for(const specification of specifications){
     const matches=meshes.filter(mesh=>{const p=mesh.geometry.parameters;return[p.width,p.height,p.depth].every((v,i)=>Math.abs(v-specification.size[i])<1e-8)});
     if(matches.length!==specification.count)throw Error(`${id}/${specification.role}: actual mesh count${matches.length}`);
     matches.sort((a,b)=>a.position.x-b.position.x||a.position.z-b.position.z);
     for(const[index,mesh]of matches.entries()){
      const p=mesh.geometry.parameters,yaw=Math.atan2(mesh.matrixWorld.elements[8],mesh.matrixWorld.elements[10]);
      const colliders=world.colliders.filter(c=>c.kind==='building'&&Math.hypot(c.x-mesh.position.x,c.z-mesh.position.z)<1e-7&&Math.abs(c.hx-p.width/2)<1e-7&&Math.abs(c.hz-p.depth/2)<1e-7&&Math.abs(c.yaw-yaw)<1e-7&&Math.abs(c.maxY-mesh.position.y-p.height/2)<1e-7);
      const contacts=[];
      for(const axis of['x','z'])for(const side of[-1,1])for(const u of[.1,.5,.9]){
       const local=new THREE.Vector3((u-.5)*p.width,-p.height/2+Math.min(1,p.height/2),(u-.5)*p.depth);
       local[axis]=side*((axis==='x'?p.width:p.depth)/2+1.05-.02);
       const point=mesh.localToWorld(local),normal=new THREE.Vector3(axis==='x'?side:0,0,axis==='z'?side:0).transformDirection(mesh.matrixWorld);
       const hit=contact(point.toArray(),normal.x,normal.z,world.colliders),individual=contact(point.toArray(),normal.x,normal.z,colliders);contacts.push({axis,side,u,position:point.toArray(),hit,individual});
      }
      const y=mesh.position.y+p.height/2+.1,above=contact([mesh.position.x,y,mesh.position.z],1,0,colliders);
      solids.push({role:`${specification.role}-${index}`,position:mesh.position.toArray(),quaternion:mesh.quaternion.toArray(),dimensions:p,yaw,mapping:colliders.length,contacts,above,passed:colliders.length===1&&contacts.every(c=>c.hit.damage>0&&c.hit.displacement>0&&c.individual.damage>0&&c.individual.displacement>0)&&above.damage===0&&above.displacement===0});
     }
    }
    const origins=id==='ksaba'?[ksb(32.175,34.908)]:id==='hadera'?[hdr(32.47,34.888)]:[hwy6(32.134,34.932),hwy6(32.21,34.978)];
    const legacy=captureParent?origins.map(origin=>{const candidates=world.colliders.filter(c=>c.kind==='building'&&Math.hypot(c.x-origin.x,c.z-origin.z)<1e-7);if(candidates.length!==1)throw Error('Original proxy identity ambiguous');return candidates[0]}):parent.rows.find(r=>r.track===id).legacy;
    const ghosts=legacy.map(c=>{
     const position=[c.x+c.hx+1.05-.02,Math.min(...solids.map(s=>s.position[1]-s.dimensions.height/2))+1,c.z];
     return{position,hit:contact(position,1,0,world.colliders)};
    });
    rows.push({track:id,solids,legacy,ghosts,passed:solids.every(s=>s.passed)&&ghosts.every(g=>g.hit.damage===0&&g.hit.displacement===0)});
   }finally{world.dispose()}
  }
  return{physicsVersion:PHYSICS_VERSION,rows,passed:rows.length===3&&rows.every(r=>r.passed)};
 },{parent,captureParent});
 if(captureParent){await mkdir(fromRoot('evidence','2026-10-16','landmark-footprints'),{recursive:true});await writeFile(fixturePath,JSON.stringify({sourceHead:'1bb8bf2ecce6857796cbd14d7f1b4599be7f3d5f',scope:'Actual immutable parent meshes,positions,quaternions andold proxy identities;controlled contact poses,not measured road driving.',...report.actual},null,2)+'\n');}
 report.passed=report.actual.passed&&!report.errors.length;await persist();console.log(JSON.stringify({passed:report.passed,captureParent,solids:report.actual.rows.reduce((n,r)=>n+r.solids.length,0),ghostDamage:report.actual.rows.flatMap(r=>r.ghosts.map(g=>g.hit.damage)),mapping:report.actual.rows.flatMap(r=>r.solids.map(s=>s.mapping))}));
 if(!report.passed)throw Error('Actual landmark footprint regression');
}catch(error){report.error=String(error);await persist();throw error}finally{if(browser)await browser.close()}
