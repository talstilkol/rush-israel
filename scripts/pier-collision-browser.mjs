import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';

/** Ground-to-slab pier contacts. The 1.6-unit body proxy is not a full roof envelope. */
export async function measurePierCollisions(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors=[]; page.on('pageerror', e=>pageErrors.push(String(e)));
  try {
    await page.goto(url,{waitUntil:'networkidle',timeout:40000});
    const report=await page.evaluate(async()=>{
      const { RaceEngine }=await import('/src/game/engine.ts');
      const { ArcadeCar }=await import('/src/game/vehicle.ts');
      const { CARS }=await import('/src/game/cars.ts');
      const canvas=document.createElement('canvas'); canvas.style.cssText='width:800px;height:600px'; document.body.append(canvas);
      const engine=new RaceEngine(canvas,{trackId:'ayalon',carId:'sabra',quality:'low',night:false,langHe:true,onHud(){},onFinish(){}});
      try {
        await engine.ready;engine.renderer.setAnimationLoop(null);
        const all=engine.world.colliders, added=all.filter(c=>c.role==='support-pier'), legacy=all.filter(c=>c.role!=='support-pier');
        const piers=engine.world.group.children.filter(o=>o.geometry?.type==='CylinderGeometry'&&o.geometry.parameters.radiusTop===0.55&&o.geometry.parameters.radiusBottom===0.72);
        const matches=piers.map((o,i)=>{
          const height=o.geometry.parameters.height, c=added[i];
          const shape={x:o.position.x,z:o.position.z,min:o.position.y-height/2,max:o.position.y+height/2,radius:o.geometry.parameters.radiusBottom};
          return {index:i,shape,collider:c??null};
        });
        const rows=[];
        for(let index=0;index<added.length;index++) for(const stats of CARS) for(const condition of ['inside-still','inside-moving','above','below']) {
          const c=added[index], y=condition==='above'?c.vertical.max+0.95:condition==='below'?-1.6:0;
          const moving=condition==='inside-moving',car=new ArcadeCar(stats,'pier height proxy');
          Object.assign(car,{x:c.x,y,z:c.z,vx:moving?3:0,vz:moving?4:0,vy:-0.5,speed:moving?-4:0});
          car.hitColliders([c]);
          rows.push({index,car:stats.id,condition,fromY:y,y:car.y,vy:car.vy,x:car.x,z:car.z,
            distance:Math.hypot(car.x-c.x,car.z-c.z),radius:c.r,velocityInto:car.vx*-0.6+car.vz*-0.8,lastHit:car.lastHit});
        }
        return {colliderCount:all.length,legacy,added,carIds:CARS.map(c=>c.id),matches,rows,grid:engine.racers.map(c=>({id:c.stats.id,x:c.x,y:c.y,z:c.z})),rampRecipe:engine.world.ramps,
          checkpointCount:engine.built.checkpoints.length,glError:engine.renderer.getContext().getError()};
      } finally {engine.dispose();canvas.remove();}
    });
    return {...report,pageErrors,legacySha256:createHash('sha256').update(JSON.stringify(report.legacy)).digest('hex')};
  } finally {await page.close();}
}
export function pierCollisionResults(r) {
  assert.equal(r.colliderCount,722);assert.equal(r.legacy.length,546);assert.equal(r.added.length,176);
  assert.equal(r.matches.length,176);assert.equal(r.checkpointCount,8);assert.equal(r.rampRecipe.length,50);
  assert.deepEqual(r.carIds,['sabra','carmel','kfir','negev','yam']);
  assert.deepEqual(r.pageErrors,[]);assert.equal(r.glError,0);assert.equal(r.rows.length,176*5*4);
  for(const [i,m] of r.matches.entries()) {
    assert.equal(m.index,i);assert.deepEqual(m.collider,r.added[i]);
    const c=m.collider,s=m.shape;
    assert.ok([s.x,s.z,s.min,s.max,s.radius,c.x,c.z,c.r,c.vertical.min,c.vertical.max].every(Number.isFinite));
    assert.ok(s.max>s.min);assert.equal(c.role,'support-pier');assert.equal(c.kind,'barrier');
    for(const [a,b] of [[c.x,s.x],[c.z,s.z],[c.vertical.min,s.min],[c.vertical.max,s.max],[c.r,s.radius+1.05]]) assert.ok(Math.abs(a-b)<1e-8,'pier mesh/collider mismatch');
  }
  const keys=new Set();
  for(const row of r.rows) {
    const key=`${row.index}/${row.car}/${row.condition}`;
    assert.ok(!keys.has(key),'duplicate pier evidence');keys.add(key);
    assert.ok(Number.isInteger(row.index)&&row.index>=0&&row.index<176&&r.carIds.includes(row.car));
    assert.ok(['inside-still','inside-moving','above','below'].includes(row.condition));
    assert.ok([row.x,row.z,row.y,row.fromY,row.vy,row.radius,row.distance,row.velocityInto].every(Number.isFinite));
    const c=r.added[row.index];assert.equal(row.radius,c.r);
    const expectedY=row.condition==='above'?c.vertical.max+0.95:row.condition==='below'?-1.6:0;
    assert.equal(row.fromY,expectedY);assert.equal(row.y,expectedY);assert.equal(row.vy,-0.5);
    assert.ok(Math.abs(row.distance-Math.hypot(row.x-c.x,row.z-c.z))<1e-8,'forged displacement');
  }
  assert.equal(r.grid.length,4);assert.deepEqual(r.grid.map(c=>c.id),['sabra','carmel','kfir','negev']);
  for(const car of r.grid) assert.ok([car.x,car.y,car.z].every(Number.isFinite));
  const gridFailures=r.grid.filter(car=>r.added.some(c=>car.y<c.vertical.max&&car.y+1.6>c.vertical.min&&Math.hypot(car.x-c.x,car.z-c.z)<c.r-1e-8)).length;
  const results=['inside-still','inside-moving','above','below'].map(condition=>{
    const rows=r.rows.filter(row=>row.condition===condition);assert.equal(rows.length,880);
    const failures=rows.filter(row=>condition.startsWith('inside')?
      Math.abs(row.distance-row.radius)>1e-8||(condition==='inside-moving'&&(row.velocityInto<-1e-8||row.lastHit!=='barrier')):
      row.distance>1e-8||row.lastHit!=='').length;
    return {case:`176 actual pier colliders / five cars / ${condition}`,status:failures?'failed':'passed',probes:rows.length,failures};
  });
  results.push({case:'actual four-car starting grid / no pier penetration',status:gridFailures?'failed':'passed',probes:r.grid.length,failures:gridFailures});
  return results;
}
export async function retainPierReport(report,out) {
  await mkdir(out,{recursive:true});
  // Retain raw measurements even when structural validation rejects the report.
  await writeFile(`${out}/results.json`,JSON.stringify(report,null,2)+'\n');
  const results=pierCollisionResults(report);
  await writeFile(`${out}/results.json`,JSON.stringify({...report,results},null,2)+'\n');
  return results;
}
export async function verifyPierCollisions(browser,url) {
  const report=await measurePierCollisions(browser,url);
  const out=process.env.PIER_OUTPUT??fromRoot('artifacts','pier-collision');
  const results=await retainPierReport(report,out);
  assert.ok(results.every(r=>r.status==='passed'),JSON.stringify(results));return results;
}
if(process.argv[1]&&await realpath(process.argv[1])===fileURLToPath(import.meta.url)) {
  const {chromium}=await import('playwright'),browser=await chromium.launch({headless:true});
  try {
    if(process.argv.includes('--expect-missing')) {
      const r=await measurePierCollisions(browser,process.env.SMOKE_URL??'http://127.0.0.1:8080/?qa=1');
      assert.equal(r.colliderCount,546);assert.equal(r.added.length,0);assert.equal(r.matches.length,176);
      assert.deepEqual(r.pageErrors,[]);assert.equal(r.glError,0);
      const out=process.env.PIER_OUTPUT??fromRoot('artifacts','pier-legacy');await mkdir(out,{recursive:true});
      await writeFile(`${out}/results.json`,JSON.stringify(r,null,2)+'\n');console.log('176 visible piers; 0 dedicated bounded colliders (old source)');
    } else console.log(JSON.stringify(await verifyPierCollisions(browser,process.env.SMOKE_URL??'http://127.0.0.1:8080/?qa=1')));
  } finally {await browser.close();}
}
