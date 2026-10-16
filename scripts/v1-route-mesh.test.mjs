import assert from 'node:assert/strict';
import {test} from 'node:test';
import {buildTrack} from '../src/game/spline.ts';
import {getTrack} from '../src/game/tracks.ts';
import {buildRoad,buildSidewalk} from '../src/game/road-geometry.ts';

function verifyBoundary(points,closed) {
 const segments=closed?points.length:points.length-1;
 const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
 const on=(a,b,p)=>Math.abs(cross(a,b,p))<=1e-9&&p.x>=Math.min(a.x,b.x)-1e-9&&p.x<=Math.max(a.x,b.x)+1e-9&&p.z>=Math.min(a.z,b.z)-1e-9&&p.z<=Math.max(a.z,b.z)+1e-9;
 const backwards=[],crossings=[];
 for(let i=0;i<segments;i++){
  const a=points[i],b=points[(i+1)%points.length];
  if((b.x-a.x)*(a.tx+b.tx)+(b.z-a.z)*(a.tz+b.tz)<=0)backwards.push(i);
  for(let j=i+2;j<segments;j++){
   if(closed&&(j+1)%points.length===i)continue;
   const c=points[j],d=points[(j+1)%points.length];
   if((cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b))crossings.push([i,j]);
  }
 }
 assert.deepEqual({backwards,crossings},{backwards:[],crossings:[]},'actual rendered boundary must advance without self-crossing, touching or overlap');
}
for(const id of ['oldjaffa','namal','hermon']) {
 const built=buildTrack(getTrack(id));
 for(const side of [-1,1])for(const kind of id==='hermon'?['asphalt']:['asphalt','outer sidewalk']){
  test(`${id}/${side}/${kind}: actual mesh boundary has no folded route segments`,()=>{
   const geometry=kind==='asphalt'?buildRoad(built):buildSidewalk(built,side);
   try{
    const attribute=geometry.getAttribute('position'),column=kind==='asphalt'?(side<0?0:1):1;
    assert.equal(attribute.count,(built.closed?built.samples.length+1:built.samples.length)*2);
    const points=built.samples.map((s,i)=>({x:attribute.getX(i*2+column),z:attribute.getZ(i*2+column),tx:s.tx,tz:s.tz}));
    if(!built.closed){const last=built.samples.at(-1);assert.equal(attribute.getX(attribute.count-2+column),Math.fround(last.x+last.rx*side*built.width/2));}
    verifyBoundary(points,built.closed);
   }finally{geometry.dispose();}
  });
 }
}
