import assert from'node:assert/strict';
import{test}from'node:test';
import{readFile,writeFile,mkdir,rmdir}from'node:fs/promises';
import{createHash}from'node:crypto';
import{spawnSync}from'node:child_process';
import{fromRoot}from'./project-root.mjs';
import{captureWithVerdict}from'./capture-verdict.mjs';
const source=fromRoot('evidence','2026-10-16','replay-camera','soak-verdict-input');
const fixture=JSON.parse(await readFile(source+'/recorded-soak.json','utf8')),png=await readFile(source+'/captured.png');
assert.equal(createHash('sha256').update(png).digest('hex'),fixture.captured_png_sha256);
const identity=fixture.captured_png_sha256.slice(0,16);
async function setup(name){
 const dir=fromRoot('artifacts','capture-verdict',identity,name);await mkdir(dir,{recursive:true});
 const path=dir+'/summary.json',summary={kind:'capture-verdict-unit-io',evidenceRole:'historical-recorded-input-not-a-new-soak',recordedSourceHead:fixture.source_head,recordedRunId:fixture.run_id,recordedInput:structuredClone(fixture.summary),passed:fixture.summary.passed};
 // The prior green is real recorded CI data; it is not a fabricated race result.
 await writeFile(path,JSON.stringify(summary));const persist=value=>writeFile(path,JSON.stringify(value,null,2)+'\n');
 return{dir,path,summary,persist};
}
test('real capture filesystem error replaces a prior recorded green with false',async()=>{
 const s=await setup('capture-failure');const destination=s.dir+'/capture.png';await mkdir(destination,{recursive:true});
 await assert.rejects(captureWithVerdict(s.summary,{persist:s.persist,capture:async()=>{
  assert.equal(JSON.parse(await readFile(s.path,'utf8')).passed,false,'pending capture must already invalidate the old verdict');
  await writeFile(destination,png);
 }}),{code:'EISDIR'});
 const actual=JSON.parse(await readFile(s.path,'utf8'));assert.equal(actual.passed,false);assert.equal(actual.captureStatus,'failed');assert.match(actual.error,/EISDIR/);
});
test('successful real file capture preserves the measured verdict only after capture',async()=>{
 const s=await setup('capture-success');const path=s.dir+'/capture.png';await captureWithVerdict(s.summary,{persist:s.persist,capture:async()=>{
  assert.equal(JSON.parse(await readFile(s.path,'utf8')).passed,false);await writeFile(path,png);
 }});
 const actual=JSON.parse(await readFile(s.path,'utf8'));assert.equal(actual.passed,true);assert.equal(actual.captureStatus,'captured');assert.deepEqual(await readFile(path),png);
});
test('real cleanup failure cannot leave the captured measured verdict green',async()=>{
 const s=await setup('cleanup-failure');await assert.rejects(captureWithVerdict(s.summary,{persist:s.persist,capture:()=>writeFile(s.dir+'/capture.png',png),cleanup:()=>rmdir(s.dir)}),{code:'ENOTEMPTY'});
 const actual=JSON.parse(await readFile(s.path,'utf8'));assert.equal(actual.passed,false);assert.equal(actual.captureStatus,'captured');assert.match(actual.cleanupError,/ENOTEMPTY/);
});

test('recapturing an actually failed prior record cannot revive its erroneous green flag',async()=>{
 const s=await setup('prior-real-error');const before=JSON.parse(await readFile(source+'/before-capture-failure.json','utf8'));s.summary={...s.summary,recordedInput:structuredClone(before.summary),passed:before.summary.passed,error:before.summary.error};await s.persist(s.summary);
 await captureWithVerdict(s.summary,{persist:s.persist,capture:()=>writeFile(s.dir+'/capture.png',png)});
 assert.equal(JSON.parse(await readFile(s.path,'utf8')).passed,false);
});

test('real browser-launch failure invalidates a prior recorded green before starting',async()=>{
 const s=await setup('launch-failure');const cache=s.dir+'/empty-browser-cache';await mkdir(cache,{recursive:true});
 const result=spawnSync(process.execPath,[fromRoot('scripts','soak-30min.mjs')],{cwd:fromRoot(),env:{...process.env,SOAK_SMOKE:'1',SOAK_MS:'20000',SOAK_ARTIFACT_DIR:s.dir,PLAYWRIGHT_BROWSERS_PATH:cache},encoding:'utf8',timeout:10000});
 assert.notEqual(result.status,0);assert.match(result.stderr,/Executable.*exist/i);const actual=JSON.parse(await readFile(s.path,'utf8'));assert.equal(actual.passed,false);assert.equal(actual.kind,'diagnostic-smoke');
});
