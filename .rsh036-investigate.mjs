import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const dir='artifacts/rsh036-investigation';await mkdir(dir,{recursive:true});
const out={source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),console:[]};
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 page.on('console',m=>{if(['error','warning'].includes(m.type()))out.console.push(m.text());});
 page.on('pageerror',e=>out.console.push(String(e)));
 await page.goto('http://127.0.0.1:8080/?qa=1',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{
  const {RendererFacade}=await import('/src/rendering/RendererFacade.ts');const init=RendererFacade.init;
  RendererFacade.init=function(...args){const gfx=init.apply(this,args);window.__gfx=gfx;const draw=gfx.gl.render;gfx.gl.render=function(scene,camera){if(scene.isScene&&camera.isPerspectiveCamera){window.__scene=scene;window.__camera=camera;}return draw.call(this,scene,camera);};return gfx;};
 });
 await page.getByRole('button',{name:/בחר מסלול/}).click();const all=page.getByRole('button',{name:/^הכל$/});if(await all.count())await all.click();await page.getByRole('button',{name:/שדרות רוטשילד/}).click();await page.waitForFunction(()=>window.__controlsTest&&window.__scene,{timeout:60000});await page.waitForTimeout(1200);
 out.probe=await page.evaluate(()=>{
  const r=window.__gfx.gl,s=window.__scene,c=window.__camera,g=r.getContext();r.setAnimationLoop(null);
  const styles=[];for(let el=r.domElement;el;el=el.parentElement){const st=getComputedStyle(el);styles.push({tag:el.tagName,class:el.className,opacity:st.opacity,display:st.display,visibility:st.visibility,z:st.zIndex,width:st.width,height:st.height,filter:st.filter});}
  const shapes=[];s.traverse(o=>{if(o.isMesh&&shapes.length<20)shapes.push({name:o.name,type:o.type,material:o.material?.type,visible:o.visible,position:o.position.toArray(),scale:o.scale.toArray()});});
  const result={styles,frame:r.info.render.frame,calls:r.info.render.calls,exposure:r.toneMappingExposure,clear:r.autoClear,scene:s.toJSON().object.background,fog:s.fog?.toJSON(),camera:{position:c.position.toArray(),quaternion:c.quaternion.toArray(),projection:c.projectionMatrix.toArray(),world:c.matrixWorld.toArray(),near:c.near,far:c.far},target:r.getRenderTarget()?.width??null,scissorTest:r.getScissorTest(),viewport:Array.from(g.getParameter(g.VIEWPORT)),error:g.getError(),shapes};
  r.render(s,c);const b=new Uint8Array(4);g.readPixels(500,400,1,1,g.RGBA,g.UNSIGNED_BYTE,b);result.pixel=Array.from(b);result.actual=r.domElement.toDataURL();
  const vis=s.children.map(o=>o.visible);s.children.forEach(o=>o.visible=false);r.render(s,c);result.backgroundOnly=r.domElement.toDataURL();s.children.forEach((o,i)=>o.visible=vis[i]);
  r.setRenderTarget(null);r.setClearColor(0x2080e0,1);r.clear();result.clearOnly=r.domElement.toDataURL();return result;
 });
 for(const key of ['actual','backgroundOnly','clearOnly']){await writeFile(`${dir}/${key}.png`,Buffer.from(out.probe[key].split(',')[1],'base64'));delete out.probe[key];}
 await page.close();
}catch(e){out.error=String(e);process.exitCode=1;}finally{await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(out,null,2));console.log(JSON.stringify(out));}
