import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadOwnedResources } from '../src/game/owned-load.ts';
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const resource = (id, released, fail=false) => ({ id, dispose() { released.push(id); if (fail) throw new Error(`cleanup ${id}`); } });
test('healthy batch transfers ownership in requested order, not completion order', async () => {
 const freed=[],a=resource('a',freed),b=resource('b',freed),late=deferred();
 const result=loadOwnedResources([()=>late.promise,async()=>b],xs=>xs);late.resolve(a);
 assert.deepEqual(await result,[a,b]);assert.deepEqual(freed,[]);
});
test('early failure waits for late fulfillment and releases both successful siblings', async () => {
 const freed=[],late=deferred(),error=new Error('failed');let committed=false;
 const result=loadOwnedResources([async()=>resource('early',freed),async()=>{throw error;},()=>late.promise],()=>{committed=true;});
 const rejected=assert.rejects(result,e=>e===error);await new Promise(r=>setImmediate(r));assert.deepEqual(freed,[]);
 late.resolve(resource('late',freed));await rejected;assert.deepEqual(freed,['late','early']);assert.equal(committed,false);
});
test('synchronous loader throws cannot bypass sibling ownership', async () => {
 const freed=[];await assert.rejects(loadOwnedResources([()=>{throw new Error('sync');},async()=>resource('b',freed)],()=>{}),/sync/);assert.deepEqual(freed,['b']);
});
test('synchronous preparation failure rolls back the entire successful batch', async()=>{
 const freed=[];await assert.rejects(loadOwnedResources([async()=>resource('a',freed),async()=>resource('b',freed)],()=>{throw new Error('prepare');}),/prepare/);assert.deepEqual(freed,['b','a']);
});
test('asynchronous commit rejection also rolls back', async()=>{
 const freed=[];await assert.rejects(loadOwnedResources([async()=>resource('a',freed)],async()=>{throw new Error('commit');}),/commit/);assert.deepEqual(freed,['a']);
});
test('cleanup failure does not prevent remaining releases and preserves original cause', async()=>{
 const freed=[],cause=new Error('load');await assert.rejects(loadOwnedResources([async()=>resource('a',freed),async()=>resource('b',freed,true),async()=>{throw cause;}],()=>{}),e=>e instanceof AggregateError&&e.cause===cause&&e.errors.length===2);assert.deepEqual(freed,['b','a']);
});
test('duplicate resource identities are disposed once on rollback', async()=>{
 const freed=[],a=resource('a',freed);await assert.rejects(loadOwnedResources([async()=>a,async()=>a,async()=>{throw new Error('bad');}],()=>{}));assert.deepEqual(freed,['a']);
});
for(const reason of [undefined,null,0,false])test(`falsy rejection ${String(reason)} still fails without publishing`,async()=>{
 let committed=false;const result=loadOwnedResources([()=>Promise.reject(reason)],()=>{committed=true;});
 let failed=false;try{await result;}catch(e){failed=true;assert.equal(e,reason);}assert.equal(failed,true);assert.equal(committed,false);
});
test('empty batch passes an empty collection to the owner', async()=>{assert.equal(await loadOwnedResources([],xs=>xs.length),0);});
