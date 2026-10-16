from pathlib import Path
import subprocess,json,os,datetime
W=Path(__file__).resolve().parent;T=Path('/private/tmp/rush-main-integration-2c365ba');HEAD='2c365ba1198c5b48cfaae3dde40cd1ce074c1d29';BASE='b2c0d46dd43c3bd8f27dc0009e4809c27c54c60e'
def git(*args):return subprocess.check_output(['git',*args],cwd=T,text=True).strip()
merge=git('rev-parse','HEAD');parents=git('show','-s','--format=%P','HEAD').split();assert parents==[BASE,HEAD]
tree=git('rev-parse','HEAD^{tree}');assert tree==git('rev-parse',HEAD+'^{tree}')
env={**os.environ,'PATH':str(W/'toolchain/node-v22.16.0-darwin-arm64/bin')+':'+os.environ['PATH']}
with open(W/'main-integration-install.log','w')as log:subprocess.run(['npm','ci','--offline','--no-audit','--fund=false'],cwd=T,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
assert not git('status','--porcelain')
x={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'candidate':HEAD,'base':BASE,'integrationMerge':merge,'parents':parents,'tree':tree,'candidateTree':git('rev-parse',HEAD+'^{tree}'),'directory':str(T),'scope':'Actual unpushed local two-parent integration of remote-main snapshot and candidate. No remote main merge, release or product acceptance.','initialAttempt':'Local object copy lacked historical trees/commits; parent/tree validation rejected the misleading already-up-to-date output. Missing objects were refetched from GitHub; only the verified two-parent merge above is tested.'};(W/'main-integration-source.json').write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(x),flush=True)
