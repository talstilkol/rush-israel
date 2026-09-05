import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';
// Execute the actual current loader module; only the network/THREE dependency is faked.
let serial=0;
async function loader(load) {
 const key=`__roadResourceFixture${serial++}`;globalThis[key]={load};
 const stub=`export const ClampToEdgeWrapping=1,RepeatWrapping=2,SRGBColorSpace='srgb',NoColorSpace='none';export class TextureLoader {loadAsync(url){return globalThis[${JSON.stringify(key)}].load(url);}}`;
 const source=readFileSync(fromRoot('src/game/road-assets.ts'),'utf8').replace('"three"',JSON.stringify('data:text/javascript;base64,'+Buffer.from(stub).toString('base64'))).replace('"./owned-load"',JSON.stringify(pathToFileURL(fromRoot('src/game/owned-load.ts')).href));
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return { api:await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64')), close(){delete globalThis[key];} };
}
const tex=(url,freed)=>({url,dispose(){freed.push(url);}});
test('concurrent lane callers share one three-request batch and a stable kit',async()=>{
 const calls=[],freed=[];const {api,close}=await loader(async url=>{calls.push(url);await new Promise(r=>setTimeout(r,2));return tex(url,freed);});
 try{const values=await Promise.all(Array.from({length:8},()=>api.loadAyalonRoad()));assert.equal(calls.length,3);assert.ok(values.every(x=>x===values[0]));assert.equal(await api.loadAyalonRoad(),values[0]);assert.equal(calls.length,3);assert.deepEqual(freed,[]);}finally{close();}
});
test('failed road batch releases late and early textures without caching a partial kit',async()=>{
 const freed=[];const {api,close}=await loader(async url=>{await new Promise(r=>setTimeout(r,url.includes('rough')?12:1));if(url.includes('bump'))throw new Error('network');return tex(url,freed);});
 try{await assert.rejects(api.loadHwyRoad(),/network/);assert.equal(freed.length,2);assert.equal(api.getBakedRoad(4),undefined);}finally{close();}
});
test('failed lane clears in-flight state so a later retry publishes a complete kit',async()=>{
 const freed=[],calls=[];let fail=true;const {api,close}=await loader(async url=>{calls.push(url);if(fail&&url.includes('bump'))throw new Error('network');return tex(url,freed);});
 try{await assert.rejects(api.loadHwyRoad(),/network/);fail=false;const kit=await api.loadHwyRoad();assert.equal(calls.length,6);assert.equal(freed.length,2);assert.equal(kit,api.getBakedRoad(4));assert.equal(await api.loadHwyRoad(),kit);}finally{close();}
});
test('texture preparation failure cleans all resources before retry',async()=>{
 const freed=[];let fail=true;const {api,close}=await loader(async url=>{const t=tex(url,freed);if(fail&&url.includes('rough'))Object.defineProperty(t,'wrapS',{set(){throw new Error('prepare');}});return t;});
 try{await assert.rejects(api.loadCityRoad(),/prepare/);assert.equal(freed.length,3);assert.equal(api.getBakedRoad(3),undefined);fail=false;assert.ok(await api.loadCityRoad());}finally{close();}
});
test('separate lane keys remain independent and preserve every URL and texture setting',async()=>{
 const calls=[],freed=[];const {api,close}=await loader(async url=>{calls.push(url);return tex(url,freed);});
 try{await Promise.all([api.loadRoadFor('ayalon'),api.loadRoadFor('hw6'),api.loadRoadFor('rothschild')]);assert.equal(calls.length,9);
 for(const n of [3,4,8]){const k=api.getBakedRoad(n);assert.equal(k.map.url,`/game/asphalt-${n}.png`);assert.equal(k.roughnessMap.url,`/game/asphalt-${n}-rough.png`);assert.equal(k.bumpMap.url,`/game/asphalt-${n}-bump.png`);assert.equal(k.map.colorSpace,'srgb');assert.equal(k.map.anisotropy,16);assert.equal(k.bumpMap.colorSpace,'none');assert.equal(k.bumpMap.anisotropy,8);assert.equal(k.map.needsUpdate,true);}assert.equal(api.getBakedRoad(2),undefined);assert.deepEqual(freed,[]);
 }finally{close();}
});
test('synchronous network-adapter throws still release successful sibling loads',async()=>{
 const freed=[];const {api,close}=await loader(url=>{if(url.includes('bump'))throw new Error('sync network');return Promise.resolve(tex(url,freed));});
 try{await assert.rejects(api.loadHwyRoad(),/sync network/);assert.equal(freed.length,2);}finally{close();}
});
