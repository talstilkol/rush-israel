import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

export const ASSET_FAMILIES = [
  { id: 'sky', entry: 'loadSky', urls: ['/game/sky-day.png', '/game/sky-night.png'], getters: [['getSkyDay'], ['getSkyNight']] },
  { id: 'tree', entry: 'loadTreeMaps', urls: ['/game/foliage.png', '/game/bark.png'], getters: [['getFoliage'], ['getBark']] },
  { id: 'flare', entry: 'loadFlares', urls: ['/game/flare-0.png', '/game/flare-1.png'], getters: [['getFlare0'], ['getFlare1']] },
  { id: 'water', entry: 'loadWater', urls: ['/game/water-n.png', '/game/checker.png'], getters: [['getWaterNormal'], ['getChecker']] },
  { id: 'curb', entry: 'loadCurbs', urls: ['city','stone','dirt','sand'].map(k=>`/game/curb-${k}.png`), getters: ['city','stone','dirt','sand'].map(k=>['getCurb',k]) },
  { id: 'facade', entry: 'loadCurtains', urls: ['blue','teal','dark','gold','white'].map(k=>`/game/curtain-${k}.png`), getters: ['blue','teal','dark','gold','white'].map(k=>['getCurtain',k]) },
  { id: 'sign', entry: 'loadSigns', urls: [
    ...['stop','yield','none','speed50','speed80','speed90'].map(k=>`/game/sign-${k}.png`),
    ...['gantry-kibbutz-galuyot','gantry-hahagana','gantry-laguardia','gantry-hashalom','gantry-savidor-center','gantry-university','stn-galuyot','stn-hagana','stn-shalom','stn-savidor','stn-uni','dest-rail'].map(k=>`/game/${k}.png`),
  ], getters: [
    ...['stop','yield','none','speed50','speed80','speed90'].map(k=>['getSign',k]),
    ...['gantry-kibbutz-galuyot','gantry-hahagana','gantry-laguardia','gantry-hashalom','gantry-savidor-center','gantry-university','stn-galuyot','stn-hagana','stn-shalom','stn-savidor','stn-uni','dest-rail'].map(k=>['getGantry',k]),
  ] },
  { id: 'car', entry: 'loadCars', urls: ['gt','hatch','muscle','rally','super'].map(k=>`/game/car-${k}.glb`), getters: ['gt','hatch','muscle','rally','super'].map(k=>['cloneCarBody',k,0x123456,true]) },
];
let serial = 0;
const uri = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
/** Actual TS module and local helpers; only THREE network/decoder imports are replaced. */
export async function assetFixture(family, network) {
  const key = `__assetBatchFixture${serial++}`;
  globalThis[key] = network;
  const stub = uri(`export const RepeatWrapping=2,SRGBColorSpace='srgb',NearestFilter=3,EquirectangularReflectionMapping=4;
    export class TextureLoader{loadAsync(url){return globalThis[${JSON.stringify(key)}](url)}}
    export class GLTFLoader{setMeshoptDecoder(){} loadAsync(url){return globalThis[${JSON.stringify(key)}](url)}}
    export const MeshoptDecoder={};`);
  const memo = new Map();
  function compile(file) {
    if (memo.has(file)) return memo.get(file);
    const source = readFileSync(file,'utf8');
    const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
    const output = js.replace(/from\s*(["'])([^"']+)\1/g, (_, quote, spec) => {
      if (spec.startsWith('three')) return `from ${JSON.stringify(stub)}`;
      if (spec.startsWith('.')) return `from ${JSON.stringify(compile(resolve(dirname(file), spec + (spec.endsWith('.ts')?'':'.ts'))))}`;
      throw new Error(`Unexpected runtime fixture dependency: ${spec}`);
    });
    const result=uri(output); memo.set(file,result); return result;
  }
  try {
    const api=await import(compile(fromRoot(`src/game/${family.id}-assets.ts`)));
    return { api, close(){delete globalThis[key];}, published(){return family.getters.map(([name,...args])=>api[name](...args));} };
  } catch(error) {delete globalThis[key];throw error;}
}
export function resourceFixture(family,url,events) {
  const texture={url,repeat:{set(x,y){this.x=x;this.y=y;}},dispose(){events.push(url);}};
  if(family.id!=='car') return texture;
  const geometry={dispose(){events.push(`${url}:geometry`);},clone(){return {owner:geometry,dispose(){}};}};
  const material={dispose(){events.push(`${url}:material`);},clone(){return {owner:material,color:{setHex(value){this.value=value;}}};}};
  const mesh={isMesh:true,name:'body',geometry,material,clone(){return {...mesh};}};
  const scene={traverse(fn){fn(mesh);},removeFromParent(){},clear(){}};
  return {scene,scenes:[scene]};
}
export function deferred() { let resolve,reject; const promise=new Promise((yes,no)=>{resolve=yes;reject=no;}); return {promise,resolve,reject}; }
