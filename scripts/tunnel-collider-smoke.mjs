#!/usr/bin/env node
/** Actual rendered tunnel solids and real vehicle contacts,not full3D/device acceptance. */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
const output = fromRoot('artifacts', 'tunnel-solids');
await mkdir(output, { recursive: true });
const report = { kind: 'actual-tunnel-solid-regression', passed: false, errors: [], scope: 'Four actual worlds;mesh-derived wall/lining/portal-post OBBs,contact integration,above-solid clearance and actual road-center samples. Ceiling/underside collision and full3D vehicle volumes remain outside this horizontal contact model. No full race,art or physical-device acceptance.' };
const persist = () => writeFile(output + '/summary.json', JSON.stringify(report, null, 2) + '\n');
await persist();
let browser;
try {
 browser = await chromium.launch({ headless: true });
 const page = await browser.newPage();
 page.on('pageerror', error => report.errors.push(String(error)));
 await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
 report.actual = await page.evaluate(async () => {
  const source = await (await fetch('/src/game/world.ts')).text();
  const imports = [...source.matchAll(/from "([^"]+)"/g)].map(match => match[1]);
  const dependency = name => imports.find(url => url.split('?')[0].endsWith(`/${name}`)) || `/src/game/${name}`;
  const THREE = await import(dependency('three.js'));
  const { TRACKS } = await import(dependency('tracks.ts'));
  const { buildTrack } = await import(dependency('spline.ts'));
  const { createWorld } = await import('/src/game/world.ts');
  const { ArcadeCar } = await import('/src/game/vehicle.ts');
  const { CARS } = await import('/src/game/cars.ts');
  const { PHYSICS_VERSION } = await import(dependency('physics.ts'));
  // Load the actual committed texture providers used by the world builder.
  for (const name of ['arrow','beam','blob','clock','curb','facade','flag','flake','flare','foam','ground','road','sign','sky','stone','tree','walk','water']) {
   const module = await import(dependency(`${name}-assets.ts`));
   for (const [key, load] of Object.entries(module)) if (key.startsWith('load') && key !== 'loadRoadFor') await load();
  }
  const rows = [];
  const makeCar = (position, vx, vz) => {
   const car = new ArcadeCar(CARS[0], CARS[0].nameEn);
   [car.x, car.y, car.z] = position;
   car.vx = vx;car.vz = vz;car.speed = Math.hypot(vx,vz);car.yaw = Math.atan2(-vx,-vz);
   return car;
  };
  const contact = (position, vx, vz, colliders) => {
   const car = makeCar(position,vx,vz);car.hitColliders(colliders);
   return { damage: car.damage, displacement: Math.hypot(car.x-position[0],car.z-position[2]) };
  };
  for (const id of ['namal','hw1','ramon','hayarkon']) {
   const definition = TRACKS.find(track => track.id === id),built = buildTrack(definition);
   const world = await createWorld(definition,built,false,false,'clear');
   try {
    world.group.updateMatrixWorld(true);
    const solids = [];
    world.group.traverse(mesh => { if (mesh.isMesh && mesh.name.startsWith('rush-tunnel-')) solids.push(mesh); });
    if (solids.length !== 8) throw Error(`${id}: expected8 actual wall/lining/post solids,got${solids.length}`);
    const pairs = solids.map(mesh => {
     const {width,height,depth} = mesh.geometry.parameters;
     const matches = world.colliders.filter(c => Math.hypot(c.x-mesh.position.x,c.z-mesh.position.z)<1e-7 && Math.abs(c.hx-width/2)<1e-7 && Math.abs(c.hz-depth/2)<1e-7 && Math.abs(c.yaw-Math.atan2(mesh.matrixWorld.elements[8],mesh.matrixWorld.elements[10]))<1e-7 && Math.abs(c.maxY-mesh.position.y-height/2)<1e-7);
     if (matches.length!==1) throw Error(`${id}/${mesh.name}: mesh/contact mapping ${matches.length}`);
     return {mesh,collider:matches[0]};
    });
    const tunnelColliders = pairs.map(pair=>pair.collider),checks=[];
    for (const {mesh,collider} of pairs) {
     const p=mesh.geometry.parameters,yaw=Math.atan2(mesh.matrixWorld.elements[8],mesh.matrixWorld.elements[10]),nx=Math.cos(yaw),nz=-Math.sin(yaw);
     const contacts=[],traversals=[];
     for(const u of [.1,.2,.3,.4,.5,.6,.7,.8,.9]) for(const side of [-1,1]) {
      const point=mesh.localToWorld(new THREE.Vector3(side*(p.width/2+1.05-.02),-p.height/2+1,(u-.5)*p.depth));
      const hit=contact(point.toArray(),-side*nx*20,-side*nz*20,[collider]);
      const full=contact(point.toArray(),-side*nx*20,-side*nz*20,world.colliders);
      if(!(hit.damage>0 && hit.displacement>0 && full.displacement>0))throw Error(`${id}/${mesh.name}: missing contact ${u}/${side} ${JSON.stringify({point:point.toArray(),hit,full,collider})}`);
      contacts.push({u,side,point:point.toArray(),hit,full});
      if(mesh.name.startsWith('rush-tunnel-wall-')) {
       const start=mesh.localToWorld(new THREE.Vector3(side*(p.width/2+3),-p.height/2+1,(u-.5)*p.depth));
       const car=makeCar(start.toArray(),-side*nx*20,-side*nz*20);
       let crossed=false;
       for(let frame=0;frame<120;frame++) {
        car.x+=car.vx/120;car.z+=car.vz/120;car.hitColliders([collider]);
        const local=mesh.worldToLocal(new THREE.Vector3(car.x,car.y,car.z));
        if(local.x*side < p.width/2) crossed=true;
       }
       if(crossed || car.damage<=0)throw Error(`${id}/${mesh.name}: normal traversal crossed visible wall ${u}/${side}`);
       traversals.push({u,side,damage:car.damage,crossed});
      }
     }
     const top=[mesh.position.x,collider.maxY+.1,mesh.position.z];
     const above=contact(top,-nx*20,-nz*20,[collider]);
     if(above.damage!==0 || above.displacement!==0)throw Error(`${id}/${mesh.name}: false contact above solid`);
     const outsidePoint=mesh.localToWorld(new THREE.Vector3(p.width/2+1.05+.1,-p.height/2+1,0));
     const outside=contact(outsidePoint.toArray(),-nx*20,-nz*20,[collider]);
     if(outside.damage!==0||outside.displacement!==0)throw Error(`${id}/${mesh.name}: false contact outside solid`);
     checks.push({name:mesh.name,position:mesh.position.toArray(),dimensions:p,collider,contacts,traversals,above,outside});
    }
    const walls=pairs.filter(pair=>pair.mesh.name.startsWith('rush-tunnel-wall-'));
    const center=new THREE.Vector3().addVectors(walls[0].mesh.position,walls[1].mesh.position).multiplyScalar(.5),wall=walls[0].mesh;
    const half=Math.hypot(wall.position.x-center.x,wall.position.z-center.z),road=[];
    for(const sample of built.samples) {
     const local=wall.worldToLocal(new THREE.Vector3(sample.x,sample.y,sample.z));
     const centerDistance=Math.abs((sample.x-center.x)*Math.cos(walls[0].collider.yaw)-(sample.z-center.z)*Math.sin(walls[0].collider.yaw));
     if(Math.abs(local.z)>wall.geometry.parameters.depth/2 || centerDistance>half)continue;
     const hit=contact([sample.x,sample.y,sample.z],-sample.tx*20,-sample.tz*20,tunnelColliders);
     if(hit.damage!==0||hit.displacement!==0)throw Error(`${id}: actual road center obstructed at${sample.t}`);
     road.push({t:sample.t,hit});
    }
    const centerline=[];
    for(let i=0;i<=12;i++) {
     const z=(i/12-.5)*wall.geometry.parameters.depth;
     const position=wall.localToWorld(new THREE.Vector3(half, -wall.geometry.parameters.height/2+1, z));
     const hit=contact(position.toArray(),-Math.sin(walls[0].collider.yaw)*20,-Math.cos(walls[0].collider.yaw)*20,tunnelColliders);
     if(hit.damage!==0||hit.displacement!==0)throw Error(`${id}: actual tunnel centerline obstructed`);
     centerline.push({position:position.toArray(),hit});
    }
    // Some scenery is deliberately off the fictional route. Do not fabricate
    // road coverage when the actual road never enters the rendered footprint.
    const nearestRoadDistance=Math.min(...built.samples.map(sample=>Math.hypot(sample.x-center.x,sample.z-center.z)));
    if(!road.length && nearestRoadDistance<=half)throw Error(`${id}: unexplained missing road samples`);
    rows.push({track:id,solids:checks,centerline,roadCenterSamples:road,roadRelation:road.length?'actual route crosses tunnel footprint':'no actual route samples inside tunnel footprint',nearestRoadDistance,passed:true});
   } finally {world.dispose();}
  }
  return {physicsVersion:PHYSICS_VERSION,rows,passed:rows.length===4&&rows.every(row=>row.passed)};
 });
 report.passed = report.actual.passed && !report.errors.length;
 await persist();
 if(!report.passed)throw Error('Tunnel contact gate failed');
 console.log(JSON.stringify({passed:report.passed,tracks:report.actual.rows.length,solids:report.actual.rows.reduce((n,r)=>n+r.solids.length,0),roadCenterSamples:report.actual.rows.reduce((n,r)=>n+r.roadCenterSamples.length,0),physicsVersion:report.actual.physicsVersion}));
} catch(error) { report.error=String(error);await persist();throw error; }
finally {if(browser)await browser.close();}
