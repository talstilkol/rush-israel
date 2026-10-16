import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import {fromRoot} from './project-root.mjs';
const parent=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','preview-road-placement','actual-parent.json'),'utf8'));
import {mkdir,writeFile} from 'node:fs/promises';
const streetParent=JSON.parse(await readFile(fromRoot('evidence','2026-10-16','preview-road-placement','before-decorative-street-clearance.json'),'utf8'));
const out=fromRoot('artifacts','preview-road-placement');await mkdir(out,{recursive:true});
const report={kind:'actual-preview-road-placement',passed:false,errors:[]};
const persist=()=>writeFile(fromRoot('artifacts','preview-road-placement','summary.json'),JSON.stringify(report,null,2)+'\n');await persist();let browser;
try{browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=report.errors;page.on('pageerror',e=>errors.push(String(e)));await page.goto(process.env.SMOKE_URL||'http://127.0.0.1:8080/',{waitUntil:'networkidle'});
const {rows,physicsVersion}=await page.evaluate(async ({parent,streetParent})=>{
  const source=await(await fetch('/src/game/world.ts')).text(),imports=[...source.matchAll(/from "([^"]+)"/g)].map(m=>m[1]);
  const dependency=name=>imports.find(url=>url.split('?')[0].endsWith(`/${name}`))||`/src/game/${name}`;
  const THREE=await import(dependency('three.js')),{TRACKS}=await import(dependency('tracks.ts'));
  const{buildTrack}=await import(dependency('spline.ts')),{createWorld}=await import('/src/game/world.ts');
  const{PHYSICS_VERSION}=await import(dependency('physics.ts'));
  for(const name of['arrow','beam','blob','clock','curb','facade','flag','flake','flare','foam','ground','road','sign','sky','stone','tree','walk','water']){
   const module=await import(dependency(`${name}-assets.ts`));for(const[key,load]of Object.entries(module))if(key.startsWith('load')&&key!=='loadRoadFor')await load();
  }

 const {roadFootprintOverlap,roadFootprintGap}=await import('/scripts/road-footprint-overlap.mjs');const rows=[];
 for(const id of ['ksaba','hw6']){
 const definition=TRACKS.find(d=>d.id===id),built=buildTrack(definition),world=await createWorld(definition,built,true,true,'clear');
 try{world.group.updateMatrixWorld(true);const road=world.group.getObjectByName('rush-race-road');if(!road)throw Error('Actual road missing');
 const vertices=mesh=>{const attribute=mesh.geometry.getAttribute('position');return Array.from({length:attribute.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(attribute,i).applyMatrix4(mesh.matrixWorld).toArray())};
 const geometry={positions:vertices(road),indices:road.geometry.index?Array.from(road.geometry.index.array):null};const meshes=[];
 world.group.traverse(mesh=>{if(!mesh.isMesh)return;if(mesh.name==='rush-ksaba-obelisk'||mesh.name.startsWith('rush-hw6-pier-')||mesh.name.startsWith('rush-hw6-pole-')||(id==='ksaba'&&mesh.geometry.type==='CylinderGeometry'&&mesh.geometry.parameters.radiusTop===10&&mesh.geometry.parameters.height===.3))meshes.push(mesh)});
 if(JSON.stringify(geometry)!==JSON.stringify(parent.rows.find(r=>r.track===id).road))throw Error('Actual road bytes changed');
 const solids=meshes.map(mesh=>{const footprint=vertices(mesh);return{name:mesh.name||'ksaba-garden',position:mesh.position.toArray(),quaternion:mesh.quaternion.toArray(),dimensions:mesh.geometry.parameters,footprint,overlap:roadFootprintOverlap(geometry,footprint),gap:roadFootprintGap(geometry,footprint)}});
 const expected=id==='ksaba'?2:4;if(solids.length!==expected)throw Error('Actual solid count changed');
 let assembly;
 if(id==='ksaba'){const garden=meshes.find(m=>m.name==='rush-ksaba-garden'),obelisk=meshes.find(m=>m.name==='rush-ksaba-obelisk');if(!garden||!obelisk)throw Error('Named actual garden assembly missing');const light=[];world.group.traverse(o=>{if(o.isPointLight&&Math.abs(o.position.x-obelisk.position.x)<1e-7&&Math.abs(o.position.z-obelisk.position.z)<1e-7&&o.position.y===12)light.push(o)});const obeliskVertices=vertices(obelisk),box=new THREE.Box3().setFromObject(obelisk),treeIntersections=[];let treesChecked=0;
 world.group.traverse(mesh=>{if(!mesh.isInstancedMesh||!['CylinderGeometry','SphereGeometry'].includes(mesh.geometry.type))return;treesChecked+=mesh.count;mesh.geometry.computeBoundingBox();const attribute=mesh.geometry.getAttribute('position');for(let index=0;index<mesh.count;index++){const matrix=new THREE.Matrix4();mesh.getMatrixAt(index,matrix);matrix.premultiply(mesh.matrixWorld);const bounds=mesh.geometry.boundingBox.clone().applyMatrix4(matrix);if(!bounds.intersectsBox(box))continue;const points=Array.from({length:attribute.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(attribute,i).applyMatrix4(matrix).toArray());const overlap=roadFootprintOverlap({positions:points,indices:mesh.geometry.index?Array.from(mesh.geometry.index.array):null},obeliskVertices);if(overlap.area>0&&overlap.verticalTriangles>0)treeIntersections.push({child:world.group.children.indexOf(mesh),geometry:mesh.geometry.type,index,overlap})}});
 const streetGeometry={positions:[],indices:[]};let streetInstances=0;
 world.group.traverse(mesh=>{if(!mesh.isInstancedMesh||mesh.material!==road.material||mesh.geometry.type!=='BoxGeometry')return;const attribute=mesh.geometry.getAttribute('position'),indices=mesh.geometry.index?Array.from(mesh.geometry.index.array):Array.from({length:attribute.count},(_,i)=>i);for(let index=0;index<mesh.count;index++){streetInstances++;const matrix=new THREE.Matrix4();mesh.getMatrixAt(index,matrix);matrix.premultiply(mesh.matrixWorld);const base=streetGeometry.positions.length;for(let i=0;i<attribute.count;i++)streetGeometry.positions.push(new THREE.Vector3().fromBufferAttribute(attribute,i).applyMatrix4(matrix).toArray());streetGeometry.indices.push(...indices.map(i=>i+base))}});
 const streetGeometryUnchanged=JSON.stringify(streetGeometry)===JSON.stringify(streetParent.rows.find(r=>r.track==='ksaba').assembly.decorativeStreets.geometry);if(!streetGeometryUnchanged)throw Error('Actual decorative streets changed');
 const decorativeStreets={streetGeometryUnchanged,instances:streetInstances,geometry:streetGeometry,plots:solids.map(s=>({name:s.name,overlap:roadFootprintOverlap(streetGeometry,s.footprint),gap:roadFootprintGap(streetGeometry,s.footprint)}))};
 assembly={sameOrigin:garden.position.x===obelisk.position.x&&garden.position.z===obelisk.position.z,lightCount:light.length,treesChecked,treeIntersections,decorativeStreets};if(!assembly.sameOrigin||assembly.lightCount!==1||!treesChecked||!streetInstances)throw Error('Garden orlight detached from landmark')}
 else{const beam=world.group.getObjectByName('rush-hw6-eyal-gantry'),sign=world.group.getObjectByName('rush-hw6-eyal-sign'),poles=meshes.filter(m=>m.name.startsWith('rush-hw6-pole-'));if(!beam||!sign||poles.length!==2)throw Error('Actual gantry missing');const a=poles[0].position,b=poles[1].position,span=a.distanceTo(b),center=a.clone().add(b).multiplyScalar(.5),direction=new THREE.Vector3(1,0,0).applyQuaternion(beam.quaternion),axis=b.clone().sub(a).normalize();assembly={span,width:beam.geometry.parameters.width,centerError:Math.hypot(beam.position.x-center.x,beam.position.z-center.z),orientationError:1-Math.abs(direction.dot(axis)),signYawError:1-Math.abs(sign.quaternion.dot(beam.quaternion)),poleYawErrors:poles.map(p=>1-Math.abs(p.quaternion.dot(beam.quaternion)))};if(assembly.centerError>1e-6||assembly.orientationError>1e-6||assembly.width<span+.6||span>built.width+16+1e-6||assembly.signYawError>1e-6||assembly.poleYawErrors.some(e=>e>1e-6))throw Error('Gantry assembly detached')}
 rows.push({track:id,roadUnchanged:true,solids,assembly,passed:solids.every(s=>s.overlap.area===0&&s.overlap.triangles===0&&s.gap>=2-1e-5)&&(!assembly.treeIntersections||assembly.treeIntersections.length===0)&&(!assembly.decorativeStreets||assembly.decorativeStreets.plots.every(p=>p.overlap.area===0&&p.gap>=2-1e-5))});
 }finally{world.dispose()}
 }return{rows,physicsVersion:PHYSICS_VERSION};
},{parent,streetParent});
Object.assign(report,{kind:'actual-preview-road-placement',physicsVersion,passed:rows.length===2&&rows.every(r=>r.passed)&&!errors.length,scope:'Current actual road triangles andsix preview footprints,all planar overlaps must be zero. Road geometry compared byte-for-byte with actual474 parent. Whole garden/light,actualtree triangle separation andgantry assemblies checked;not allworldprops,completevehiclevolume,art,grounding orpreview-race acceptance.',rows,errors});
await persist();if(!report.passed)throw Error('Actual preview road or vegetation overlap persists');console.log(JSON.stringify({passed:report.passed,errors,rows:rows.map(r=>({track:r.track,solids:r.solids.map(s=>({name:s.name,gap:s.gap,...s.overlap}))}))}));
}catch(error){report.passed=false;report.error=String(error);await persist();throw error}finally{if(browser)try{await browser.close()}catch(error){report.passed=false;report.cleanupError=String(error);await persist();process.exitCode=1}}
