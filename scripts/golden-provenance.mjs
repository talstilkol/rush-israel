#!/usr/bin/env node
/** Read-only provenance inventory; does not approve or update a baseline. Requires full Git history. */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fromRoot, projectRoot } from './project-root.mjs';
const git = (...args) => execFileSync('git', args, { cwd: projectRoot, maxBuffer: 20 * 1024 * 1024 });
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const files = ['ayalon-day-g01.png','ayalon-day-g05.png','ayalon-day-g07.png','ayalon-night-g08.png'];
const baselineCommit = 'b0e3e525689955e6ff944b49f08c814e49cf03fa';
const result = { baselineCommit, acceptance: 'blocked', baselineUpdates: 0, frames: [], sourceComparison: [] };
try {
  result.checkout = git('rev-parse','HEAD').toString().trim();
  result.indexTree = git('write-tree').toString().trim();
  result.baselineCommitMetadata = git('show','-s','--format=%H%n%aI%n%s%n%b',baselineCommit).toString().trim();
  for (const name of files) {
    const path = `golden-baseline/${name}`;
    const current = readFileSync(fromRoot(path));
    const historical = git('show',`${baselineCommit}:${path}`);
    result.frames.push({ path, lastCommit: git('log','-1','--format=%H','--',path).toString().trim(),
      currentSha256: sha256(current), historicalSha256: sha256(historical), identical: current.equals(historical) });
  }
  const paths = ['scripts/pixel-golden.mjs','src/world/goldenCameras.ts','src/game/engine.ts','src/game/engine/qa-adapter.ts',
    'src/game/cars.ts','src/game/car-assets.ts','src/game/car-mesh.ts','src/game/world.ts','src/game/tracks.ts',
    'src/game/tracks/ayalon.ts','src/rendering/QualityProfile.ts','src/components/game-app/hud.tsx','package-lock.json'];
  for (const path of paths) {
    if (!existsSync(fromRoot(path))) continue;
    const current = readFileSync(fromRoot(path));
    const present = git('ls-tree',baselineCommit,'--',path).length > 0;
    const prior = present ? git('show',`${baselineCommit}:${path}`) : null;
    result.sourceComparison.push({ path, currentSha256: sha256(current), historicalSha256: prior ? sha256(prior) : null,
      state: prior ? current.equals(prior) ? 'unchanged' : 'changed' : 'added_since_baseline' });
  }
  result.status = 'provenance_verified_not_visual_acceptance';
  result.limit = 'Different source layouts include accepted refactors. Changed hashes alone cannot attribute pixel differences; deterministic source/configuration bisect remains required.';
} catch (error) { result.status = 'incomplete'; result.error = String(error); process.exitCode = 1; }
mkdirSync(fromRoot('artifacts'),{recursive:true});
writeFileSync(fromRoot('artifacts','golden-provenance.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
