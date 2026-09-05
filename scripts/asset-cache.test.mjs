import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAssetCache } from '../src/game/asset-cache.ts';
import { createUnpublishedGltfDisposer } from '../src/game/unpublished-gltf.ts';
import { deferred } from './asset-cache-fixture.mjs';
test('single-flight cache publishes only a completed value and returns one pending promise',async()=>{
 const done=deferred();let calls=0;const cache=createAssetCache(()=>{calls++;return done.promise;});
 const a=cache.load(),b=cache.load();assert.equal(a,b);assert.equal(cache.peek(),undefined);const value=new Map([['ready',true]]);done.resolve(value);assert.equal(await a,value);assert.equal(await cache.load(),value);assert.equal(calls,1);
});
test('single-flight cache retries synchronous factory errors without an unhandled rejection',async()=>{
 let calls=0;const cache=createAssetCache(()=>{if(++calls===1)throw new Error('factory');return Promise.resolve('ok');});await assert.rejects(cache.load(),/factory/);assert.equal(cache.peek(),undefined);assert.equal(await cache.load(),'ok');assert.equal(calls,2);
});
test('successful undefined is cached without duplicate requests',async()=>{let calls=0;const cache=createAssetCache(async()=>{calls++;});await cache.load();await cache.load();assert.equal(calls,1);});
function scene(nodes){return {traverse(fn){nodes.forEach(fn);},removeFromParent(){},clear(){}};}
test('unpublished GLTF rollback covers all scenes and deduplicates shared geometries, materials, textures and bitmaps across files',()=>{
 const counts={};const resource=id=>({dispose(){counts[id]=(counts[id]??0)+1;}});
 const image={close(){counts.image=(counts.image??0)+1;}};const t={...resource('texture'),isTexture:true,source:{data:image}};
 const material={...resource('material'),map:t,normalMap:t},geometry=resource('geometry'),skeleton=resource('skeleton');
 const a=scene([{geometry,material:[material,material],skeleton}]);const b=scene([{geometry,material}]);const extra=scene([{geometry:resource('extra')}]);
 const dispose=createUnpublishedGltfDisposer();dispose({scene:a,scenes:[a,b,extra]});dispose({scene:b,scenes:[b]});assert.deepEqual(counts,{geometry:1,texture:1,material:1,skeleton:1,extra:1,image:1});
});
test('unpublished GLTF rollback continues after disposer exceptions and reports them',()=>{
 const seen=[];const a={dispose(){seen.push('broken');throw new Error('cleanup');}},b={dispose(){seen.push('healthy');}};
 const root=scene([{geometry:a,material:b}]);assert.throws(()=>createUnpublishedGltfDisposer()({scene:root,scenes:[root]}),AggregateError);assert.deepEqual(seen,['broken','healthy']);
});
