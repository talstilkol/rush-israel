import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ASSET_FAMILIES, assetFixture, resourceFixture, deferred } from './asset-cache-fixture.mjs';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
for(const family of ASSET_FAMILIES) {
  const load=(f)=>f.api[family.entry]();
  const expectedDisposals=(count)=>family.id==='car'?count*2:count;
  test(`${family.id}: concurrent requests load every URL once and keep the successful cache`,async()=>{
    const calls=[],events=[];
    const f=await assetFixture(family,async url=>{calls.push(url);await tick();return resourceFixture(family,url,events);});
    try {
      await Promise.all(Array.from({length:6},()=>load(f)));
      assert.deepEqual(calls,family.urls); assert.ok(f.published().every(Boolean));
      await load(f);assert.deepEqual(calls,family.urls);assert.deepEqual(events,[]);
      if(family.id==='car'){ const clone=f.api.cloneCarBody('hatch',0x123456,true);assert.equal(clone.material.color.value,0x123456);assert.ok(clone.geometry.owner);assert.ok(clone.material.owner);assert.equal(clone.castShadow,true); }
    } finally {f.close();}
  });
  test(`${family.id}: failed batch waits for late successes, publishes nothing, and disposes all successes`,async()=>{
    const events=[],last=deferred();let complete=false;
    const f=await assetFixture(family,url=>{
      if(url===family.urls[0])return Promise.reject(new Error('network denied'));
      if(url===family.urls.at(-1))return last.promise;
      return Promise.resolve(resourceFixture(family,url,events));
    });
    try {
      const attempt=load(f);const rejection=assert.rejects(attempt,/network denied/);attempt.then(()=>{complete=true;},()=>{complete=true;});
      await tick();assert.equal(complete,false);assert.ok(f.published().every(x=>x===undefined));
      last.resolve(resourceFixture(family,family.urls.at(-1),events));await rejection;
      assert.ok(f.published().every(x=>x===undefined));assert.equal(events.length,expectedDisposals(family.urls.length-1));assert.equal(new Set(events).size,events.length);
    } finally {last.resolve(resourceFixture(family,'late-cleanup',events));f.close();}
  });
  test(`${family.id}: retry after failed batch reloads all members and never treats a partial Map as ready`,async()=>{
    const events=[],calls=[];let fail=true;
    const f=await assetFixture(family,async url=>{calls.push(url);if(fail&&url===family.urls.at(-1))throw new Error('retry me');return resourceFixture(family,url,events);});
    try {await assert.rejects(load(f),/retry me/);assert.ok(f.published().every(x=>x===undefined));fail=false;await load(f);assert.deepEqual(calls,[...family.urls,...family.urls]);assert.ok(f.published().every(Boolean));assert.equal(events.length,expectedDisposals(family.urls.length-1));}finally{f.close();}
  });
  test(`${family.id}: synchronous network errors are contained and clean successful siblings`,async()=>{
    const events=[];const f=await assetFixture(family,url=>{if(url===family.urls[0])throw new Error('sync failure');return Promise.resolve(resourceFixture(family,url,events));});
    try {await assert.rejects(load(f),/sync failure/);await tick();assert.equal(events.length,expectedDisposals(family.urls.length-1));assert.ok(f.published().every(x=>x===undefined));}finally{f.close();}
  });
  test(`${family.id}: getters remain empty until the final member is prepared`,async()=>{
    const events=[],last=deferred();const f=await assetFixture(family,url=>url===family.urls.at(-1)?last.promise:Promise.resolve(resourceFixture(family,url,events)));
    try {const attempt=load(f);await tick();assert.ok(f.published().every(x=>x===undefined));last.resolve(resourceFixture(family,family.urls.at(-1),events));await attempt;assert.ok(f.published().every(Boolean));assert.deepEqual(events,[]);}finally{f.close();}
  });
  if(family.id!=='car')test(`${family.id}: preparation exception rolls back even prepared members and permits a clean retry`,async()=>{
    const events=[];let fail=true;
    const f=await assetFixture(family,async url=>{const t=resourceFixture(family,url,events);if(fail&&url===family.urls.at(-1))Object.defineProperty(t,'needsUpdate',{set(){throw new Error('preparation failure');}});return t;});
    try {await assert.rejects(load(f),/preparation failure/);assert.equal(events.length,family.urls.length);assert.ok(f.published().every(x=>x===undefined));fail=false;await load(f);assert.ok(f.published().every(Boolean));}finally{f.close();}
  });
}
test('successful texture settings, ordering, repeat, colour space and fallback remain unchanged',async()=>{
  for(const family of ASSET_FAMILIES.filter(f=>f.id!=='car')){
    const f=await assetFixture(family,async url=>resourceFixture(family,url,[]));
    try {await f.api[family.entry]();const ts=f.published();assert.deepEqual(ts.map(t=>t.url),family.urls);assert.ok(ts.every(t=>t.needsUpdate===true));
      if(family.id==='sky'){assert.ok(ts.every(t=>t.mapping===4&&t.anisotropy===4&&t.colorSpace==='srgb'));}
      if(family.id==='tree'){assert.deepEqual(ts.map(t=>[t.repeat.x,t.repeat.y]),[[2,2],[1,3]]);assert.ok(ts.every(t=>t.wrapS===2&&t.wrapT===2&&t.anisotropy===4&&t.colorSpace==='srgb'));}
      if(family.id==='water'){assert.deepEqual([ts[0].repeat.x,ts[0].repeat.y],[48,28]);assert.equal(ts[0].wrapS,2);assert.equal(ts[0].anisotropy,4);assert.equal(ts[1].magFilter,3);assert.deepEqual([ts[1].repeat.x,ts[1].repeat.y],[1,1]);}
      if(family.id==='curb'||family.id==='facade'){assert.ok(ts.every(t=>t.wrapS===2&&t.wrapT===2&&t.anisotropy===8&&t.colorSpace==='srgb'));assert.deepEqual(ts.map(t=>[t.repeat.x,t.repeat.y]),ts.map(()=>family.id==='curb'?[1,1]:[2,8]));assert.equal(f.api[family.getters[0][0]]('unknown'),ts[0]);}
      if(family.id==='flare'||family.id==='sign')assert.ok(ts.every(t=>t.colorSpace==='srgb'));
      if(family.id==='sign'){assert.ok(ts.every(t=>t.anisotropy===4));assert.equal(f.api.getSign('unknown'),undefined);}
    }finally{f.close();}
  }
});
