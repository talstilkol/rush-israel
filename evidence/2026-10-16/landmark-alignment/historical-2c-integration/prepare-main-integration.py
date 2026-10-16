from pathlib import Path
import subprocess,json,os,datetime
W=Path(__file__).resolve().parent;R=W/'rush-israel-pr83';HEAD='2c365ba1198c5b48cfaae3dde40cd1ce074c1d29';BASE='b2c0d46dd43c3bd8f27dc0009e4809c27c54c60e';T=Path('/private/tmp/rush-main-integration-2c365ba')
assert not T.exists();assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==HEAD
subprocess.run(['git','clone','--quiet','--no-hardlinks',str(R),str(T)],check=True)
with open(W/'main-integration-git.log','w')as log:
 for args in [['checkout','--detach',BASE],['switch','-c','qa-main-integration-2c365ba'],['merge','--no-ff','--no-edit',HEAD]]:subprocess.run(['git',*args],cwd=T,stdout=log,stderr=subprocess.STDOUT,check=True)
merge=subprocess.check_output(['git','rev-parse','HEAD'],cwd=T,text=True).strip();parents=subprocess.check_output(['git','show','-s','--format=%P','HEAD'],cwd=T,text=True).strip().split();assert parents==[BASE,HEAD]
tree=lambda ref:subprocess.check_output(['git','rev-parse',ref+'^{tree}'],cwd=T,text=True).strip();assert tree('HEAD')==tree(HEAD)
env={**os.environ,'PATH':str(W/'toolchain/node-v22.16.0-darwin-arm64/bin')+':'+os.environ['PATH']}
with open(W/'main-integration-install.log','w')as log:subprocess.run(['npm','ci','--offline','--no-audit','--fund=false'],cwd=T,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
assert not subprocess.check_output(['git','status','--porcelain'],cwd=T,text=True).strip()
x={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'candidate':HEAD,'base':BASE,'integrationMerge':merge,'parents':parents,'tree':tree('HEAD'),'candidateTree':tree(HEAD),'directory':str(T),'scope':'Actual unpushed local two-parent integration of remote-main snapshot and candidate. No remote main merge, release or product acceptance.'};(W/'main-integration-source.json').write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(x),flush=True)
