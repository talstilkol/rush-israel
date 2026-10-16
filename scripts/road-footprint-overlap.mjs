/** Independent clipping of actual rendered Float32 road triangles against mesh hulls. */
export function convexFootprint(points) {
 const unique=[...new Map(points.map(p=>[`${p[0]},${p[2]}`,p])).values()].sort((a,b)=>a[0]-b[0]||a[2]-b[2]);
 const cross=(a,b,c)=>(b[0]-a[0])*(c[2]-a[2])-(b[2]-a[2])*(c[0]-a[0]);
 const half=values=>{const out=[];for(const p of values){while(out.length>=2&&cross(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p)}return out};
 return [...half(unique).slice(0,-1),...half([...unique].reverse()).slice(0,-1)];
}
export function roadFootprintOverlap(road,footprint) {
 const hull=convexFootprint(footprint),indices=road.indices??road.positions.map((_,i)=>i),bounds=[Math.min(...hull.map(p=>p[0])),Math.max(...hull.map(p=>p[0])),Math.min(...hull.map(p=>p[2])),Math.max(...hull.map(p=>p[2]))];
 if(hull.length<3)throw Error('Actual mesh has no planar footprint');
 const minY=Math.min(...footprint.map(p=>p[1])),maxY=Math.max(...footprint.map(p=>p[1]));let area=0,triangles=0,verticalTriangles=0;
 for(let i=0;i<indices.length;i+=3){let polygon=[0,1,2].map(offset=>road.positions[indices[i+offset]]);
  if(Math.max(...polygon.map(p=>p[0]))<bounds[0]||Math.min(...polygon.map(p=>p[0]))>bounds[1]||Math.max(...polygon.map(p=>p[2]))<bounds[2]||Math.min(...polygon.map(p=>p[2]))>bounds[3])continue;
  for(let j=0;j<hull.length&&polygon.length;j++){
   const a=hull[j],b=hull[(j+1)%hull.length],distance=p=>(b[0]-a[0])*(p[2]-a[2])-(b[2]-a[2])*(p[0]-a[0]),next=[];
   for(let k=0;k<polygon.length;k++){const p=polygon[k],q=polygon[(k+1)%polygon.length],dp=distance(p),dq=distance(q);if(dp>=0)next.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);next.push(p.map((v,axis)=>v+(q[axis]-v)*t))}}
   polygon=next;
  }
  const clipped=Math.abs(polygon.reduce((sum,p,j)=>{const q=polygon[(j+1)%polygon.length];return sum+p[0]*q[2]-q[0]*p[2]},0))/2;
  if(clipped>1e-8){area+=clipped;triangles++;if(Math.min(...polygon.map(p=>p[1]))<=maxY&&Math.max(...polygon.map(p=>p[1]))>=minY)verticalTriangles++}
 }
 return{area,triangles,verticalTriangles};
}

/** Planar separation from actual road triangles,including edge-to-edge minima. */
export function roadFootprintGap(road,footprint) {
 if(roadFootprintOverlap(road,footprint).area>0)return 0;
 const hull=convexFootprint(footprint),indices=road.indices??road.positions.map((_,i)=>i);
 const distance=(p,a,b)=>{const dx=b[0]-a[0],dz=b[2]-a[2],u=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[2]-a[2])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(p[0]-a[0]-u*dx,p[2]-a[2]-u*dz)};
 let gap=Infinity;
 for(let i=0;i<indices.length;i+=3){const triangle=[0,1,2].map(offset=>road.positions[indices[i+offset]]);
  for(let j=0;j<hull.length;j++)for(let k=0;k<3;k++){const a=hull[j],b=hull[(j+1)%hull.length],p=triangle[k],q=triangle[(k+1)%3];gap=Math.min(gap,distance(a,p,q),distance(b,p,q),distance(p,a,b),distance(q,a,b))}
 }
 return gap;
}
