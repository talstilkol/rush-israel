import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp,readFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pierCollisionResults,retainPierReport } from './pier-collision-browser.mjs';
function fixture() {
  const added=Array.from({length:176},(_,i)=>({x:i*4,z:0,r:1.77,kind:'barrier',role:'support-pier',vertical:{min:0,max:8.45}}));
  const carIds=['sabra','carmel','kfir','negev','yam'];
  return {grid:['sabra','carmel','kfir','negev'].map((id,i)=>({id,x:10000+i*5,y:0,z:0})),colliderCount:722,legacy:Array(546).fill({}),added,carIds,checkpointCount:8,rampRecipe:Array(50).fill({}),pageErrors:[],glError:0,
    matches:added.map((c,index)=>({index,collider:c,shape:{x:c.x,z:0,min:0,max:8.45,radius:0.72}})),
    rows:added.flatMap((c,index)=>carIds.flatMap(car=>['inside-still','inside-moving','above','below'].map(condition=>{
      const inside=condition.startsWith('inside'),y=condition==='above'?8.45+0.95:condition==='below'?-1.6:0;
      return {index,car,condition,fromY:y,y,vy:-0.5,x:c.x+(inside?1.77:0),z:0,distance:inside?1.77:0,radius:1.77,velocityInto:0,lastHit:condition==='inside-moving'?'barrier':''};
    })))};
}
test('complete pier evidence yields five narrowly scoped passes',()=>assert.deepEqual(pierCollisionResults(fixture()).map(r=>r.status),Array(5).fill('passed')));
for(const [name,mutate] of [
  ['missing pier',r=>r.added.pop()],['missing observation',r=>r.rows.pop()],
  ['duplicate observation',r=>r.rows[1]=r.rows[0]],['invented car',r=>r.rows[0].car='other'],
  ['nonfinite height',r=>r.rows[0].y=NaN],['nonfinite geometry',r=>r.matches[0].shape.max=NaN],
  ['wrong collider height',r=>r.matches[0].shape.max=20],['fake displacement',r=>r.rows[0].distance=0],
  ['wrong observation height',r=>r.rows[2].y=0],['page error',r=>r.pageErrors.push('error')],
  ['lost legacy obstacle',r=>r.legacy.pop()],['changed radius',r=>r.rows[0].radius=2],
]) test(`pier evidence fails closed: ${name}`,()=>{const r=fixture();mutate(r);assert.throws(()=>pierCollisionResults(r));});
test('valid measurements of unresolved inside contact produce failure, not a false pass',()=>{
  const r=fixture();r.rows[0].x=r.added[0].x;r.rows[0].distance=0;assert.equal(pierCollisionResults(r)[0].status,'failed');
});
test('spurious above-deck collision remains a failed contract',()=>{
  const r=fixture();r.rows[2].x+=1;r.rows[2].distance=1;assert.equal(pierCollisionResults(r)[2].status,'failed');
});

for(const [name,mutate] of [['missing grid car',r=>r.grid.pop()],['duplicate grid car',r=>r.grid[1]=r.grid[0]],['nonfinite grid height',r=>r.grid[0].y=NaN]]) test(`pier evidence rejects ${name}`,()=>{const r=fixture();mutate(r);assert.throws(()=>pierCollisionResults(r));});
test('a measured grid penetration cannot be relabelled as safe spawn',()=>{const r=fixture();r.grid[0].x=0;assert.equal(pierCollisionResults(r)[4].status,'failed');});
test('invalid complete report is retained before validation throws',async()=>{const out=await mkdtemp(join(tmpdir(),'pier-invalid-'));try {const r=fixture();r.colliderCount=711;await assert.rejects(retainPierReport(r,out));assert.equal(JSON.parse(await readFile(join(out,'results.json'),'utf8')).colliderCount,711);}finally{await rm(out,{recursive:true,force:true});}});
test('validated report retains all measurements and five results',async()=>{const out=await mkdtemp(join(tmpdir(),'pier-valid-'));try {await retainPierReport(fixture(),out);const r=JSON.parse(await readFile(join(out,'results.json'),'utf8'));assert.equal(r.rows.length,3520);assert.equal(r.results.length,5);}finally{await rm(out,{recursive:true,force:true});}});
