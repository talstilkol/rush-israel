import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fromRoot } from './project-root.mjs';
import { validateHeroCar } from './check-hero-car.mjs';
import { validateAyalonAsphalt } from './check-ayalon-asphalt.mjs';
test('hero historical projection never exempts a modified GLTF URL',()=>{
 const assetsSource=readFileSync(fromRoot('src/game/car-assets.ts'),'utf8').replace('/game/car-${kind}.glb','/game/unreviewed-${kind}.glb');
 assert.ok(validateHeroCar({assetsSource}).errors.length);
});
test('sign historical projection never exempts a modified sign URL',()=>{
 const signAssetSource=readFileSync(fromRoot('src/game/sign-assets.ts'),'utf8').replace('/game/sign-${k}.png','/game/unreviewed-${k}.png');
 assert.ok(validateAyalonAsphalt({signAssetSource}).errors.length);
});
