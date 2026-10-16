import{chromium}from'./rush-israel-pr83/node_modules/playwright/index.mjs';
import{readFile,writeFile,mkdir}from'node:fs/promises';
const source='/Users/tal/Documents/Codex/2026-10-11/new-chat',out=source+'/outputs/RUSH-COLLIDER-TRACE-2c365ba';await mkdir(out,{recursive:true});
const historical=JSON.parse(await readFile(source+'/work/historical-42-collider-locations.json','utf8'));
const browser=await chromium.launch({headless:true});
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:8127/',{waitUntil:'networkidle'});
const rows=await page.evaluate(async historical=>{
    const worldSource = await (await fetch('/src/game/world.ts')).text();
    const imports = [...worldSource.matchAll(/from "([^"]+)"/g)].map(match => match[1]);
    const dependency = name => imports.find(url => url.split('?')[0].endsWith(`/${name}`)) || `/src/game/${name}`;
    const THREE = await import(dependency('three.js'));
    const { TRACKS } = await import(dependency('tracks.ts'));
    const { buildTrack, closestSample, sampleAtT } = await import(dependency('spline.ts'));
    const { createWorld } = await import('/src/game/world.ts');
    const { ArcadeCar, aiInput } = await import('/src/game/vehicle.ts');
    const { roadLaneOffset, ROAD_UV_METRES, ROAD_PAINT_REPEAT_METRES } = await import('/src/game/road-layout.ts');
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

 const results=[];
 for(const definition of TRACKS.filter(d=>historical.rows.some(x=>x.track===d.id))){
  const world=await createWorld(definition,buildTrack(definition),false,false,'clear');
  try{
   world.group.updateMatrixWorld(true);const meshes=[];
   world.group.traverse(object=>{
    if(!object.isMesh)return;object.geometry.computeBoundingBox();const local=object.geometry.boundingBox;if(!local||local.isEmpty())return;
    const count=object.isInstancedMesh?object.count:1;
    for(let index=0;index<count;index++){
     const matrix=new THREE.Matrix4();if(object.isInstancedMesh){object.getMatrixAt(index,matrix);matrix.premultiply(object.matrixWorld)}else matrix.copy(object.matrixWorld);
     const center=new THREE.Vector3().setFromMatrixPosition(matrix),bounds=local.clone().applyMatrix4(matrix),size=bounds.getSize(new THREE.Vector3());
     if(Math.max(size.x,size.z)<.5||size.y<.5)continue;
     meshes.push({name:object.name,type:object.geometry.type,instance:object.isInstancedMesh?index:null,center:center.toArray(),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},size:size.toArray()});
    }
   });
   for(const item of historical.rows.filter(x=>x.track===definition.id)){
    const original=item.before;
    const candidates=world.colliders.map((collider,index)=>({collider,index})).filter(({collider:c})=>c.kind===original.kind&&Math.abs(c.r-original.r)<1e-7&&Math.hypot(c.x-original.x,c.z-original.z)<1e-7);
    const current=candidates.length===1?candidates[0]:null;
    const nearest=current?meshes.map(m=>({...m,centerDistance:Math.hypot(m.center[0]-current.collider.x,m.center[2]-current.collider.z)})).sort((a,b)=>a.centerDistance-b.centerDistance).slice(0,4):[];
    results.push({...item,currentIdentity:current,identityMatches:candidates.length,nearestMeshOrigins:nearest,exactMeshOrigin:nearest.some(m=>m.centerDistance<1e-6),scope:'Current collider identity and mesh-origin/bounds inspection only. No full hull,vertical clearance,contact or visual acceptance.'});
   }
  }finally{world.dispose()}
 }
 return results;
},historical);
const report={sourceHead:'2c365ba1198c5b48cfaae3dde40cd1ce074c1d29',kind:'historical-collider-current-identity-trace',scope:'All42 archived historical offsets reconstructed from real old CPU reports. Current26 worlds assembled in Chromium with real committed assets. Exact-coordinate/radius identity and mesh-origin/bounds trace only; changed identities and full shape/height/contact alignment remain unaccepted.',rows,errors,counts:{historical:rows.length,tracks:new Set(rows.map(r=>r.track)).size,unambiguousOriginalIdentity:rows.filter(r=>r.currentIdentity).length,exactMeshOrigin:rows.filter(r=>r.currentIdentity&&r.exactMeshOrigin).length,requiresMapping:rows.filter(r=>!r.currentIdentity).map(r=>({track:r.track,historicalIndex:r.historicalIndex})),acceptedContacts:0}};
await writeFile(out+'/trace.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({counts:report.counts,errors}));if(rows.length!==42||errors.length)throw Error('Incomplete collider trace');
}finally{await browser.close()}
