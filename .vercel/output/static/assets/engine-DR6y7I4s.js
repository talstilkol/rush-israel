const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/nyc-canvas-B629CVT2.js","assets/index-D8AMo2t9.js","assets/road-assets-BFdBVRVA.js","assets/nyc-landmarks-BlPC51Hy.js","assets/three.webgpu-C5y8vDrg.js"])))=>i.map(i=>d[i]);
import{c as e,d as t,f as n,i as r,l as i,n as a,o,r as s,s as c,t as l}from"./index-D8AMo2t9.js";import{$ as u,$t as d,A as f,Ai as p,An as m,Ar as h,At as g,B as _,Bi as v,Bn as y,Br as b,Bt as x,Ci as S,Cn as C,Cr as w,Dn as T,Dt as E,E as D,Ei as O,En as k,Et as A,Fi as j,Gn as M,Gr as N,Gt as P,H as F,Hr as I,In as ee,It as L,J as R,Jr as te,Jt as ne,K as re,Kr as z,Kt as B,Li as ie,Ln as ae,Lr as V,M as oe,Mi as se,Mr as ce,N as le,Ni as ue,Nn as de,O as fe,On as pe,Or as me,Ot as he,Pi as ge,Q as _e,Qr as ve,Qt as ye,Ri as be,Rr as xe,Si as Se,Sn as Ce,Sr as we,St as Te,T as Ee,V as H,Vi as De,Wn as Oe,Wt as ke,X as U,Xt as Ae,Yr as W,Yt as je,Zt as Me,_ as G,_i as Ne,_n as Pe,_t as Fe,an as Ie,at as Le,bi as K,bn as Re,ci as ze,cn as Be,ct as Ve,di as He,dt as Ue,g as We,gi as Ge,gt as Ke,h as qe,hi as Je,hn as q,ht as Ye,ii as Xe,in as Ze,it as Qe,j as $e,ji as et,jn as tt,jt as nt,kn as rt,l as it,li as at,ln as ot,lt as st,mn as ct,mt as lt,n as ut,ni as dt,nn as ft,nt as pt,o as mt,oi as ht,on as J,p as gt,pi as _t,q as vt,r as yt,ri as bt,rt as xt,s as St,sn as Ct,st as wt,t as Tt,tn as Et,ui as Dt,un as Ot,ut as kt,v as At,vi as jt,vn as Mt,w as Nt,wi as Pt,wn as Ft,wr as It,wt as Lt,xi as Rt,y as zt,yi as Bt,yn as Vt,z as Y,zi as Ht,zr as Ut,zt as Wt}from"./road-assets-BFdBVRVA.js";import{$ as Gt,A as Kt,B as qt,C as Jt,Ct as Yt,D as Xt,E as Zt,F as Qt,G as $t,H as en,I as tn,J as nn,K as rn,L as an,M as on,N as sn,O as cn,P as ln,Q as un,R as dn,S as fn,St as pn,T as mn,Tt as hn,U as gn,V as _n,W as vn,X as yn,Y as bn,Z as xn,_ as Sn,_t as Cn,a as wn,at as Tn,b as En,bt as Dn,c as On,ct as kn,d as An,dt as jn,et as Mn,f as Nn,ft as Pn,g as Fn,gt as In,h as Ln,ht as Rn,i as zn,it as Bn,j as Vn,k as Hn,l as Un,lt as Wn,m as Gn,mt as Kn,n as qn,nt as Jn,o as Yn,ot as Xn,p as Zn,pt as Qn,q as $n,r as er,rt as tr,s as nr,st as rr,tt as ir,u as ar,ut as or,v as sr,vt as cr,w as lr,wt as X,x as ur,xt as dr,y as fr,yt as pr,z as mr}from"./routes-CYhrfuMN.js";function hr(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function gr(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var _r={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new D(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},envMapRotation:{value:new Ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new D(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new K},probesMax:{value:new K},probesResolution:{value:new K}},points:{diffuse:{value:new D(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new D(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},vr={basic:{uniforms:be([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:_r.meshbasic_vert,fragmentShader:_r.meshbasic_frag},lambert:{uniforms:be([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new D(0)},envMapIntensity:{value:1}}]),vertexShader:_r.meshlambert_vert,fragmentShader:_r.meshlambert_frag},phong:{uniforms:be([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new D(0)},specular:{value:new D(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:_r.meshphong_vert,fragmentShader:_r.meshphong_frag},standard:{uniforms:be([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new D(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_r.meshphysical_vert,fragmentShader:_r.meshphysical_frag},toon:{uniforms:be([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new D(0)}}]),vertexShader:_r.meshtoon_vert,fragmentShader:_r.meshtoon_frag},matcap:{uniforms:be([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:_r.meshmatcap_vert,fragmentShader:_r.meshmatcap_frag},points:{uniforms:be([Z.points,Z.fog]),vertexShader:_r.points_vert,fragmentShader:_r.points_frag},dashed:{uniforms:be([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_r.linedashed_vert,fragmentShader:_r.linedashed_frag},depth:{uniforms:be([Z.common,Z.displacementmap]),vertexShader:_r.depth_vert,fragmentShader:_r.depth_frag},normal:{uniforms:be([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:_r.meshnormal_vert,fragmentShader:_r.meshnormal_frag},sprite:{uniforms:be([Z.sprite,Z.fog]),vertexShader:_r.sprite_vert,fragmentShader:_r.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_r.background_vert,fragmentShader:_r.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ze}},vertexShader:_r.backgroundCube_vert,fragmentShader:_r.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_r.cube_vert,fragmentShader:_r.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_r.equirect_vert,fragmentShader:_r.equirect_frag},distance:{uniforms:be([Z.common,Z.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_r.distance_vert,fragmentShader:_r.distance_frag},shadow:{uniforms:be([Z.lights,Z.fog,{color:{value:new D(0)},opacity:{value:1}}]),vertexShader:_r.shadow_vert,fragmentShader:_r.shadow_frag}};vr.physical={uniforms:be([vr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new D(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new D(0)},specularColor:{value:new D(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:_r.meshphysical_vert,fragmentShader:_r.meshphysical_frag};var yr={r:0,b:0,g:0},br=new Ie,xr=new Ze;xr.set(-1,0,0,0,1,0,0,0,1);function Sr(e,t,n,r,i,a){let o=new D(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function m(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function h(t){let r=!1,i=m(t);i===null?_(o,s):i&&i.isColor&&(_(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let i=m(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new J(new G(1,1,1),new b({name:`BackgroundCubeMaterial`,uniforms:p(vr.backgroundCube.uniforms),vertexShader:vr.backgroundCube.vertexShader,fragmentShader:vr.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(br.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(xr),l.material.toneMapped=fe.getTransfer(i.colorSpace)!==xe,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new J(new pe(2,2),new b({name:`BackgroundMaterial`,uniforms:p(vr.background.uniforms),vertexShader:vr.background.vertexShader,fragmentShader:vr.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=fe.getTransfer(i.colorSpace)!==xe,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function _(t,r){t.getRGB(yr,j(e)),n.buffers.color.setClear(yr.r,yr.g,yr.b,r,a)}function v(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,_(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,_(o,s)},render:h,addToRenderList:g,dispose:v}}function Cr(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function wr(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Tr(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(v(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&v(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),x=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),S=e.getParameter(e.MAX_SAMPLES),C=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:x,maxSamples:S,samples:C}}function Er(e){let t=this,n=null,r=0,i=!1,a=!1,o=new T,s=new Ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Dr=4,Or=[.125,.215,.35,.446,.526,.582],kr=20,Ar=256,jr=new Ft,Mr=new D,Nr=null,Pr=0,Fr=0,Ir=!1,Lr=new K,Rr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Lr}=i;Nr=this._renderer.getRenderTarget(),Pr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Ir=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gr(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wr(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Nr,Pr,Fr),this._renderer.xr.enabled=Ir,e.scissorTest=!1,Vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nr=this._renderer.getRenderTarget(),Pr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Ir=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:B,minFilter:B,generateMipmaps:!1,type:Ye,format:Oe,colorSpace:Ae,depthBuffer:!1},r=Br(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Br(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=zr(r)),this._blurMaterial=Ur(r,e,t),this._ggxMaterial=Hr(r,e,t)}return r}_compileMaterial(e){let t=new J(new zt,e);this._renderer.compile(t,jr)}_sceneToCubeUV(e,t,n,r,i){let a=new k(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Mr),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new J(new G,new Ct({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Mr),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Vr(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gr()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wr());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Vr(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,jr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Dr?n-d+Dr:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Vr(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,jr),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Vr(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,jr)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&ue(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):kr;m>kr&&v(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${kr}`);let h=[],g=0;for(let e=0;e<kr;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let y=this._sizeLods[r];Vr(t,3*y*(r>_-Dr?r-_+Dr:0),4*(this._cubeSize-y),3*y,2*y),s.setRenderTarget(t),s.render(l,jr)}};function zr(e){let t=[],n=[],r=[],i=e,a=e-Dr+1+Or.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Dr?s=Or[o-e+Dr-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new zt;h.setAttribute(`position`,new At(f,3)),h.setAttribute(`uv`,new At(p,2)),h.setAttribute(`faceIndex`,new At(m,1)),r.push(new J(h,null)),i>Dr&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function Br(e,t,n){let r=new Pt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Vr(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Hr(e,t,n){return new b({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ar,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Kr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ur(e,t,n){let r=new Float32Array(kr),i=new K(0,1,0);return new b({name:`SphericalGaussianBlur`,defines:{n:kr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Wr(){return new b({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Gr(){return new b({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Kr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var qr=class extends Pt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new le(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new G(5,5,5),i=new b({name:`CubemapFromEquirect`,uniforms:p(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new J(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=B),new $e(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Jr(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new qr(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Rr(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Rr(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Yr(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&De(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Xr(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?at:ze)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Zr(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Qr(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:ue(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function $r(e,t,n){let r=new WeakMap,i=new Rt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new H(h,p,m,u);g.type=Ve,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new Bt(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function ei(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var ti={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function ni(e,t,n,r,i,a){let o=new Pt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new R(t,n):void 0}),s=new Pt(t,n,{type:Ye,depthBuffer:!1,stencilBuffer:!1}),c=new zt;c.setAttribute(`position`,new wt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new wt([0,2,0,0,2,0],2));let l=new It({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new J(c,l),d=new Ft(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},fe.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=ti[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var ri=new dt,ii=new R(1,1),ai=new H,oi=new _,si=new le,ci=[],li=[],ui=new Float32Array(16),di=new Float32Array(9),fi=new Float32Array(4);function pi(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=ci[i];if(a===void 0&&(a=new Float32Array(i),ci[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function mi(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function hi(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function gi(e,t){let n=li[t];n===void 0&&(n=new Int32Array(t),li[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function _i(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function vi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(mi(n,t))return;e.uniform2fv(this.addr,t),hi(n,t)}}function yi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(mi(n,t))return;e.uniform3fv(this.addr,t),hi(n,t)}}function bi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(mi(n,t))return;e.uniform4fv(this.addr,t),hi(n,t)}}function xi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(mi(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),hi(n,t)}else{if(mi(n,r))return;fi.set(r),e.uniformMatrix2fv(this.addr,!1,fi),hi(n,r)}}function Si(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(mi(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),hi(n,t)}else{if(mi(n,r))return;di.set(r),e.uniformMatrix3fv(this.addr,!1,di),hi(n,r)}}function Ci(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(mi(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),hi(n,t)}else{if(mi(n,r))return;ui.set(r),e.uniformMatrix4fv(this.addr,!1,ui),hi(n,r)}}function wi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Ti(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(mi(n,t))return;e.uniform2iv(this.addr,t),hi(n,t)}}function Ei(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(mi(n,t))return;e.uniform3iv(this.addr,t),hi(n,t)}}function Di(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(mi(n,t))return;e.uniform4iv(this.addr,t),hi(n,t)}}function Oi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ki(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(mi(n,t))return;e.uniform2uiv(this.addr,t),hi(n,t)}}function Ai(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(mi(n,t))return;e.uniform3uiv(this.addr,t),hi(n,t)}}function ji(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(mi(n,t))return;e.uniform4uiv(this.addr,t),hi(n,t)}}function Mi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(ii.compareFunction=n.isReversedDepthBuffer()?518:515,a=ii):a=ri,n.setTexture2D(t||a,i)}function Ni(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||oi,i)}function Pi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||si,i)}function Fi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||ai,i)}function Ii(e){switch(e){case 5126:return _i;case 35664:return vi;case 35665:return yi;case 35666:return bi;case 35674:return xi;case 35675:return Si;case 35676:return Ci;case 5124:case 35670:return wi;case 35667:case 35671:return Ti;case 35668:case 35672:return Ei;case 35669:case 35673:return Di;case 5125:return Oi;case 36294:return ki;case 36295:return Ai;case 36296:return ji;case 35678:case 36198:case 36298:case 36306:case 35682:return Mi;case 35679:case 36299:case 36307:return Ni;case 35680:case 36300:case 36308:case 36293:return Pi;case 36289:case 36303:case 36311:case 36292:return Fi}}function Li(e,t){e.uniform1fv(this.addr,t)}function Ri(e,t){let n=pi(t,this.size,2);e.uniform2fv(this.addr,n)}function zi(e,t){let n=pi(t,this.size,3);e.uniform3fv(this.addr,n)}function Bi(e,t){let n=pi(t,this.size,4);e.uniform4fv(this.addr,n)}function Vi(e,t){let n=pi(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Hi(e,t){let n=pi(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Ui(e,t){let n=pi(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Wi(e,t){e.uniform1iv(this.addr,t)}function Gi(e,t){e.uniform2iv(this.addr,t)}function Ki(e,t){e.uniform3iv(this.addr,t)}function qi(e,t){e.uniform4iv(this.addr,t)}function Ji(e,t){e.uniform1uiv(this.addr,t)}function Yi(e,t){e.uniform2uiv(this.addr,t)}function Xi(e,t){e.uniform3uiv(this.addr,t)}function Zi(e,t){e.uniform4uiv(this.addr,t)}function Qi(e,t,n){let r=this.cache,i=t.length,a=gi(n,i);mi(r,a)||(e.uniform1iv(this.addr,a),hi(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?ii:ri;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function $i(e,t,n){let r=this.cache,i=t.length,a=gi(n,i);mi(r,a)||(e.uniform1iv(this.addr,a),hi(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||oi,a[e])}function ea(e,t,n){let r=this.cache,i=t.length,a=gi(n,i);mi(r,a)||(e.uniform1iv(this.addr,a),hi(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||si,a[e])}function ta(e,t,n){let r=this.cache,i=t.length,a=gi(n,i);mi(r,a)||(e.uniform1iv(this.addr,a),hi(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||ai,a[e])}function na(e){switch(e){case 5126:return Li;case 35664:return Ri;case 35665:return zi;case 35666:return Bi;case 35674:return Vi;case 35675:return Hi;case 35676:return Ui;case 5124:case 35670:return Wi;case 35667:case 35671:return Gi;case 35668:case 35672:return Ki;case 35669:case 35673:return qi;case 5125:return Ji;case 36294:return Yi;case 36295:return Xi;case 36296:return Zi;case 35678:case 36198:case 36298:case 36306:case 35682:return Qi;case 35679:case 36299:case 36307:return $i;case 35680:case 36300:case 36308:case 36293:return ea;case 36289:case 36303:case 36311:case 36292:return ta}}var ra=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ii(t.type)}},ia=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=na(t.type)}},aa=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},oa=/(\w+)(\])?(\[|\.)?/g;function sa(e,t){e.seq.push(t),e.map[t.id]=t}function ca(e,t,n){let r=e.name,i=r.length;for(oa.lastIndex=0;;){let a=oa.exec(r),o=oa.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){sa(n,l===void 0?new ra(s,e,t):new ia(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new aa(s),sa(n,e)),n=e}}}var la=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);ca(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function ua(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var da=37297,fa=0;function pa(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var ma=new Ze;function ha(e){fe._getMatrix(ma,fe.workingColorSpace,e);let t=`mat3( ${ma.elements.map(e=>e.toFixed(4))} )`;switch(fe.getTransfer(e)){case Me:return[t,`LinearTransferOETF`];case xe:return[t,`sRGBTransferOETF`];default:return v(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function ga(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+pa(e.getShaderSource(t),r)}return i}function _a(e,t){let n=ha(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var va={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function ya(e,t){let n=va[t];return n===void 0?(v(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var ba=new K;function xa(){return fe.getLuminanceCoefficients(ba),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${ba.x.toFixed(4)}, ${ba.y.toFixed(4)}, ${ba.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Sa(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ta).join(`
`)}function Ca(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function wa(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ta(e){return e!==``}function Ea(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Da(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Oa=/^[ \t]*#include +<([\w\d./]+)>/gm;function ka(e){return e.replace(Oa,ja)}var Aa=new Map;function ja(e,t){let n=_r[t];if(n===void 0){let e=Aa.get(t);if(e!==void 0)n=_r[e],v(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ka(n)}var Ma=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Na(e){return e.replace(Ma,Pa)}function Pa(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Fa(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Ia={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function La(e){return Ia[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ra={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function za(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Ra[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Ba={302:`ENVMAP_MODE_REFRACTION`};function Va(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ba[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Ha={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Ua(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Ha[e.combine]||`ENVMAP_BLENDING_NONE`}function Wa(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Ga(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=La(n),l=za(n),u=Va(n),d=Ua(n),f=Wa(n),p=Sa(n),m=Ca(a),h=i.createProgram(),g,_,y=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ta).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ta).join(`
`),_.length>0&&(_+=`
`)):(g=[Fa(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ta).join(`
`),_=[Fa(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:_r.tonemapping_pars_fragment,n.toneMapping===0?``:ya(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,_r.colorspace_pars_fragment,_a(`linearToOutputTexel`,n.outputColorSpace),xa(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ta).join(`
`)),o=ka(o),o=Ea(o,n),o=Da(o,n),s=ka(s),s=Ea(s,n),s=Da(s,n),o=Na(o),s=Na(s),n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let b=y+g+o,x=y+_+s,S=ua(i,i.VERTEX_SHADER,b),C=ua(i,i.FRAGMENT_SHADER,x);i.attachShader(h,S),i.attachShader(h,C),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function w(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(S)||``,a=i.getShaderInfoLog(C)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,S,C);else{let e=ga(i,S,`vertex`),n=ga(i,C,`fragment`);ue(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):v(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(S),i.deleteShader(C),T=new la(i,h),E=wa(i,h)}let T;this.getUniforms=function(){return T===void 0&&w(this),T};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let D=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(h,da)),D},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=fa++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=S,this.fragmentShader=C,this}var Ka=0,qa=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ja(e),t.set(e,n)),n}},Ja=class{constructor(e){this.id=Ka++,this.code=e,this.usedTimes=0}};function Ya(e){return e===1030||e===37490||e===36285}function Xa(e,t,n,r,i,a){let o=new L,s=new qa,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,y=h.geometry,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,x=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,S=t.get(i.envMap||b,x),C=S&&S.mapping===306?S.image.height:null,w=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&v(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let T=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,E=T===void 0?0:T.length,D=0;y.morphAttributes.position!==void 0&&(D=1),y.morphAttributes.normal!==void 0&&(D=2),y.morphAttributes.color!==void 0&&(D=3);let O,k,A,j;if(w){let e=vr[w];O=e.vertexShader,k=e.fragmentShader}else{O=i.vertexShader,k=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),A=e.id,j=t.id}let M=e.getRenderTarget(),N=e.state.buffers.depth.getReversed(),P=h.isInstancedMesh===!0,F=h.isBatchedMesh===!0,I=!!i.map,ee=!!i.matcap,L=!!S,R=!!i.aoMap,te=!!i.lightMap,ne=!!i.bumpMap&&i.wireframe===!1,re=!!i.normalMap,z=!!i.displacementMap,B=!!i.emissiveMap,ie=!!i.metalnessMap,ae=!!i.roughnessMap,V=i.anisotropy>0,oe=i.clearcoat>0,se=i.dispersion>0,ce=i.iridescence>0,le=i.sheen>0,ue=i.transmission>0,de=V&&!!i.anisotropyMap,pe=oe&&!!i.clearcoatMap,me=oe&&!!i.clearcoatNormalMap,he=oe&&!!i.clearcoatRoughnessMap,ge=ce&&!!i.iridescenceMap,_e=ce&&!!i.iridescenceThicknessMap,ve=le&&!!i.sheenColorMap,ye=le&&!!i.sheenRoughnessMap,be=!!i.specularMap,xe=!!i.specularColorMap,Se=!!i.specularIntensityMap,Ce=ue&&!!i.transmissionMap,we=ue&&!!i.thicknessMap,Te=!!i.gradientMap,Ee=!!i.alphaMap,H=i.alphaTest>0,De=!!i.alphaHash,Oe=!!i.extensions,ke=0;i.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(ke=e.toneMapping);let U={shaderID:w,shaderType:i.type,shaderName:i.name,vertexShader:O,fragmentShader:k,defines:i.defines,customVertexShaderID:A,customFragmentShaderID:j,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:F,batchingColor:F&&h._colorsTexture!==null,instancing:P,instancingColor:P&&h.instanceColor!==null,instancingMorph:P&&h.morphTexture!==null,outputColorSpace:M===null?e.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:fe.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:I,matcap:ee,envMap:L,envMapMode:L&&S.mapping,envMapCubeUVHeight:C,aoMap:R,lightMap:te,bumpMap:ne,normalMap:re,displacementMap:z,emissiveMap:B,normalMapObjectSpace:re&&i.normalMapType===1,normalMapTangentSpace:re&&i.normalMapType===0,packedNormalMap:re&&i.normalMapType===0&&Ya(i.normalMap.format),metalnessMap:ie,roughnessMap:ae,anisotropy:V,anisotropyMap:de,clearcoat:oe,clearcoatMap:pe,clearcoatNormalMap:me,clearcoatRoughnessMap:he,dispersion:se,iridescence:ce,iridescenceMap:ge,iridescenceThicknessMap:_e,sheen:le,sheenColorMap:ve,sheenRoughnessMap:ye,specularMap:be,specularColorMap:xe,specularIntensityMap:Se,transmission:ue,transmissionMap:Ce,thicknessMap:we,gradientMap:Te,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ee,alphaTest:H,alphaHash:De,combine:i.combine,mapUv:I&&m(i.map.channel),aoMapUv:R&&m(i.aoMap.channel),lightMapUv:te&&m(i.lightMap.channel),bumpMapUv:ne&&m(i.bumpMap.channel),normalMapUv:re&&m(i.normalMap.channel),displacementMapUv:z&&m(i.displacementMap.channel),emissiveMapUv:B&&m(i.emissiveMap.channel),metalnessMapUv:ie&&m(i.metalnessMap.channel),roughnessMapUv:ae&&m(i.roughnessMap.channel),anisotropyMapUv:de&&m(i.anisotropyMap.channel),clearcoatMapUv:pe&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:ye&&m(i.sheenRoughnessMap.channel),specularMapUv:be&&m(i.specularMap.channel),specularColorMapUv:xe&&m(i.specularColorMap.channel),specularIntensityMapUv:Se&&m(i.specularIntensityMap.channel),transmissionMapUv:Ce&&m(i.transmissionMap.channel),thicknessMapUv:we&&m(i.thicknessMap.channel),alphaMapUv:Ee&&m(i.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(re||V),vertexNormals:!!y.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!y.attributes.uv&&(I||Ee),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||y.attributes.normal===void 0&&re===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:N,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:y.attributes.position!==void 0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:E,morphTextureStride:D,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:ke,decodeVideoTexture:I&&i.map.isVideoTexture===!0&&fe.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:B&&i.emissiveMap.isVideoTexture===!0&&fe.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Oe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Oe&&i.extensions.multiDraw===!0||F)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return U.vertexUv1s=c.has(1),U.vertexUv2s=c.has(2),U.vertexUv3s=c.has(3),c.clear(),U}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function b(e){let t=p[e.type],n;if(t){let e=vr[t];n=Dt.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r=u.get(n);return r===void 0?(r=new Ga(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function S(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function C(e){s.remove(e)}function w(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:l,dispose:w}}function Za(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Qa(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function $a(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function eo(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Qa),r.length>1&&r.sort(t||$a),i.length>1&&i.sort(t||$a),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function to(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new eo,e.set(t,[i])):n>=r.length?(i=new eo,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function no(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new K,color:new D};break;case`SpotLight`:n={position:new K,direction:new K,color:new D,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new D,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new D,groundColor:new D};break;case`RectAreaLight`:n={color:new D,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function ro(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var io=0;function ao(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function oo(e){let t=new no,n=ro(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new Ie,o=new Ie;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(ao);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=io++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function so(e){let t=new oo(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function co(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new so(e),t.set(n,[a])):r>=i.length?(a=new so(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var lo=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uo=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,fo=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],po=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],mo=new Ie,ho=new K,go=new K;function _o(e,t,n){let r=new Ue,i=new Bt,a=new Bt,o=new Rt,s=new Be,c=new ot,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new b({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:lo,fragmentShader:uo}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new zt;m.setAttribute(`position`,new At(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new J(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(v(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){v(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){v(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Pt(i.x,i.y,{format:we,type:Ye,minFilter:B,magFilter:B,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new R(i.x,i.y,Ve),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=re,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Mt,d.map.depthTexture.magFilter=Mt}else l.isPointLight?(d.map=new qr(i.x),d.map.depthTexture=new oe(i.x,Je)):(d.map=new Pt(i.x,i.y),d.map.depthTexture=new R(i.x,i.y,Je)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=re,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=B,d.map.depthTexture.magFilter=B):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Mt,d.map.depthTexture.magFilter=Mt);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),ho.setFromMatrixPosition(l.matrixWorld),e.position.copy(ho),go.copy(e.position),go.add(fo[t]),e.up.copy(po[t]),e.lookAt(go),e.updateMatrixWorld(),n.makeTranslation(-ho.x,-ho.y,-ho.z),mo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(mo,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),S(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&y(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function y(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Pt(i.x,i.y,{format:we,type:Ye})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function x(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,C)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function S(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=x(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=x(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)S(c[e],i,a,o,s)}function C(e){e.target.removeEventListener(`dispose`,C);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function vo(e,t){function n(){let t=!1,n=new Rt,r=null,i=new Rt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ie(e.DEPTH_TEST):ae(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ce[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ie(e.STENCIL_TEST):ae(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new D(0,0,0),T=0,E=!1,O=null,k=null,A=null,j=null,M=null,N=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),P=!1,F=0,I=e.getParameter(e.VERSION);I.indexOf(`WebGL`)===-1?I.indexOf(`OpenGL ES`)!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),P=F>=2):(F=parseFloat(/^WebGL (\d)/.exec(I)[1]),P=F>=1);let ee=null,L={},R=e.getParameter(e.SCISSOR_BOX),te=e.getParameter(e.VIEWPORT),ne=new Rt().fromArray(R),re=new Rt().fromArray(te);function z(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let B={};B[e.TEXTURE_2D]=z(e.TEXTURE_2D,e.TEXTURE_2D,1),B[e.TEXTURE_CUBE_MAP]=z(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[e.TEXTURE_2D_ARRAY]=z(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),B[e.TEXTURE_3D]=z(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ie(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),ie(e.CULL_FACE),fe(0);function ie(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ae(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function V(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function oe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function se(t){return h!==t&&(e.useProgram(t),h=t,!0)}let le={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};le[103]=e.MIN,le[104]=e.MAX;let de={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function fe(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ae(e.BLEND),g=!1);return}if(g===!1&&(ie(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:ue(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:ue(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:ue(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:ue(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(le[n],le[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(de[r],de[i],de[o],de[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function pe(t,n){t.side===2?ae(e.CULL_FACE):ie(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?fe(0):fe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),_e(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ie(e.SAMPLE_ALPHA_TO_COVERAGE):ae(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){O!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),O=t)}function he(t){t===0?ae(e.CULL_FACE):(ie(e.CULL_FACE),t!==k&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),k=t}function ge(t){t!==A&&(P&&e.lineWidth(t),A=t)}function _e(t,n,r){t?(ie(e.POLYGON_OFFSET_FILL),(j!==n||M!==r)&&(j=n,M=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ae(e.POLYGON_OFFSET_FILL)}function ve(t){t?ie(e.SCISSOR_TEST):ae(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+N-1),ee!==t&&(e.activeTexture(t),ee=t)}function be(t,n,r){r===void 0&&(r=ee===null?e.TEXTURE0+N-1:ee);let i=L[r];i===void 0&&(i={type:void 0,texture:void 0},L[r]=i),(i.type!==t||i.texture!==n)&&(ee!==r&&(e.activeTexture(r),ee=r),e.bindTexture(t,n||B[t]),i.type=t,i.texture=n)}function xe(){let t=L[ee];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function H(){try{e.compressedTexSubImage3D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function De(){try{e.texStorage2D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function Oe(){try{e.texStorage3D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function ke(){try{e.texImage2D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function U(){try{e.texImage3D(...arguments)}catch(e){ue(`WebGLState:`,e)}}function Ae(t){return d[t]===void 0?e.getParameter(t):d[t]}function W(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function je(t){ne.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ne.copy(t))}function Me(t){re.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),re.copy(t))}function G(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ne(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ee=null,L={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new D(0,0,0),T=0,E=!1,O=null,k=null,A=null,j=null,M=null,ne.set(0,0,e.canvas.width,e.canvas.height),re.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ie,disable:ae,bindFramebuffer:V,drawBuffers:oe,useProgram:se,setBlending:fe,setMaterial:pe,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:_e,setScissorTest:ve,activeTexture:ye,bindTexture:be,unbindTexture:xe,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:ke,texImage3D:U,pixelStorei:W,getParameter:Ae,updateUBOMapping:G,uniformBlockBinding:Ne,texStorage2D:De,texStorage3D:Oe,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:H,scissor:je,viewport:Me,reset:Pe}}function yo(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Bt,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function g(e,t){return m?new OffscreenCanvas(e,t):se(`canvas`)}function _(e,t,n){let r=1,i=De(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=g(n,a));let o=t?g(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),v(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&v(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];v(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||v(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Me:fe.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,v(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=e.target;t.removeEventListener(`dispose`,T),D(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function E(e){let t=e.target;t.removeEventListener(`dispose`,E),k(t)}function D(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&O(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function O(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function k(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let A=0;function j(){A=0}function M(){return A}function N(e){A=e}function P(){let e=A;return e>=i.maxTextures&&v(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),A+=1,e}function F(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function I(t,i){let a=r.get(t);if(t.isVideoTexture&&Te(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)v(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)v(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ce(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ce(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function L(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ce(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function R(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){le(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let te={[h]:e.REPEAT,[Ee]:e.CLAMP_TO_EDGE,[Pe]:e.MIRRORED_REPEAT},re={[Mt]:e.NEAREST,[Re]:e.NEAREST_MIPMAP_NEAREST,[Vt]:e.NEAREST_MIPMAP_LINEAR,[B]:e.LINEAR,[je]:e.LINEAR_MIPMAP_NEAREST,[ne]:e.LINEAR_MIPMAP_LINEAR},z={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ie(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&v(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,te[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,te[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,te[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,re[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,re[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,z[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ae(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,T));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=F(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&O(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function V(e,t,n){return Math.floor(Math.floor(e/n)/t)}function oe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=V(n.start,r.width,4),c=V(t.start,r.width,4);n.start<=i+1&&a===c&&V(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ce(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ae(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=fe.getPrimaries(fe.workingColorSpace),r=o.colorSpace===``?null:fe.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=_(o.image,!1,i.maxTextureSize);t=H(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);ie(c,o);let h,g=o.mipmaps,x=o.isVideoTexture!==!0,T=f.__version===void 0||l===!0,E=u.dataReady,D=w(o,t);if(o.isDepthTexture)m=C(o.format===vt,o.type),T&&(x?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){x&&T&&n.texStorage2D(e.TEXTURE_2D,D,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],x?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else x?(T&&n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height),E&&oe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){x&&T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(x){if(E){if(o.layerUpdates.size>0){let t=ge(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else v(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else x?E&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{x&&T&&n.texStorage2D(e.TEXTURE_2D,D,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?x?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?v(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):x?E&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(x){if(T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,m,t.width,t.height,t.depth),E){if(o.layerUpdates.size>0){let i=ge(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)x?(T&&n.texStorage3D(e.TEXTURE_3D,D,m,t.width,t.height,t.depth),E&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(T){if(x)n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<D;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(x&&T){let t=De(g[0]);n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],x?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(x){if(T){let r=De(t);n.texStorage2D(e.TEXTURE_2D,D,m,r.width,r.height)}E&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function le(t,o,s){if(o.image.length!==6)return;let c=ae(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=fe.getPrimaries(fe.workingColorSpace),r=o.colorSpace===``?null:fe.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=_(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=H(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=S(o.internalFormat,g,x,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);ie(e.TEXTURE_CUBE_MAP,o);let k;if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,C,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,g,x,i.data):g===null?v(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=De(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,g,x,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,g,x,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,g,x,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,g,x,i.image[t])}}}y(o)&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function de(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),we(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ce(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function pe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;we(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);we(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function me(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,T)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ie(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else I(i.depthTexture,0);let u=l.__webglTexture,d=Ce(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)we(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)we(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function he(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)me(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?me(i.__webglFramebuffer[0],t,0):me(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),pe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),pe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,i){let a=r.get(t);n!==void 0&&de(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&he(t)}function ve(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,E);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&we(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ce(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),pe(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ie(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)de(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else de(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)&&b(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ie(c,a),de(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ie(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)de(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else de(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)&&b(r),n.unbindTexture()}t.depthBuffer&&he(t)}function ye(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let be=[],xe=[];function Se(t){if(t.samples>0){if(we(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(be.length=0,xe.length=0,be.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(be.push(l),xe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,xe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,be))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ce(e){return Math.min(i.maxSamples,e.samples)}function we(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Te(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function H(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(fe.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&v(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):ue(`WebGLTextures: Unsupported texture color space:`,n)),t}function De(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=P,this.resetTextureUnits=j,this.getTextureUnits=M,this.setTextureUnits=N,this.setTexture2D=I,this.setTexture2DArray=ee,this.setTexture3D=L,this.setTextureCube=R,this.rebindTextures=_e,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=de,this.useMultisampledRTT=we,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function bo(e,t){function n(n,r=``){let i,a=fe.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var xo=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,So=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Co=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xt(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new b({vertexShader:xo,fragmentShader:So,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new J(new pe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},wo=class extends pt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Co,g={},_=t.getContextAttributes(),b=null,x=null,S=[],C=[],w=new Bt,T=null,E=new k;E.viewport=new Rt;let D=new k;D.viewport=new Rt;let A=[E,D],j=new it,M=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new O,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new O,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new O,S[e]=t),t.getHandSpace()};function P(e){let t=C.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function F(){r.removeEventListener(`select`,P),r.removeEventListener(`selectstart`,P),r.removeEventListener(`selectend`,P),r.removeEventListener(`squeeze`,P),r.removeEventListener(`squeezestart`,P),r.removeEventListener(`squeezeend`,P),r.removeEventListener(`end`,F),r.removeEventListener(`inputsourceschange`,I);for(let e=0;e<S.length;e++){let t=C[e];t!==null&&(C[e]=null,S[e].disconnect(t))}M=null,N=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(b),f=null,d=null,u=null,r=null,x=null,ae.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&v(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&v(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,P),r.addEventListener(`selectstart`,P),r.addEventListener(`selectend`,P),r.addEventListener(`squeeze`,P),r.addEventListener(`squeezestart`,P),r.addEventListener(`squeezeend`,P),r.addEventListener(`end`,F),r.addEventListener(`inputsourceschange`,I),_.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(w),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?vt:re,a=_.stencil?_t:Je);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Pt(d.textureWidth,d.textureHeight,{format:Oe,type:He,depthTexture:new R(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Pt(f.framebufferWidth,f.framebufferHeight,{format:Oe,type:He,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ae.setContext(r),ae.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function I(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=C.indexOf(n);r>=0&&(C[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=C.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=C.length){C.push(n),r=e;break}else if(C[e]===null){C[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let ee=new K,L=new K;function te(e,t,n){ee.setFromMatrixPosition(t.matrixWorld),L.setFromMatrixPosition(n.matrixWorld);let r=ee.distanceTo(L),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ne(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),j.near=D.near=E.near=t,j.far=D.far=E.far=n,(M!==j.near||N!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),M=j.near,N=j.far),j.layers.mask=e.layers.mask|6,E.layers.mask=j.layers.mask&-5,D.layers.mask=j.layers.mask&-3;let i=e.parent,a=j.cameras;ne(j,i);for(let e=0;e<a.length;e++)ne(a[e],i);a.length===2?te(j,E,D):j.projectionMatrix.copy(E.projectionMatrix),z(e,j,i)};function z(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=y*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(j)},this.getCameraTexture=function(e){return g[e]};let B=null;function ie(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=A[n];o===void 0&&(o=new k,o.layers.enable(n),o.viewport=new Rt,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new xt,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=C[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}B&&B(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ae=new hr;ae.setAnimationLoop(ie),this.setAnimationLoop=function(e){B=e},this.dispose=function(){}}},To=new Ie,Eo=new Ze;Eo.set(-1,0,0,0,1,0,0,0,1);function Do(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,j(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(To.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Eo),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Oo(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,y));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return ue(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?v(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):v(`WebGLRenderer: Unsupported uniform value type.`,e),t}function y(t){let n=t.target;n.removeEventListener(`dispose`,y);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function b(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:b}}var ko=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ao=null;function jo(){return Ao===null&&(Ao=new F(ko,16,16,we,Ye),Ao.name=`DFG_LUT`,Ao.minFilter=B,Ao.magFilter=B,Ao.wrapS=Ee,Ao.wrapT=Ee,Ao.generateMipmaps=!1,Ao.needsUpdate=!0),Ao}var Mo=class{constructor(e={}){let{canvas:t=et(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=He}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([M,w,me]),g=new Set([He,Je,jt,_t,Ge,Ne]),_=new Uint32Array(4),y=new Int32Array(4),b=new K,x=null,C=null,T=[],E=[],O=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let k=this,A=!1,j=null,N=null,P=null,F=null;this._outputColorSpace=V;let I=0,ee=0,L=null,R=-1,te=null,re=new Rt,z=new Rt,B=null,ae=new D(0),oe=0,se=t.width,ce=t.height,le=1,de=null,pe=null,he=new Rt(0,0,se,ce),ge=new Rt(0,0,se,ce),_e=!1,ve=new Ue,ye=!1,be=!1,xe=new Ie,Se=new K,Ce=new Rt,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Te=!1;function Ee(){return L===null?le:1}let H=n;function De(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,rt,!1),t.addEventListener(`webglcontextrestored`,it,!1),t.addEventListener(`webglcontextcreationerror`,at,!1),H===null){let t=`webgl2`;if(H=De(t,e),H===null)throw De(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw ue(`WebGLRenderer: `+e.message),e}let Oe,ke,U,Ae,W,je,Me,G,Pe,Fe,Le,Re,ze,Be,Ve,We,Ke,qe,q,Xe,Ze,Qe,$e;function tt(){Oe=new Yr(H),Oe.init(),Ze=new bo(H,Oe),ke=new Tr(H,Oe,e,Ze),U=new vo(H,Oe),ke.reversedDepthBuffer&&d&&U.buffers.depth.setReversed(!0),N=H.createFramebuffer(),P=H.createFramebuffer(),F=H.createFramebuffer(),Ae=new Qr(H),W=new Za,je=new yo(H,Oe,U,W,ke,Ze,Ae),Me=new Jr(k),G=new gr(H),Qe=new Cr(H,G),Pe=new Xr(H,G,Ae,Qe),Fe=new ei(H,Pe,G,Qe,Ae),qe=new $r(H,ke,je),Ve=new Er(W),Le=new Xa(k,Me,Oe,ke,Qe,Ve),Re=new Do(k,W),ze=new to,Be=new co(Oe),Ke=new Sr(k,Me,U,Fe,p,s),We=new _o(k,Fe,ke),$e=new Oo(H,Ae,ke,U),q=new wr(H,Oe,Ae),Xe=new Zr(H,Oe,Ae),Ae.programs=Le.programs,k.capabilities=ke,k.extensions=Oe,k.properties=W,k.renderLists=ze,k.shadowMap=We,k.state=U,k.info=Ae}tt(),m!==1009&&(O=new ni(m,t.width,t.height,o,r,i));let nt=new wo(k,H);this.xr=nt,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return le},this.setPixelRatio=function(e){e!==void 0&&(le=e,this.setSize(se,ce,!1))},this.getSize=function(e){return e.set(se,ce)},this.setSize=function(e,n,r=!0){if(nt.isPresenting){v(`WebGLRenderer: Can't change size while VR device is presenting.`);return}se=e,ce=n,t.width=Math.floor(e*le),t.height=Math.floor(n*le),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(se*le,ce*le).floor()},this.setDrawingBufferSize=function(e,n,r){se=e,ce=n,le=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){ue(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){v(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}O.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(re)},this.getViewport=function(e){return e.copy(he)},this.setViewport=function(e,t,n,r){e.isVector4?he.set(e.x,e.y,e.z,e.w):he.set(e,t,n,r),U.viewport(re.copy(he).multiplyScalar(le).round())},this.getScissor=function(e){return e.copy(ge)},this.setScissor=function(e,t,n,r){e.isVector4?ge.set(e.x,e.y,e.z,e.w):ge.set(e,t,n,r),U.scissor(z.copy(ge).multiplyScalar(le).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(e){U.setScissorTest(_e=e)},this.setOpaqueSort=function(e){de=e},this.setTransparentSort=function(e){pe=e},this.getClearColor=function(e){return e.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(L!==null){let t=L.texture.format;e=h.has(t)}if(e){let e=L.texture.type,t=g.has(e),n=Ke.getClearColor(),r=Ke.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,H.clearBufferuiv(H.COLOR,0,_)):(y[0]=i,y[1]=a,y[2]=o,y[3]=r,H.clearBufferiv(H.COLOR,0,y))}else r|=H.COLOR_BUFFER_BIT}t&&(r|=H.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&H.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),j=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,rt,!1),t.removeEventListener(`webglcontextrestored`,it,!1),t.removeEventListener(`webglcontextcreationerror`,at,!1),Ke.dispose(),ze.dispose(),Be.dispose(),W.dispose(),Me.dispose(),Fe.dispose(),Qe.dispose(),$e.dispose(),Le.dispose(),nt.dispose(),nt.removeEventListener(`sessionstart`,ft),nt.removeEventListener(`sessionend`,pt),mt.stop()};function rt(e){e.preventDefault(),ie(`WebGLRenderer: Context Lost.`),A=!0}function it(){ie(`WebGLRenderer: Context Restored.`),A=!1;let e=Ae.autoReset,t=We.enabled,n=We.autoUpdate,r=We.needsUpdate,i=We.type;tt(),Ae.autoReset=e,We.enabled=t,We.autoUpdate=n,We.needsUpdate=r,We.type=i}function at(e){ue(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ot(e){let t=e.target;t.removeEventListener(`dispose`,ot),st(t)}function st(e){ct(e),W.remove(e)}function ct(e){let t=W.get(e).programs;t!==void 0&&(t.forEach(function(e){Le.releaseProgram(e)}),e.isShaderMaterial&&Le.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=we);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=wt(e,t,n,r,i);U.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Pe.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Qe.setup(i,r,s,n,c);let h,g=q;if(c!==null&&(h=G.get(c),g=Xe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(U.setLineWidth(r.wireframeLinewidth*Ee()),g.setMode(H.LINES)):g.setMode(H.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),U.setLineWidth(e*Ee()),i.isLineSegments?g.setMode(H.LINES):i.isLineLoop?g.setMode(H.LINE_LOOP):g.setMode(H.LINE_STRIP)}else i.isPoints?g.setMode(H.POINTS):i.isSprite&&g.setMode(H.TRIANGLES);if(i.isBatchedMesh){if(Oe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?G.get(c).bytesPerElement:1,o=W.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(H,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function lt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,bt(e,t,n),e.side=0,e.needsUpdate=!0,bt(e,t,n),e.side=2):bt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),C=Be.get(n),C.init(t),E.push(C),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(C.pushLight(e),e.castShadow&&C.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(C.pushLight(e),e.castShadow&&C.pushShadow(e))}),C.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];lt(a,n,e),r.add(a)}else lt(t,n,e),r.add(t)}}),C=E.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){W.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Oe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ut=null;function dt(e){ut&&ut(e)}function ft(){mt.stop()}function pt(){mt.start()}let mt=new hr;mt.setAnimationLoop(dt),typeof self<`u`&&mt.setContext(self),this.setAnimationLoop=function(e){ut=e,nt.setAnimationLoop(e),e===null?mt.stop():mt.start()},nt.addEventListener(`sessionstart`,ft),nt.addEventListener(`sessionend`,pt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){ue(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(A===!0)return;j!==null&&j.renderStart(e,t);let n=nt.enabled===!0&&nt.isPresenting===!0,r=O!==null&&(L===null||n)&&O.begin(k,L);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(t),t=nt.getCamera()),e.isScene===!0&&e.onBeforeRender(k,e,t,L),C=Be.get(e,E.length),C.init(t),C.state.textureUnits=je.getTextureUnits(),E.push(C),xe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ve.setFromProjectionMatrix(xe,S,t.reversedDepth),be=this.localClippingEnabled,ye=Ve.init(this.clippingPlanes,be),x=ze.get(e,T.length),x.init(),T.push(x),nt.enabled===!0&&nt.isPresenting===!0){let e=k.xr.getDepthSensingMesh();e!==null&&ht(e,t,-1/0,k.sortObjects)}ht(e,t,0,k.sortObjects),x.finish(),k.sortObjects===!0&&x.sort(de,pe,t.reversedDepth),Te=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,Te&&Ke.addToRenderList(x,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ye===!0&&Ve.beginShadows();let i=C.state.shadowsArray;if(We.render(i,e,t),ye===!0&&Ve.endShadows(),(r&&O.hasRenderPass())===!1){let n=x.opaque,r=x.transmissive;if(C.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];gt(n,r,e,a)}Te&&Ke.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];J(x,e,n,n.viewport)}}else r.length>0&&gt(n,r,e,t),Te&&Ke.render(e),J(x,e,t)}L!==null&&ee===0&&(je.updateMultisampleRenderTarget(L),je.updateRenderTargetMipmap(L)),r&&O.end(k),e.isScene===!0&&e.onAfterRender(k,e,t),Qe.resetDefaultState(),R=-1,te=null,E.pop(),E.length>0?(C=E[E.length-1],je.setTextureUnits(C.state.textureUnits),ye===!0&&Ve.setGlobalState(k.clippingPlanes,C.state.camera)):C=null,T.pop(),x=T.length>0?T[T.length-1]:null,j!==null&&j.renderEnd()};function ht(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)C.pushLightProbeGrid(e);else if(e.isLight)C.pushLight(e),e.castShadow&&C.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ve.intersectsSprite(e)){r&&Ce.setFromMatrixPosition(e.matrixWorld).applyMatrix4(xe);let t=Fe.update(e),i=e.material;i.visible&&x.push(e,t,i,n,Ce.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||ve.intersectsObject(e))){let t=Fe.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Ce.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ce.copy(e.boundingSphere.center)),Ce.applyMatrix4(e.matrixWorld).applyMatrix4(xe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&x.push(e,t,s,n,Ce.z,o)}}else i.visible&&x.push(e,t,i,n,Ce.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ht(i[e],t,n,r)}function J(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;C.setupLightsView(n),ye===!0&&Ve.setGlobalState(k.clippingPlanes,n),r&&U.viewport(re.copy(r)),i.length>0&&vt(i,t,n),a.length>0&&vt(a,t,n),o.length>0&&vt(o,t,n),U.buffers.depth.setTest(!0),U.buffers.depth.setMask(!0),U.buffers.color.setMask(!0),U.setPolygonOffset(!1)}function gt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(C.state.transmissionRenderTarget[r.id]===void 0){let e=Oe.has(`EXT_color_buffer_half_float`)||Oe.has(`EXT_color_buffer_float`);C.state.transmissionRenderTarget[r.id]=new Pt(1,1,{generateMipmaps:!0,type:e?Ye:He,minFilter:ne,samples:Math.max(4,ke.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:fe.workingColorSpace})}let a=C.state.transmissionRenderTarget[r.id],o=r.viewport||re;a.setSize(o.z*k.transmissionResolutionScale,o.w*k.transmissionResolutionScale);let s=k.getRenderTarget(),c=k.getActiveCubeFace(),l=k.getActiveMipmapLevel();k.setRenderTarget(a),k.getClearColor(ae),oe=k.getClearAlpha(),oe<1&&k.setClearColor(16777215,.5),k.clear(),Te&&Ke.render(n);let u=k.toneMapping;k.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),C.setupLightsView(r),ye===!0&&Ve.setGlobalState(k.clippingPlanes,r),vt(e,n,r),je.updateMultisampleRenderTarget(a),je.updateRenderTargetMipmap(a),Oe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,yt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(je.updateMultisampleRenderTarget(a),je.updateRenderTargetMipmap(a))}k.setRenderTarget(s,c,l),k.setClearColor(ae,oe),d!==void 0&&(r.viewport=d),k.toneMapping=u}function vt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&yt(o,t,n,s,l,c)}}function yt(e,t,n,r,i,a){e.onBeforeRender(k,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(k,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=2):k.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(k,t,n,r,i,a)}function bt(e,t,n){t.isScene!==!0&&(t=we);let r=W.get(e),i=C.state.lights,a=C.state.shadowsArray,o=i.state.version,s=Le.getParameters(e,i.state,a,t,n,C.state.lightProbeGridArray),c=Le.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Me.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ot),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return St(e,s),d}else s.uniforms=Le.getUniforms(e),j!==null&&e.isNodeMaterial&&j.build(e,n,s),e.onBeforeCompile(s,k),d=Le.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ve.uniform),St(e,s),r.needsLights=Et(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=C.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function xt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=la.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function St(e,t){let n=W.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ct(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];b.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(b))return n}return null}function wt(e,t,n,r,i){t.isScene!==!0&&(t=we),je.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=L===null?k.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:fe.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Me.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(h=k.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=W.get(r),y=C.state.lights;if(ye===!0&&(be===!0||e!==te)){let t=e===te&&r.id===R;Ve.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ve.numPlanes||v.numIntersection!==Ve.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=C.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=bt(r,t,i),j&&r.isNodeMaterial&&j.onUpdateProgram(r,x,v));let S=!1,w=!1,T=!1,E=x.getUniforms(),D=v.uniforms;if(U.useProgram(x.program)&&(S=!0,w=!0,T=!0),r.id!==R&&(R=r.id,w=!0),v.needsLights){let e=Ct(C.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(S||te!==e){U.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(H,`projectionMatrix`,e.projectionMatrix),E.setValue(H,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(H,Se.setFromMatrixPosition(e.matrixWorld)),ke.logarithmicDepthBuffer&&E.setValue(H,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(H,`isOrthographic`,e.isOrthographicCamera===!0),te!==e&&(te=e,w=!0,T=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&E.setValue(H,`directionalShadowMap`,y.state.directionalShadowMap,je),y.state.spotShadowMap.length>0&&E.setValue(H,`spotShadowMap`,y.state.spotShadowMap,je),y.state.pointShadowMap.length>0&&E.setValue(H,`pointShadowMap`,y.state.pointShadowMap,je)),i.isSkinnedMesh){E.setOptional(H,i,`bindMatrix`),E.setOptional(H,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(H,`boneTexture`,e.boneTexture,je))}i.isBatchedMesh&&(E.setOptional(H,i,`batchingTexture`),E.setValue(H,`batchingTexture`,i._matricesTexture,je),E.setOptional(H,i,`batchingIdTexture`),E.setValue(H,`batchingIdTexture`,i._indirectTexture,je),E.setOptional(H,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(H,`batchingColorTexture`,i._colorsTexture,je));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&qe.update(i,n,x),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(H,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=jo()),w){if(E.setValue(H,`toneMappingExposure`,k.toneMappingExposure),v.needsLights&&Tt(D,T),a&&r.fog===!0&&Re.refreshFogUniforms(D,a),Re.refreshMaterialUniforms(D,r,le,ce,C.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}la.upload(H,xt(v),D,je)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(la.upload(H,xt(v),D,je),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(H,`center`,i.center),E.setValue(H,`modelViewMatrix`,i.modelViewMatrix),E.setValue(H,`normalMatrix`,i.normalMatrix),E.setValue(H,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];$e.update(n,x),$e.bind(n,x)}}return x}function Tt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Et(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(e,t,n){let r=W.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),W.get(e.texture).__webglTexture=t,W.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=W.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){L=e,I=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=W.get(e);if(o.__useDefaultFramebuffer!==void 0){U.bindFramebuffer(H.FRAMEBUFFER,o.__webglFramebuffer),re.copy(e.viewport),z.copy(e.scissor),B=e.scissorTest,U.viewport(re),U.scissor(z),U.setScissorTest(B),R=-1;return}if(o.__webglFramebuffer===void 0)je.setupRenderTarget(e);else if(o.__hasExternalTextures)je.rebindTextures(e,W.get(e.texture).__webglTexture,W.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&W.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);je.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=W.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&je.useMultisampledRTT(e)===!1?W.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,re.copy(e.viewport),z.copy(e.scissor),B=e.scissorTest}else re.copy(he).multiplyScalar(le).floor(),z.copy(ge).multiplyScalar(le).floor(),B=_e;if(n!==0&&(r=N),U.bindFramebuffer(H.FRAMEBUFFER,r)&&U.drawBuffers(e,r),U.viewport(re),U.scissor(z),U.setScissorTest(B),i){let r=W.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=W.get(e.textures[t]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=W.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,t.__webglTexture,n)}R=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){ue(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=W.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){U.bindFramebuffer(H.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s),!ke.textureFormatReadable(c)){ue(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!ke.textureTypeReadable(l)){ue(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&H.readPixels(t,n,r,i,Ze.convert(c),Ze.convert(l),a)}finally{let e=L===null?null:W.get(L).__webglFramebuffer;U.bindFramebuffer(H.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=W.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){U.bindFramebuffer(H.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s),!ke.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!ke.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,d),H.bufferData(H.PIXEL_PACK_BUFFER,a.byteLength,H.STREAM_READ),H.readPixels(t,n,r,i,Ze.convert(l),Ze.convert(u),0);let f=L===null?null:W.get(L).__webglFramebuffer;U.bindFramebuffer(H.FRAMEBUFFER,f);let p=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Ht(H,p,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,d),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,a),H.deleteBuffer(d),H.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;je.setTexture2D(e,0),H.copyTexSubImage2D(H.TEXTURE_2D,n,0,0,o,s,i,a),U.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ze.convert(t.format),_=Ze.convert(t.type),v;t.isData3DTexture?(je.setTexture3D(t,0),v=H.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(je.setTexture2DArray(t,0),v=H.TEXTURE_2D_ARRAY):(je.setTexture2D(t,0),v=H.TEXTURE_2D),U.activeTexture(H.TEXTURE0),U.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,t.flipY),U.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),U.pixelStorei(H.UNPACK_ALIGNMENT,t.unpackAlignment);let y=U.getParameter(H.UNPACK_ROW_LENGTH),b=U.getParameter(H.UNPACK_IMAGE_HEIGHT),x=U.getParameter(H.UNPACK_SKIP_PIXELS),S=U.getParameter(H.UNPACK_SKIP_ROWS),C=U.getParameter(H.UNPACK_SKIP_IMAGES);U.pixelStorei(H.UNPACK_ROW_LENGTH,h.width),U.pixelStorei(H.UNPACK_IMAGE_HEIGHT,h.height),U.pixelStorei(H.UNPACK_SKIP_PIXELS,l),U.pixelStorei(H.UNPACK_SKIP_ROWS,u),U.pixelStorei(H.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=W.get(e),r=W.get(t),h=W.get(n.__renderTarget),g=W.get(r.__renderTarget);U.bindFramebuffer(H.READ_FRAMEBUFFER,h.__webglFramebuffer),U.bindFramebuffer(H.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,W.get(e).__webglTexture,i,d+n),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,W.get(t).__webglTexture,a,m+n)),H.blitFramebuffer(l,u,o,s,f,p,o,s,H.DEPTH_BUFFER_BIT,H.NEAREST);U.bindFramebuffer(H.READ_FRAMEBUFFER,null),U.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||W.has(e)){let n=W.get(e),r=W.get(t);U.bindFramebuffer(H.READ_FRAMEBUFFER,P),U.bindFramebuffer(H.DRAW_FRAMEBUFFER,F);for(let e=0;e<c;e++)w?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,n.__webglTexture,i),T?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,r.__webglTexture,a),i===0?T?H.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):H.copyTexSubImage2D(v,a,f,p,l,u,o,s):H.blitFramebuffer(l,u,o,s,f,p,o,s,H.COLOR_BUFFER_BIT,H.NEAREST);U.bindFramebuffer(H.READ_FRAMEBUFFER,null),U.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?H.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h);U.pixelStorei(H.UNPACK_ROW_LENGTH,y),U.pixelStorei(H.UNPACK_IMAGE_HEIGHT,b),U.pixelStorei(H.UNPACK_SKIP_PIXELS,x),U.pixelStorei(H.UNPACK_SKIP_ROWS,S),U.pixelStorei(H.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&H.generateMipmap(v),U.unbindTexture()},this.initRenderTarget=function(e){W.get(e).__webglFramebuffer===void 0&&je.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?je.setTextureCube(e,0):e.isData3DTexture?je.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?je.setTexture2DArray(e,0):je.setTexture2D(e,0),U.unbindTexture()},this.resetState=function(){I=0,ee=0,L=null,U.reset(),Qe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return S}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=fe._getDrawingBufferColorSpace(e),t.unpackColorSpace=fe._getUnpackColorSpace()}},No=[{id:0,he:`פאלס 101`,en:`Pulse 101`},{id:1,he:`גל ים`,en:`Yam FM`},{id:2,he:`המחתרת`,en:`Underground`},{id:3,he:`לילה לבן`,en:`White Night`}];function Po(e){return 440*2**((e-69)/12)}var Fo=[{bpm:126,kick:[1,0,0,0,1,0,0,1,1,0,0,0,1,0,1,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],hat:[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0],bass:[45,0,45,48,0,45,41,0,45,0,48,0,43,0,41,43],chords:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],lead:[72,0,76,0,74,72,0,69,72,0,76,79,0,76,74,0]},{bpm:94,kick:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1],bass:[50,0,0,50,0,0,53,0,50,0,48,0,45,0,47,0],chords:[[62,66,69],[57,61,64],[53,57,60],[55,59,62]],lead:[74,0,0,76,0,74,69,0,71,0,74,0,69,0,67,0]},{bpm:138,kick:[1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0],snare:[0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],hat:[1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],bass:[40,40,0,43,40,0,36,40,40,0,43,0,38,38,0,36],chords:[[52,55,59],[48,52,55],[50,53,57],[47,50,55]],lead:[76,79,0,76,0,72,71,0,76,0,79,83,0,79,76,0]},{bpm:108,kick:[1,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0],hat:[1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0],bass:[44,0,44,47,0,44,42,0,44,0,49,0,47,0,42,44],chords:[[56,59,63],[54,58,61],[51,54,58],[49,54,58]],lead:[68,0,71,75,0,71,68,0,66,0,68,71,0,75,73,0]}],Io=class{ctx=null;master=null;sfx=null;engineGain=null;engineOsc=null;engineOsc2=null;driftGain=null;driftSrc=null;musicGain=null;muted=!1;started=!1;sirenOsc=null;sirenGain=null;sirenT=0;rainGain=null;rainSrc=null;station=0;voice=1;voiceVol=1;sched=0;step=0;noise=null;visBound=!1;unbindVisibility=null;unlock(){this.started||this.bootGraph(),this.resumeSync(),this.bindVisibility()}resumeSync(){let e=this.ctx;e&&e.state===`suspended`&&e.resume()}bindVisibility(){if(this.visBound||typeof document>`u`)return;this.visBound=!0;let e=()=>{document.visibilityState===`visible`&&this.resumeSync()};document.addEventListener(`visibilitychange`,e),window.addEventListener(`focus`,e),this.unbindVisibility=()=>{document.removeEventListener(`visibilitychange`,e),window.removeEventListener(`focus`,e),this.visBound=!1}}bootGraph(){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=new e({latencyHint:`interactive`});this.ctx=t,this.master=t.createGain(),this.sfx=t.createGain(),this.engineGain=t.createGain(),this.driftGain=t.createGain(),this.master.gain.value=.55,this.sfx.gain.value=.7,this.engineGain.gain.value=0,this.driftGain.gain.value=0,this.sfx.connect(this.master),this.engineGain.connect(this.master),this.driftGain.connect(this.master),this.musicGain=t.createGain(),this.musicGain.gain.value=.22,this.musicGain.connect(this.master),this.sirenGain=t.createGain(),this.sirenGain.gain.value=0,this.sirenGain.connect(this.master);let n=t.createOscillator();if(n.type=`square`,n.frequency.value=740,n.connect(this.sirenGain),n.start(),this.sirenOsc=n,this.rainGain=t.createGain(),this.rainGain.gain.value=0,this.rainGain.connect(this.master),this.noise=this.makeNoise(),this.noise){let e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let n=t.createBiquadFilter();n.type=`highpass`,n.frequency.value=1400,e.connect(n),n.connect(this.rainGain),e.start(),this.rainSrc=e}this.master.connect(t.destination);let r=t.createOscillator();r.type=`sawtooth`,r.frequency.value=70;let i=t.createOscillator();i.type=`triangle`,i.frequency.value=90;let a=t.createBiquadFilter();if(a.type=`lowpass`,a.frequency.value=420,r.connect(a),i.connect(a),a.connect(this.engineGain),r.start(),i.start(),this.engineOsc=r,this.engineOsc2=i,this.noise){let e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let n=t.createBiquadFilter();n.type=`bandpass`,n.frequency.value=900,e.connect(n),n.connect(this.driftGain),e.start(),this.driftSrc=e}this.started=!0,this.sched=t.currentTime+.05,this.step=0}makeNoise(){if(!this.ctx)return null;let e=this.ctx.sampleRate*1.2,t=this.ctx.createBuffer(1,e,this.ctx.sampleRate),n=t.getChannelData(0);for(let t=0;t<e;t++)n[t]=c(t,97)*2-1;return t}noiseBuffer(){return this.noise??this.makeNoise()}setMuted(e){this.muted=e,this.master&&this.master.gain.setTargetAtTime(e?0:.55,this.ctx.currentTime,.04)}isMuted(){return this.muted}setVoice(e){e===`ev`?(this.voice=1.85,this.voiceVol=.55):e===`muscle`?(this.voice=.7,this.voiceVol=1.35):e===`super`?(this.voice=1.28,this.voiceVol=1.12):e===`rally`?(this.voice=.92,this.voiceVol=1.18):(this.voice=1,this.voiceVol=1)}updateEngine(e,t,n,r=0,i=0){if(!this.ctx||!this.engineOsc||!this.engineGain)return;let a=this.ctx.currentTime,o=(85+i*540+(t?55:0)+e*.9)*this.voice;this.engineOsc.frequency.setTargetAtTime(o,a,.04),this.engineOsc2?.frequency.setTargetAtTime(o*(this.voice<.85?1.12:1.34),a,.04);let s=this.muted?0:Math.min(.38,(.06+e*.0055+i*.05)*this.voiceVol);this.engineGain.gain.setTargetAtTime(s,a,.05);let c=n||r>.2;this.driftGain?.gain.setTargetAtTime(this.muted?0:c?.035+r*.12:0,a,.04),this.musicGain&&!this.muted&&this.musicGain.gain.setTargetAtTime(t?.1:e>8?.16:.22,a,.1)}beep(e,t=.12,n=.18){if(!this.ctx||!this.sfx||this.muted)return;let r=this.ctx.currentTime,i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type=`square`,i.frequency.value=e,a.gain.setValueAtTime(n,r),a.gain.exponentialRampToValueAtTime(.001,r+t),i.connect(a),a.connect(this.sfx),i.start(r),i.stop(r+t+.02)}whoosh(){if(!this.ctx||!this.sfx||this.muted)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`sawtooth`,t.frequency.setValueAtTime(240,e),t.frequency.exponentialRampToValueAtTime(90,e+.28),n.gain.setValueAtTime(.12,e),n.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(n),n.connect(this.sfx),t.start(e),t.stop(e+.32)}impact(e=.5){if(!this.ctx||!this.sfx||this.muted)return;let t=this.ctx.currentTime,n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type=`sine`,n.frequency.setValueAtTime(90+e*40,t),n.frequency.exponentialRampToValueAtTime(32,t+.16);let i=.08+e*.16;r.gain.setValueAtTime(i,t),r.gain.exponentialRampToValueAtTime(.001,t+.22),n.connect(r),r.connect(this.sfx),n.start(t),n.stop(t+.24);let a=this.ctx.createBufferSource(),o=this.noiseBuffer();if(o){a.buffer=o;let n=this.ctx.createGain(),r=this.ctx.createBiquadFilter();r.type=`lowpass`,r.frequency.value=380,n.gain.setValueAtTime(.06+e*.1,t),n.gain.exponentialRampToValueAtTime(.001,t+.14),a.connect(r),r.connect(n),n.connect(this.sfx),a.start(t),a.stop(t+.16)}}cheer(){if(!this.ctx||!this.sfx||this.muted)return;let e=this.ctx.currentTime,t=this.noiseBuffer();if(t){let n=this.ctx.createBufferSource();n.buffer=t;let r=this.ctx.createGain(),i=this.ctx.createBiquadFilter();i.type=`bandpass`,i.frequency.value=1200,r.gain.setValueAtTime(.12,e),r.gain.exponentialRampToValueAtTime(.001,e+1.1),n.connect(i),i.connect(r),r.connect(this.sfx),n.start(e),n.stop(e+1.15)}this.beep(523,.18,.1),this.beep(784,.28,.1)}checkpoint(){this.beep(880,.08,.1),this.beep(1180,.1,.08)}finish(){this.beep(523,.16,.16),this.beep(659,.2,.14),this.beep(784,.28,.14)}tone(e,t,n,r,i,a,o){if(!this.ctx)return;let s=this.ctx.createOscillator(),c=this.ctx.createGain();s.type=e,s.frequency.setValueAtTime(Math.max(20,t),n),o&&s.frequency.exponentialRampToValueAtTime(Math.max(20,o),n+r*.7),c.gain.setValueAtTime(Math.max(1e-4,i),n),c.gain.exponentialRampToValueAtTime(.001,n+r),s.connect(c),c.connect(a),s.start(n),s.stop(n+r+.02)}noiseHit(e,t,n,r,i){if(!this.ctx||!this.noise)return;let a=this.ctx.createBufferSource();a.buffer=this.noise;let o=this.ctx.createGain(),s=this.ctx.createBiquadFilter();s.type=r>2e3?`highpass`:`bandpass`,s.frequency.value=r,o.gain.setValueAtTime(Math.max(1e-4,n),e),o.gain.exponentialRampToValueAtTime(.001,e+t),a.connect(s),s.connect(o),o.connect(i),a.start(e),a.stop(e+t+.02)}pulseMusic(e,t){if(!this.ctx||!this.musicGain||this.muted)return;let n=Fo[this.station]??Fo[0],r=this.ctx.currentTime,i=60/n.bpm/4;this.sched<r-.4&&(this.sched=r);let a=this.musicGain;for(;this.sched<r+.14;){let t=this.step%16,r=Math.floor(this.step/16)%n.chords.length,o=this.sched;if(n.kick[t]&&this.tone(`sine`,e?95:78,o,.18,e?.22:.16,a,38),n.snare[t]&&this.noiseHit(o,.12,.09,1800,a),n.hat[t]&&this.noiseHit(o,.045,e?.04:.028,5200,a),n.bass[t]){let e=this.station===2?`square`:this.station===1?`sine`:`sawtooth`;this.tone(e,Po(n.bass[t]),o,i*1.35,this.station===2?.07:.09,a)}if(t===0){let t=n.chords[r],s=this.ctx.createBiquadFilter();s.type=`lowpass`,s.frequency.value=e?1400:900;let c=this.ctx.createGain();c.gain.setValueAtTime(1e-4,o),c.gain.exponentialRampToValueAtTime(this.station===1?.05:.032,o+.08),c.gain.exponentialRampToValueAtTime(.001,o+i*16*.95),s.connect(c),c.connect(a);for(let e of t){let t=this.ctx.createOscillator();t.type=this.station===2?`sawtooth`:`triangle`,t.frequency.value=Po(e),t.connect(s),t.start(o),t.stop(o+i*16)}}n.lead[t]&&(e||this.station!==1||t%4==0)&&this.tone(`triangle`,Po(n.lead[t]+(e?0:-12)),o,i*1.8,e?.055:.04,a),this.step+=1,this.sched+=i}}cycleStation(){return this.station=(this.station+1)%No.length,this.step=0,this.ctx&&(this.sched=this.ctx.currentTime+.02),this.station}getStation(){return this.station}rewindTick(){this.beep(420,.04,.05)}updateRain(e,t){if(!this.ctx||!this.rainGain)return;let n=this.muted||!e?0:t?.08:.045;this.rainGain.gain.setTargetAtTime(n,this.ctx.currentTime,.12)}updateSiren(e,t){if(!this.ctx||!this.sirenGain||!this.sirenOsc)return;let n=this.ctx.currentTime;if(this.sirenGain.gain.setTargetAtTime(e&&!this.muted?.055:0,n,.08),!e)return;this.sirenT+=t;let r=this.sirenT%.7<.35;this.sirenOsc.frequency.setTargetAtTime(r?910:680,n,.035)}bust(){this.beep(180,.4,.22),this.beep(140,.5,.18)}resume(){this.resumeSync()}dispose(){this.unbindVisibility?.(),this.unbindVisibility=null;let e=e=>{try{e?.stop()}catch{}};e(this.engineOsc),e(this.engineOsc2),e(this.driftSrc),e(this.sirenOsc),e(this.rainSrc);let t=this.ctx;this.ctx=null,this.master=null,this.sfx=null,this.engineGain=null,this.engineOsc=null,this.engineOsc2=null,this.driftGain=null,this.driftSrc=null,this.musicGain=null,this.sirenOsc=null,this.sirenGain=null,this.rainGain=null,this.rainSrc=null,this.noise=null,this.started=!1,t&&t.state!==`closed`&&t.close().catch(()=>{})}};function Lo(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function Ro(e){let t=new Map,n=new Map,r=e.clone();return zo(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function zo(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)zo(e.children[r],t.children[r],n)}var Bo=class extends ye{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new qo(e)}),this.register(function(e){return new Jo(e)}),this.register(function(e){return new rs(e)}),this.register(function(e){return new is(e)}),this.register(function(e){return new as(e)}),this.register(function(e){return new Xo(e)}),this.register(function(e){return new Zo(e)}),this.register(function(e){return new Qo(e)}),this.register(function(e){return new $o(e)}),this.register(function(e){return new Ko(e)}),this.register(function(e){return new es(e)}),this.register(function(e){return new Yo(e)}),this.register(function(e){return new ns(e)}),this.register(function(e){return new ts(e)}),this.register(function(e){return new Wo(e)}),this.register(function(e){return new os(e,Uo.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new os(e,Uo.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new ss(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=d.extractUrlBase(e);a=d.resolveURL(t,this.path)}else a=d.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Le(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===cs){try{a[Uo.KHR_BINARY_GLTF]=new ds(e)}catch(e){r&&r(e);return}i=JSON.parse(a[Uo.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new Ls(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case Uo.KHR_MATERIALS_UNLIT:a[t]=new Go;break;case Uo.KHR_DRACO_MESH_COMPRESSION:a[t]=new fs(i,this.dracoLoader);break;case Uo.KHR_TEXTURE_TRANSFORM:a[t]=new ps;break;case Uo.KHR_MESH_QUANTIZATION:a[t]=new ms;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function Vo(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function Ho(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var Uo={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},Wo=class{constructor(e){this.parser=e,this.name=Uo.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new D(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],Ae);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new U(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new rt(s),o.distance=c;break;case`spot`:o=new ve(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),ks(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},Go=class{constructor(){this.name=Uo.KHR_MATERIALS_UNLIT}getMaterialType(){return Ct}extendParams(e,t,n){let r=[];e.color=new D(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],Ae),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,V))}return Promise.all(r)}},Ko=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},qo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Bt(e,e)}return Promise.all(r)}},Jo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},Yo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},Xo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new D(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],Ae)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,V)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(r)}},Zo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},Qo=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new D().setRGB(i[0],i[1],i[2],Ae),Promise.all(r)}},$o=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_IOR}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);return n===null?Promise.resolve():(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3),Promise.resolve())}},es=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let i=n.specularColorFactor||[1,1,1];return t.specularColor=new D().setRGB(i[0],i[1],i[2],Ae),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,V)),Promise.all(r)}},ts=class{constructor(e){this.parser=e,this.name=Uo.EXT_MATERIALS_BUMP}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},ns=class{constructor(e){this.parser=e,this.name=Uo.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ho(this.parser,e,this.name)===null?null:ct}extendMaterialParams(e,t){let n=Ho(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},rs=class{constructor(e){this.parser=e,this.name=Uo.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},is=class{constructor(e){this.parser=e,this.name=Uo.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},as=class{constructor(e){this.parser=e,this.name=Uo.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},os=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},ss=class{constructor(e){this.name=Uo.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==vs.TRIANGLES&&e.mode!==vs.TRIANGLE_STRIP&&e.mode!==vs.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new Ie,n=new K,a=new ee,s=new K(1,1,1),c=new Lt(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new Te(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);C.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},cs=`glTF`,ls=12,us={JSON:1313821514,BIN:5130562},ds=class{constructor(e){this.name=Uo.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,ls),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==cs)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-ls,i=new DataView(e,ls),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===us.JSON){let r=new Uint8Array(e,ls+a,t);this.content=n.decode(r)}else if(r===us.BIN){let n=ls+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},fs=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=Uo.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=Cs[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=Cs[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=ys[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,Ae,n)})})}},ps=class{constructor(){this.name=Uo.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0?e:(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0,e)}},ms=class{constructor(){this.name=Uo.KHR_MESH_QUANTIZATION}},hs=class extends he{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},gs=new ee,_s=class extends hs{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return gs.fromArray(i).normalize().toArray(i),i}},vs={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},ys={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},bs={9728:Mt,9729:B,9984:Re,9985:je,9986:Vt,9987:ne},xs={33071:Ee,33648:Pe,10497:h},Ss={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Cs={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},ws={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},Ts={CUBICSPLINE:void 0,LINEAR:nt,STEP:g},Es={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function Ds(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new q({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function Os(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function ks(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function As(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function js(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function Ms(e){let t,n=e.extensions&&e.extensions[Uo.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+Ns(n.attributes):e.indices+`:`+Ns(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+Ns(e.targets[n]);return t}function Ns(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function Ps(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function Fs(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var Is=new Ie,Ls=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Vo,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new bt(this.options.manager):new Fe(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Le(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return Os(i,a,r),ks(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Uo.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(d.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=Ss[r.type],t=ys[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new At(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=Ss[r.type],o=ys[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new A(f,u/s),t.cache.add(n,c)),p=new E(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new At(f,a,d);if(r.sparse!==void 0){let t=Ss.SCALAR,n=ys[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new At(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=bs[n.magFilter]||1006,t.minFilter=bs[n.minFilter]||1008,t.wrapS=xs[n.wrapS]||1e3,t.wrapT=xs[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new dt(e);t.needsUpdate=!0,n(t)}),t.load(d.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),ks(e,a),e.userData.mimeType=a.mimeType||Fs(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[Uo.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[Uo.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[Uo.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new tt,Et.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new x,Et.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return q}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[Uo.KHR_MATERIALS_UNLIT]){let e=r[Uo.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new D(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],Ae),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,V)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||Es.OPAQUE;if(l===Es.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===Es.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==Ct&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new Bt(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==Ct&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==Ct){let e=i.emissiveFactor;o.emissive=new D().setRGB(e[0],e[1],e[2],Ae)}return i.emissiveTexture!==void 0&&a!==Ct&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,V)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),ks(n,i),t.associations.set(n,{materials:e}),i.extensions&&Os(r,n,i),n})}createUniqueName(e){let t=de.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[Uo.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return zs(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=Ms(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[Uo.KHR_DRACO_MESH_COMPRESSION]?i(o):zs(new zt,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?Ds(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===vs.TRIANGLES||u.mode===vs.TRIANGLE_STRIP||u.mode===vs.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new z(l,f):new J(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===vs.TRIANGLE_STRIP?d.geometry=Lo(d.geometry,1):u.mode===vs.TRIANGLE_FAN&&(d.geometry=Lo(d.geometry,2));else if(u.mode===vs.LINES)d=new P(l,f);else if(u.mode===vs.LINE_STRIP)d=new Wt(l,f);else if(u.mode===vs.LINE_LOOP)d=new ke(l,f);else if(u.mode===vs.POINTS)d=new m(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&js(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),ks(d,i),u.extensions&&Os(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&Os(r,c[0],i),c[0];let l=new lt;i.extensions&&Os(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn(`THREE.GLTFLoader: Missing camera parameters.`);return}return n.type===`perspective`?t=new k(ft.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new Ft(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ks(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new Ie;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new N(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new St(i,void 0,l);return ks(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,Is)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new K().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new gt:t.length>1?new lt:t.length===1?t[0]:new C,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),ks(o,i),i.extensions&&Os(n,o,i),i.matrix!==void 0){let e=new Ie;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new lt;n.name&&(i.name=r.createUniqueName(n.name)),ks(i,n),n.extensions&&Os(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(Ro(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof Et||e instanceof dt)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];function c(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}ws[i.path]===ws.weights?(c(e),e.isGroup&&e.children.forEach(c)):s.push(o);let l;switch(ws[i.path]){case ws.weights:l=Ce;break;case ws.rotation:l=ae;break;case ws.translation:case ws.scale:l=Se;break;default:switch(n.itemSize){case 1:l=Ce;break;default:l=Se}}let u=r.interpolation===void 0?nt:Ts[r.interpolation],d=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new l(s[e]+`.`+ws[i.path],t.array,d,u);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=Ps(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof ae?_s:hs)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Rs(e,t,n){let r=t.attributes,i=new We;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new K(t[0],t[1],t[2]),new K(a[0],a[1],a[2])),e.normalized){let t=Ps(ys[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new K,t=new K;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=Ps(ys[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new te;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function zs(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=Cs[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return fe.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${fe.workingColorSpace}" not supported.`),ks(e,t),Rs(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:As(e,t.targets,n)})}var Bs=(function(){var e=`b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb`,t=`b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb`,n=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),r=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!=`object`)return{supported:!1};var i=WebAssembly.validate(n)?s(t):s(e),a,o=WebAssembly.instantiate(i,{}).then(function(e){a=e.instance,a.exports.__wasm_call_ctors()});function s(e){for(var t=new Uint8Array(e.length),n=0;n<e.length;++n){var i=e.charCodeAt(n);t[n]=i>96?i-97:i>64?i-39:i+4}for(var a=0,n=0;n<e.length;++n)t[a++]=t[n]<60?r[t[n]]:(t[n]-60)*64+t[++n];return t.buffer.slice(0,a)}function c(e,t,n,r,i,a,o){var s=e.exports.sbrk,c=r+3&-4,l=s(c*i),u=s(a.length),d=new Uint8Array(e.exports.memory.buffer);d.set(a,u);var f=t(l,r,i,u,a.length);if(f==0&&o&&o(l,c,i),n.set(d.subarray(l,l+r*i)),s(l-s(0)),f!=0)throw Error(`Malformed buffer data: `+f)}var l={NONE:``,OCTAHEDRAL:`meshopt_decodeFilterOct`,QUATERNION:`meshopt_decodeFilterQuat`,EXPONENTIAL:`meshopt_decodeFilterExp`,COLOR:`meshopt_decodeFilterColor`},u={ATTRIBUTES:`meshopt_decodeVertexBuffer`,TRIANGLES:`meshopt_decodeIndexBuffer`,INDICES:`meshopt_decodeIndexSequence`},d=[],f=0;function p(e){var t={object:new Worker(e),pending:0,requests:{}};return t.object.onmessage=function(e){var n=e.data;t.pending-=n.count,t.requests[n.id][n.action](n.value),delete t.requests[n.id]},t}function m(e){for(var t=`self.ready = WebAssembly.instantiate(new Uint8Array([`+new Uint8Array(i)+`]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = `+g.name+`;`+c.toString()+g.toString(),n=new Blob([t],{type:`text/javascript`}),r=URL.createObjectURL(n),a=d.length;a<e;++a)d[a]=p(r);for(var a=e;a<d.length;++a)d[a].object.postMessage({});d.length=e,URL.revokeObjectURL(r)}function h(e,t,n,r,i){for(var a=d[0],o=1;o<d.length;++o)d[o].pending<a.pending&&(a=d[o]);return new Promise(function(o,s){var c=new Uint8Array(n),l=++f;a.pending+=e,a.requests[l]={resolve:o,reject:s},a.object.postMessage({id:l,count:e,size:t,source:c,mode:r,filter:i},[c.buffer])})}function g(e){var t=e.data;self.ready.then(function(e){if(!t.id)return self.close();try{var n=new Uint8Array(t.count*t.size);c(e,e.exports[t.mode],n,t.count,t.size,t.source,e.exports[t.filter]),self.postMessage({id:t.id,count:t.count,action:`resolve`,value:n},[n.buffer])}catch(e){self.postMessage({id:t.id,count:t.count,action:`reject`,value:e})}})}return{ready:o,supported:!0,useWorkers:function(e){m(e)},decodeVertexBuffer:function(e,t,n,r,i){c(a,a.exports.meshopt_decodeVertexBuffer,e,t,n,r,a.exports[l[i]])},decodeIndexBuffer:function(e,t,n,r){c(a,a.exports.meshopt_decodeIndexBuffer,e,t,n,r)},decodeIndexSequence:function(e,t,n,r){c(a,a.exports.meshopt_decodeIndexSequence,e,t,n,r)},decodeGltfBuffer:function(e,t,n,r,i,o){c(a,a.exports[u[i]],e,t,n,r,a.exports[l[o]])},decodeGltfBufferAsync:function(e,t,n,r,i){return d.length>0?h(e,t,n,u[r],l[i]):o.then(function(){var o=new Uint8Array(e*t);return c(a,a.exports[u[r]],o,e,t,n,a.exports[l[i]]),o})}}})(),Vs=new Map;function Hs(e,t,n){let r=Vs.get(e)??Vs.get(`gt`);if(!r)return;let i;if(r.traverse(e=>{e.isMesh&&e.name===`body`&&(i=e)}),!i)return;let a=i.clone(),o=i.material.clone();return o.color.setHex(t),a.material=o,a.castShadow=n,a.receiveShadow=!0,a.name=`body`,a}async function Us(e){if(Vs.size)return;let t=new Bo;t.setMeshoptDecoder(Bs),await Promise.all([`gt`,`hatch`,`muscle`,`rally`,`super`].map(async e=>{let n=await t.loadAsync(`/game/car-${e}.glb`);Vs.set(e,n.scene)}))}var Ws;function Gs(){return Ws}async function Ks(){if(Ws)return Ws;let e=await new bt().loadAsync(`/game/beam.png`);return e.colorSpace=``,e.needsUpdate=!0,Ws=e,Ws}var qs;function Js(){return qs}async function Ys(){if(qs)return qs;let e=await new bt().loadAsync(`/game/flake.png`);return e.wrapS=e.wrapT=h,e.repeat.set(8,4),e.anisotropy=4,e.colorSpace=``,e.needsUpdate=!0,qs=e,qs}function Xs(){return{geometries:new Set,materials:new Set}}function Zs(e,t){t.materials.has(e)||(t.materials.add(e),e.dispose())}function Qs(e,t=Xs()){let n=t.geometries.size,r=t.materials.size;return e.traverse(e=>{let n=e;n.geometry&&!t.geometries.has(n.geometry)&&(t.geometries.add(n.geometry),n.geometry.dispose());let r=Array.isArray(n.material)?n.material:n.material?[n.material]:[];for(let e of r)Zs(e,t)}),e.removeFromParent(),e.clear(),{geometries:t.geometries.size-n,materials:t.materials.size-r}}var $s=null;function ec(){if($s)return $s;let e=Js();return e?($s=e,e):null}function tc(e){let t=e.onBeforeCompile;e.onBeforeCompile=(n,r)=>{t?.call(e,n,r),n.fragmentShader=n.fragmentShader.replace(`#include <opaque_fragment>`,`
      outgoingLight += pow(max(dot(normal, normalize(vViewPosition)), 0.0), 72.0)
        * step(0.973, fract(sin(dot(normal.xy * 48.0, vec2(12.9898, 78.233))) * 43758.5453))
        * 0.4;
      #include <opaque_fragment>
      `)};let n=e.customProgramCacheKey?.bind(e);e.customProgramCacheKey=()=>`${n?.()??``}|paint-flake-v1`}function nc(e){let t=new D(e),n=ec(),r=new ct({color:e,metalness:.06,roughness:.22,roughnessMap:n??void 0,bumpMap:n??void 0,bumpScale:.04,clearcoat:1,clearcoatRoughness:.06,clearcoatNormalMap:n??void 0,clearcoatNormalScale:new Bt(.22,.22),envMapIntensity:1.4,sheen:.18,sheenColor:t.clone().multiplyScalar(.35),sheenRoughness:.35});return tc(r),r}var rc=null;function ic(){if(rc)return rc;let e=Gs();return e?(e.wrapS=Ee,e.wrapT=Ee,e.colorSpace=``,rc=e,e):null}function ac(e){let t=new I,n=e===`hatch`?[[-2.02,.16],[-2.05,.5],[-1.78,.74],[-1.48,1.24],[-.18,1.34],[.52,1.3],[.92,.8],[1.52,.64],[2,.5],[2.08,.32],[2.02,.15],[1.62,.14],[-1.62,.14]]:e===`muscle`?[[-2.4,.15],[-2.42,.46],[-2.08,.58],[-1.52,.6],[-1.22,1.06],[-.12,1.12],[.52,1.08],[1.18,.6],[1.98,.5],[2.4,.46],[2.44,.26],[2.36,.14],[1.9,.13],[-1.9,.13]]:e===`rally`?[[-2.14,.18],[-2.16,.58],[-1.82,.8],[-1.52,1.3],[-.18,1.4],[.48,1.36],[.9,.84],[1.42,.7],[2.08,.58],[2.16,.34],[2.08,.16],[1.68,.16],[-1.68,.16]]:e===`super`?[[-2.24,.13],[-2.26,.38],[-1.82,.46],[-1.32,.9],[-.18,.98],[.58,.94],[1.28,.5],[1.98,.4],[2.26,.36],[2.3,.2],[2.2,.12],[1.78,.12],[-1.78,.12]]:[[-2.24,.16],[-2.26,.48],[-1.92,.62],[-1.32,.64],[-1.08,1.2],[-.12,1.3],[.62,1.26],[1.04,.72],[1.62,.6],[2.18,.5],[2.28,.32],[2.22,.15],[1.82,.14],[-1.82,.14]];t.moveTo(n[0][0],n[0][1]);for(let e=1;e<n.length;e++)t.lineTo(n[e][0],n[e][1]);return t.closePath(),t}function oc(e,t){let n=new Qe(ac(e),{depth:t,bevelEnabled:!0,bevelThickness:.09,bevelSize:.07,bevelSegments:4,steps:1});return n.translate(0,0,-t/2),n.rotateY(-Math.PI/2),n.computeVertexNormals(),n}function sc(e){return e===`hatch`?{L:4.08,W:1.76,wb:2.52,track:1.5,wheelR:.32,wheelY:.32,cabinZ:-.18,cabinL:1.78,cabinH:.62,hoodL:1.08,trunkL:.38,bodyH:.58}:e===`muscle`?{L:4.82,W:1.9,wb:2.78,track:1.62,wheelR:.34,wheelY:.34,cabinZ:-.48,cabinL:1.42,cabinH:.46,hoodL:1.58,trunkL:.9,bodyH:.52}:e===`rally`?{L:4.32,W:1.84,wb:2.56,track:1.54,wheelR:.36,wheelY:.38,cabinZ:-.1,cabinL:1.68,cabinH:.64,hoodL:1.12,trunkL:.52,bodyH:.62}:e===`super`?{L:4.52,W:1.96,wb:2.62,track:1.68,wheelR:.325,wheelY:.3,cabinZ:-.28,cabinL:1.36,cabinH:.36,hoodL:1.48,trunkL:.7,bodyH:.42}:{L:4.5,W:1.82,wb:2.68,track:1.54,wheelR:.33,wheelY:.33,cabinZ:-.16,cabinL:1.62,cabinH:.54,hoodL:1.22,trunkL:.78,bodyH:.56}}var cc=new Set([16106496,15778816]);function lc(e,t,n,r=!1,i=`gt`,a=!1,o){let s=new lt,c=sc(i),l=nc(e),u=nc(t);u.roughness=.28;let d=new ct({color:1184792,metalness:.42,roughness:.46,envMapIntensity:.65}),f=new ct({color:9086132,metalness:.06,roughness:.07,transparent:!0,opacity:.38,envMapIntensity:2.2,clearcoat:1,clearcoatRoughness:.06}),p=new ct({color:1315862,metalness:.04,roughness:.58,envMapIntensity:.42,clearcoat:.18,clearcoatRoughness:.48}),m=new ct({color:13160662,metalness:.96,roughness:.12,clearcoat:.85,clearcoatRoughness:.08,envMapIntensity:1.65}),h=new ct({color:6975092,metalness:.9,roughness:.22,envMapIntensity:.9}),g=new ct({color:3802632,emissive:16718354,emissiveIntensity:.5,roughness:.3}),_=new ct({color:16774880,emissive:16773832,emissiveIntensity:3.4,roughness:.12}),v=new ct({color:14212836,metalness:1,roughness:.08,envMapIntensity:2}),y=new q({color:789518,roughness:.55,metalness:.25}),b=new q({color:15920872,roughness:.45,metalness:.08}),x=(e,t,r,i,a,o=0,c=0,l=0)=>{let u=new J(e,t);return u.position.set(r,i,a),u.rotation.set(o,c,l),u.castShadow=n,u.receiveShadow=!0,s.add(u),u},S=c.L/2,C=c.wheelY+c.bodyH*.22,w=Hs(i,e,n);w?(s.add(w),l=w.material,tc(l)):x(oc(i,c.W*.9),l,0,0,0);let T=c.wheelY+c.bodyH*.55+c.cabinH*.42;x(new G(c.W*.98,.16,.2),d,0,c.wheelY*.5,S-.01);let E=x(new G(c.W*.94,.18,.22),d,0,c.wheelY*.55,-S+.03);x(new G(c.W*.38,.12,.03),b,0,c.wheelY*.5,-S-.05),x(new G(c.W*.72,.14,.04),y,0,C+.04,S-.01);let O=c.W*.3,k=C+.05,A=S+.02,j=new W(.13,12,8,0,Math.PI*2,0,Math.PI*.7);x(new G(.38,.14,.08),v,-O,k,A),x(new G(.38,.14,.08),v,O,k,A);let M=x(j,_,-O,k,A+.03,Math.PI/2,0,0),N=x(j.clone(),_,O,k,A+.03,Math.PI/2,0,0),P=new Ct({color:16774352,transparent:!0,opacity:.5,blending:2,depthWrite:!1}),F=new J(new W(.14,10,8),P);F.position.set(-O,k,A+.02);let I=F.clone();I.position.x=O,s.add(F,I);let ee=C+.02,L=-S-.03,R=x(new G(.46,.1,.05),g,-O,ee,L),te=x(new G(.46,.1,.05),g,O,ee,L),ne=x(new G(.7,.035,.03),g,0,T+c.cabinH*.08,c.cabinZ-c.cabinL*.42),re=new q({color:658448,roughness:.92,metalness:.04});x(new G(c.W*.62,c.cabinH*.48,c.cabinL*.52),re,0,T-.06,c.cabinZ),x(new G(c.W*.56,.07,.2),y,0,T-.1,c.cabinZ+c.cabinL*.26),x(new G(.26,.2,.3),y,-.17,T-.2,c.cabinZ-.02),x(new G(.26,.2,.3),y,.17,T-.2,c.cabinZ-.02),x(new ht(.13,.016,8,18),y,-.17,T-.04,c.cabinZ+c.cabinL*.2,.62,0,0);let z=c.W*.68,B=(e,t)=>new G(e,t,.036);x(B(z,c.cabinH*.72),f,0,T+.02,c.cabinZ+c.cabinL*.42,-.62),x(B(z*.96,c.cabinH*.58),f,0,T,c.cabinZ-c.cabinL*.42,.52),x(B(c.cabinL*.62,c.cabinH*.48),f,-c.W*.445,T,c.cabinZ,0,Math.PI/2),x(B(c.cabinL*.62,c.cabinH*.48),f,c.W*.445,T,c.cabinZ,0,-Math.PI/2),x(new G(.18,.1,.14),y,-c.W*.48,T+.01,c.cabinZ+c.cabinL*.18),x(new G(.18,.1,.14),y,c.W*.48,T+.01,c.cabinZ+c.cabinL*.18),x(new G(.07,.07,.1),f,-c.W*.54,T+.01,c.cabinZ+c.cabinL*.18),x(new G(.07,.07,.1),f,c.W*.54,T+.01,c.cabinZ+c.cabinL*.18),x(new G(c.W*.88,.08,c.L*.72),y,0,c.wheelY*.22,0),x(new G(.36,.1,.02),v,0,c.wheelY*.78,-S-.04);let ie=new Y(.042,.048,.16,10);if(ie.rotateX(Math.PI/2),x(ie,v,-.3,c.wheelY*.48,-S-.07),(i===`muscle`||i===`super`)&&x(ie.clone(),v,.3,c.wheelY*.48,-S-.07),i===`super`){x(new G(c.W*.95,.05,.42),u,0,T+.22,-S+.12),x(new G(c.W*.98,.04,.38),u,0,c.wheelY*.42,S-.02),x(new G(c.W*1.02,.08,.55),u,0,T+.28,-S+.28);for(let e of[-1,1])x(new G(.18,.22,.55),y,e*c.W*.48,C+.06,c.cabinZ+.15)}else if(i===`muscle`)x(new G(.9,.1,.7),l,0,C+c.bodyH*.55,S-c.hoodL*.5),x(new G(c.W*.7,.05,.28),u,0,T+.18,-S+.2),x(new G(c.W*.92,.08,.12),v,0,c.wheelY*.62,S-.01);else if(i===`rally`){x(new G(1.2,.05,1.4),d,0,T+c.cabinH*.55,c.cabinZ),x(new G(1.1,.08,.08),_,0,C+.16,S+.04),x(new Y(.06,.06,.5,8),d,-c.W*.38,T,c.cabinZ+.4);for(let e of[-.28,0,.28]){let t=x(new Y(.08,.08,.1,10),_,e,T+c.cabinH*.62,c.cabinZ+.35);t.rotation.x=Math.PI/2}for(let e of[-1,1])x(new G(.16,.22,.9),d,e*(c.W*.52),c.wheelY+.08,c.wb*.22)}else i===`hatch`&&cc.has(e)?x(new G(.4,.14,.2),new q({color:15920872,emissive:15920872,emissiveIntensity:.4}),0,T+c.cabinH*.58,c.cabinZ+.1):i===`hatch`?x(new G(c.W*.72,.05,.28),d,0,T+c.cabinH*.48,c.cabinZ-c.cabinL*.48):(x(new G(1.5,.04,.26),u,0,T+.08,-S+.22),x(new G(c.W*.02,.06,c.L*.62),v,c.W*.46,C+.12,0),x(new G(c.W*.02,.06,c.L*.62),v,-c.W*.46,C+.12,0));let ae=new Y(c.wheelR+.04,c.wheelR+.04,.12,18);ae.rotateZ(Math.PI/2);let V=new ht(c.wheelR+.07,.035,6,16,Math.PI);V.rotateZ(Math.PI/2);let oe=[],se=[],ce=new Y(c.wheelR,c.wheelR,.26,32);ce.rotateZ(Math.PI/2);let le=new ht(c.wheelR*.92,.055,8,24),ue=new ht(c.wheelR*.78,.04,8,22),de=new Y(.11,.11,.28,18);de.rotateZ(Math.PI/2);let fe=new Y(c.wheelR*.7,c.wheelR*.7,.035,22);fe.rotateZ(Math.PI/2);let me=i===`super`?10:i===`rally`||i===`muscle`?5:i===`hatch`?6:7,he=new G(i===`super`?.022:.028,c.wheelR*(i===`super`?.88:.82),.035),ge=[[-c.track/2,c.wheelY,c.wb/2],[c.track/2,c.wheelY,c.wb/2],[-c.track/2,c.wheelY,-c.wb/2],[c.track/2,c.wheelY,-c.wb/2]];for(let e=0;e<ge.length;e++){let[t,r,a]=ge[e];x(ae,d,t+Math.sign(t)*.01,r,a);let o=x(V,l,t+Math.sign(t)*.04,r,a,0,0,Math.sign(t)>0?0:Math.PI);o.rotation.x=-Math.PI/2;let c=new lt,u=new lt,f=i===`muscle`&&e>=2?1.28:i===`super`&&e>=2?1.18:1,g=new J(ce,p);g.scale.x=f,u.add(g),u.add(new J(le,p)),u.add(new J(ue,p)),u.add(new J(de,m)),u.add(new J(fe,h));for(let e=0;e<me;e++){let t=new J(he,m);t.rotation.z=e/me*Math.PI,u.add(t)}c.add(u),c.position.set(t,r,a),c.userData.y0=r,c.traverse(e=>{e.isMesh&&(e.castShadow=n)}),s.add(c),oe.push(c),se.push(u)}let _e=[],ye;if(r){let e=ic();for(let t of[-O,O]){let r=new ve(16773576,0,48,.5,.68,1.05);r.position.set(t,k,A),r.target.position.set(t*.12,-.42,14),e&&(r.map=e),r.castShadow=!!(n&&e),r.castShadow&&(r.shadow.mapSize.set(256,256),r.shadow.bias=-25e-5,r.shadow.camera.near=.6,r.shadow.camera.far=42,r.shadow.focus=1),r.intensity=0,s.add(r,r.target),_e.push(r)}let t=new Ct({map:e||null,color:e?16777215:16770224,transparent:!0,opacity:0,depthWrite:!1,blending:2});ye=new J(new Nt(5.4,22),t),ye.rotation.x=-Math.PI/2,ye.position.set(0,.06,8.6),ye.scale.set(.72,1,1.8),ye.renderOrder=2,s.add(ye)}let be=new q({color:1709588,roughness:.78,metalness:.04});x(new G(c.W*.7,.06,c.cabinL*.62),be,0,c.wheelY+.36,c.cabinZ),x(new G(.4,.22,.4),be,.24,c.wheelY+.5,c.cabinZ-.04),x(new G(.4,.42,.09),be,.24,c.wheelY+.7,c.cabinZ-.22),x(new G(.4,.22,.4),be,-.24,c.wheelY+.5,c.cabinZ-.04);let xe=x(new G(c.W*.76,.2,.4),d,0,T-.16,c.cabinZ+c.cabinL*.3);xe.castShadow=!1,x(new G(.42,.07,.14),new q({color:790548,emissive:1718858,emissiveIntensity:.55,roughness:.35}),0,T-.02,c.cabinZ+c.cabinL*.36),x(new G(.05,c.cabinH*.62,.05),d,c.W*.34,T,c.cabinZ+c.cabinL*.32),x(new G(.05,c.cabinH*.62,.05),d,-c.W*.34,T,c.cabinZ+c.cabinL*.32);let Se=new J(new Y(.032,.04,.26,8),d);Se.rotation.x=1.05,Se.position.set(.26,T-.1,c.cabinZ+c.cabinL*.2),s.add(Se);let Ce=new lt,we=new J(new ht(.17,.026,8,18),d);we.rotation.x=Math.PI/2,Ce.add(we),Ce.add(new J(new G(.26,.018,.035),d)),Ce.add(new J(new G(.035,.018,.2),d)),Ce.position.set(.26,T-.02,c.cabinZ+c.cabinL*.14),Ce.rotation.x=.55,s.add(Ce);let Te;if(a){let e=new ct({color:9048088,emissive:16720960,emissiveIntensity:3.2,roughness:.3}),t=new ct({color:1058888,emissive:3837183,emissiveIntensity:3.2,roughness:.3});x(new G(1.15,.1,.26),d,0,T+c.cabinH*.62,c.cabinZ),x(new G(.48,.12,.28),e,-.3,T+c.cabinH*.7,c.cabinZ),x(new G(.48,.12,.28),t,.3,T+c.cabinH*.7,c.cabinZ),x(new G(c.W*.98,.1,c.L*.55),u,0,C+.08,0),Te={red:e,blue:t}}let Ee=[],H=new W(.08,8,6);for(let[e,t,n]of[[c.W*.32,C,c.L*.22],[-c.W*.34,C+.04,.1],[c.W*.28,C,-c.L*.25]]){let r=new J(H,d);r.position.set(e,t,n),r.scale.set(1.4,.45,1.1),r.visible=!1,s.add(r),Ee.push(r)}let De=new J(new pe(1.3,.5),new Ct({color:2761756,transparent:!0,opacity:0,depthWrite:!1}));De.rotation.y=Math.PI/2,De.position.set(c.W*.48,C,.15),s.add(De);let Oe=new J(new Nt(c.W*.72,16),new Ct({color:658448,transparent:!0,opacity:0,depthWrite:!1}));return Oe.rotation.x=-Math.PI/2,Oe.position.y=.04,Oe.visible=!1,Oe.renderOrder=-1,s.add(Oe),{group:s,wheels:oe,spins:se,brakeLights:[R,te,ne],headLights:[M,N],headGlows:[F,I],bodyMat:l,spots:_e,headPool:ye,steerWheel:Ce,baseColor:new D(e),bumper:E,dents:Ee,scratch:De,police:Te}}function uc(e,t,n=0){let r=Math.min(1,Math.max(0,t)),i=Math.min(1,Math.max(0,n));e.bodyMat.color.copy(e.baseColor).lerp(new D(3814444),r*.72).lerp(new D(4866102),i*.55),e.bodyMat.roughness=.16+r*.52+i*.38,e.bodyMat.clearcoat=Math.max(.08,1-r*.75-i*.55),e.bodyMat.clearcoatRoughness=.08+r*.4+i*.28,e.bumper&&(e.bumper.rotation.x=r*.14),e.dents.forEach((e,t)=>{e.visible=r>.16+t*.18}),e.scratch&&(e.scratch.material.opacity=r*.62)}function dc(e,t){let n=t;for(let t of e.spots)if(t.intensity=n?28:0,t.visible=n,!t.map){let e=ic();e&&(t.map=e)}e.bodyMat.envMapIntensity=t?1.15:1.4;for(let n of e.headLights)n.material.emissiveIntensity=t?5.2:.85;for(let n of e.headGlows)n.material.opacity=t?.78:.16,n.visible=!0;if(e.headPool){let n=e.headPool.material;if(!n.map){let e=ic();e&&(n.map=e,n.color.setHex(16777215))}n.opacity=t?.88:0,e.headPool.visible=t}}function fc(e,t){if(!e.police)return;let n=(Math.sin(t*14)+1)*.5;e.police.red.emissiveIntensity=.5+n*7.5,e.police.blue.emissiveIntensity=.5+(1-n)*7.5}function pc(e,t,n,r,i,a,o,s,c,l,u=0,d=`asphalt`){e.group.userData.t=(e.group.userData.t||0)+a*Math.abs(n);let f=d===`curb`?Math.sin(e.group.userData.t*3.4)*.032:d===`sand`?Math.sin(e.group.userData.t*1.8)*.022:0;e.group.position.set(o,s+.02+f,c),e.group.rotation.order=`YXZ`,e.group.rotation.set(u*.55,t+Math.PI,l);let p=n/.33*a;for(let t of e.spins)t.rotateX(p);e.wheels[0]&&(e.wheels[0].rotation.y=r*.38),e.wheels[1]&&(e.wheels[1].rotation.y=r*.38);let m=.14,h=e.wheels.map(e=>e.userData.y0??e.position.y);e.wheels[0]&&(e.wheels[0].position.y=h[0]+(-u+l)*m),e.wheels[1]&&(e.wheels[1].position.y=h[1]+(-u-l)*m),e.wheels[2]&&(e.wheels[2].position.y=h[2]+(u+l)*m),e.wheels[3]&&(e.wheels[3].position.y=h[3]+(u-l)*m),e.steerWheel&&(e.steerWheel.rotation.z=-r*.9);let g=n<-.8,_=i>.15&&!g;for(let t of e.brakeLights){let e=t.material;e.emissive.setHex(g?16054008:16718354),e.color.setHex(g?16054008:3802632),e.emissiveIntensity=g||_?4.6:.45}}function mc(e,t){return Qs(e.group,t)}function hc(e,t){let n=Hn[(e%Hn.length+Hn.length)%Hn.length];return t?n.he:n.en}function gc(e,t){if(e?.lineHe)return t?e.lineHe:e.lineEn??e.lineHe;let n=(e?.chapter??1)%Hn.length,r=hc(n,t),i=[`${r}: בוא נראה אם אתה שייך לרחוב.`,`${r}: אל תישן בזינוק.`,`${r}: אני לוקח את הקו הפנימי.`,`${r}: נסיעה נקייה. בלי דרמות.`],a=[`${r}: Let's see if you belong on this street.`,`${r}: Don't sleep on the lights.`,`${r}: I'm taking the inside line.`,`${r}: Clean run. No drama.`];return t?i[n]:a[n]}function _c(e,t,n){let r=hc(n,t);return e?t?`${r}: תעבור אותי? חח.`:`${r}: Passing me? Cute.`:t?`${r}: חזרתי. תתרגל.`:`${r}: I'm back. Get used to it.`}function vc(e,t,n,r){let i=hc(r,n);return t?n?`${i}: המשטרה עשתה לך את העבודה.`:`${i}: The cops did my job.`:e===1?n?`${i}: סבבה. סיבוב הבא שלי.`:`${i}: Fine. Next one's mine.`:e===2?n?`${i}: קרוב. לא מספיק.`:`${i}: Close. Not enough.`:n?`${i}: לך הביתה, תתקן את הרכב.`:`${i}: Go home. Fix the car.`}function yc(e,t=.12,n=1.6){return Math.abs(e)<=t?0:(e<0?-1:1)*Math.abs(e)**+n}var bc=class{keys=new Set;touchSteer=0;touchThrottle=0;touchBrake=0;touchDrift=!1;touchNitro=!1;touchRewind=!1;steerOverride=null;throttleOverride=null;brakeOverride=null;paused=!1;steerFilt=0;thrFilt=0;lastPoll=0;canvas;unbind=[];constructor(e){this.canvas=e;let t=e=>{this.keys.add(e.code),[`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Space`].includes(e.code)&&e.preventDefault()},n=e=>{this.keys.delete(e.code)},r=()=>this.keys.clear();window.addEventListener(`keydown`,t),window.addEventListener(`keyup`,n),window.addEventListener(`blur`,r),document.addEventListener(`visibilitychange`,r),this.unbind.push(()=>{window.removeEventListener(`keydown`,t),window.removeEventListener(`keyup`,n),window.removeEventListener(`blur`,r),document.removeEventListener(`visibilitychange`,r)})}setTouch(e){e.steer!==void 0&&(this.touchSteer=s(e.steer,-1,1)),e.throttle!==void 0&&(this.touchThrottle=s(e.throttle,0,1)),e.brake!==void 0&&(this.touchBrake=s(e.brake,0,1)),e.drift!==void 0&&(this.touchDrift=e.drift),e.nitro!==void 0&&(this.touchNitro=e.nitro),e.rewind!==void 0&&(this.touchRewind=e.rewind)}poll(){let e=0;(this.keys.has(`KeyA`)||this.keys.has(`ArrowLeft`))&&(e+=1),(this.keys.has(`KeyD`)||this.keys.has(`ArrowRight`))&&--e,e+=this.touchSteer;let t=this.touchThrottle,n=this.touchBrake;(this.keys.has(`KeyW`)||this.keys.has(`ArrowUp`))&&(t=1),(this.keys.has(`KeyS`)||this.keys.has(`ArrowDown`))&&(n=1);let r=(typeof navigator<`u`?navigator.getGamepads?.():null)?.[0];if(r){e-=yc(r.axes[0]??0);let i=r.axes[1]??0;i<-.12&&(t=Math.max(t,yc(-i)));let a=r.buttons[7]?.value??0,o=r.buttons[6]?.value??0;a>.05&&(t=Math.max(t,a)),o>.05&&(n=Math.max(n,o))}this.steerOverride!==null&&(e=this.steerOverride),this.throttleOverride!==null&&(t=this.throttleOverride),this.brakeOverride!==null&&(n=this.brakeOverride);let i=typeof performance<`u`?performance.now():0,a=this.lastPoll?Math.min(.05,(i-this.lastPoll)/1e3):.016;if(this.lastPoll=i,this.steerOverride!==null)this.steerFilt=e;else{let t=Math.abs(e)<.05?11:6.5;this.steerFilt+=(e-this.steerFilt)*Math.min(1,t*a),Math.abs(this.steerFilt)<.01&&(this.steerFilt=0),e=this.steerFilt}if(this.throttleOverride!==null)this.thrFilt=t;else{let e=t>this.thrFilt?5.5:8;this.thrFilt+=(t-this.thrFilt)*Math.min(1,e*a),t=this.thrFilt}let o=this.touchDrift||this.keys.has(`Space`)||this.keys.has(`ShiftLeft`)||this.keys.has(`ShiftRight`)||!!r?.buttons[4]?.pressed||!!r?.buttons[5]?.pressed,c=this.touchNitro||this.keys.has(`KeyE`)||this.keys.has(`KeyQ`)||!!r?.buttons[0]?.pressed||!!r?.buttons[1]?.pressed;return{steer:s(e,-1,1),throttle:s(t,0,1),brake:s(n,0,1),drift:o,nitro:c}}wantsPause(){return this.keys.has(`Escape`)||this.keys.has(`KeyP`)}wantsRewind(){let e=typeof navigator<`u`?navigator.getGamepads?.()?.[0]:null;return this.touchRewind||this.keys.has(`KeyR`)||!!e?.buttons[2]?.pressed}dispose(){for(let e of this.unbind)e();this.unbind=[],this.keys.clear()}},xc={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Sc=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Cc=new Ft(-1,1,1,-1,0,1),wc=new class extends zt{constructor(){super(),this.setAttribute(`position`,new wt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new wt([0,2,0,0,2,0],2))}},Tc=class{constructor(e){this._mesh=new J(wc,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Cc)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Ec=class extends Sc{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof b?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Dt.clone(e.uniforms),this.material=new b({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Tc(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Dc=class extends Sc{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Oc=class extends Sc{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},kc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new Bt);this._width=n.width,this._height=n.height,t=new Pt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ye}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ec(xc),this.copyPass.material.blending=0,this.timer=new Xe}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Dc!==void 0&&(r instanceof Dc?n=!0:r instanceof Oc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Bt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Ac={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},jc=class extends Sc{constructor(){super(),this.isOutputPass=!0,this.uniforms=Dt.clone(Ac.uniforms),this.material=new It({name:Ac.name,uniforms:this.uniforms,vertexShader:Ac.vertexShader,fragmentShader:Ac.fragmentShader}),this._fsQuad=new Tc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},fe.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Mc=class extends Sc{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new D}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Nc={name:`SMAAEdgesShader`,defines:{SMAA_THRESHOLD:`0.1`},uniforms:{tDiffuse:{value:null},resolution:{value:new Bt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},Pc={name:`SMAAWeightsShader`,defines:{SMAA_MAX_SEARCH_STEPS:`8`,SMAA_AREATEX_MAX_DISTANCE:`16`,SMAA_AREATEX_PIXEL_SIZE:`( 1.0 / vec2( 160.0, 560.0 ) )`,SMAA_AREATEX_SUBTEX_SIZE:`( 1.0 / 7.0 )`},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new Bt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},Fc={name:`SMAABlendShader`,uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new Bt(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`},Ic=class extends Sc{constructor(){super(),this._edgesRT=new Pt(1,1,{depthBuffer:!1,type:Ye}),this._edgesRT.texture.name=`SMAAPass.edges`,this._weightsRT=new Pt(1,1,{depthBuffer:!1,type:Ye}),this._weightsRT.texture.name=`SMAAPass.weights`;let e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new dt,this._areaTexture.name=`SMAAPass.area`,this._areaTexture.image=t,this._areaTexture.minFilter=B,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;let n=new Image;n.src=this._getSearchTexture(),n.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new dt,this._searchTexture.name=`SMAAPass.search`,this._searchTexture.image=n,this._searchTexture.magFilter=Mt,this._searchTexture.minFilter=Mt,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=Dt.clone(Nc.uniforms),this._materialEdges=new b({defines:Object.assign({},Nc.defines),uniforms:this._uniformsEdges,vertexShader:Nc.vertexShader,fragmentShader:Nc.fragmentShader}),this._uniformsWeights=Dt.clone(Pc.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new b({defines:Object.assign({},Pc.defines),uniforms:this._uniformsWeights,vertexShader:Pc.vertexShader,fragmentShader:Pc.fragmentShader}),this._uniformsBlend=Dt.clone(Fc.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new b({uniforms:this._uniformsBlend,vertexShader:Fc.vertexShader,fragmentShader:Fc.fragmentShader}),this._fsQuad=new Tc(null)}render(e,t,n){this._uniformsEdges.tDiffuse.value=n.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=n.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return`data:image/png;base64,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`}_getSearchTexture(){return`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII=`}},Lc={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new D(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Rc=class e extends Sc{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new Bt(256,256):new Bt(e.x,e.y),this.clearColor=new D(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Pt(i,a,{type:Ye}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Pt(i,a,{type:Ye});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Pt(i,a,{type:Ye});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Lc;this.highPassUniforms=Dt.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new b({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new Bt(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new K(1,1,1),new K(1,1,1),new K(1,1,1),new K(1,1,1),new K(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Dt.clone(xc.uniforms),this.blendMaterial=new b({uniforms:this.copyUniforms,vertexShader:xc.vertexShader,fragmentShader:xc.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new D,this._oldClearAlpha=1,this._basic=new Ct,this._fsQuad=new Tc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new Bt(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new b({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Bt(.5,.5)},direction:{value:new Bt(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new b({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Rc.BlurDirectionX=new Bt(1,0),Rc.BlurDirectionY=new Bt(0,1);var zc={uniforms:{tDiffuse:{value:null},uSpeed:{value:0},uBoost:{value:0},uNight:{value:0},uFilter:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uSpeed;
    uniform float uBoost;
    uniform float uNight;
    uniform float uFilter;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r = length(c);
      vec3 col = texture2D(tDiffuse, uv).rgb;

      float lum = dot(col, vec3(0.22, 0.70, 0.08));
      vec3 shadowTint = mix(vec3(1.0, 0.99, 0.98), vec3(1.04, 0.96, 0.82), uNight);
      vec3 highTint = mix(vec3(1.0), vec3(0.98, 0.97, 1.02), uNight);
      col *= mix(shadowTint, highTint, smoothstep(0.14, 0.78, lum));
      col *= mix(1.0, 1.06, uNight * (1.0 - lum) * 0.35);

      float k = smoothstep(0.18, 0.92, uSpeed);
      vec2 smear = c * r * k * mix(0.018, 0.038, uBoost);
      if (k > 0.02) {
        vec3 a = texture2D(tDiffuse, uv + smear).rgb;
        vec3 b = texture2D(tDiffuse, uv + smear * 1.7).rgb;
        col = mix(col, (col + a + b) / 3.0, k * 0.55);
        float cr = texture2D(tDiffuse, uv + smear * 0.55).r;
        float cb = texture2D(tDiffuse, uv - smear * 0.55).b;
        col = mix(col, vec3(cr, col.g, cb), k * 0.2);
      }

      float vig = smoothstep(1.22, 0.28, r);
      col *= mix(1.0, vig, mix(0.05, 0.2, k) + uNight * 0.08);

      float f = uFilter;
      if (f > 0.5) {
        float chroma = (uSpeed * 0.003 + uBoost * 0.0025) * r;
        vec2 dir = c * chroma;
        float cr = texture2D(tDiffuse, uv + dir).r;
        float cg = col.g;
        float cb = texture2D(tDiffuse, uv - dir).b;
        col = vec3(cr, cg, cb);
        float grain = fract(sin(dot(uv * 840.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
        if (f > 6.5) {
          col *= vec3(1.14, 1.05, 0.88);
          col = mix(col, vec3(0.96, 0.9, 0.76), 0.14);
          col += grain * 0.045;
        } else if (f > 5.5) {
          col = mix(col, vec3(lum), 0.38);
          col = (col - 0.5) * 1.38 + 0.52;
        } else if (f > 4.5) {
          col.r = mix(col.r, mix(0.12, 1.0, lum), 0.22);
          col *= vec3(1.08, 0.98, 0.86);
        } else if (f > 3.5) {
          col = mix(col, vec3(lum * 1.04), 0.2);
          col *= vec3(1.06, 1.02, 0.94);
          if (uv.y < 0.09 || uv.y > 0.91) col = vec3(0.015);
        } else if (f > 2.5) {
          col = vec3(lum * 1.05);
        } else if (f > 1.5) {
          col *= vec3(1.08, 0.86, 1.22);
        } else {
          col *= vec3(1.14, 1.02, 0.86);
        }
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `};function Bc(e,t,n,r,i=!1){let a=new Bt;e.getDrawingBufferSize(a);let o=new Pt(a.x,a.y,{type:i?He:Ye,depthBuffer:!0}),s=new kc(e,o);s.addPass(new Mc(t,n));let c=new Rc(a,r&&!i?.11:0,r?.2:.06,r?.84:.96);c.enabled=r&&!i,s.addPass(c);let l=i?void 0:new Ic;l&&s.addPass(l);let u=new Ec(zc);u.uniforms.uNight.value=+!!r,s.addPass(u),s.addPass(new jc);let d=!i,f=i?`low`:`high`,p=!1;return{composer:s,bloom:c,grade:u,smaa:l,setSize(e,t){s.setSize(e,t),c.setSize(e,t),l?.setSize(e,t)},setDrive(e,t){u.uniforms.uSpeed.value=e,u.uniforms.uBoost.value=+!!t},setNight(e){r=e,u.uniforms.uNight.value=+!!e,c.enabled=e&&f===`high`,c.strength=e&&f===`high`?.11:0,c.radius=e?.2:.06,c.threshold=e?.84:.96},setFilter(e){u.uniforms.uFilter.value=e},setBudget(e){this.setTier(e?`low`:`high`)},setTier(e){f=e,i=e===`low`,d=e!==`low`,l&&(l.enabled=e!==`low`),c.enabled=r&&e===`high`,c.strength=r&&e===`high`?.11:0},setBloom(e){c.enabled=e&&r&&f===`high`,c.strength=c.enabled?.11:0},render(){d?s.render():e.render(t,n)},dispose(){p||(p=!0,s.dispose(),o.dispose())}}}function Vc(e,t=!1){let n=new Ut;n.background=new D(t?1582134:3840736),n.add(new Ke(t?4874368:13166847,t?1709072:12097640,t?.55:1.2));let r=new U(t?11059424:16771268,t?.32:1.2);if(r.position.set(6,14,4),n.add(r),!t){let e=new J(new W(2.4,16,16),new Ct({color:16774872}));e.position.set(10,16,7),n.add(e);let t=new J(new Nt(22,24),new Ot({color:3818056}));t.rotation.x=-Math.PI/2,t.position.y=-2.2,n.add(t)}let i=new Rr(e),a=i.fromScene(n,.04);return i.dispose(),a}var Hc=new Ie,Uc=class e{constructor(e){e||={},this.zNear=e.webGL===!0?-1:0,this.zFar=1,this.vertices={near:[new K,new K,new K,new K],far:[new K,new K,new K,new K]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4),e.reversedDepth===!0&&(this.zNear=1,this.zFar=0)}setFromProjectionMatrix(e,t){let n=this.zNear,r=this.zFar,i=e.elements[11]===0;return Hc.copy(e).invert(),this.vertices.near[0].set(1,1,n),this.vertices.near[1].set(1,-1,n),this.vertices.near[2].set(-1,-1,n),this.vertices.near[3].set(-1,1,n),this.vertices.near.forEach(function(e){e.applyMatrix4(Hc)}),this.vertices.far[0].set(1,1,r),this.vertices.far[1].set(1,-1,r),this.vertices.far[2].set(-1,-1,r),this.vertices.far[3].set(-1,1,r),this.vertices.far.forEach(function(e){e.applyMatrix4(Hc);let n=Math.abs(e.z);i?e.z*=Math.min(t/n,1):e.multiplyScalar(Math.min(t/n,1))}),this.vertices}split(t,n){for(;t.length>n.length;)n.push(new e);n.length=t.length;let r=this.vertices.near[0].z,i=this.vertices.far[0].z;for(let e=0;e<t.length;e++){let a=n[e];if(e===0)for(let e=0;e<4;e++)a.vertices.near[e].copy(this.vertices.near[e]);else{let n=(t[e-1]*i-r)/(i-r);for(let e=0;e<4;e++)a.vertices.near[e].lerpVectors(this.vertices.near[e],this.vertices.far[e],n)}if(e===t.length-1)for(let e=0;e<4;e++)a.vertices.far[e].copy(this.vertices.far[e]);else{let n=(t[e]*i-r)/(i-r);for(let e=0;e<4;e++)a.vertices.far[e].lerpVectors(this.vertices.near[e],this.vertices.far[e],n)}}}toSpace(e,t){for(let n=0;n<4;n++)t.vertices.near[n].copy(this.vertices.near[n]).applyMatrix4(e),t.vertices.far[n].copy(this.vertices.far[n]).applyMatrix4(e)}},Wc={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+_r.lights_pars_begin},Gc=new Ie,Kc=new Uc({webGL:!0}),qc=new K,Jc=new K,Yc=new We,Xc=[],Zc=[],Qc=new Ie,$c=new Ie,el=new K(0,1,0),tl=class{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||`practical`,this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new K(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new Uc({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this._createLights(),this.updateFrustums(),this._injectInclude()}_createLights(){for(let e=0;e<this.cascades;e++){let e=new U(16777215,this.lightIntensity);e.castShadow=!0,e.shadow.mapSize.width=this.shadowMapSize,e.shadow.mapSize.height=this.shadowMapSize,e.shadow.camera.near=this.lightNear,e.shadow.camera.far=this.lightFar,e.shadow.bias=this.shadowBias,this.parent.add(e),this.parent.add(e.target),this.lights.push(e)}}_initCascades(){let e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}_updateShadowBounds(){let e=this.frustums;for(let t=0;t<e.length;t++){let e=this.lights[t].shadow.camera,n=this.frustums[t],r=n.vertices.near,i=n.vertices.far,a=i[0],o;o=a.distanceTo(i[2])>a.distanceTo(r[2])?i[2]:r[2];let s=a.distanceTo(o);if(this.fade){let e=this.camera,t=Math.max(e.far,this.maxFar),r=.25*(n.vertices.far[0].z/(t-e.near))**2*(t-e.near);s+=r}e.left=-s/2,e.right=s/2,e.top=s/2,e.bottom=-s/2,e.updateProjectionMatrix()}}_getBreaks(){let e=this.camera,t=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case`uniform`:n(this.cascades,e.near,t,this.breaks);break;case`logarithmic`:r(this.cascades,e.near,t,this.breaks);break;case`practical`:i(this.cascades,e.near,t,.5,this.breaks);break;case`custom`:this.customSplitsCallback===void 0&&console.error(`CSM: Custom split scheme callback not defined.`),this.customSplitsCallback(this.cascades,e.near,t,this.breaks)}function n(e,t,n,r){for(let i=1;i<e;i++)r.push((t+(n-t)*i/e)/n);r.push(1)}function r(e,t,n,r){for(let i=1;i<e;i++)r.push(t*(n/t)**(i/e)/n);r.push(1)}function i(e,t,i,a,o){Xc.length=0,Zc.length=0,r(e,t,i,Zc),n(e,t,i,Xc);for(let t=1;t<e;t++)o.push(ft.lerp(Xc[t-1],Zc[t-1],a));o.push(1)}}update(){let e=this.camera,t=this.frustums;Qc.lookAt(Jc,this.lightDirection,el),$c.copy(Qc).invert();for(let n=0;n<t.length;n++){let r=this.lights[n],i=r.shadow.camera,a=(i.right-i.left)/this.shadowMapSize,o=(i.top-i.bottom)/this.shadowMapSize;Gc.multiplyMatrices($c,e.matrixWorld),t[n].toSpace(Gc,Kc);let s=Kc.vertices.near,c=Kc.vertices.far;Yc.makeEmpty();for(let e=0;e<4;e++)Yc.expandByPoint(s[e]),Yc.expandByPoint(c[e]);Yc.getCenter(qc),qc.z=Yc.max.z+this.lightMargin,qc.x=Math.floor(qc.x/a)*a,qc.y=Math.floor(qc.y/o)*o,qc.applyMatrix4(Qc),r.position.copy(qc),r.target.position.copy(qc),r.target.position.x+=this.lightDirection.x,r.target.position.y+=this.lightDirection.y,r.target.position.z+=this.lightDirection.z}}_injectInclude(){_r.lights_fragment_begin=Wc.lights_fragment_begin,_r.lights_pars_begin=Wc.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE=``);let t=[],n=this,r=this.shaders;e.onBeforeCompile=function(i){let a=Math.min(n.camera.far,n.maxFar);n._getExtendedBreaks(t),i.uniforms.CSM_cascades={value:t},i.uniforms.cameraNear={value:n.camera.near},i.uniforms.shadowFar={value:a},r.set(e,i)},r.set(e,null)}_updateUniforms(){let e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(t,n){if(t!==null){let n=t.uniforms;this._getExtendedBreaks(n.CSM_cascades.value),n.cameraNear.value=this.camera.near,n.shadowFar.value=e}!this.fade&&`CSM_FADE`in n.defines?(delete n.defines.CSM_FADE,n.needsUpdate=!0):this.fade&&!(`CSM_FADE`in n.defines)&&(n.defines.CSM_FADE=``,n.needsUpdate=!0)},this)}_getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new Bt);e.length=this.breaks.length;for(let t=0;t<this.cascades;t++){let n=this.breaks[t],r=this.breaks[t-1]||0;e[t].x=r,e[t].y=n}}updateFrustums(){this._getBreaks(),this._initCascades(),this._updateShadowBounds(),this._updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){let e=this.shaders;e.forEach(function(e,t){delete t.onBeforeCompile,delete t.defines.USE_CSM,delete t.defines.CSM_CASCADES,delete t.defines.CSM_FADE,e!==null&&(delete e.uniforms.CSM_cascades,delete e.uniforms.cameraNear,delete e.uniforms.shadowFar),t.needsUpdate=!0}),e.clear()}};function nl(e,t=28,n=!1){let r=e.length,i=n?Math.max(1,r-1):r,o=[];for(let s=0;s<i;s++){let c=e[n?Math.max(0,s-1):(s-1+r)%r],l=e[s],u=e[n?Math.min(r-1,s+1):(s+1)%r],d=e[n?Math.min(r-1,s+2):(s+2)%r];for(let e=0;e<t;e++){let n=e/t,r=(s+n)/i;o.push({x:a(c.x,l.x,u.x,d.x,n),z:a(c.z,l.z,u.z,d.z,n),t:r})}}if(n){let t=e[r-1];o.push({x:t.x,z:t.z,t:1})}return o}function rl(e){let t=!e.open,n=nl(e.points,30,!!e.open),r=[],i=0,a=[];for(let r=0;r<n.length;r++){let o=n[r],s=n[t?(r+1)%n.length:Math.min(r+1,n.length-1)],c=s.x-o.x,l=s.z-o.z,u=Math.hypot(c,l)||.01;a.push({x:o.x,z:o.z,y:e.elevation(o.t),t:o.t,ds:u}),i+=u}let o=0;for(let e=0;e<a.length;e++){let n=a[t?(e-1+a.length)%a.length:Math.max(0,e-1)],i=a[t?(e+1)%a.length:Math.min(a.length-1,e+1)],s=i.x-n.x,c=i.z-n.z,l=Math.hypot(s,c)||1,u=s/l,d=c/l,f=d,p=-u;if(e>0){let t=r[e-1];f*t.rx+p*t.rz<0&&(f=-f,p=-p)}let m=a[e];r.push({x:m.x,y:m.y,z:m.z,tx:u,tz:d,rx:f,rz:p,t:m.t,s:o}),o+=m.ds}if(t&&r.length>1){let e=r[0],t=r[r.length-1];e.rx*t.rx+e.rz*t.rz<0&&(t.rx=-t.rx,t.rz=-t.rz)}let s=[];for(let n=0;n<e.checkpointCount;n++)s.push(t?n/e.checkpointCount:(n+1)/(e.checkpointCount+.15));return{samples:r,length:i,width:Math.max(18.5,e.width),checkpoints:s,closed:t}}function Q(e,t,n,r,i=!0){let a=e.length,o=Math.max(0,Math.min(a-1,(r%a+a)%a)),s=o,c=1/0;for(let r=-88;r<=88;r++){let l=i?((o+r)%a+a)%a:Math.max(0,Math.min(a-1,o+r)),u=e[l],d=(u.x-t)*(u.x-t)+(u.z-n)*(u.z-n)+r*r*.55;d<c&&(c=d,s=l)}if((e[s].x-t)*(e[s].x-t)+(e[s].z-n)*(e[s].z-n)>19600)for(let r=0;r<a;r+=2){let i=e[r],l=(i.x-t)*(i.x-t)+(i.z-n)*(i.z-n),u=Math.min(Math.abs(r-o),a-Math.abs(r-o)),d=l+u*u*.25;d<c&&(c=d,s=r)}let l=e[s];return{index:s,dist:Math.hypot(l.x-t,l.z-n)}}function il(e,t){let n=e.length,r=(t%1+1)%1;return e[Math.min(n-1,Math.floor(r*n))]}var al=[[`דיזנגוף`,`Dizengoff`],[`אלנבי`,`Allenby`],[`שינקין`,`Sheinkin`],[`בן יהודה`,`Ben Yehuda`],[`רוטשילד`,`Rothschild`],[`בוגרשוב`,`Bugrashov`],[`פרישמן`,`Frischmann`],[`גורדון`,`Gordon`],[`נחלת בנימין`,`Nahalat Binyamin`],[`הרצל`,`Herzl`],[`המלך ג'ורג'`,`King George`],[`יפו`,`Jaffa St`],[`אגרון`,`Agron`],[`עמק רפאים`,`Emek Refaim`]],ol=[[`ברודוויי`,`Broadway`],[`השדרה השביעית`,`7th Avenue`],[`השדרה החמישית`,`Fifth Avenue`],[`רחוב 42`,`42nd Street`],[`רחוב 34`,`34th Street`],[`מדיסון`,`Madison Ave`],[`לקסינגטון`,`Lexington Ave`],[`אמסטרדם`,`Amsterdam Ave`],[`קולומבוס`,`Columbus Ave`],[`מרסר`,`Mercer St`],[`ספרינג`,`Spring St`],[`פרונט`,`Front Street`],[`קדמן פלאזה`,`Cadman Plaza`]];function sl(e,t,n){for(let r of e)if(Math.abs(t-r.x)<r.w*.42&&Math.abs(n-r.z)<r.d*.42)return!0;return!1}function cl(e,t,n){for(let r of e.clearZones??[])if(Math.abs(t-r.x)<r.w*.5&&Math.abs(n-r.z)<r.d*.5)return!0;return!1}function ll(e,t,n){if(e.id===`ayalon`)return[];let r=e.city===`nyc`?ol:al,i=[],a=e.theme===`park`,o=e.id===`gushdan`,s=o?30:a?78:e.theme===`highway`?62:46,c=o?54:a?24:38,l=o?6.2:a?4.4:5.7,u=10,d=0;for(let a of t.samples){if(a.s<u||(u=a.s+s,a.y>6.5))continue;let o=r[d%r.length];for(let r of[-1,1]){let s=t.width/2+2.6,u=a.x+a.rx*s*r,f=a.z+a.rz*s*r,p=a.x+a.rx*(s+c)*r,m=a.z+a.rz*(s+c)*r,h=(u+p)*.5,g=(f+m)*.5;sl(n,h,g)||cl(e,h,g)||sl(n,p,m)||(i.push({ax:u,az:f,bx:p,bz:m,half:l,he:o[0],en:o[1]}),d+=1)}if(i.length>=28)break}return i}function ul(e,t,n){let r=n.bx-n.ax,i=n.bz-n.az,a=r*r+i*i||1,o=s(((e-n.ax)*r+(t-n.az)*i)/a,0,1),c=n.ax+o*r,l=n.az+o*i;return{dist:Math.hypot(e-c,t-l),qx:c,qz:l,t:o}}function dl(e,t,n){let r=null,i=1/0,a={dist:1/0,qx:e,qz:t,t:0};for(let o of n){let n=ul(e,t,o);n.dist<i&&(i=n.dist,r=o,a=n)}return r?{street:r,...a}:null}function fl(e,t,n,r=0){let i=null;for(let a of n){let n=e-a.x,o=t-a.z,c=n*a.sx+o*a.sz,l=n*a.sz-o*a.sx;if(Math.abs(c)<=a.len*.5&&Math.abs(l)<=a.half){let e=s(c/a.len+.5,0,1),t=a.y0+(a.y1-a.y0)*e,n=(a.y1-a.y0)/a.len,o=Math.abs(t-r);(!i||o+.04<i.score||o<=i.score+.04&&t>i.y&&t<=r+1.2)&&(i={r:a,y:t,dyds:n,score:o})}}return i}var pl=class{x=0;y=0;z=0;yaw=0;vx=0;vz=0;vy=0;speed=0;drifting=!1;driftCharge=0;driftScore=0;boostT=0;nitro=.35;nitroPulse=!1;pitch=0;impact=0;lastHit=``;onTrack=!0;sideStreet=``;sideStreetEn=``;progress=0;sampleIndex=0;lastCheckpoint=0;nextCheckpoint=1;lap=0;wrongWayT=0;offTrackT=0;roam=!1;finished=!1;eliminated=!1;isAi=!1;isTraffic=!1;isCop=!1;aiSkill=1;aiOffset=0;weatherGrip=1;damage=0;drafting=!1;roll=0;surfaceGrip=1;slip=0;gear=1;rpm=0;yawRate=0;kinMix=0;surfaceKind=`asphalt`;baseGrip=1;dirt=0;airborne=!1;airMs=0;rideCompress=0;wasCurb=!1;comboMul=1;wheelsLocked=!1;driftAngle=0;reverseHold=0;handling=`simcade`;assists={...Yn};weather=`clear`;absActive=!1;tcsActive=!1;escActive=!1;slipRatio=0;stats;name;nitroHeld=!1;constructor(e,t){this.stats=e,this.name=t}spawn(e,t,n){let r=il(e.samples,t);this.x=r.x+r.rx*n,this.z=r.z+r.rz*n,this.y=r.y,this.yaw=Math.atan2(-r.tx,-r.tz),this.vx=0,this.vz=0,this.vy=0,this.speed=0,this.progress=t,this.sampleIndex=Math.floor(t*e.samples.length)%e.samples.length,this.nextCheckpoint=1,this.lastCheckpoint=0,this.lap=0,this.boostT=0,this.driftCharge=0,this.driftScore=0,this.nitro=this.isTraffic?0:this.stats.nitroStart??.35,this.pitch=0,this.roll=0,this.gear=1,this.rpm=0,this.yawRate=0,this.impact=0,this.damage=0,this.dirt=0,this.finished=!1,this.eliminated=!1,this.wrongWayT=0,this.airborne=!1,this.airMs=0,this.rideCompress=0,this.wasCurb=!1}step(e,t,n,i,a=[],o=[],c=[]){if(this.impact=0,this.lastHit=``,this.nitroPulse=!1,this.finished||this.eliminated){this.speed*=Math.exp(-2.2*e),this.integrateMotion(e,n,0,a,o,c),this.pitch=r(this.pitch,0,8,e);return}let l=this.stats,u=nr[this.handling],d=An[this.weather]??An.clear,f=this.boostT>0,p=1-this.damage*.28,m=l.maxSpeed*(f?1.18:1)*(this.isAi&&!this.isCop?this.aiSkill:1)*p,h=l.body===`ev`,g=Math.abs(this.speed)/Math.max(8,m);if(h)this.gear=1,this.rpm=s(g,0,1);else{let e=[.2,.38,.56,.76,1.08],t=this.gear;g>e[t-1]+.02&&(t=Math.min(5,t+1)),t>1&&g<e[t-2]-.04&&--t,t!==this.gear&&i&&(this.speed*=.94),this.gear=t;let n=t===1?0:e[t-2],r=e[t-1];this.rpm=s((g-n)/Math.max(.06,r-n),0,1)}let _=Math.max(.7,l.mass||1);h?1.06-g*.2:[1.22,1.08,.98,.88,.8][this.gear-1];let v=1+s(g,0,1)*(l.body===`super`?.24:l.body===`rally`?.07:.1);this.wheelsLocked=!1,this.absActive=!1,this.tcsActive=!1,this.escActive=!1;let y=this.speed,b=Math.abs(y),x=l.drag*.00155*b*b,S=ar[this.surfaceKind]??ar.asphalt,C=b>.2?(1.15+(this.onTrack?0:l.body===`rally`?1.15:3.4))*S.roll*d.roll:0,w=Math.max(.02,1-s(b/Math.max(8,m),0,1)**2.1),T=-Math.sin(this.yaw),E=-Math.cos(this.yaw),D=Math.cos(this.yaw),O=-Math.sin(this.yaw),k=this.vx*T+this.vz*E,A=this.speed;this.slipRatio=(A-k)/Math.max(4.2,Math.abs(k));let j=t.throttle,M=t.brake,N=Sn(j,this.slipRatio,this.assists.tcs&&i);j=N.throttle,this.tcsActive=N.active;let P=Nn(M,this.slipRatio,this.assists.abs&&i);if(M=P.brake,this.absActive=P.active,i){if(j>0&&M<=.1){let t=27.778,n=t/Math.max(3.2,l.zeroTo100??8)*j*_*d.long*S.long*(f?1.08:1)*(this.drafting?1.05:1),r=b<=t?1:Math.max(.02,w);this.speed+=n/_*r*e}if(M>0){let t=Math.abs(this.speed);this.wheelsLocked=!this.assists.abs&&M>.92&&t>18;let n=Zn(M,l.brake,this.pitch)*d.long*S.long;this.speed>.5?(this.speed-=n*e,this.reverseHold=0):(this.reverseHold+=e,this.reverseHold>=.25?this.speed-=M*l.accel*.28*e:this.speed=Math.max(0,this.speed-n*e))}else this.reverseHold=0;let t=(x/_+C)*e+(j<=.05&&M<=0&&b>3?(h?.9:2.2+this.gear*.4)*e:0);Math.abs(this.speed)<=t?j<=0&&M<=0&&(this.speed=0):this.speed-=Math.sign(this.speed)*t}else this.speed*=Math.exp(-2.4*e);let F=i&&!this.isTraffic&&t.nitro&&this.nitro>.02;F&&(this.nitro=Math.max(0,this.nitro-e*(l.nitroDrain??.42)),this.boostT=Math.max(this.boostT,.14),this.speed+=l.accel*.55*u.nitroMul*e,this.nitroHeld||(this.nitroPulse=!0)),this.nitroHeld=F,f&&(this.speed+=l.accel*.28*u.nitroMul*e,this.boostT-=e),this.speed=s(this.speed,-m*.32,m*(F?1.08:1));{let t=n.samples[this.sampleIndex],r=n.samples[Math.min(this.sampleIndex+1,n.samples.length-1)],a=Math.hypot(r.x-t.x,r.z-t.z)||1,o=(r.y-t.y)/a,s=fl(this.x,this.z,c,this.y);if(s){let e=this.vx*s.r.sx+this.vz*s.r.sz;o=s.dyds*Math.sign(e||1)}i&&(this.speed+=-o*16.2*e,o>.04&&(this.speed-=o*7.4*e))}let I=Math.abs(this.speed),ee=i?M*.72-j*.48:0,L=this.sampleIndex,R=n.samples[L],te=n.samples[Math.min(L+1,n.samples.length-1)],ne=Math.hypot(te.x-R.x,te.z-R.z)||1,re=s(-(fl(this.x,this.z,c,this.y)?.dyds??(te.y-R.y)/ne)*3.4,-.75,.75);this.pitch=r(this.pitch,ee+re,9,e);let z=i?-t.steer*s(I/24,0,1)*.34:0;this.roll=r(this.roll,z,7,e);let B=s(.5+this.pitch*.42,.32,.7),ie=this.speed>=0?1:-1,ae=i&&t.drift&&I>9&&Math.abs(t.steer)>.18,V=this.onTrack?l.grip:l.grip*(l.body===`rally`?.78:.4);if(V*=this.weatherGrip*this.surfaceGrip*v*u.gripMul*d.lat*S.lat,V*=1-this.damage*.22,V*=.84+B*.28,V*=1-this.rideCompress*1.6,V*=1/(1+(I/32)**2),V*=Ln(I,d.hydro),this.wheelsLocked&&(V*=.42),ae&&(V=Math.min(V,.22+(1-B)*.12)),this.stepWheels(e,t.steer,V,I,T,E,D,O,i,ie,ae,B,_),this.integrateMotion(e,n,V,a,o,c),ae){if(this.drifting=!0,this.driftCharge=Math.min(this.driftCharge+e*.9,2.1),this.nitro=Math.min(1,this.nitro+e*.2),this.driftAngle=Math.asin(s(this.slip,0,1))*57.3,!this.isAi){let t=this.driftAngle,n=t<12?.38:t>52?.55:t>18&&t<42?1.42:1;this.driftScore+=I*(.55+this.driftCharge)*e*14*n*this.comboMul}}else this.drifting&&this.driftCharge>.55&&i&&(this.boostT=Math.min(.4+this.driftCharge*.55*u.driftBoost,1.55),this.nitro=Math.min(1,this.nitro+this.driftCharge*.16),!this.isAi&&this.comboMul>1.2&&(this.driftScore+=70*this.comboMul)),this.drifting=!1,this.driftCharge=Math.max(0,this.driftCharge-e*1.7),this.driftAngle=Math.max(0,this.driftAngle-e*40),!F&&!this.isTraffic&&(this.nitro=Math.min(1,this.nitro+e*.012));this.onTrack?this.offTrackT=0:this.offTrackT+=e,!this.isTraffic&&!this.isCop&&(!this.onTrack||this.surfaceKind===`sand`?this.dirt+=e*.075:this.surfaceKind===`curb`&&(this.dirt+=e*.028),this.drifting&&(this.dirt+=e*.045),this.weatherGrip<.95&&this.onTrack&&(this.dirt-=e*.11),this.dirt=s(this.dirt,0,1)),this.offTrackT>3.2&&this.respawn(n)}stepWheels(e,t,r,i,a,o,c,l,u,d,f,p,m){let h=2.55,g=.76,_=m*2.85,v=.5*(1-.4*s(i/36,0,1)),y=(u?t:0)*v*d,b=[h*.5,h*.5,-1.275,-1.275],x=[-.76,g,-.76,g],S=[y,y,0,0],C=[p*.5,p*.5,(1-p)*.5,(1-p)*.5],w=0;for(let e=0;e<4;e++){let t=this.yaw+S[e],n=Math.cos(t),i=-Math.sin(t),s=a*b[e]+c*x[e],u=o*b[e]+l*x[e],d=this.vx-this.yawRate*u,f=this.vz+this.yawRate*s,p=-Math.sin(t),m=-Math.cos(t),h=d*p+f*m,g=d*n+f*i,_=-Fn(Math.atan2(g,Math.max(2.2,Math.abs(h))),Math.max(.08,r*C[e]*4));w+=s*i*_-u*n*_}let T=s(i/7.5,0,1)*(1-.4*s(i/38,0,1)),E=1-s((i-4)/6,0,1);this.kinMix=E;let D=t*1.7*s(i/6.5,0,1)*d*(f?1.28:1)*(.92+p*.16),O=w/_*80;this.yawRate=D*E+O;let k=this.vx*c+this.vz*l,A=Gn(Math.atan2(k,Math.max(2.4,i)),this.yawRate,this.assists.esc&&u,f);this.escActive=A.active,this.yawRate+=A.yaw*1.55*T,this.yaw=n(this.yaw+this.yawRate*e),this.vx=a*this.speed+c*k,this.vz=o*this.speed+l*k}integrateMotion(e,t,r,i=[],a=[],c=[]){let l=-Math.sin(this.yaw),u=-Math.cos(this.yaw),d=Math.cos(this.yaw),f=-Math.sin(this.yaw),p=this.vx*d+this.vz*f,m=Math.hypot(this.speed,p),h=Math.abs(p)/Math.max(m,2.2);this.slip=h;let g=Math.max(.12,Math.abs(Fn(h,r)));p*=Math.exp(-g*8.4*e);let _=p*(h>.3?.028:-.006);this.yaw=n(this.yaw+_*e),this.vx=l*this.speed+d*p,this.vz=u*this.speed+f*p;let v=m>25?2:1,y=e/v;for(let e=0;e<v;e++)this.x+=this.vx*y,this.z+=this.vz*y,this.hitColliders(i);let b=Q(t.samples,this.x,this.z,this.sampleIndex,t.closed);this.sampleIndex=b.index;let x=t.samples[b.index],S=fl(this.x,this.z,c,this.y),C=1.25,w=.72,T=[[this.x+l*C+d*w,this.z+u*C+f*w],[this.x+l*C-d*w,this.z+u*C-f*w],[this.x-l*C+d*w,this.z-u*C+f*w],[this.x-l*C-d*w,this.z-u*C-f*w]],E=0,D=1e9,O=-1e9;for(let[e,n]of T){let r=fl(e,n,c,this.y),i=r?r.y:t.samples[Q(t.samples,e,n,b.index,t.closed).index].y;E+=i,i<D&&(D=i),i>O&&(O=i)}let k=E*.25;this.rideCompress=s(O-D,0,.12);let A=S?S.y:k,j=b.dist,M=t.width/2,N=j/Math.max(.5,M),P=!S&&N>.9&&N<1.08;if(S)this.y=A,this.vy=0,this.airborne=!1,this.airMs=0,this.wasCurb=!1;else if(P&&!this.wasCurb&&m>10&&(this.vy+=3.6),this.wasCurb=P,this.vy-=18*e,this.y+=this.vy*e,this.y<=A+.04)this.y=A,this.vy<0&&(this.vy=0),this.airborne=!1,this.airMs=0;else{this.y>A+.55?this.airMs+=e*1e3:this.airMs=0,this.airborne=this.airMs>=12;let t=this.vy>2||this.airborne?A+8:A+.85;this.y>t&&(this.y=t,this.vy=Math.min(0,this.vy))}let F=dl(this.x,this.z,a),I=!!(F&&F.dist<F.street.half*1.05),ee=!!S,L=j<M*(this.roam?1.35:1.02);if(this.onTrack=L||I||ee||this.roam&&j<M*2.6,this.sideStreet=ee?S.r.he:I&&!L?F.street.he:``,this.sideStreetEn=ee?S.r.en:I&&!L?F.street.en:``,this.onTrack?N>.9&&!ee?(this.surfaceKind=`curb`,this.surfaceGrip=this.baseGrip*.74):(this.surfaceKind=`asphalt`,this.surfaceGrip=this.baseGrip*(N>.72&&this.weatherGrip<.95?.86:1)):(this.surfaceKind=`sand`,this.surfaceGrip=this.baseGrip*.54),this.onTrack||(this.speed*=Math.exp(-(this.roam?.9:this.stats.body===`rally`?1.15:2.6)*e)),I&&!L&&F){let e=F.street.half+1.35;if(F.dist>e){let t=(this.x-F.qx)/(F.dist||1),n=(this.z-F.qz)/(F.dist||1);this.x=F.qx+t*e,this.z=F.qz+n*e;let r=this.vx*t+this.vz*n;r>0&&(this.vx-=t*r*1.2,this.vz-=n*r*1.2,this.speed*=.88)}}else if(!ee){let e=M+.35;if(j>e){let t=(this.x-x.x)/(j||1),n=(this.z-x.z)/(j||1);this.x=x.x+t*e,this.z=x.z+n*e;let r=this.vx*t+this.vz*n;if(r>0){this.vx-=t*r,this.vz-=n*r;let e=-Math.sin(this.yaw),i=-Math.cos(this.yaw);this.speed=this.vx*e+this.vz*i,r>8&&(this.speed*=.9,this.impact=Math.max(this.impact,Math.min(.35,r/36)),this.damage=s(this.damage+r*.004,0,1))}}}if(j>92){let e=(this.x-x.x)/(j||1),t=(this.z-x.z)/(j||1);this.x=x.x+e*92,this.z=x.z+t*92}let R=this.progress;this.progress=x.t,o(R,this.progress,t.closed)<-.002&&Math.abs(this.speed)>4&&L?this.wrongWayT+=e:this.wrongWayT=Math.max(0,this.wrongWayT-e*1.4)}hitColliders(e){for(let t of e){let e=1.05,r=0,i=0,a=0;if(t.hx!=null&&t.hz!=null){let n=this.x-t.x,o=this.z-t.z,s=t.yaw??0,c=Math.cos(s),l=Math.sin(s),u=n*c-o*l,d=n*l+o*c,f=t.hx+e-Math.abs(u),p=t.hz+e-Math.abs(d);if(f<=0||p<=0)continue;let m=0,h=0;f<p?(m=u<0?-1:1,u=m*(t.hx+e),a=f):(h=d<0?-1:1,d=h*(t.hz+e),a=p),this.x=t.x+u*c+d*l,this.z=t.z-u*l+d*c,r=m*c+h*l,i=-m*l+h*c}else{let e=this.x-t.x,n=this.z-t.z,o=Math.hypot(e,n);if(o>=t.r||o<1e-4)continue;r=e/o,i=n/o,this.x=t.x+r*t.r,this.z=t.z+i*t.r,a=t.r-o}let o=this.vx*r+this.vz*i;if(o<0){let e=Math.max(-o,a),c=t.kind??`barrier`;this.lastHit=c;let l=-Math.sin(this.yaw),u=-Math.cos(this.yaw);c===`building`?(this.vx-=r*o,this.vz-=i*o,this.speed*=e>10?.02:e>5?.07:.14,this.yaw=n(this.yaw+(r*u-i*l)*.12*Math.min(1,e/9)),this.damage=s(this.damage+e*.085,0,1),e>2.5&&(this.impact=Math.max(this.impact,Math.min(1,e/7)))):c===`car`?(this.vx-=r*o*.68,this.vz-=i*o*.68,this.speed=this.vx*l+this.vz*u,this.speed*=e>14?.58:e>7?.76:.88,this.damage=s(this.damage+e*.02,0,1),e>4&&(this.impact=Math.max(this.impact,Math.min(.55,e/20)))):(this.vx-=r*o*1.08,this.vz-=i*o*1.08,this.speed=this.vx*l+this.vz*u,this.speed*=e>12?.78:.92,e>9&&(this.damage=s(this.damage+e*.008,0,1),this.impact=Math.max(this.impact,Math.min(.38,e/30))))}}}consumeCheckpoints(e,t){if(this.finished||this.isTraffic||this.isCop||this.eliminated)return{lapComplete:!1,checkpoint:!1};let n=o(t,this.progress,e.closed);if(n<0||n>.18)return{lapComplete:!1,checkpoint:!1};if(!e.closed&&this.progress>.96&&this.lap<1)return this.lap+=1,this.lastCheckpoint=e.checkpoints.length-1,{lapComplete:!0,checkpoint:!0};let r=e.checkpoints.length,i=!1,a=!1,s=e.checkpoints[this.nextCheckpoint]??0;return this.didCross(t,this.progress,s)&&(i=!0,this.lastCheckpoint=this.nextCheckpoint,this.nextCheckpoint=(this.nextCheckpoint+1)%r,this.lastCheckpoint===0&&(this.lap+=1,a=!0)),{lapComplete:a,checkpoint:i}}didCross(e,t,n){return e<=t?e<n&&t>=n:e<n||t>=n}respawn(e){let t=e.checkpoints[this.lastCheckpoint]??this.progress,n=il(e.samples,t);this.x=n.x+n.rx*this.aiOffset,this.z=n.z+n.rz*this.aiOffset,this.y=n.y,this.yaw=Math.atan2(-n.tx,-n.tz),this.vx=0,this.vz=0,this.vy=0,this.speed=0,this.offTrackT=0,this.progress=n.t}snap(){return{x:this.x,y:this.y,z:this.z,yaw:this.yaw,vx:this.vx,vz:this.vz,vy:this.vy,speed:this.speed,progress:this.progress,sampleIndex:this.sampleIndex,lap:this.lap,lastCheckpoint:this.lastCheckpoint,nextCheckpoint:this.nextCheckpoint,nitro:this.nitro,driftCharge:this.driftCharge,driftScore:this.driftScore,damage:this.damage,pitch:this.pitch,boostT:this.boostT,finished:this.finished,eliminated:this.eliminated,offTrackT:this.offTrackT,wrongWayT:this.wrongWayT,roll:this.roll,gear:this.gear,yawRate:this.yawRate}}load(e){this.x=e.x,this.y=e.y,this.z=e.z,this.yaw=e.yaw,this.vx=e.vx,this.vz=e.vz,this.vy=e.vy??0,this.speed=e.speed,this.progress=e.progress,this.sampleIndex=e.sampleIndex,this.lap=e.lap,this.lastCheckpoint=e.lastCheckpoint,this.nextCheckpoint=e.nextCheckpoint,this.nitro=e.nitro,this.driftCharge=e.driftCharge,this.driftScore=e.driftScore,this.damage=e.damage,this.pitch=e.pitch,this.boostT=e.boostT,this.finished=e.finished,this.eliminated=e.eliminated,this.offTrackT=e.offTrackT,this.wrongWayT=e.wrongWayT,this.roll=e.roll??0,this.gear=e.gear??this.gear,this.yawRate=e.yawRate??0}raceScore(){return this.lap*1e3+this.lastCheckpoint*10+this.progress}},ml={jaffa:.76,stone:.8,desert:.62,park:.86,carmel:.9,port:.88,highway:.94,manhattan:.92,bauhaus:.94,snow:.5};function hl(e,t,r){let i=.045+s(e.speed/80,0,.04),a=t.closed?(e.progress+i)%1:Math.min(.995,e.progress+i),o=il(t.samples,a),c=o.x+o.rx*e.aiOffset,l=o.z+o.rz*e.aiOffset,u=n(Math.atan2(-(c-e.x),-(l-e.z))-e.yaw),d=s(u*1.6,-1,1),f=Math.abs(u),p=il(t.samples,t.closed?(e.progress+.09)%1:Math.min(.995,e.progress+.09)),m=Math.abs(n(Math.atan2(-p.tx,-p.tz)-e.yaw)),h=f>.55?.35:1;if(r&&nr[e.handling].rubberBand){let t=r.raceScore()-e.raceScore(),n=1+s(t*.004,-.12,.08);h*=e.aiSkill*n}else h*=e.aiSkill;m>.42&&(h*=.5),m>.75&&(h*=.55);let g=f>.85&&e.speed>22||m>.82?.48:0,_=f>.5&&e.speed>16,v=e.nitro>.4&&f<.22&&e.speed>16;return{steer:s(d,-1,1),throttle:s(h,0,1),brake:s(g,0,1),drift:_,nitro:v}}function gl(e,t){let r=.028,i=t.closed?(e.progress+r)%1:Math.min(.995,e.progress+r),a=il(t.samples,i),o=a.x+a.rx*e.aiOffset,c=a.z+a.rz*e.aiOffset,l=n(Math.atan2(-(o-e.x),-(c-e.z))-e.yaw),u=s(l*1.35,-1,1),d=12+e.aiSkill*7;return{steer:s(u,-1,1),throttle:e.speed<d?.58:.1,brake:Math.abs(l)>.65&&e.speed>11?.45:0,drift:!1,nitro:!1}}function _l(e,t,r,i=.4){let a=r.x-e.x,o=r.z-e.z,c=Math.hypot(a,o),l=Math.atan2(-a,-o),u=il(t.samples,(e.progress+.03)%1),d=Math.atan2(-(u.x+u.rx*e.aiOffset-e.x),-(u.z+u.rz*e.aiOffset-e.z)),f=c<55?.72+i*.22:.32+i*.2,p=n(d+n(l-d)*f),m=n(p-e.yaw),h=s(m*(2.05+i*.4),-1,1),g=Math.cos(e.yaw),_=-Math.sin(e.yaw),v=a*g+o*_;c<14&&i>.35&&(h=s(h+Math.sign(v)*.28,-1,1));let y=c>7?1:.4,b=Math.abs(m)>1.05&&e.speed>20?.42:0,x=Math.abs(m)>.62&&e.speed>15,S=c>20&&e.nitro>.08;return{steer:s(h,-1,1),throttle:s(y,0,1),brake:s(b,0,1),drift:x,nitro:S}}function vl(e,t){if(e.drafting=!1,!(e.finished||Math.abs(e.speed)<10))for(let n of t){if(n===e||n.eliminated)continue;let t=-Math.sin(n.yaw),r=-Math.cos(n.yaw),i=e.x-n.x,a=e.z-n.z,o=-(i*t+a*r),s=Math.abs(i*Math.cos(n.yaw)+a*-Math.sin(n.yaw));if(o>3.4&&o<14&&s<2.5&&n.speed>11){e.drafting=!0;return}}}function yl(e){let t=e.length,n=2.45,r=0;for(let i=0;i<t;i++)for(let a=i+1;a<t;a++){let t=e[i],o=e[a],c=t.x-o.x,l=t.z-o.z,u=Math.hypot(c,l);if(u>=n||u<1e-4)continue;let d=c/u,f=l/u,p=t.stats.mass||1,m=o.stats.mass||1,h=p+m,g=n-u;t.x+=d*g*(m/h),t.z+=f*g*(m/h),o.x-=d*g*(p/h),o.z-=f*g*(p/h);let _=(t.vx-o.vx)*d+(t.vz-o.vz)*f;if(_>=0)continue;let v=-1.42*_/(1/p+1/m);t.vx+=v/p*d,t.vz+=v/p*f,o.vx-=v/m*d,o.vz-=v/m*f;let y=-_,b=-Math.sin(t.yaw),x=-Math.cos(t.yaw),S=-Math.sin(o.yaw),C=-Math.cos(o.yaw);t.speed=t.vx*b+t.vz*x,o.speed=o.vx*S+o.vz*C;let w=s(y/34,.04,.32);if(t.speed*=1-m/h*w*.45,o.speed*=1-p/h*w*.45,t.damage=s(t.damage+y*.014*(m/h),0,1),o.damage=s(o.damage+y*.014*(p/h),0,1),!t.isAi||!o.isAi){r=Math.max(r,y);let e=Math.min(.55,y/22);t.isAi||(t.impact=Math.max(t.impact,e)),o.isAi||(o.impact=Math.max(o.impact,e))}}return r}var bl=class e extends J{constructor(){super(e.Geometry,new Ct({opacity:0,transparent:!0})),this.isLensflare=!0,this.type=`Lensflare`,this.frustumCulled=!1,this.renderOrder=1/0;let t=new K,n=new K,r=new kt(16,16),i=new kt(16,16),a=He,o=e.Geometry,s=new It({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),c=new It({uniforms:{map:{value:r},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),l=new J(o,s),u=[],d=xl.Shader,f=new It({name:d.name,uniforms:{map:{value:null},occlusionMap:{value:i},color:{value:new D(16777215)},scale:{value:new Bt},screenPosition:{value:new K}},vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:2,transparent:!0,depthWrite:!1}),p=new J(o,f);this.addElement=function(e){u.push(e)};let m=new Bt,h=new Bt,g=new qe,_=new Rt;this.onBeforeRender=function(e,d,v){e.getCurrentViewport(_);let y=e.getRenderTarget(),b=y===null?He:y.texture.type;a!==b&&(r.dispose(),i.dispose(),r.type=i.type=b,a=b);let x=_.w/_.z,S=_.z/2,C=_.w/2,w=16/_.w;if(m.set(w*x,w),g.min.set(_.x,_.y),g.max.set(_.x+(_.z-16),_.y+(_.w-16)),n.setFromMatrixPosition(this.matrixWorld),n.applyMatrix4(v.matrixWorldInverse),!(n.z>0)&&(t.copy(n).applyMatrix4(v.projectionMatrix),h.x=_.x+t.x*S+S-8,h.y=_.y+t.y*C+C-8,g.containsPoint(h))){e.copyFramebufferToTexture(r,h);let n=s.uniforms;n.scale.value=m,n.screenPosition.value=t,e.renderBufferDirect(v,null,o,s,l,null),e.copyFramebufferToTexture(i,h),n=c.uniforms,n.scale.value=m,n.screenPosition.value=t,e.renderBufferDirect(v,null,o,c,l,null);let a=-t.x*2,d=-t.y*2;for(let n=0,r=u.length;n<r;n++){let r=u[n],i=f.uniforms;i.color.value.copy(r.color),i.map.value=r.texture,i.screenPosition.value.x=t.x+a*r.distance,i.screenPosition.value.y=t.y+d*r.distance,w=r.size/_.w;let s=_.w/_.z;i.scale.value.set(w*s,w),f.uniformsNeedUpdate=!0,e.renderBufferDirect(v,null,o,f,p,null)}}},this.dispose=function(){s.dispose(),c.dispose(),f.dispose(),r.dispose(),i.dispose();for(let e=0,t=u.length;e<t;e++)u[e].texture.dispose()}}},xl=class{constructor(e,t=1,n=0,r=new D(16777215)){this.texture=e,this.size=t,this.distance=n,this.color=r}};xl.Shader={name:`LensflareElementShader`,uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`},bl.Geometry=(function(){let e=new zt,t=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),n=new A(t,5);return e.setIndex([0,1,2,0,2,3]),e.setAttribute(`position`,new E(n,3,0,!1)),e.setAttribute(`uv`,new E(n,2,3,!1)),e})();var Sl=class e extends J{constructor(t,n={}){super(t),this.isReflector=!0,this.type=`Reflector`,this.forceUpdate=!1,this._reflectionCameras=new WeakMap;let r=this,i=n.color===void 0?new D(8355711):new D(n.color),a=n.textureWidth||512,o=n.textureHeight||512,s=n.clipBias||0,c=n.shader||e.ReflectorShader,l=n.multisample===void 0?4:n.multisample,u=new T,d=new K,f=new K,p=new K,m=new Ie,h=new K(0,0,-1),g=new Rt,_=new K,v=new K,y=new Rt,x=new Ie,S=new Pt(a,o,{samples:l,type:Ye}),C=new b({name:c.name===void 0?`unspecified`:c.name,uniforms:Dt.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});C.uniforms.tDiffuse.value=S.texture,C.uniforms.color.value=i,C.uniforms.textureMatrix.value=x,this.material=C,this.onBeforeRender=function(e,t,n){let i=this.getReflectionCamera(n);if(f.setFromMatrixPosition(r.matrixWorld),p.setFromMatrixPosition(n.matrixWorld),m.extractRotation(r.matrixWorld),d.set(0,0,1),d.applyMatrix4(m),_.subVectors(f,p),_.dot(d)>0&&this.forceUpdate===!1)return;_.reflect(d).negate(),_.add(f),m.extractRotation(n.matrixWorld),h.set(0,0,-1),h.applyMatrix4(m),h.add(p),v.subVectors(f,h),v.reflect(d).negate(),v.add(f),i.position.copy(_),i.up.set(0,1,0),i.up.applyMatrix4(m),i.up.reflect(d),i.lookAt(v),i.far=n.far,i.updateMatrixWorld(),i.projectionMatrix.copy(n.projectionMatrix),x.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),x.multiply(i.projectionMatrix),x.multiply(i.matrixWorldInverse),x.multiply(r.matrixWorld),u.setFromNormalAndCoplanarPoint(d,f),u.applyMatrix4(i.matrixWorldInverse),g.set(u.normal.x,u.normal.y,u.normal.z,u.constant);let a=i.projectionMatrix;i.isOrthographicCamera?(y.x=(Math.sign(g.x)+a.elements[8])/a.elements[0],y.y=(Math.sign(g.y)+a.elements[9])/a.elements[5],y.z=-n.far,y.w=1):(y.x=(Math.sign(g.x)+a.elements[8])/a.elements[0],y.y=(Math.sign(g.y)+a.elements[9])/a.elements[5],y.z=-1,y.w=(1+a.elements[10])/a.elements[14]),g.multiplyScalar(2/g.dot(y)),a.elements[2]=g.x,a.elements[6]=g.y,i.isOrthographicCamera?(a.elements[10]=g.z-s,a.elements[14]=g.w-1):(a.elements[10]=g.z+1-s,a.elements[14]=g.w),r.visible=!1;let o=e.getRenderTarget(),c=e.xr.enabled,l=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(S),e.state.buffers.depth.setMask(!0),e.autoClear===!1&&e.clear(),e.render(t,i),e.xr.enabled=c,e.shadowMap.autoUpdate=l,e.setRenderTarget(o);let b=n.viewport;b!==void 0&&e.state.viewport(b),r.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return S},this.dispose=function(){S.dispose(),r.material.dispose()},this.getReflectionCamera=function(e){let t=this._reflectionCameras.get(e);return t===void 0&&(t=e.clone(),this._reflectionCameras.set(e,t)),t}}};Sl.ReflectorShader={name:`ReflectorShader`,uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var Cl=class e extends J{constructor(){let t=e.SkyShader,n=new b({name:t.name,uniforms:Dt.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:1,depthWrite:!1});super(new G(1,1,1),n),this.isSky=!0}};Cl.SkyShader={name:`SkyShader`,uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new K},up:{value:new K(0,1,0)},cloudScale:{value:2e-4},cloudSpeed:{value:1e-4},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// Cloud noise functions
		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453123 );
		}

		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			float a = hash( i );
			float b = hash( i + vec2( 1.0, 0.0 ) );
			float c = hash( i + vec2( 0.0, 1.0 ) );
			float d = hash( i + vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
		}

		float fbm( vec2 p ) {
			float value = 0.0;
			float amplitude = 0.5;
			for ( int i = 0; i < 5; i ++ ) {
				value += amplitude * noise( p );
				p *= 2.0;
				amplitude *= 0.5;
			}
			return value;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta ) * showSunDisc;
			L0 += ( vSunE * 19000.0 * Fex ) * sundisc;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Multi-octave noise for fluffy clouds
				float cloudNoise = fbm( cloudUV * 1000.0 );
				cloudNoise += 0.5 * fbm( cloudUV * 2000.0 + 3.7 );
				cloudNoise = cloudNoise * 0.5 + 0.5;

				// Apply coverage threshold
				float cloudMask = smoothstep( 1.0 - cloudCoverage, 1.0 - cloudCoverage + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.1 + 0.2 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting based on sun position
				float sunInfluence = dot( direction, vSunDirection ) * 0.5 + 0.5;
				float daylight = max( 0.0, vSunDirection.y * 2.0 );

				// Base cloud color affected by atmosphere
				vec3 atmosphereColor = Lin * 0.04;
				vec3 cloudColor = mix( vec3( 0.3 ), vec3( 1.0 ), daylight );
				cloudColor = mix( cloudColor, atmosphereColor + vec3( 1.0 ), sunInfluence * 0.5 );
				cloudColor *= vSunE * 0.00002;

				// Blend clouds with sky
				texColor = mix( texColor, cloudColor, cloudMask * cloudDensity );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var wl={summer14:{look:`summer14`,exposure:.56,wetness:.18,night:0,vis:1},golden:{look:`golden`,exposure:.7,wetness:.16,night:.12,vis:1},night:{look:`night`,exposure:1.22,wetness:.22,night:1,vis:.9},nightrain:{look:`nightrain`,exposure:1.18,wetness:.7,night:1,vis:.76},rain:{look:`rain`,exposure:.58,wetness:1,night:.08,vis:.55}};function Tl(e,t,n=!1){return(t===`rain`||t===`storm`)&&e?`nightrain`:t===`rain`||t===`storm`?`rain`:e?`night`:n?`golden`:`summer14`}var El={city:{day:1e-5,night:45e-6,far:1e4,dayCol:7255260,nightCol:2768984},desert:{day:6e-5,night:12e-5,far:12e3,dayCol:12101768,nightCol:1714232},snow:{day:4e-5,night:1e-4,far:12e3,dayCol:13163756,nightCol:1714232},carmel:{day:2e-5,night:1e-4,far:12e3,dayCol:7255260,nightCol:1714232},stone:{day:18e-6,night:8e-5,far:14e3,dayCol:12891290,nightCol:1714232}};function Dl(e,t){return t===`ramon`||e===`desert`?`desert`:t===`hermon`||e===`snow`?`snow`:e===`carmel`?`carmel`:e===`stone`||t===`jerusalem`||t===`scopus`?`stone`:`city`}function Ol(e,t){e.fragmentShader.includes(`RUSH_LANES`)||(e.uniforms.uLanes={value:t},e.uniforms.uWet={value:0},e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`#include <map_fragment>
    // RUSH_LANES
    {
      vec2 ru = vMapUv;
      float lanes = uLanes;
      float edge = max(smoothstep(0.018, 0.0, ru.x), smoothstep(0.982, 1.0, ru.x));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.93, 0.94), edge * 0.9);
      float meters = ru.y * 6.0;
      float dash = step(0.45, fract(meters / 8.0));
      float laneU = ru.x * lanes;
      float k = floor(laneU + 0.5);
      float skipEdge = step(k, 0.5) + step(lanes - 0.5, k);
      float skipMid = 0.0;
      float bound = 1.0 - smoothstep(0.018, 0.04, abs(fract(laneU + 0.5) - 0.5));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96), bound * dash * (1.0 - skipEdge) * (1.0 - skipMid) * 0.92);
      float wet = uWet;
      diffuseColor.rgb *= mix(1.0, 0.88, wet);
    }`),e.fragmentShader.includes(`RUSH_WET_R`)||(e.fragmentShader=e.fragmentShader.replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.14, uWet); // RUSH_WET_R`)),e.fragmentShader=`uniform float uLanes;
uniform float uWet;
`+e.fragmentShader)}function kl(e){let t=e.userData.lanes;if(!t)return;let n=e.onBeforeCompile;e.onBeforeCompile=(r,i)=>{typeof n==`function`&&n(r,i),Ol(r,t),e.userData.uWet=r.uniforms.uWet}}var Al;function jl(){return Al}async function Ml(){if(Al)return Al;let e=await new bt().loadAsync(`/game/lane-arrow.png`);return e.colorSpace=V,e.needsUpdate=!0,Al=e,Al}var Nl,Pl;function Fl(){return Nl}function Il(){return Pl}async function Ll(){if(Nl&&Pl)return;let e=new bt,[t,n]=await Promise.all([e.loadAsync(`/game/flare-0.png`),e.loadAsync(`/game/flare-1.png`)]);t.colorSpace=V,n.colorSpace=V,t.needsUpdate=!0,n.needsUpdate=!0,Nl=t,Pl=n}var Rl,zl;function Bl(){return Rl}function Vl(){return zl}async function Hl(){if(Rl&&zl)return;let e=new bt,[t,n]=await Promise.all([e.loadAsync(`/game/water-n.png`),e.loadAsync(`/game/checker.png`)]);t.wrapS=t.wrapT=h,t.repeat.set(48,28),t.anisotropy=4,t.needsUpdate=!0,n.magFilter=Mt,n.colorSpace=V,n.repeat.set(1,1),n.needsUpdate=!0,Rl=t,zl=n}var Ul=new Map,Wl=[`gantry-kibbutz-galuyot`,`gantry-hahagana`,`gantry-laguardia`,`gantry-hashalom`,`gantry-savidor-center`,`gantry-university`,`stn-galuyot`,`stn-hagana`,`stn-shalom`,`stn-savidor`,`stn-uni`,`dest-rail`];function Gl(e){return Ul.get(e)}function Kl(e){return Ul.get(e)}async function ql(){if(Ul.size)return;let e=new bt;await Promise.all([...[`stop`,`yield`,`none`,`speed50`,`speed80`,`speed90`].map(async t=>{let n=await e.loadAsync(`/game/sign-${t}.png`);n.colorSpace=V,n.anisotropy=4,n.needsUpdate=!0,Ul.set(t,n)}),...Wl.map(async t=>{let n=await e.loadAsync(`/game/${t}.png`);n.colorSpace=V,n.anisotropy=4,n.needsUpdate=!0,Ul.set(t,n)})])}var Jl;function Yl(){return Jl}async function Xl(){if(Jl)return Jl;let e=await new bt().loadAsync(`/game/foam.png`);return e.wrapS=Ee,e.wrapT=h,e.repeat.set(1,8),e.colorSpace=V,e.needsUpdate=!0,Jl=e,Jl}var Zl;function Ql(){return Zl}async function $l(){if(Zl)return Zl;let e=await new bt().loadAsync(`/game/ground.png`);return e.wrapS=e.wrapT=h,e.colorSpace=V,e.repeat.set(90,90),e.anisotropy=8,e.needsUpdate=!0,Zl=e,Zl}var eu;function tu(){return eu}async function nu(){if(eu)return eu;let e=await new bt().loadAsync(`/game/sidewalk.png`);return e.wrapS=e.wrapT=h,e.colorSpace=V,e.anisotropy=4,e.needsUpdate=!0,eu=e,eu}var ru=new Map;function iu(e){return ru.get(e)??ru.get(`blue`)}async function au(){if(ru.size)return;let e=new bt;await Promise.all([`blue`,`teal`,`dark`,`gold`,`white`].map(async t=>{let n=await e.loadAsync(`/game/curtain-${t}.png`);n.wrapS=n.wrapT=h,n.anisotropy=8,n.colorSpace=V,n.repeat.set(2,8),n.needsUpdate=!0,ru.set(t,n)}))}var ou=new Map;function su(e){return ou.get(e)??ou.get(`city`)}async function cu(){if(ou.size)return;let e=new bt;await Promise.all([`city`,`stone`,`dirt`,`sand`].map(async t=>{let n=await e.loadAsync(`/game/curb-${t}.png`);n.wrapS=n.wrapT=h,n.colorSpace=V,n.anisotropy=8,n.repeat.set(1,1),n.needsUpdate=!0,ou.set(t,n)}))}var lu;function uu(){return lu}async function du(){if(lu)return lu;let e=await new bt().loadAsync(`/game/herodian.png`);return e.wrapS=e.wrapT=h,e.anisotropy=8,e.colorSpace=V,e.repeat.set(3,2),e.needsUpdate=!0,lu=e,lu}var fu;function pu(){return fu}async function mu(){if(fu)return fu;let e=await new bt().loadAsync(`/game/jaffa-clock.png`);return e.colorSpace=V,e.needsUpdate=!0,fu=e,fu}var hu;function gu(){return hu}async function _u(){if(hu)return hu;let e=await new bt().loadAsync(`/game/israel-flag.png`);return e.colorSpace=V,e.needsUpdate=!0,hu=e,hu}var vu,yu;function bu(){return vu}function xu(){return yu}function Su(e,t){return e.wrapS=e.wrapT=h,e.anisotropy=4,e.colorSpace=V,e.repeat.set(t===3?1:2,t),e.needsUpdate=!0,e}async function Cu(){if(vu&&yu)return;let e=new bt,[t,n]=await Promise.all([e.loadAsync(`/game/foliage.png`),e.loadAsync(`/game/bark.png`)]);vu=Su(t,2),yu=Su(n,3)}var wu,Tu;function Eu(){return wu}function Du(){return Tu}function Ou(e){return e.mapping=303,e.colorSpace=V,e.anisotropy=4,e.needsUpdate=!0,e}async function ku(){if(wu&&Tu)return;let e=new bt,[t,n]=await Promise.all([e.loadAsync(`/game/sky-day.png`),e.loadAsync(`/game/sky-night.png`)]);wu=Ou(t),Tu=Ou(n)}var Au;function ju(){return Au}async function Mu(e){if(Au)return Au;let t=await new bt().loadAsync(`/game/blob.png`);return t.colorSpace=``,t.needsUpdate=!0,Au=t,Au}function Nu(e){let{group:t,sun:n,sky:r,dir:i,dirNear:a,waterMesh:o,colliders:s,streets:c,ramps:l,getNight:u,getWeather:d,followShadows:f,followMirror:p,setPlanar:m,sunDir:h,tick:g,setTime:_,setClock:v,getClock:y,setWeather:b,setLod:x,dispose:S}=e;return{group:t,sun:n,sky:r,dir:i,dirNear:a,waterMesh:o,colliders:s,streets:c,ramps:l,get night(){return u()},get weather(){return d()},followShadows:f,followMirror:p,setPlanar:m,sunDir:h,tick:g,setTime:_,setClock:v,get clock(){return y()},setWeather:b,setLod:x,dispose:S}}function Pu(e,t,n,r,i,a){e.city}function Fu(e){let{group:t,def:n,bag:r,shadows:i,isNight:a,glows:o,emitList:s,colliders:c,movers:l,ramps:u,streets:d,built:p,support:{_dummy:m,barkTexture:h,curtainTexture:g,foliageTexture:_,herodianTexture:v,samp:y,segsOf:b}}=e,x=e=>{e.castShadow=i,e.receiveShadow=!0,t.add(e),`geometry`in e&&e.geometry&&r.push(e.geometry);let n=`material`in e?e.material:null;Array.isArray(n)?n.forEach(e=>r.push(e)):n&&r.push(n)},S=(e,n,r,s,c,l)=>{if(!i||o.length>=4)return;let u=new rt(s,a?c:0,l,2);u.position.set(e,n,r),t.add(u),o.push({light:u,on:c})},C=(e,t,n,r,i,a)=>{c.push({x:e,z:t,r:n,hx:r??n*.72,hz:i??n*.72,yaw:a??0,kind:`building`})},w=(e,t)=>{let n=p.samples[Q(p.samples,e,t,0).index];return Math.atan2(n.tx,n.tz)},T=(e,t,n,r,i)=>C(e,t,n,r,i,w(e,t)),E=(e,t,r,i,a,o)=>{n.id===`ayalon`?T(e,t,r,i,a):C(e,t,r,i,a,o)},D=(e,t,n,i,o,s,c=0)=>{let l=Math.sin(n),u=Math.cos(n),d=Math.cos(n),f=-Math.sin(n),p=new q({color:3813932,roughness:.9,envMapIntensity:.2}),m=new q({color:10127986,roughness:.62,envMapIntensity:.35}),h=new q({color:2367002,roughness:.92}),g=new q({color:16771248,emissive:16764006,emissiveIntensity:a?2.4:.7,roughness:.4});r.push(p,m,h,g);let _=new J(new G(.85,s,i),p);_.position.set(e-d*o,c+s*.5,t-f*o),_.rotation.y=n,x(_);let v=new J(new G(.85,s,i),p);v.position.set(e+d*o,c+s*.5,t+f*o),v.rotation.y=n,x(v);let y=new J(new G(.12,s*.55,i*.96),m);y.position.set(e-d*(o-.5),c+s*.32,t-f*(o-.5)),y.rotation.y=n,x(y);let b=y.clone();b.position.set(e+d*(o-.5),c+s*.32,t+f*(o-.5)),x(b);let S=new J(new G(o*2+1.6,.7,i),h);S.position.set(e,c+s+.15,t),S.rotation.y=n,x(S);for(let r of[-1,1]){let a=e+i*.5*l*r,p=t+i*.5*u*r;for(let e of[-1,1]){let t=new J(new G(1.15,s+1.4,1.35),m);t.position.set(a+d*o*e,c+(s+1.4)*.5,p+f*o*e),t.rotation.y=n,x(t)}let h=new J(new G(o*2+2.4,1.5,1.5),m);h.position.set(a,c+s+.6,p),h.rotation.y=n,x(h)}let w=Math.max(3,Math.round(i/10));for(let r=0;r<w;r++){let a=(r+.5)/w-.5,o=e+l*a*i,d=t+u*a*i,f=new J(new G(.35,.16,1.1),g);f.position.set(o,c+s-.2,d),f.rotation.y=n,x(f)}let T=Math.max(3,Math.round(i/12));for(let r=0;r<T;r++){let a=(r+.5)/T-.5,s=e+l*a*i,c=t+u*a*i;C(s-d*(o+.4),c-f*(o+.4),1.05,.55,2.4,n),C(s+d*(o+.4),c+f*(o+.4),1.05,.55,2.4,n)}},O=new q({color:13350810,roughness:.78,envMapIntensity:.45}),k=new q({color:15525594,roughness:.48,metalness:0,envMapIntensity:.7}),A=new ct({color:6987956,roughness:.08,metalness:0,envMapIntensity:1.8,clearcoat:1,clearcoatRoughness:.08,emissive:1722982,emissiveIntensity:a?.32:0}),j=new ct({color:11569722,metalness:.82,roughness:.22,envMapIntensity:1.4,clearcoat:.45}),M=new ct({color:13934615,metalness:.92,roughness:.18,envMapIntensity:1.8,clearcoat:.7,emissive:13934615,emissiveIntensity:a?.55:.06}),N=new q({color:15260868,roughness:.62,envMapIntensity:.5}),P=new q({color:10771002,roughness:.82,envMapIntensity:.3}),F=new q({color:6965810,roughness:.88}),I=new q({color:1840144,roughness:.96});r.push(I);let ee=(e,t,n,r,i=12)=>{let a=new J(new G(n,i,4.4),O);a.position.set(e,i*.5,t),a.rotation.y=r,x(a);let o=Math.max(4,Math.floor(n/5.2));for(let a=0;a<o;a++){let s=(a/Math.max(1,o-1)-.5)*(n-2.4),c=new J(new G(2.5,2.15,4.8),O);c.position.set(e+Math.cos(r)*s,i+1.05,t-Math.sin(r)*s),c.rotation.y=r,x(c)}C(e,t,Math.min(7,Math.max(3.5,n*.1)))},L=(e,t,n=26)=>{let r=new J(new Y(1.25,1.65,n,10),O);r.position.set(e,n*.5,t),x(r);let i=new J(new Y(2.05,2.05,.65,10),N);i.position.set(e,n*.68,t),x(i);let a=new J(new f(1.7,3.2,8),O);a.position.set(e,n+1.4,t),x(a),C(e,t,4)},R=(e,t,n)=>{let r=Math.cos(n),i=-Math.sin(n);for(let a of[-18,18]){let o=new J(new G(9,16,10),O);o.position.set(e+r*a,8,t+i*a),o.rotation.y=n,x(o),C(e+r*a,t+i*a,6,4.8,5.2,n)}let a=new J(new G(38,5.4,10.4),O);a.position.set(e,18.2,t),a.rotation.y=n,x(a);let o=new J(new f(5.8,3.6,4),O);o.rotation.y=n+Math.PI/4,o.position.set(e,23.6,t),x(o);for(let a of[-16,-6,6,16]){let o=new J(new G(3.4,2.2,10.8),O);o.position.set(e+r*a,21.8,t+i*a),o.rotation.y=n,x(o)}},te=(e,t)=>{let n=new J(new Y(11.4,11.4,8.4,8),N);n.position.set(e,9.2,t),x(n);let i=new q({color:1986178,roughness:.38,metalness:.22,envMapIntensity:.85});r.push(i);let a=new J(new Y(11.55,11.55,3.2,8),i);a.position.set(e,11.4,t),x(a);for(let n=0;n<8;n++){let r=n/8*Math.PI*2+Math.PI/8,i=new J(new Y(.48,.55,8.6,8),N);i.position.set(e+Math.cos(r)*11.9,9.2,t+Math.sin(r)*11.9),x(i)}let o=new J(new Y(7.8,7.8,6.2,20),i);o.position.set(e,16.4,t),x(o);let s=new J(new W(10.4,28,18,0,Math.PI*2,0,Math.PI/2),M);s.position.set(e,19.4,t),x(s);let c=new J(new Y(.85,1.35,3.1,8),M);c.position.set(e,30.4,t),x(c),S(e,31,t,16763972,80,48),C(e,t,12)},ne=new ct({color:3842232,roughness:.08,metalness:.12,envMapIntensity:1.4,clearcoat:1,clearcoatRoughness:.12,emissive:3842232,emissiveIntensity:a?.7:.08});r.push(O,k,A,j,M,N,P,F,ne),s.push({mat:M,night:.55,day:.06},{mat:A,night:.32,day:0},{mat:ne,night:.7,day:.08});let re=new ct({color:3822696,roughness:.08,metalness:0,envMapIntensity:1.6,clearcoat:1,clearcoatRoughness:.08,emissive:663600,emissiveIntensity:a?.28:0}),z=new ct({color:12110036,roughness:.1,metalness:0,envMapIntensity:1.4,clearcoat:.9,emissive:1716288,emissiveIntensity:a?.22:0}),B=new q({color:14214378,metalness:.62,roughness:.22,envMapIntensity:1.3}),ie=g(`blue`),ae=g(`teal`),V=g(`dark`),oe=g(`dark`),se=g(`gold`);r.push(ie,ae,V,oe,se);let ce=(e,t,n)=>new ct({map:e,color:t,roughness:.12,metalness:0,envMapIntensity:1.45,clearcoat:1,clearcoatRoughness:.1,emissive:1722982,emissiveIntensity:a?n:0}),le=ce(ie,5151362,.38),ue=ce(ae,9136970,.32),de=ce(V,6982314,.28),fe=ce(oe,13161692,.3),pe=ce(se,13214810,.24);r.push(re,z,B,le,ue,de,fe,pe),s.push({mat:re,night:.28,day:0},{mat:z,night:.22,day:0},{mat:le,night:.38,day:0},{mat:ue,night:.32,day:0},{mat:de,night:.28,day:0},{mat:fe,night:.3,day:0},{mat:pe,night:.24,day:0});let me=e=>{let n=new q({color:15526112,metalness:0,roughness:.42,envMapIntensity:.85});r.push(n);let a=X(32.07455,34.79195),o=Q(p.samples,a.x,a.z,0),s=p.samples[o.index],c=p.width/2+52,l=s.x+s.rx*c,u=s.z+s.rz*c,d=154*e,f=new J(new Y(13.4*e,14.6*e,d,48),le);f.position.set(l,d*.5,u),x(f);{let a=[];for(let t=4.4*e;t<d-2.4*e;t+=2.35*e)a.push(t);let o=new ht(13.8*e,.08*e,5,24),s=new Lt(o,n,a.length);s.frustumCulled=!1;for(let e=0;e<a.length;e++){let t=1+a[e]/d*.041;m.position.set(l,a[e],u),m.rotation.set(Math.PI/2,0,0),m.scale.set(t,t,1),m.updateMatrix(),s.setMatrixAt(e,m.matrix)}s.instanceMatrix.needsUpdate=!0,s.castShadow=i,t.add(s),r.push(o)}let h=new J(new Y(22.4*e,14.6*e,2.8*e,36),n);h.position.set(l,d+.4*e,u),x(h);let g=new J(new Y(23.2*e,20.4*e,2*e,36),z);g.position.set(l,d+2.8*e,u),x(g);let _=new J(new W(12.6*e,28,14,0,Math.PI*2,0,Math.PI*.5),z);_.position.set(l,d+3.6*e,u),x(_);let v=new J(new ht(21.6*e,.48*e,6,36),n);v.rotation.x=Math.PI/2,v.position.set(l,d+2.9*e,u),x(v);let y=new J(new ht(16.2*e,.32*e,6,28),n);y.rotation.x=Math.PI/2,y.position.set(l,d+3.8*e,u),x(y);let b=138*e,C=l+s.tx*24*e+s.rx*20*e,w=u+s.tz*24*e+s.rz*20*e,T=new J(new Y(8.8*e,10.8*e,b,3),ue);T.position.set(C,b*.5,w),T.rotation.y=.52,x(T);for(let t=0;t<3;t++){let r=.52+t*(Math.PI*2/3)+Math.PI/3,i=9.2*e,a=new J(new G(.62*e,b*.96,.62*e),n);a.position.set(C+Math.cos(r)*i,b*.5,w+Math.sin(r)*i),x(a)}{let a=[];for(let t=6*e;t<b-4*e;t+=5.6*e)a.push(t);let o=new Y(9.2*e,10.2*e,.45*e,3),s=new Lt(o,n,a.length);s.frustumCulled=!1;for(let e=0;e<a.length;e++)m.position.set(C,a[e],w),m.rotation.set(0,.52,0),m.scale.set(1,1,1),m.updateMatrix(),s.setMatrixAt(e,m.matrix);s.instanceMatrix.needsUpdate=!0,s.castShadow=i,t.add(s),r.push(o)}let D=new J(new Y(1.4*e,8.6*e,18*e,3),z);D.position.set(C,b+7*e,w),D.rotation.y=.52,x(D);let O=126*e,A=l-s.tx*22*e+s.rx*12*e,j=u-s.tz*22*e+s.rz*12*e,M=new J(new G(15.2*e,O,15.2*e),de);M.position.set(A,O*.5,j),x(M);{let a=[];for(let t=5.5*e;t<O-3*e;t+=2.9*e)a.push(t);let o=new G(15.8*e,.35*e,15.8*e),s=new Lt(o,n,a.length);s.frustumCulled=!1;for(let e=0;e<a.length;e++)m.position.set(A,a[e],j),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),s.setMatrixAt(e,m.matrix);s.instanceMatrix.needsUpdate=!0,s.castShadow=i,t.add(s),r.push(o)}let N=new J(new G(11.6*e,8.4*e,11.6*e),z);N.position.set(A,O+3.8*e,j),x(N);let P=new J(new G(8.4*e,6.2*e,8.4*e),de);P.position.set(A,O+10.8*e,j),x(P);let F=new J(new Y(.2*e,.32*e,12*e,6),n);F.position.set(A,O+20*e,j),x(F);let I={x:(l+C+A)/3,z:(u+w+j)/3},ee=new J(new G(52*e,9.2*e,42*e),k);ee.position.set(I.x,4.6*e,I.z),x(ee);let L=new J(new Y(16.4*e,16.4*e,14*e,32),z);L.position.set(I.x,7*e,I.z),x(L);let R=new J(new ht(16.6*e,.48*e,6,32),n);R.rotation.x=Math.PI/2,R.position.set(I.x,14.1*e,I.z),x(R);let te=new J(new W(16.4*e,28,14,0,Math.PI*2,0,Math.PI*.42),z);te.position.set(I.x,14.2*e,I.z),x(te);let ne=Math.max(8*e,Math.hypot(l-C,u-w)),re=new J(new G(ne,1.7*e,5.8*e),z);re.position.set((l+C)*.5,34*e,(u+w)*.5),re.rotation.y=Math.atan2(C-l,w-u),x(re);let B=Math.max(8*e,Math.hypot(l-A,u-j)),ie=new J(new G(B,1.6*e,5.4*e),z);ie.position.set((l+A)*.5,31*e,(u+j)*.5),ie.rotation.y=Math.atan2(A-l,j-u),x(ie),S(l,d+6,u,8308968,62*e,54*e),S(C,b+6,w,8308968,52*e,48*e),E(l,u,12*e,14*e,14*e),E(C,w,11*e,10*e,10*e),E(A,j,10*e,8.4*e,8.4*e)},he=(e,t,n=48)=>{let r=X(e,t),i=Q(p.samples,r.x,r.z,0),a=p.samples[i.index];return i.dist<p.width/2+n-8?{x:a.x+a.rx*(p.width/2+n),z:a.z+a.rz*(p.width/2+n)}:r},ge=e=>{let n=he(32.0832,34.8027,52),a=168*e,o=Math.PI/4,s=new J(new G(16.2*e,a,16.2*e),fe);s.position.set(n.x,a*.5,n.z),s.rotation.y=o,x(s);{let s=[];for(let t=10*e;t<a-8*e;t+=6.2*e)s.push(t);let c=new G(16.8*e,.28*e,16.8*e),l=new Lt(c,B,s.length);l.frustumCulled=!1;for(let e=0;e<s.length;e++)m.position.set(n.x,s[e],n.z),m.rotation.set(0,o,0),m.scale.set(1,1,1),m.updateMatrix(),l.setMatrixAt(e,m.matrix);l.instanceMatrix.needsUpdate=!0,l.castShadow=i,t.add(l),r.push(c)}let c=new J(new G(11.4*e,18*e,11.4*e),z);c.position.set(n.x,a+8*e,n.z),c.rotation.y=o,x(c);let l=new J(new Y(.22*e,.55*e,48*e,8),B);l.position.set(n.x,a+40*e,n.z),x(l),S(n.x,a+24*e,n.z,11065584,52*e,46*e),E(n.x,n.z,11*e,10*e,10*e,o)},_e=(e,n=32.0713,a=34.7886)=>{let o=X(n,a),s=Q(p.samples,o.x,o.z,0),c=p.samples[s.index],l=s.dist<p.width/2+40?{x:c.x+c.rx*(p.width/2+48),z:c.z+c.rz*(p.width/2+48)}:o,u=new G(1,4.7*e,.62),d=new Lt(u,pe,44);d.frustumCulled=!1;let f=new G(1,.22*e,.72),h=new Lt(f,B,22);h.frustumCulled=!1;let g=0,_=0,v=(t,n,r,i)=>{for(let a=0;a<22;a++){let o=a/21,s=(6.4+o*14.8)*e,c=3.8*e+5.15*e*a,u=r+o*.95*i+Math.PI/4,f=l.x+t+Math.sin(o*1.1)*1.6*e*i,p=l.z+n;m.position.set(f,c,p),m.rotation.set(0,u,0),m.scale.set(s,1,s),m.updateMatrix(),d.setMatrixAt(g++,m.matrix),a%2==0&&_<22&&(m.position.set(f,c+2.2*e,p),m.scale.set(s+.6*e,1,s+.4*e),m.updateMatrix(),h.setMatrixAt(_++,m.matrix))}};v(-8.2*e,-1.2*e,Math.PI/5,1),v(8.4*e,2.8*e,-Math.PI/6,-1),d.count=g,h.count=_,d.instanceMatrix.needsUpdate=!0,h.instanceMatrix.needsUpdate=!0,d.castShadow=i,t.add(d,h),r.push(u,f);let y=new J(new G(28*e,3.2*e,16*e),z);y.position.set(l.x,118*e,l.z+1.2*e),y.rotation.y=Math.PI/4,x(y);let b=new J(new G(24*e,4.8*e,20*e),N);b.position.set(l.x,2.4*e,l.z),x(b),S(l.x,110*e,l.z,13166847,46*e,40*e),E(l.x,l.z,13*e,15*e,13*e)},ve=e=>{let n=he(32.0806,34.7926,48),i=new ct({color:1846332,roughness:.1,metalness:0,envMapIntensity:1.55,clearcoat:1,clearcoatRoughness:.1});r.push(i);let a=108*e,o=94*e,s=new J(new G(12.4*e,a,14.6*e),i);s.position.set(n.x-8.2*e,a*.5,n.z),x(s);let c=new J(new G(12.4*e,o,14.6*e),i);c.position.set(n.x+8.2*e,o*.5,n.z),x(c);let l=new G(12.9*e,.22*e,15.1*e),u=new Lt(l,B,36);u.frustumCulled=!1;let d=0;for(let[t,r]of[[-8.2*e,a],[8.2*e,o]])for(let i=0;i<18;i++){let a=6*e+i*(r-12*e)/17;m.position.set(n.x+t,a,n.z),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),u.setMatrixAt(d++,m.matrix)}u.count=d,u.instanceMatrix.needsUpdate=!0,t.add(u),r.push(l);let f=new G(18.6*e,3.2*e,7.2*e),p=new Lt(f,z,3);p.frustumCulled=!1,[26,54,82].forEach((t,r)=>{m.position.set(n.x,t*e,n.z),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),p.setMatrixAt(r,m.matrix)}),p.instanceMatrix.needsUpdate=!0,t.add(p),r.push(f),S(n.x,90*e,n.z,6719658,40*e,36*e),E(n.x,n.z,14*e,18*e,10*e)},ye=e=>{let n=he(32.0699,34.7918,46),a=new ct({color:4881042,roughness:.1,metalness:0,envMapIntensity:1.5,clearcoat:1,clearcoatRoughness:.1});r.push(a);let o=118*e,s=new J(new G(14.2*e,o,14.2*e),a);s.position.set(n.x,o*.5,n.z),x(s);let c=[];for(let t=5*e;t<o-4*e;t+=3.1*e)c.push(t);let l=new G(14.8*e,.2*e,14.8*e),u=new Lt(l,B,c.length);u.frustumCulled=!1;for(let e=0;e<c.length;e++)m.position.set(n.x,c[e],n.z),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),u.setMatrixAt(e,m.matrix);u.instanceMatrix.needsUpdate=!0,u.castShadow=i,t.add(u),r.push(l);let d=new G(.16*e,o*.96,.16*e),f=new Lt(d,B,14);f.frustumCulled=!1;let p=0;for(let t=0;t<7;t++){let r=-5.8*e+t*1.93*e;for(let t of[n.z+7.15*e,n.z-7.15*e])m.position.set(n.x+r,o*.5,t),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),f.setMatrixAt(p++,m.matrix)}f.count=p,f.instanceMatrix.needsUpdate=!0,t.add(f),r.push(d);let h=new J(new G(15.4*e,5.4*e,15.4*e),B);h.position.set(n.x,o+3.2*e,n.z),x(h);let g=new J(new G(10.6*e,4.6*e,10.6*e),z);g.position.set(n.x,o+8.2*e,n.z),x(g);let _=new J(new Y(.2*e,.4*e,32*e,8),B);_.position.set(n.x,o+24*e,n.z),x(_),S(n.x,o+8*e,n.z,8962264,36*e,32*e),E(n.x,n.z,9*e)},be=e=>{let n=he(32.0714,34.7866,44),i=178*e,a=new ct({color:14214380,roughness:.08,metalness:0,envMapIntensity:1.65,clearcoat:1,clearcoatRoughness:.08});r.push(a);let o=new J(new G(11.2*e,i,22.4*e),a);o.position.set(n.x,i*.5,n.z),o.rotation.y=.18,x(o);let s=new G(.22*e,i*.96,.22*e),c=new Lt(s,B,12);c.frustumCulled=!1;let l=0;for(let t=0;t<6;t++){let r=-10.4*e+t*4.16*e;for(let t of[-5.7*e,5.7*e])m.position.set(n.x+t,i*.5,n.z+r),m.rotation.set(0,.18,0),m.scale.set(1,1,1),m.updateMatrix(),c.setMatrixAt(l++,m.matrix)}c.count=l,c.instanceMatrix.needsUpdate=!0,t.add(c),r.push(s);let u=new J(new G(12.2*e,6.4*e,23.2*e),z);u.position.set(n.x,i+2.8*e,n.z),u.rotation.y=.18,x(u),S(n.x,i+4*e,n.z,15266554,44*e,40*e),E(n.x,n.z,12*e,8*e,14*e,.18)},xe=e=>{let n=he(32.0756,34.7878,40),i=new q({color:12098158,roughness:.62,envMapIntensity:.45});r.push(i);let a=96*e,o=new J(new G(14.4*e,a,18.6*e),i);o.position.set(n.x,a*.5,n.z),x(o);let s=new J(new G(15.2*e,4.2*e,19.4*e),N);s.position.set(n.x,a+1.8*e,n.z),x(s);let c=new G(1,1,1),l=new Lt(c,N,6);l.frustumCulled=!1,[[22,6,8,16,8,10],[-20,5.2,12,14,6.4,12],[16,4.4,-16,18,5.2,9],[-14,7,-18,12,9.2,14],[28,3.8,-8,10,4.6,16],[-26,4.8,4,12,5.8,8]].forEach((t,r)=>{m.position.set(n.x+t[0]*e,t[1]*e,n.z+t[2]*e),m.rotation.set(0,r*.12,0),m.scale.set(t[3]*e,t[4]*e*2,t[5]*e),m.updateMatrix(),l.setMatrixAt(r,m.matrix)}),l.instanceMatrix.needsUpdate=!0,t.add(l),r.push(c),S(n.x,a+4*e,n.z,13943968,32*e,28*e),E(n.x,n.z,16*e,22*e,20*e)},Se=e=>{let n=he(32.0639,34.7704,36),i=82*e,a=new J(new G(16.4*e,i,10.6*e),N);a.position.set(n.x,i*.5,n.z),x(a);let o=new q({color:1854072,roughness:.7,envMapIntensity:.4});r.push(o);let s=new J(new G(.22*e,i*.58,9.6*e),o);s.position.set(n.x+8.3*e,i*.42,n.z),x(s);let c=new G(16.9*e,.22*e,11.1*e),l=new Lt(c,B,12);l.frustumCulled=!1;for(let t=0;t<12;t++)m.position.set(n.x,6*e+t*(i-12*e)/11,n.z),m.rotation.set(0,0,0),m.scale.set(1,1,1),m.updateMatrix(),l.setMatrixAt(t,m.matrix);l.instanceMatrix.needsUpdate=!0,t.add(l),r.push(c);let u=new J(new Y(.2*e,.34*e,22*e,6),B);u.position.set(n.x,i+10*e,n.z),x(u),S(n.x,i+6*e,n.z,15920352,28*e,24*e),E(n.x,n.z,9*e,10*e,7*e)};return{group:t,def:n,bag:r,shadows:i,isNight:a,emitList:s,colliders:c,movers:l,ramps:u,streets:d,built:p,add:x,glowAt:S,hit:C,hitRoad:T,placeTunnel:D,stone:O,white:k,glass:A,copper:j,gold:M,cream:N,terracotta:P,wood:F,darkArch:I,merlonWall:ee,minaret:L,ottomanGate:R,placeDome:te,cyan:ne,darkGlass:re,paleGlass:z,bandMat:B,azSqGlass:de,gateGlass:fe,placeAzrieli:me,placeCityGate:ge,placeToHa:_e,placeMidtown:ve,placeElectra:ye,placeSarona:be,placeHakirya:xe,placeShalomMeir:Se,placeTlvTowers:e=>{ge(e),_e(e),be(e),xe(e),Se(e),ve(e),ye(e)},placeNycSkyline:(e,t,n)=>{let r=118*n,i=new J(new G(14*n,r,14*n),z);i.position.set(e,r*.5,t),x(i);let a=new J(new Y(.35*n,1.8*n,28*n,6),B);a.position.set(e,r+12*n,t),x(a);let o=92*n,s=new J(new G(16*n,o,12*n),re);s.position.set(e+32*n,o*.5,t+28*n),x(s);let c=new J(new G(10*n,22*n,8*n),re);c.position.set(e+32*n,o+10*n,t+28*n),x(c);let l=new J(new Y(.22*n,.4*n,22*n,6),B);l.position.set(e+32*n,o+32*n,t+28*n),x(l);let u=new J(new G(11*n,70*n,11*n),z);u.position.set(e-28*n,35*n,t+18*n),x(u);let d=new J(new Y(2.2*n,7.4*n,16*n,8),z);d.position.set(e-28*n,78*n,t+18*n),x(d);let f=new J(new Y(10*n,10*n,48*n,3),N);f.position.set(e+18*n,24*n,t-36*n),f.rotation.y=.4,x(f),S(e,r+8,t,13166847,52*n,48*n),S(e+32*n,o+12,t+28*n,16771248,36*n,34*n),C(e,t,10*n),C(e+32*n,t+28*n,9*n)},placeGothicTower:(e,t,n)=>{let r=new J(new G(10,n,8),O);r.position.set(e,n*.5,t),x(r);let i=new J(new G(4.2,n*.42,2.2),O);i.position.set(e,n*.38,t),x(i);for(let r of[-4.2,4.2]){let i=new J(new f(1.4,8,4),O);i.position.set(e+r,n+3.5,t),x(i)}let a=new J(new G(11,3.2,9),O);a.position.set(e,n+.8,t),x(a),C(e,t,8)},_dummy:m,barkTexture:h,curtainTexture:g,foliageTexture:_,herodianTexture:v,samp:y,segsOf:b}}function Iu(e){let{group:t,bag:n,built:r,add:i,glowAt:a,hit:o,placeTunnel:s,stone:c,white:l,cream:u,terracotta:d,wood:p,cyan:m,darkGlass:h,paleGlass:g,bandMat:_,_dummy:v}=e,y=X(32.0893,34.7694);{let e=Q(r.samples,y.x,y.z,0);if(e.dist<r.width/2+10){let t=r.samples[e.index];y.x=t.x+t.rx*(r.width/2+30),y.z=t.z+t.rz*(r.width/2+30)}}let b=new J(new Y(20,21,34,20,1,!1,.55,2.05),l);b.position.set(y.x,17,y.z),b.rotation.y=-.35,i(b);for(let e=0;e<11;e++){let t=new J(new Y(20.6,21.4,.22,20,1,!1,.55,2.05),u);t.position.set(y.x,3.2+e*2.9,y.z),t.rotation.y=-.35,i(t)}let x=new J(new Y(16,20,2.4,20,1,!1,.55,2.05),u);x.position.set(y.x,35.2,y.z),x.rotation.y=-.35,i(x);let S=new pe(1.1,1.4);n.push(S);let C=new Lt(S,h,90),w=0;for(let e=0;e<10;e++)for(let t=0;t<9;t++){let n=-.35+.55+t/8*2.05,r=4.4+e*2.9;v.position.set(y.x+Math.cos(n)*20.4,r,y.z+Math.sin(n)*20.4),v.scale.set(1,1,1),v.lookAt(y.x+Math.cos(n)*28,r,y.z+Math.sin(n)*28),v.updateMatrix(),C.setMatrixAt(w++,v.matrix)}C.instanceMatrix.needsUpdate=!0,t.add(C);let T=X(32.0768,34.7662);{let e=Q(r.samples,T.x,T.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];T.x=t.x+t.rx*(r.width/2+22),T.z=t.z+t.rz*(r.width/2+22)}}let E=new J(new Y(11,12.4,6,20),u);E.position.set(T.x,3,T.z),i(E);let D=new J(new Y(7.2,8.4,36,22),u);D.position.set(T.x,24,T.z),i(D);for(let e=8;e<40;e+=3.1){let t=new J(new ht(7.9,.18,5,22),h);t.rotation.x=Math.PI/2,t.position.set(T.x,e,T.z),i(t)}for(let e=0;e<14;e++){let t=e/14*Math.PI*2,n=new J(new Y(.28,.32,5.5,6),l);n.position.set(T.x+Math.cos(t)*8.6,44,T.z+Math.sin(t)*8.6),i(n)}let O=new J(new ht(8.8,.42,6,20),l);O.rotation.x=Math.PI/2,O.position.set(T.x,47,T.z),i(O);let k=new J(new Y(9.2,5.2,5.4,18),l);k.position.set(T.x,50.2,T.z),i(k);let A=X(32.0814,34.7672);{let e=Q(r.samples,A.x,A.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];A.x=t.x+t.rx*(r.width/2+20),A.z=t.z+t.rz*(r.width/2+20)}}let j=new J(new G(12,28,38),l);j.position.set(A.x,14,A.z),i(j);for(let e=4;e<26;e+=2.8){let t=new J(new G(13.2,.18,39),u);t.position.set(A.x,e,A.z),i(t)}for(let e of[-6.08,6.08]){let t=new J(new G(.1,22,34),h);t.position.set(A.x+e,14,A.z),i(t)}let M=new J(new G(10,2.2,28),u);M.position.set(A.x,29.2,A.z),i(M);let N=X(32.0866,34.7678);{let e=Q(r.samples,N.x,N.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];N.x=t.x+t.rx*(r.width/2+20),N.z=t.z+t.rz*(r.width/2+20)}}for(let e=0;e<5;e++){let t=16-e*1.4,n=new J(new G(t,5.2,22-e*1.1),e%2?l:u);n.position.set(N.x,2.8+e*5.4,N.z),i(n)}let P=new J(new G(8.4,2.2,12),u);P.position.set(N.x,28.4,N.z),i(P),o(N.x,N.z,9),a(N.x,26,N.z,16777200,22,18);let F=X(32.0848,34.768),I=new J(new G(18,.25,9),m);I.position.set(F.x,.2,F.z),i(I);let ee=new J(new G(22,.18,13),c);ee.position.set(F.x,.08,F.z),i(ee);let L=new J(new G(10,4.2,8),l);L.position.set(F.x+8,2.1,F.z),i(L);let R=X(32.0938,34.7688);{let e=Q(r.samples,R.x,R.z,0);if(e.dist<r.width/2+10){let t=r.samples[e.index];R.x=t.x+t.rx*(r.width/2+22),R.z=t.z+t.rz*(r.width/2+22)}}let te=new J(new G(4.2,1.4,52),c);te.position.set(R.x-36,.5,R.z),i(te);let ne=new J(new G(28,1.2,4),c);ne.position.set(R.x-22,.45,R.z-26),i(ne);let re=new J(new G(6,.4,42),p);re.position.set(R.x-18,.15,R.z),i(re);let z=new J(new G(22,4.2,12),u);z.position.set(R.x,2.1,R.z),i(z);let B=new J(new Y(.7,1.1,14,8),l);B.position.set(R.x-34,7,R.z-22),i(B);let ie=new J(new Y(1.4,1.2,1.6,8),u);ie.position.set(R.x-34,14.6,R.z-22),i(ie);let ae=new J(new W(.7,8,6),new Ct({color:16777136}));ae.position.set(R.x-34,15.8,R.z-22),i(ae);for(let e=0;e<8;e++){let t=new J(new G(2.4,.75,8.2),e%2?l:u);t.position.set(R.x-30-e%2*7,.45,R.z-22+e*7),t.rotation.y=.12,i(t);let n=new J(new G(1.6,1.1,3.2),l);n.position.set(R.x-30-e%2*7,1.3,R.z-22+e*7),i(n);let r=new J(new Y(.06,.08,9,5),p);r.position.set(R.x-30-e%2*7,5.2,R.z-22+e*7),i(r)}let V=X(32.1044,34.7794);{let e=Q(r.samples,V.x,V.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];V.x=t.x+t.rx*(r.width/2+34),V.z=t.z+t.rz*(r.width/2+34)}}let oe=new q({color:9067074,roughness:.9});n.push(oe);let se=new J(new G(36,12,20),oe);se.position.set(V.x,6,V.z),i(se);let ce=new J(new G(22,8,14),u);ce.position.set(V.x+8,4,V.z+12),i(ce);for(let e of[-8,8]){let t=new J(new Y(2.15,2.7,52,14),oe);t.position.set(V.x+e,32,V.z),i(t);for(let t=0;t<5;t++){let n=new J(new Y(2.35,2.5,1.7,14),l);n.position.set(V.x+e,14+t*8,V.z),i(n)}let n=new J(new Y(2.6,2.2,1.6,14),oe);n.position.set(V.x+e,58.4,V.z),i(n)}o(V.x,V.z,12,16,10),a(V.x,48,V.z,16764e3,28,22);let le=new q({color:15920864,roughness:.7}),ue=new Y(.05,.06,2.4,5),de=new f(1.6,.55,8);for(let e=0;e<22;e++){let t=X(32.062+e*.0014,34.7604),n=new J(ue,p);n.position.set(t.x,1.2,t.z),i(n);let r=new J(de,e%2?le:d);r.position.set(t.x,2.5,t.z),i(r)}n.push(le,ue,de);let fe=new q({color:15255720,roughness:.62}),me=new q({color:14206096,roughness:.96}),he=new q({color:14144440,roughness:.88}),ge=new q({color:5875780,roughness:.95});n.push(fe,me,he,ge);let _e=new J(new G(48,.22,920),me);_e.position.set(X(32.08,34.763).x,.04,X(32.08,34.763).z),_e.rotation.y=.28,i(_e);let ve=new J(new G(9,.14,820),he);ve.position.set(X(32.08,34.7658).x,.1,X(32.08,34.7658).z),ve.rotation.y=.28,i(ve);let ye=X(32.0618,34.7612),be=new J(new G(70,.12,110),ge);be.position.set(ye.x,.06,ye.z),i(be);let xe=X(32.0865,34.7688);{let e=Q(r.samples,xe.x,xe.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];xe.x=t.x+t.rx*(r.width/2+22),xe.z=t.z+t.rz*(r.width/2+22)}}let Se=new J(new G(11,44,11),l);Se.position.set(xe.x,22,xe.z),i(Se);let Ce=new J(new G(10,36,10),u);Ce.position.set(xe.x+14,18,xe.z+4),i(Ce);for(let e=6;e<40;e+=3.2){let t=new J(new G(11.6,.16,11.6),u);t.position.set(xe.x,e,xe.z),i(t)}let we=new J(new G(16,2.2,5),g);we.position.set(xe.x+7,24,xe.z+2),i(we);let Te=X(32.0795,34.7668);{let e=Q(r.samples,Te.x,Te.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];Te.x=t.x+t.rx*(r.width/2+22),Te.z=t.z+t.rz*(r.width/2+22)}}let Ee=new J(new Y(4.6,5.2,46,12),l);Ee.position.set(Te.x,23,Te.z),i(Ee);let H=new J(new Y(5.4,3.8,4.2,12),u);H.position.set(Te.x,48,Te.z),i(H);let De=X(32.0638,34.7648);{let e=Q(r.samples,De.x,De.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];De.x=t.x+t.rx*(r.width/2+24),De.z=t.z+t.rz*(r.width/2+24)}}let Oe=new J(new G(36,18,16),u);Oe.position.set(De.x,9,De.z),i(Oe);let ke=new J(new G(28,12,14),l);ke.position.set(De.x,21,De.z),i(ke);let U=new J(new G(20,8,12),u);U.position.set(De.x,31,De.z),i(U);let Ae=X(32.083,34.7674);{let e=Q(r.samples,Ae.x,Ae.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];Ae.x=t.x+t.rx*(r.width/2+22),Ae.z=t.z+t.rz*(r.width/2+22)}}let je=new J(new G(16,22,10),fe);je.position.set(Ae.x,11,Ae.z),i(je);for(let e=4;e<20;e+=2.6){let t=new J(new G(17.2,.14,11),u);t.position.set(Ae.x,e,Ae.z),i(t)}let Me=X(32.0648,34.7618);{let e=Q(r.samples,Me.x,Me.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];Me.x=t.x+t.rx*(r.width/2+26),Me.z=t.z+t.rz*(r.width/2+26)}}let Ne=new J(new ht(12,1.4,8,24),c);Ne.rotation.x=Math.PI/2,Ne.position.set(Me.x,.8,Me.z),i(Ne);let Pe=new J(new Y(8,9.5,2.4,16,1,!0),c);Pe.position.set(Me.x,1.2,Me.z),i(Pe);let Fe=X(32.0639,34.7688);{let e=Q(r.samples,Fe.x,Fe.z,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];Fe.x=t.x+t.rx*(r.width/2+24),Fe.z=t.z+t.rz*(r.width/2+24)}}let Ie=new J(new G(16,62,10),u);Ie.position.set(Fe.x,31,Fe.z),i(Ie);let Le=new J(new Y(.2,.32,16,6),_);Le.position.set(Fe.x,70,Fe.z),i(Le),a(y.x,36,y.z,16769200,38,36),a(T.x,50,T.z,16771264,32,32);let K=(e,t,n)=>{Q(r.samples,e,t,0).dist>r.width/2+6&&o(e,t,n)};K(Fe.x,Fe.z,8),K(y.x,y.z,16),K(T.x,T.z,10),K(A.x,A.z,14),K(xe.x,xe.z,10),K(xe.x+14,xe.z+4,8),K(Te.x,Te.z,6),K(De.x,De.z,14),K(Ae.x,Ae.z,8),K(Me.x,Me.z,10),K(R.x,R.z,10);let Re=X(32.1044,34.7776);{let e=Q(r.samples,Re.x,Re.z,0),t=r.samples[e.index];s(t.x,t.z,Math.atan2(t.tx,t.tz),82,r.width*.72,8.8,t.y),e.dist<r.width/2+12&&(Re.x=t.x+t.rx*(r.width/2+26),Re.z=t.z+t.rz*(r.width/2+26))}let ze=new J(new Y(3.8,5.6,92,16),u);ze.position.set(Re.x,46,Re.z),i(ze);let Be=new J(new Y(5.2,4.2,2.8,16),u);Be.position.set(Re.x,93,Re.z),i(Be);let Ve=new J(new Y(4.2,3.6,3.4,16),u);Ve.position.set(Re.x,96,Re.z),i(Ve);let He=new q({color:12860456,roughness:.52});n.push(He);for(let e=0;e<16;e++){let t=new J(new Y(4.05,4.2,3.2,14),e%2?He:l);t.position.set(Re.x,22+e*4.4,Re.z),i(t)}K(Re.x,Re.z,5)}function Lu(e){let{bag:t,isNight:n,emitList:r,built:i,add:a,glowAt:o,hit:s,white:c,cream:l,terracotta:u,wood:d,darkArch:p}=e,m=new q({color:12886128,roughness:.9,envMapIntensity:.22}),h=new q({color:10516552,roughness:.92}),g=new q({color:13215092,roughness:.82});t.push(m,h,g);let _=X(32.0556,34.7558);{let e=Q(i.samples,_.x,_.z,0);if(e.dist<i.width/2+10){let t=i.samples[e.index];_.x=t.x+t.rx*(i.width/2+22),_.z=t.z+t.rz*(i.width/2+22)}}let v=new J(new G(5.2,32,5.2),m);v.position.set(_.x,17.2,_.z),a(v);for(let e=6.2;e<30;e+=4.6){let t=new J(new G(5.55,.36,5.55),g);t.position.set(_.x,e,_.z),a(t)}let y=new J(new G(8.4,4.2,8.4),h);y.position.set(_.x,2.1,_.z),a(y);let b=new J(new Y(16,16,.18,20),h);b.position.set(_.x-6,.1,_.z),a(b);let x=new J(new G(5.8,.24,5.8),g);x.position.set(_.x,18.8,_.z),a(x);for(let e=0;e<4;e++)for(let t of[0,Math.PI/2,Math.PI,3*Math.PI/2]){let n=new J(new Y(.85,.85,.32,10,1,!1,0,Math.PI),p);n.rotation.z=Math.PI/2,n.position.set(_.x+Math.sin(t)*2.45,4.8+e*3.6,_.z+Math.cos(t)*2.45),n.rotation.y=t,a(n)}let S=pu(),C=new q({map:S??void 0,color:S?16777215:16051936,roughness:.45,emissive:3351050,emissiveIntensity:n?.55:.08});r.push({mat:C,night:.55,day:.08}),t.push(C);for(let e=0;e<4;e++){let t=e*Math.PI/2,n=new J(new Nt(1.05,22),C);n.position.set(_.x+Math.sin(t)*2.66,26.4,_.z+Math.cos(t)*2.66),n.lookAt(_.x+Math.sin(t)*8,26.4,_.z+Math.cos(t)*8),a(n)}let w=new J(new f(3.6,6.4,4),h);w.rotation.y=Math.PI/4,w.position.set(_.x,36.2,_.z),a(w);let T=new J(new Y(.07,.11,2.8,6),h);T.position.set(_.x,40.2,_.z),a(T),s(_.x,_.z,5.5,4.2,4.2);for(let e=0;e<22;e++){let t=e/22*Math.PI*1.7+.35,n=_.x+Math.cos(t)*(22+e%4*5),r=_.z+Math.sin(t)*(20+e%3*6);if(Q(i.samples,n,r,0).dist<i.width/2+10)continue;let o=5.2+e%4*1.6,c=new J(new G(6.2+e%3,o,5.4+e%2),e%2?m:h);c.position.set(n,o*.5,r),a(c);let l=new J(new Y(2.4+e%2*.4,2.4+e%2*.4,6.4+e%3,10,1,!1,0,Math.PI),h);l.rotation.z=Math.PI/2,l.position.set(n,o+.9,r),a(l);let u=new J(new G(1.6,2.2,.3),p);if(u.position.set(n,1.2,r+2.8),a(u),e%3==0){let e=new J(new W(1.6,10,8,0,Math.PI*2,0,Math.PI/2),g);e.position.set(n,o+2.4,r),a(e)}s(n,r,3.4,3.2,2.8)}let E=X(32.0564,34.7568);{let e=Q(i.samples,E.x,E.z,0);if(e.dist<i.width/2+12){let t=i.samples[e.index];E.x=t.x+t.rx*(i.width/2+26),E.z=t.z+t.rz*(i.width/2+26)}}let D=new J(new G(16,8,14),m);D.position.set(E.x,4,E.z),a(D);let O=new J(new W(4.4,14,10,0,Math.PI*2,0,Math.PI/2),l);O.position.set(E.x,8.2,E.z),a(O);let k=new J(new Y(1.15,1.45,22,10),g);k.position.set(E.x+7,11,E.z-4),a(k);let A=new J(new f(1.7,2.8,8),l);A.position.set(E.x+7,23.4,E.z-4),a(A);let j=X(32.0524,34.7492),M=new J(new G(22,.7,86),h);M.position.set(j.x,.18,j.z),a(M);for(let e of[{lat:32.0516,lon:34.7494},{lat:32.0522,lon:34.7496},{lat:32.0528,lon:34.7498},{lat:32.0534,lon:34.75}]){let t=X(e.lat,e.lon);{let e=Q(i.samples,t.x,t.z,0);if(e.dist<i.width/2+10){let n=i.samples[e.index];t.x=n.x+n.rx*(i.width/2+18),t.z=n.z+n.rz*(i.width/2+18)}}let n=new J(new G(18,6.4,14),m);n.position.set(t.x,3.2,t.z),a(n);for(let e=0;e<3;e++){let n=new J(new G(2.8,3.6,.4),p);n.position.set(t.x-9,1.9,t.z-4+e*4),a(n)}let r=new J(new G(20,.4,16),u);r.position.set(t.x,6.6,t.z),a(r),s(t.x,t.z,6)}let N=[12860456,15262940,2779786,13934688];for(let e=0;e<9;e++){let n=N[e%N.length],r=new q({color:n,roughness:.55});t.push(r);let i=new J(new G(3.4,1.6,9.2),r);i.position.set(j.x-22-e%3*5,.7,j.z-30+e*8),i.rotation.y=.12,a(i);let o=new J(new G(2.2,1.4,3.2),c);o.position.set(j.x-22-e%3*5,2.1,j.z-30+e*8),a(o)}let P=new J(new G(4.2,.35,22),d);P.position.set(j.x-18,.4,j.z+8),a(P);{let e=X(32.0533,34.751),t=Q(i.samples,e.x,e.z,0);if(t.dist<i.width/2+12){let n=i.samples[t.index];e.x=n.x+n.rx*(i.width/2+26),e.z=n.z+n.rz*(i.width/2+26)}let n=new J(new Y(1.15,1.55,14,10),g);n.position.set(e.x,7.2,e.z),a(n);let r=new J(new Y(1.7,1.5,2.4,10),l);r.position.set(e.x,15.4,e.z),a(r);let c=new J(new W(.7,10,8),new Ct({color:16773832}));c.position.set(e.x,16.8,e.z),a(c),o(e.x,16.8,e.z,16777136,22,16),s(e.x,e.z,2.4)}let F=X(32.0546,34.7508);{let e=Q(i.samples,F.x,F.z,0);if(e.dist<i.width/2+12){let t=i.samples[e.index];F.x=t.x+t.rx*(i.width/2+22),F.z=t.z+t.rz*(i.width/2+22)}}let I=new J(new G(14,10,22),l);I.position.set(F.x,8,F.z),a(I);let ee=new J(new G(6.2,28,6.2),l);ee.position.set(F.x-2,16,F.z-8),a(ee);let L=new J(new Nt(1.05,16),C);L.position.set(F.x-2,26,F.z-11.2),a(L);let R=new J(new f(4.2,7.4,4),l);R.rotation.y=Math.PI/4,R.position.set(F.x-2,33.4,F.z-8),a(R);let te=new J(new G(.18,2.2,.18),c);te.position.set(F.x-2,38,F.z-8),a(te),X(32.054,34.7522);let ne=[{lat:32.0538,lon:34.7532,w:6.2,h:5.4,d:5.8,col:m},{lat:32.054,lon:34.7536,w:5.6,h:6.8,d:5.2,col:h},{lat:32.0544,lon:34.7534,w:7.4,h:5.2,d:6.4,col:g},{lat:32.0548,lon:34.753,w:5.8,h:7.2,d:5.4,col:m},{lat:32.0546,lon:34.754,w:6.6,h:6,d:5.6,col:h},{lat:32.0536,lon:34.7538,w:5.2,h:5.8,d:6.2,col:g},{lat:32.0534,lon:34.7544,w:6.8,h:4.8,d:5.4,col:m},{lat:32.055,lon:34.7538,w:5.4,h:6.4,d:5.8,col:h}];for(let e of ne){let t=X(e.lat,e.lon),n=Q(i.samples,t.x,t.z,0);if(n.dist<i.width/2+8){let e=i.samples[n.index];t.x=e.x+e.rx*(i.width/2+14),t.z=e.z+e.rz*(i.width/2+14)}let r=new J(new G(e.w,e.h,e.d),e.col);r.position.set(t.x,1.6+e.h*.5,t.z),a(r);let o=new J(new G(e.w+.4,.28,e.d+.4),u);o.position.set(t.x,1.6+e.h+.16,t.z),a(o);let c=new J(new Y(.7,.7,.28,10,1,!1,0,Math.PI),p);c.rotation.z=Math.PI/2,c.position.set(t.x,2.4,t.z+e.d*.51),a(c),s(t.x,t.z,4)}let re=[10762792,12880440,6961698,12085296];for(let e=0;e<8;e++)for(let t=0;t<7;t++){let n=32.0528+e*32e-5,r=34.7514+t*38e-5,o=X(n,r);if(Q(i.samples,o.x,o.z,0).dist<i.width/2+11)continue;let c=e*7+t,l=4.4+c%5*.85,d=5.2+c%3*.7,f=4.8+c%2*.8,_=c%3==0?m:c%3==1?h:g,v=.4+t*.35,y=new J(new G(d,l,f),_);y.position.set(o.x,v+l*.5,o.z),a(y);let b=new J(new G(d+.5,.28,f+.5),u);b.position.set(o.x,v+l+.2,o.z),a(b);let x=new J(new G(1.1,1.4,.12),p);if(x.position.set(o.x,v+2.2,o.z+f*.51),a(x),c%4==0){let e=new J(new G(2.4,.08,1.6),new q({color:re[c%4],roughness:.9}));e.position.set(o.x,v+2.8,o.z+f*.55),a(e)}s(o.x,o.z,3.2)}let z=X(32.0533,34.7502),B=new J(new Y(1.7,2.2,11,12),l);B.position.set(z.x,5.6,z.z),a(B);let ie=new J(new Y(2.3,2.3,.35,12),h);ie.position.set(z.x,11.3,z.z),a(ie);let ae=new J(new Y(1.15,1.35,2.8,10),c);ae.position.set(z.x,12.8,z.z),a(ae);let V=new J(new W(1.05,10,8),new Ct({color:16773828}));V.position.set(z.x,14.2,z.z),a(V);let oe=new J(new f(1.4,1.6,8),h);oe.position.set(z.x,15.6,z.z),a(oe),o(z.x,14.2,z.z,16771232,22,18);let se=X(32.0542,34.752),ce=new J(new Y(2.4,2.6,.6,14),m);ce.position.set(se.x,.4,se.z),a(ce);let le=X(32.0535,34.7588),ue=[new q({color:10762792,roughness:.88}),new q({color:12884544,roughness:.88}),new q({color:3824248,roughness:.88})];t.push(...ue);for(let e=0;e<8;e++){let t=new J(new G(1.6,5.4,1.6),m);if(t.position.set(le.x+e*4.2,2.7,le.z),a(t),e<7){let t=new J(new G(4.4,1.1,1.8),h);t.position.set(le.x+e*4.2+2.1,5.6,le.z),a(t);let n=new J(new G(3.2,2.8,.3),p);n.position.set(le.x+e*4.2+2.1,2.2,le.z+.9),a(n);let r=new J(new G(3.6,.1,2.4),ue[e%3]);r.position.set(le.x+e*4.2+2.1,4.4,le.z+1.6),a(r)}}let de=X(32.0528,34.7486),fe=new J(new _e(3.4,0),h);fe.position.set(de.x,.6,de.z),a(fe),o(_.x,26,_.z,16770736,36,28),o(F.x-2,30,F.z-8,16771272,28,24),o(j.x,6,j.z,16763e3,24,22);let pe=(e,t,n)=>{Q(i.samples,e,t,0).dist>i.width/2+5&&s(e,t,n)};pe(_.x,_.z,4.5),pe(F.x,F.z,7),pe(E.x,E.z,7),pe(j.x,j.z,6),pe(z.x,z.z,3)}function Ru(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,hitRoad:o,stone:s,white:c,glass:l,cream:u,terracotta:d,darkGlass:p,paleGlass:m,bandMat:h,azSqGlass:g,gateGlass:_,placeAzrieli:v,placeCityGate:y,placeToHa:b}=e,x=(e,t=26)=>{let r=Q(n.samples,e.x,e.z,0);if(r.dist<n.width/2+t){let i=n.samples[r.index];e.x=i.x+i.rx*(n.width/2+t),e.z=i.z+i.rz*(n.width/2+t)}return e},S=X(32.0744,34.7938);v(1.22),b(1.05),y(1);let C=x(X(32.0714,34.7866),28),w=new J(new G(11,92,11),l);w.position.set(C.x,46,C.z),r(w);let T=new J(new G(8.4,16,8.4),m);T.position.set(C.x,100,C.z),r(T),X(32.071,34.7858);let E=[{lat:32.0706,lon:34.7848,w:6.8,d:8.2,h:5.8,col:u,roof:d},{lat:32.071,lon:34.7852,w:5.6,d:7.4,h:4.8,col:c,roof:d},{lat:32.0714,lon:34.7846,w:7.2,d:6.6,h:6.4,col:u,roof:d},{lat:32.0708,lon:34.7844,w:6.2,d:7.8,h:5.2,col:c,roof:d},{lat:32.0712,lon:34.7842,w:5.4,d:6.8,h:4.6,col:u,roof:d},{lat:32.0716,lon:34.785,w:8.4,d:7.2,h:7.2,col:c,roof:d}];for(let e of E){let t=x(X(e.lat,e.lon),22),n=new J(new G(e.w,e.h,e.d),e.col);n.position.set(t.x,e.h*.5,t.z),r(n);let i=new J(new f(Math.max(e.w,e.d)*.58,2.4,4),e.roof);i.rotation.y=Math.PI/4,i.position.set(t.x,e.h+1.2,t.z),r(i),a(t.x,t.z,4)}let D=x(X(32.0712,34.7844),22),O=new J(new G(10,8.4,16),u);O.position.set(D.x,4.2,D.z),r(O);let k=new J(new G(11,.5,17),d);k.position.set(D.x,8.6,D.z),r(k),a(D.x,D.z,6);let A=x(X(32.0704,34.7838),22),j=new J(new G(22,6.2,9),m);j.position.set(A.x,3.1,A.z),r(j);let M=new J(new G(23.2,.35,10.2),h);M.position.set(A.x,6.4,A.z),r(M);for(let e of[-8,0,8]){let t=new J(new G(.35,6.4,9.4),h);t.position.set(A.x+e,3.2,A.z),r(t)}a(A.x,A.z,8);let N=x(X(32.0754,34.7874),30),P=new J(new G(16,42,12),u);P.position.set(N.x,21,N.z),r(P);let F=new J(new G(17.2,4.4,13),h);F.position.set(N.x,44.2,N.z),r(F);let I=x(X(32.0804,34.7942),32),ee=new J(new G(13.2,88,13.2),g);ee.position.set(I.x,44,I.z),r(ee);let L=new J(new Y(.22,.4,24,8),h);L.position.set(I.x,100,I.z),r(L);let R=x(X(32.0798,34.7934),32),te=new J(new G(11,76,13),_);te.position.set(R.x-8,38,R.z),r(te);let ne=new J(new G(11,68,13),_);ne.position.set(R.x+8,34,R.z),r(ne);let re=x(X(32.0758,34.7946),30),z=new J(new Y(7.2,9.4,72,12),l);z.position.set(re.x,36,re.z),r(z);let B=x(X(32.0728,34.7794),28),ie=new J(new Y(28,28,.16,32),s);ie.position.set(B.x,.08,B.z),r(ie);let ae=new J(new ht(20,.55,6,28),u);ae.rotation.x=Math.PI/2,ae.position.set(B.x,.22,B.z),r(ae);let V=new J(new G(22,14,18),c);V.position.set(B.x,7,B.z),r(V);let oe=new J(new G(14,12,14),u);oe.position.set(B.x+7,19,B.z-3),oe.rotation.y=.22,r(oe);let se=new J(new G(10,8.4,10),c);se.position.set(B.x-6,18,B.z+4),r(se);let ce=new J(new G(12,.4,10),new q({color:2779688,roughness:.9}));ce.position.set(B.x+7,25.2,B.z-3),r(ce);let le=new q({color:3178290,roughness:.92});t.push(le);for(let e of[-9,9]){let t=new J(new G(.6,14,8),le);t.position.set(B.x+e,9,B.z),r(t)}let ue=new J(new G(28,1.2,10),s);ue.position.set(B.x,.6,B.z+12),r(ue),a(B.x,B.z,14);let de=x(X(32.0629,34.7716),24),fe=new J(new G(13.4,8.2,10.2),u);fe.position.set(de.x,4.1,de.z),r(fe);let me=new J(new G(10.4,.22,2.4),c);me.position.set(de.x,5.4,de.z+5.6),r(me);let he=new J(new G(10.4,.7,.08),c);he.position.set(de.x,5.85,de.z+6.7),r(he);let ge=new J(new Y(.06,.08,6.2,6),h);ge.position.set(de.x+5.4,8.8,de.z+4.2),r(ge);let _e=new J(new pe(2.6,1.5),new Ct({map:gu()??void 0,color:gu()?16777215:14520,side:2}));_e.position.set(de.x+6.7,11.2,de.z+4.2),r(_e),a(de.x,de.z,7);let ve=x(X(32.0732,34.7888),28),ye=new J(new G(14,56,10),p);ye.position.set(ve.x,28,ve.z),r(ye);let be=new J(new G(8,20,10),m);be.position.set(ve.x+4,48,ve.z),r(be),o(ve.x,ve.z,7),i(S.x,110,S.z,8308968,70,60),o(S.x+17.08,S.z,16,22,14),o(C.x,C.z,8),o(N.x,N.z,10),o(I.x,I.z,8);let xe=x(X(32.0753,34.7748),28),Se=new J(new Y(18,20,8,24),u);Se.position.set(xe.x,4,xe.z),r(Se);let Ce=new J(new Y(7.2,7.8,36,16),c);Ce.position.set(xe.x-10,26,xe.z),r(Ce);let we=new J(new Y(6.6,7.2,30,16),u);we.position.set(xe.x+11,23,xe.z+4),r(we);let Te=new J(new ht(14,1.1,6,20,Math.PI*1.4),s);Te.rotation.x=Math.PI/2,Te.position.set(xe.x,2.4,xe.z),r(Te),o(xe.x,xe.z,16);let Ee=x(X(32.063,34.7795),28),H=new J(new Y(8.4,9.2,78,3),p);H.position.set(Ee.x,39,Ee.z),H.rotation.y=.4,r(H);let De=new J(new Y(3.2,8.2,10,3),m);De.position.set(Ee.x,83,Ee.z),De.rotation.y=.4,r(De),o(Ee.x,Ee.z,8);let Oe=x(X(32.0854,34.7966),30),ke=x(X(32.0858,34.7972),30),U=new J(new G(11,82,11),m);U.position.set(Oe.x,41,Oe.z),r(U);let Ae=new J(new G(11,74,11),l);Ae.position.set(ke.x,37,ke.z),r(Ae),o(Oe.x,Oe.z,7),o(ke.x,ke.z,7);let W=x(X(32.0639,34.7704),26),je=new J(new G(16,62,10),u);je.position.set(W.x,31,W.z),r(je);let Me=new J(new Y(.2,.32,16,6),h);Me.position.set(W.x,70,W.z),r(Me),o(W.x,W.z,8)}function zu(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,placeTunnel:o,white:s,glass:c,cream:l,terracotta:u,wood:d,darkGlass:p}=e,m=new q({color:14207144,roughness:.74,metalness:.08,envMapIntensity:.4}),h=new q({color:11029042,roughness:.62,metalness:.35,envMapIntensity:.55});t.push(m,h);let g=X(32.0968,34.7735);for(let e of[{lat:32.0958,lon:34.7712},{lat:32.0964,lon:34.7713},{lat:32.097,lon:34.7714},{lat:32.0976,lon:34.7715},{lat:32.0982,lon:34.7716}]){let t=X(e.lat,e.lon);{let e=Q(n.samples,t.x,t.z,0);if(e.dist<n.width/2+16){let r=n.samples[e.index];t.x=r.x+r.rx*(n.width/2+36),t.z=r.z+r.rz*(n.width/2+36)}}let i=new J(new G(36,7.2,16),m);i.position.set(t.x,3.6,t.z),r(i);let a=new J(new Y(8.2,8.2,36,12,1,!1,0,Math.PI),m);a.rotation.z=Math.PI/2,a.position.set(t.x,7.2,t.z),r(a)}let _=new J(new G(1.4,22,1.4),h);_.position.set(g.x-22,11,g.z+30),r(_);let v=new J(new G(28,.7,.7),h);v.position.set(g.x-10,22,g.z+30),r(v);let y=new J(new G(.25,8,.25),h);y.position.set(g.x+2,18,g.z+30),r(y);let b=X(32.1035,34.7788),x=Q(n.samples,b.x,b.z,0),S=n.samples[x.index],C=Math.atan2(S.tx,S.tz),w=new q({color:13213808,roughness:.8,envMapIntensity:.38}),T=new q({color:11569240,roughness:.82}),E=new q({color:12104876,roughness:.68,metalness:.14}),D=new q({color:12858408,roughness:.5}),O=new q({color:15262940,roughness:.48});t.push(w,T,E,D,O),o(S.x,S.z,C,86,n.width/2+.6,8.8,S.y);let k=Math.cos(C),A=-Math.sin(C),j=Math.sin(C),M=Math.cos(C),N=S.x+k*(n.width/2+48),P=S.z+A*(n.width/2+48),F=new J(new G(34,11,42),w);F.position.set(N,S.y+5.5,P),F.rotation.y=C,r(F);for(let e of[-1,1]){let t=new J(new G(1.2,8.2,58),w);t.position.set(N+k*17.4*e,S.y+4.1,P+A*17.4*e),t.rotation.y=C,r(t)}for(let e of[-1,1]){let t=S.x+j*32*e,n=S.z+M*32*e;for(let e of[-1,1]){let i=new J(new G(5.2,8.6,2.6),T);i.position.set(t+k*18.6*e,4.3,n+A*18.6*e),i.rotation.y=C,r(i)}let i=new J(new G(38,2.6,2.8),w);i.position.set(t,8.7,n),i.rotation.y=C,r(i);let a=new J(new G(8,1.4,3.2),T);a.position.set(t,10.4,n),a.rotation.y=C,r(a)}for(let e of[-1,1])for(let t=0;t<8;t++){let n=new J(new G(2.2,3.4,.35),p);n.position.set(N+k*e*17.2+j*(t*4.4-14),S.y+8.2,P+A*e*17.2+M*(t*4.4-14)),n.rotation.y=C,r(n)}let I=new J(new G(12,20,14),T);I.position.set(N-k*18,S.y+10.2,P-A*18),I.rotation.y=C,r(I);let ee=new J(new G(14,9,16),w);ee.position.set(N-k*20,S.y+4.6,P-A*20),ee.rotation.y=C,r(ee);let L=new J(new G(14,9,16),w);L.position.set(N+k*20,S.y+4.6,P+A*20),L.rotation.y=C,r(L);let R=new J(new G(36,.7,44),l);R.position.set(N,S.y+11.1,P),R.rotation.y=C,r(R);let te=N+k*26,ne=P+A*26,re=new J(new Y(3.8,5.6,92,16),E);re.position.set(te,S.y+52.4,ne),r(re);let z=new J(new Y(5.2,4.2,2.8,16),E);z.position.set(te,S.y+99.2,ne),r(z);let B=new J(new Y(4.2,3.6,3.6,16),E);B.position.set(te,S.y+102.2,ne),r(B);for(let e=0;e<16;e++){let t=new J(new Y(4.05,4.2,3.2,14),e%2?D:O);t.position.set(te,S.y+28+e*4.4,ne),r(t)}let ie=N+k*36,ae=P+A*36,V=new J(new Y(2.8,3.8,62,12),E);V.position.set(ie,S.y+37.4,ae),r(V);for(let e=0;e<12;e++){let t=new J(new Y(3,3.1,2.6,12),e%2?D:O);t.position.set(ie,S.y+18+e*3.4,ae),r(t)}let oe=X(32.102,34.774),se=new J(new pe(90,220),new q({color:15259572,roughness:1}));se.rotation.x=-Math.PI/2,se.position.set(oe.x,.02,oe.z),r(se);let ce=new q({color:16052196,roughness:.7});t.push(ce);for(let e=0;e<18;e++){let t=oe.x-8+e%3*7,n=oe.z-70+Math.floor(e/3)*22,i=new J(new Y(.06,.07,2.5,5),d);i.position.set(t,1.25,n),r(i);let a=new J(new f(1.7,.5,8),e%2?ce:u);a.position.set(t,2.55,n),r(a)}let le=X(32.104,34.79),ue=new J(new Y(16,16,6,24),s);ue.position.set(le.x,3,le.z),r(ue);let de=new J(new W(16,20,10,0,Math.PI*2,0,Math.PI/2),c);de.position.set(le.x,6,le.z),r(de),i(te,S.y+98,ne,16724016,48,40),i(g.x,10,g.z,16760944,24,22),a(S.x-k*30,S.z-A*30,8),a(S.x+k*30,S.z+A*30,8),a(te,ne,5),a(ie,ae,4),a(N,P,16,18,22,C),a(le.x,le.z,14),a(g.x,g.z+40,12)}function Bu(e){let{def:t,bag:n,built:r,add:i,glowAt:a,hit:o,stone:s,white:c,cream:l,terracotta:u,merlonWall:d,minaret:p,ottomanGate:m,placeDome:h,herodianTexture:g}=e,_=(e,t=24)=>{let n=Q(r.samples,e.x,e.z,0);if(n.dist<r.width/2+t){let i=r.samples[n.index];e.x=i.x+i.rx*(r.width/2+t),e.z=i.z+i.rz*(r.width/2+t)}return e},v=_(rr(31.7764,35.2276),28),y=_(rr(31.7762,35.2284),36),b=_(rr(31.7788,35.2364),42),x=_(rr(31.7745,35.2225),26),S=_(rr(31.7848,35.2114),22),C=_(rr(31.7784,35.2346),38),w=_(rr(31.7715,35.2247),26),T=_(rr(31.7848,35.2462),32);d(v.x+38,v.z+62,54,.2,13),d(v.x+62,v.z+42,48,1.1,12);let E=Math.max(0,Math.min(r.samples.length-1,Math.floor(r.samples.length*.46))),D=r.samples[E],O=r.width/2+44;m(D.x+D.rx*O,D.z+D.rz*O,Math.atan2(D.tx,D.tz));let k=new J(new G(22,13,22),s);k.position.set(y.x+28,7.5,y.z+36),i(k);for(let[e,t]of[[-9,-9],[9,-9],[-9,9],[9,9]]){let n=new J(new Y(3.4,4,17,10),s);n.position.set(y.x+28+e,10,y.z+36+t),i(n);let r=new J(new Y(4.3,3.7,1.5,10),l);r.position.set(y.x+28+e,19,y.z+36+t),i(r)}p(y.x+32,y.z+33,32),h(b.x,b.z);let A=_(rr(31.7784,35.236),34),j=new J(new G(28,8,16),s);j.position.set(A.x,4.2,A.z),i(j);let M=new J(new W(5.2,14,10,0,Math.PI*2,0,Math.PI/2),l);M.position.set(A.x,10.4,A.z),i(M);let N=_(rr(31.7784,35.2296),26),P=new J(new G(18,11,16),s);P.position.set(N.x,5.6,N.z),i(P);let F=new J(new W(6.4,14,10,0,Math.PI*2,0,Math.PI/2),l);F.position.set(N.x,13.2,N.z),i(F);let I=_(rr(31.7772,35.2316),24),ee=new J(new Y(6.2,6.6,10,12),s);ee.position.set(I.x,5.2,I.z),i(ee);let L=new J(new W(6.8,16,10,0,Math.PI*2,0,Math.PI/2),c);L.position.set(I.x,11.4,I.z),i(L);let R=_(rr(31.7753,35.222),22),te=new J(new G(18,14,12),s);te.position.set(R.x,7.2,R.z),i(te);let ne=new J(new G(5.2,28,5.2),s);ne.position.set(R.x,18,R.z),i(ne);let re=new J(new f(3.8,6,4),l);re.rotation.y=Math.PI/4,re.position.set(R.x,35,R.z),i(re),o(A.x,A.z,10,14,8),o(N.x,N.z,9,9,8),o(I.x,I.z,7,6.4,6.4),o(R.x,R.z,8,9,6);let z=_(rr(31.7766,35.2054),28),B=new J(new G(36,8.4,22),s);B.position.set(z.x,5.2,z.z),i(B);let ie=new J(new G(38,.7,24),l);ie.position.set(z.x,9.6,z.z),i(ie);for(let e of[-14,-7,0,7,14]){let t=new J(new G(1.1,7.2,1.1),l);t.position.set(z.x+e,4.6,z.z+12),i(t)}o(z.x,z.z,12);let ae=new J(new G(28,17,14),s);ae.position.set(x.x-28,10,x.z-22),i(ae);let V=new J(new G(30,2.2,16),u);V.position.set(x.x-28,19.4,x.z-22),i(V);let oe=new J(new G(20,5,10),u);oe.position.set(S.x-16,4,S.z+12),i(oe);for(let e=0;e<10;e++){let t=new J(new G(3.4,2.6,2.8),e%2?u:l);t.position.set(S.x-22+e*4.2,1.4,S.z+18),i(t);let n=new J(new G(3.6,.12,3.2),new q({color:e%3==0?12868666:e%3==1?2779704:1723018,roughness:.88}));n.position.set(S.x-22+e*4.2,2.85,S.z+18),i(n)}let se=new J(new Y(3.4,4.2,9,12),s);se.position.set(w.x,4.6,w.z),i(se);let ce=new J(new f(3.8,4.2,8),l);ce.position.set(w.x,11.2,w.z),i(ce);let le=g();n.push(le);let ue=new q({map:le,roughness:.78,metalness:.06,envMapIntensity:.4});n.push(ue);let de=C.x,fe=C.z+18;{let e=Q(r.samples,de,fe,0);if(e.dist<r.width/2+12){let t=r.samples[e.index];de=t.x+t.rx*(r.width/2+24),fe=t.z+t.rz*(r.width/2+24)}}for(let e=0;e<8;e++)for(let t=0;t<10;t++){let n=3.6+(t+e)%3*.45,r=new J(new G(n,1.85,3.5),ue);r.position.set(de-18+t*4.1+e%2*.7,1.1+e*1.95,fe),i(r)}for(let e=0;e<10;e++){let n=new J(new f(1.15,6.4,7),new q({color:2972216,roughness:.9}));n.position.set(T.x+e%5*6-10,t.elevation(.92)+3.2,T.z-8-Math.floor(e/5)*7),i(n)}let pe=new q({color:12890250,roughness:.95,flatShading:!0});n.push(pe);for(let e=0;e<18;e++){let n=e/18*Math.PI*2+.3,r=340+e%5*90,a=68+e%6*28,o=new J(new f(62+e%4*16,a,6),pe);o.position.set(T.x+Math.cos(n)*r,t.elevation(1)*.18+a*.22,T.z+Math.sin(n)*r),i(o)}a(v.x+18,16,v.z+40,16769184,28,24),a(b.x,18,b.z,16765040,32,26),o(v.x+18,v.z+40,6),o(y.x+28,y.z+36,10),o(de,fe,10,22,6),o(x.x-28,x.z-22,8),o(w.x,w.z,5)}function Vu(e){let{group:t,def:n,bag:r,built:i,add:a,glowAt:o,hit:s,stone:c,gold:l,cream:u,terracotta:d,_dummy:p}=e,m=xn(32.8118,34.9884),h=xn(32.819,35.004),g=new q({color:1853992,roughness:.9,flatShading:!0}),_=new q({color:3811356,roughness:.92}),v=new q({color:2972216,roughness:.9,flatShading:!0}),y=new q({color:4025140,roughness:.88,flatShading:!0}),b=new q({color:9076848,roughness:.9,flatShading:!0});r.push(g,_,v,y,b);let x=m.x+26,S=m.z+18;{let e=Q(i.samples,x,S,0);if(e.dist<i.width/2+36){let t=i.samples[e.index],n=i.width/2+58;x=t.x+t.rx*n,S=t.z+t.rz*n}}let C=n.elevation(.06);for(let e=0;e<18;e++){let t=new J(new G(38-e*1.15,1.05,12),new q({color:e%2?13623492:15262936,roughness:.85,envMapIntensity:.35}));t.position.set(x,C-4-e*2.4,S+e*7.2),a(t);let n=new J(new G(5.2,.4,7.4),u);if(n.position.set(x,C-3.6-e*2.4,S+e*7.2),a(n),e%2==0)for(let t of[-14,14]){let n=new J(new f(1.1,5.4,7),v);n.position.set(x+t,C-.8-e*2.4,S+e*7.2),a(n)}else for(let t of[-10,10]){let n=new J(new f(.9,4.2,7),v);n.position.set(x+t,C-1.4-e*2.4,S+e*7.2),a(n)}let r=new J(new G(34-e*1.1,.55,.7),y);r.position.set(x,C-3.3-e*2.4,S+e*7.2+5.4),a(r)}let w=new J(new Y(8.2,9.1,13,8),u);w.position.set(x,C+8,S-8),a(w);for(let e=0;e<18;e++){let t=e/18*Math.PI*2,n=new J(new Y(.36,.42,12,8),u);n.position.set(x+Math.cos(t)*10.2,C+8,S-8+Math.sin(t)*10.2),a(n)}let T=new J(new W(8.4,24,16,0,Math.PI*2,0,Math.PI/2),l);T.position.set(x,C+15.6,S-8),a(T);let E=new J(new Y(8.6,8.9,2.6,18),u);E.position.set(x,C+14.4,S-8),a(E);let D=new J(new ht(8.55,.22,6,18),l);D.rotation.x=Math.PI/2,D.position.set(x,C+15.5,S-8),a(D);let O=new J(new Y(.9,1.5,3.6,8),l);O.position.set(x,C+23.2,S-8),a(O);let k=new J(new W(.7,10,8),l);k.position.set(x,C+25.4,S-8),a(k),o(x,C+23,S-8,16763972,56,42),s(x,S-8,11,10,10);{let e=new q({color:4874808,roughness:.95,flatShading:!0});r.push(e);let t=i.samples[2];for(let n=0;n<12;n++){let r=80+n*28,i=48+n%4*20,o=new J(new f(34+n%3*10,i,6),e);o.position.set(t.x-t.rx*r,t.y+i*.18,t.z-t.rz*r),a(o)}}let A=new Y(.22,.36,8.4,7);A.translate(0,4.2,0);let j=new f(2.2,6.4,7),M=Math.min(90,i.samples.length*2),N=new Lt(A,_,M),P=new Lt(j,g,M),F=0,I=Math.max(1,Math.floor(i.samples.length/40));for(let e=1;e<i.samples.length-1&&F<M;e+=I){let t=i.samples[e],n=t.rx*(m.x-t.x)+t.rz*(m.z-t.z)>=0?1:-1;for(let r of[11,20,32]){if(F>=M)break;let a=i.width/2+r,o=t.x+t.rx*a*n,s=t.z+t.rz*a*n;p.position.set(o,t.y,s),p.scale.set(1,1+e%4*.12,1),p.rotation.set(0,e*.7,0),p.updateMatrix(),N.setMatrixAt(F,p.matrix),p.position.set(o,t.y+8.2,s),p.updateMatrix(),P.setMatrixAt(F,p.matrix),F++}}N.count=F,P.count=F,N.instanceMatrix.needsUpdate=!0,P.instanceMatrix.needsUpdate=!0,t.add(N,P);let ee=new q({color:6969928,roughness:.95,flatShading:!0});r.push(ee);for(let e=0;e<14;e++){let t=new J(new _e(4+e%3,0),ee);t.position.set(m.x+40+e%4*18,6+e%3*5,m.z-30+Math.floor(e/4)*22),a(t)}let L=new q({color:12085288,metalness:.4,roughness:.45});r.push(L);for(let e=0;e<3;e++){let t=Q(i.samples,h.x,h.z,0),n=i.samples[t.index],r=n.x+n.rx*(i.width/2+24+e*10),o=n.z+n.rz*(i.width/2+24+e*10),s=new J(new G(1.4,32+e*4,1.4),L);s.position.set(r,16+e*2,o),a(s);let c=new J(new G(36,.8,.8),L);c.position.set(r+12,32+e*4,o),a(c)}let R=xn(32.8272,34.9698),te=R.x,ne=R.z;{let e=Q(i.samples,te,ne,0);if(e.dist<i.width/2+16){let t=i.samples[e.index];te=t.x+t.rx*(i.width/2+28),ne=t.z+t.rz*(i.width/2+28)}}let re=new J(new G(16,9,22),u);re.position.set(te,4.5,ne),a(re);let z=new J(new G(10,6,8),u);z.position.set(te,12,ne),a(z);let B=new J(new W(5.2,14,10,0,Math.PI*2,0,Math.PI/2),d);B.position.set(te,15.4,ne),a(B);let ie=new J(new G(4.2,18,4.2),u);ie.position.set(te+8,9,ne+8),a(ie);let ae=new J(new f(3.2,4.4,4),d);ae.rotation.y=Math.PI/4,ae.position.set(te+8,20.2,ne+8),a(ae),s(te,ne,10,9,12);let V=new q({color:9071176,roughness:.7,metalness:.2});r.push(V);for(let e=0;e<4;e++){let t=new J(new G(8,4.2,28),V);t.position.set(h.x+40,1.8,h.z-30+e*22),a(t);let n=new J(new Y(.7,.9,6,8),u);n.position.set(h.x+40,6.8,h.z-30+e*22),a(n)}let oe=new q({color:13156532,roughness:.62,metalness:.12});r.push(oe);for(let e=0;e<5;e++){let t=new J(new Y(3.4,3.6,22,12),oe);t.position.set(h.x-28+e*8,11,h.z+22),a(t)}let se=[{lat:32.8194,lon:34.9892,w:9.2,h:8.4,d:7.6},{lat:32.8198,lon:34.99,w:10.4,h:9.2,d:8.2},{lat:32.82,lon:34.9908,w:8.6,h:7.8,d:7.2},{lat:32.8192,lon:34.9914,w:11.2,h:8.8,d:8.4},{lat:32.8188,lon:34.9898,w:9.6,h:10.2,d:7.8}];for(let e=0;e<se.length;e++){let t=se[e],n=xn(t.lat,t.lon),r=new J(new G(t.w,t.h,t.d),e%2?u:c);r.position.set(n.x,t.h*.5,n.z),a(r);let i=new J(new f(Math.max(t.w,t.d)*.7,3.2,4),d);i.rotation.y=Math.PI/4,i.position.set(n.x,t.h+1.6,n.z),a(i),s(n.x,n.z,5)}let ce=n.water?n.water.x:h.x,le=n.water?n.water.z:h.z,ue=Math.max(3,Math.floor(i.samples.length/28));for(let e=2;e<i.samples.length-2;e+=ue){let t=i.samples[e],n=-(t.rx*(ce-t.x)+t.rz*(le-t.z)>=0?1:-1),r=i.width/2+3.4,o=t.x+t.rx*r*n,s=t.z+t.rz*r*n,c=new J(new G(1.1,3.6,14),b);c.position.set(o,t.y+1.4,s),c.rotation.y=Math.atan2(t.tx,t.tz),a(c)}let de=new q({color:13157564,metalness:.35,roughness:.45});r.push(de);for(let e=4;e<i.samples.length-4;e+=4){let t=i.samples[e],n=t.rx*(ce-t.x)+t.rz*(le-t.z)>=0?1:-1,r=i.width/2+1.6,o=t.x+t.rx*r*n,s=t.z+t.rz*r*n,c=new J(new Y(.06,.07,1.15,5),de);if(c.position.set(o,t.y+.7,s),a(c),e+4<i.samples.length){let c=i.samples[Math.min(e+4,i.samples.length-1)],l=c.x+c.rx*r*n,u=c.z+c.rz*r*n,d=new J(new G(Math.hypot(l-o,u-s),.06,.06),de);d.position.set((o+l)*.5,t.y+1.15,(s+u)*.5),d.lookAt(l,t.y+1.15,u),a(d)}}}function Hu(e){let{built:t,add:n,glowAt:r,hit:i,white:a,cream:o,wood:s,cyan:c}=e,l=bn(29.5482,34.9542);{let e=Q(t.samples,l.x,l.z,0);if(e.dist<t.width/2+10){let n=t.samples[e.index];l.x=n.x+n.rx*(t.width/2+24),l.z=n.z+n.rz*(t.width/2+24)}}let u=bn(29.5585,34.96);for(let e=0;e<7;e++){let t=new J(new f(18+e*3,22+e*6,5),new q({color:10771002,roughness:.95,flatShading:!0,envMapIntensity:.2}));t.position.set(l.x+80+e*18,10+e,l.z-20+e%3*30),n(t)}let d=new J(new G(5,.45,36),s);d.position.set(l.x-12,.22,l.z),n(d);for(let e of[{lat:29.5578,lon:34.9612,w:12,h:26,d:9},{lat:29.5564,lon:34.9604,w:11,h:22,d:9},{lat:29.5586,lon:34.9592,w:14,h:32,d:10,round:!0},{lat:29.5552,lon:34.9618,w:13,h:24,d:9}]){let t=bn(e.lat,e.lon);if(e.round){let r=new J(new Y(7.2,8,e.h,12),a);r.position.set(t.x,e.h*.5,t.z),n(r);let i=new J(new Y(8.4,6.2,3.2,12),o);i.position.set(t.x,e.h+1.6,t.z),n(i)}else{let r=new J(new G(e.w,e.h,e.d),o);r.position.set(t.x,e.h*.5,t.z),n(r);for(let r=0;r<6;r++){let i=new J(new G(e.w+.3,.16,e.d+.3),c);i.position.set(t.x,4+r*3.4,t.z),n(i)}}i(t.x,t.z,7)}r(l.x,16,l.z,6739176,32,26),i(l.x,l.z,8),i(u.x,u.z,8)}function Uu(e){let{group:t,bag:n,shadows:r,colliders:i,built:a,add:o,glowAt:s,hit:c,white:l,gold:u,cream:d,terracotta:p,darkGlass:m,bandMat:h,_dummy:g,barkTexture:_,curtainTexture:v,foliageTexture:y}=e,b=new q({color:3832386,roughness:.92}),x=new q({color:12890256,roughness:.88}),S=new q({color:2763822,roughness:.78}),C=new q({map:_(),color:6967352,roughness:.94}),w=new q({map:y(),color:2779688,roughness:.82,flatShading:!0}),T=new q({color:15255720,roughness:.7}),E=new q({color:14206112,roughness:.74});n.push(b,x,S,C,w,T,E);let D=a.samples.length,O=[],k=[],A=[],j=[],M=6.2,N=1.5;for(let e=0;e<=D;e++){let t=a.samples[e%D],n=t.y+.08;O.push(t.x-t.rx*M,n,t.z-t.rz*M),O.push(t.x+t.rx*M,n,t.z+t.rz*M),A.push(t.x-t.rx*N,n+.04,t.z-t.rz*N),A.push(t.x+t.rx*N,n+.04,t.z+t.rz*N)}for(let e=0;e<D;e++){let t=e*2;k.push(t,t+1,t+2,t+1,t+3,t+2),j.push(t,t+1,t+2,t+1,t+3,t+2)}let P=(e,r,i)=>{let a=new zt;a.setAttribute(`position`,new wt(e,3)),a.setIndex(r),a.computeVertexNormals();let o=new J(a,i);o.receiveShadow=!0,t.add(o),n.push(a)};P(O,k,b),P(A,j,x);let F=new q({color:13155496,roughness:.7});n.push(F);let I=new Y(.95,1.52,12.4,12),ee=new W(4.2,10,8);n.push(I,ee);let L=new Lt(I,C,128),R=new Lt(ee,w,960);L.castShadow=r,R.castShadow=r;let te=0,ne=0,re=Math.max(1,Math.floor(D/48));for(let e=2;e<D&&te<128;e+=re){let t=a.samples[e];for(let n of[-3.05,3.05]){if(te>=128)break;let r=t.x+t.rx*n,a=t.z+t.rz*n;g.position.set(r,t.y+6.2,a),g.scale.set(1,1,1),g.rotation.set(0,e*.7%6,0),g.updateMatrix(),L.setMatrixAt(te,g.matrix);let o=[[0,.8,0],[2.8,.3,.9],[-2.7,.4,.7],[.9,.7,-2.7],[-1,.3,2.6],[2,2.2,1.4],[-2.1,2.1,-1.3],[.2,3.2,.3],[2.3,1.6,-1.8],[-2.2,1.7,1.9],[1.4,2.6,-.8],[-1.5,2.5,.9]];for(let e=0;e<12;e++){g.position.set(r+o[e][0],t.y+13.4+o[e][1],a+o[e][2]);let n=1.12+e%3*.2;g.scale.set(n,n*.88,n),g.updateMatrix(),R.setMatrixAt(ne++,g.matrix)}i.push({x:r,z:a,r:1.15,kind:`barrier`}),te++}}L.count=te,R.count=ne,L.instanceMatrix.needsUpdate=!0,R.instanceMatrix.needsUpdate=!0,t.add(L,R);let z=new G(1.8,.12,.55),B=new q({color:6965802,roughness:.88});n.push(z,B);let ie=new Lt(z,B,28),ae=0;for(let e=8;e<D&&ae<28;e+=Math.max(4,Math.floor(D/14))){let t=a.samples[e];g.position.set(t.x+t.rx*1.7,t.y+.55,t.z+t.rz*1.7),g.rotation.set(0,Math.atan2(t.tx,t.tz),0),g.scale.set(1,1,1),g.updateMatrix(),ie.setMatrixAt(ae++,g.matrix)}ie.count=ae,ie.instanceMatrix.needsUpdate=!0,t.add(ie);let V=new q({color:3824248,roughness:.55});n.push(V);for(let e of[{lat:32.0636,lon:34.7718,w:11,h:9.2,d:9,roof:`tile`,col:0},{lat:32.0648,lon:34.7734,w:10,h:11.4,d:8.2,roof:`flat`,col:1},{lat:32.0658,lon:34.7746,w:12,h:10.2,d:8.6,roof:`tile`,col:2},{lat:32.067,lon:34.7754,w:9.2,h:13.4,d:8,roof:`flat`,col:3},{lat:32.0684,lon:34.7758,w:10.4,h:12.2,d:9,roof:`tile`,col:0},{lat:32.0704,lon:34.7757,w:10.6,h:14.8,d:10,roof:`flat`,col:1},{lat:32.0718,lon:34.7764,w:11.2,h:11.6,d:8.4,roof:`flat`,col:2},{lat:32.0728,lon:34.7782,w:9.4,h:15.2,d:8,roof:`flat`,col:3},{lat:32.0742,lon:34.7796,w:10,h:10.8,d:8.6,roof:`tile`,col:0}]){let t=X(e.lat,e.lon),r=Q(a.samples,t.x,t.z,0),i=a.samples[r.index],s=a.width/2+18;r.dist<s&&(t.x=i.x+i.rx*s,t.z=i.z+i.rz*s);let l=new q({map:v([`white`,`gold`,`white`,`teal`][e.col%4]),roughness:.78,color:15789528});n.push(l);let u=new J(new G(e.w,e.h,e.d),l);u.position.set(t.x,e.h*.5,t.z),o(u);let h=new J(new G(e.w+.7,.35,e.d+.5),e.col%2?p:d);if(h.position.set(t.x,e.h+.1,t.z),o(h),e.roof===`tile`){let n=new J(new f(e.w*.72,2.6,4),p);n.rotation.y=Math.PI/4,n.position.set(t.x,e.h+1.5,t.z),o(n)}else if(e.roof===`pagoda`)for(let n=0;n<3;n++){let r=new J(new f(e.w*(.62-n*.12),2.1,6),p);r.position.set(t.x,e.h+1.2+n*2.1,t.z),o(r)}for(let n=0;n<3;n++)for(let r of[-2.2,2.2]){let i=new J(new pe(1.3,1.7),m);i.position.set(t.x+e.d*.51,2.4+n*2.8,t.z+r),o(i)}c(t.x,t.z,5.5,e.w*.48,e.d*.48)}let oe=X(32.0629,34.7695);{let e=Q(a.samples,oe.x,oe.z,0);if(e.dist<a.width/2+12){let t=a.samples[e.index];oe.x=t.x+t.rx*(a.width/2+16),oe.z=t.z+t.rz*(a.width/2+16)}}{let e=new q({map:v(`white`),roughness:.8,color:16118744});n.push(e);let t=new J(new G(14.2,8.4,11.2),e);t.position.set(oe.x,4.2,oe.z),o(t);let r=new J(new G(15.2,.45,12),l);r.position.set(oe.x,8.7,oe.z),o(r),c(oe.x,oe.z,7,7.2,5.8)}let se=X(32.0648,34.7752);{let e=Q(a.samples,se.x,se.z,0);if(e.dist<a.width/2+12){let t=a.samples[e.index];se.x=t.x+t.rx*(a.width/2+18),se.z=t.z+t.rz*(a.width/2+18)}}let ce=new J(new G(9.2,16.5,9.2),d);ce.position.set(se.x,8.3,se.z),o(ce);for(let e=0;e<4;e++){let t=7.4-e*1.15,n=new J(new Y(t+1.3,t,.55,8),p);n.position.set(se.x,6.2+e*3.35,se.z),o(n);let r=new J(new f(t+.4,1.8,8),p);r.position.set(se.x,7.3+e*3.35,se.z),o(r);let i=new J(new G(t*1.35,.18,t*1.35),d);i.position.set(se.x,5.7+e*3.35,se.z),o(i)}let le=new J(new W(.7,8,6),p);le.position.set(se.x,20.4,se.z),o(le);let ue=X(32.0734,34.7826);{let e=Q(a.samples,ue.x,ue.z,0);if(e.dist<a.width/2+16){let t=a.samples[e.index];ue.x=t.x+t.rx*(a.width/2+28),ue.z=t.z+t.rz*(a.width/2+28)}}let de=new J(new Nt(22,24),x);de.rotation.x=-Math.PI/2,de.position.set(ue.x,.12,ue.z),o(de);for(let[e,t,n,r]of[[0,0,16,9.5],[-9,6,11,7.2],[9,5,10,6.6]]){let i=new J(new Y(r,r*1.04,n,20),l);i.position.set(ue.x+e,n*.5,ue.z+t),o(i)}let fe=new J(new ht(10.2,.35,6,20),d);fe.rotation.x=Math.PI/2,fe.position.set(ue.x,15.4,ue.z),o(fe);for(let e=0;e<5;e++){let t=new J(new ht(9.7,.22,5,20),d);t.rotation.x=Math.PI/2,t.position.set(ue.x,3.2+e*2.6,ue.z),o(t)}let me=new J(new Y(10.4,9.2,1.4,20),l);me.position.set(ue.x,16.6,ue.z),o(me);let he=X(32.0624,34.7682);{let e=Q(a.samples,he.x,he.z,0);if(e.dist<a.width/2+12){let t=a.samples[e.index];he.x=t.x+t.rx*(a.width/2+18),he.z=t.z+t.rz*(a.width/2+18)}}let ge=new J(new G(16,8.4,11.4),d);ge.position.set(he.x,4.6,he.z),o(ge);let _e=new J(new G(14.4,.28,2.6),d);_e.position.set(he.x,5.8,he.z+6.4),o(_e);let ve=new J(new G(14.4,.72,.12),l);ve.position.set(he.x,6.3,he.z+7.5),o(ve);for(let e of[-5.4,-1.8,1.8,5.4]){let t=new J(new Y(.38,.44,6.2,10),l);t.position.set(he.x+e,3.5,he.z+5.9),o(t)}for(let[e,t]of[[-4.2,3.2],[0,3.2],[4.2,3.2],[-4.2,6.4],[0,6.4],[4.2,6.4]]){let n=new J(new pe(1.6,1.9),m);n.position.set(he.x+e,t,he.z+5.75),o(n)}let ye=new J(new G(17.6,.5,12.4),p);ye.position.set(he.x,9,he.z),o(ye);let be=new J(new Y(.07,.09,7.6,6),h);be.position.set(he.x+7.2,8.6,he.z+4.2),o(be);let xe=new J(new f(11.2,3.4,4),p);xe.rotation.y=Math.PI/4,xe.position.set(he.x,11.1,he.z),o(xe);let Se=new J(new Y(.08,.1,8.4,6),l);Se.position.set(he.x,14.6,he.z),o(Se);let Ce=gu(),we=new J(new pe(3.4,2.1),new Ct({map:Ce??void 0,color:Ce?16777215:16054008,side:2}));we.position.set(he.x+1.7,17.4,he.z),o(we);let Te=X(32.0658,34.7768),Ee=new J(new G(8.2,70,8.2),l);Ee.position.set(Te.x,35,Te.z),o(Ee);let H=new J(new G(9.2,5.4,9.2),u);H.position.set(Te.x,72.4,Te.z),o(H),s(Te.x,74,Te.z,16764006,26,24),s(ue.x,16,ue.z,16771272,22,18),c(ue.x,ue.z,10),c(he.x,he.z,8),c(Te.x,Te.z,6),Q(a.samples,se.x,se.z,0).dist>a.width/2+6&&c(se.x,se.z,6)}function Wu(e){let{group:t,bag:n,shadows:r,movers:i,ramps:a,streets:o,built:s,add:c,glowAt:l,hit:u,hitRoad:d,white:f,cream:p,terracotta:m,darkGlass:h,paleGlass:g,bandMat:_,placeAzrieli:v,placeCityGate:y,placeToHa:b,placeMidtown:x,placeElectra:S,placeSarona:C,placeHakirya:w,placeShalomMeir:T,_dummy:E}=e;X(32.0744,34.7932),v(1.42),b(1.28,32.0695,34.7894),y(1),x(1.15),S(1.2),C(1.32),w(1.1),T(1.15);let D=(e,t,n,r)=>{let i=X(e,t),a=Q(s.samples,i.x,i.z,0),o=s.samples[a.index],c=r?s.width+18+s.width/2+n:-(s.width/2+n);return{x:o.x+o.rx*c,z:o.z+o.rz*c,y:o.y}},O=D(32.0856,34.7987,36,!0),k=new ct({color:3829370,roughness:.14,metalness:0,envMapIntensity:1.5,clearcoat:1,clearcoatRoughness:.12});n.push(k);let A=new G(1,7.2,1),j=new Lt(A,k,6);j.frustumCulled=!1;for(let e=0;e<6;e++){let t=20-e*2.2;E.position.set(O.x,4.2+e*8,O.z),E.rotation.set(0,0,0),E.scale.set(t,1,t),E.updateMatrix(),j.setMatrixAt(e,E.matrix)}j.instanceMatrix.needsUpdate=!0,j.castShadow=r,t.add(j),n.push(A),u(O.x,O.z,12);let M=D(32.0788,34.7916,30,!1),N=new ct({color:5927048,roughness:.12,metalness:0,envMapIntensity:1.45,clearcoat:1});n.push(N);let P=new J(new Y(7.2,8.1,92,18),N);P.position.set(M.x,46,M.z),c(P);let F=[];for(let e=8;e<88;e+=4.2)F.push(e);let I=new ht(7.6,.12,5,18),ee=new Lt(I,_,F.length);ee.frustumCulled=!1;for(let e=0;e<F.length;e++)E.position.set(M.x,F[e],M.z),E.rotation.set(Math.PI/2,0,0),E.scale.set(1,1,1),E.updateMatrix(),ee.setMatrixAt(e,E.matrix);ee.instanceMatrix.needsUpdate=!0,t.add(ee),n.push(I);let L=new J(new Y(9.4,6.2,9,18),_);L.position.set(M.x,96,M.z),c(L),u(M.x,M.z,10);let R=D(32.0842,34.8036,42,!0),te=new J(new Y(6.4,7.4,108,8),h);te.position.set(R.x,54,R.z),te.rotation.y=.28,c(te);let ne=[];for(let e=8;e<100;e+=5.2)ne.push(e);let re=new Y(6.7,7.3,.28,8),z=new Lt(re,_,ne.length);z.frustumCulled=!1;for(let e=0;e<ne.length;e++)E.position.set(R.x,ne[e],R.z),E.rotation.set(0,.28,0),E.scale.set(1,1,1),E.updateMatrix(),z.setMatrixAt(e,E.matrix);z.instanceMatrix.needsUpdate=!0,t.add(z),n.push(re);let B=new J(new Y(8.4,5.2,7.2,8),_);B.position.set(R.x,112,R.z),B.rotation.y=.28,c(B),u(R.x,R.z,10);let ie=D(32.1124,34.8046,48,!0),ae=new J(new Y(10,11.4,14,20),p);ae.position.set(ie.x,7,ie.z),c(ae);let V=new J(new W(8.4,16,10,0,Math.PI*2,0,Math.PI/2),f);V.position.set(ie.x,14.4,ie.z),c(V);let oe=new G(1,1,1),se=new Lt(oe,p,5);se.frustumCulled=!1,[[18,5.2,8,14,6.4,10],[-16,4.4,-10,12,5.6,9],[8,6.2,-18,10,8.4,16],[-22,3.8,14,16,4.8,8],[24,3.2,12,8,4.2,14]].forEach((e,t)=>{E.position.set(ie.x+e[0],e[1],ie.z+e[2]),E.rotation.set(0,t*.35,0),E.scale.set(e[3],e[4]*2,e[5]),E.updateMatrix(),se.setMatrixAt(t,E.matrix)}),se.instanceMatrix.needsUpdate=!0,t.add(se),n.push(oe),l(ie.x,16,ie.z,15919312,28,22),u(ie.x,ie.z,22);let ce=X(32.0735,34.79605),le=Q(s.samples,ce.x,ce.z,0),ue=s.samples[le.index],de=s.width/2+9,fe={x:ue.x+ue.rx*de,z:ue.z+ue.rz*de},me=s.width+42,he=Math.atan2(ue.rx,ue.rz),ge=new J(new Y(3.4,3.4,me,24,1,!0),g);ge.rotation.order=`YZX`,ge.rotation.set(0,he,Math.PI/2),ge.position.set(fe.x,ue.y+15.6,fe.z),c(ge);let _e=new J(new G(me,.32,5.2),f);_e.position.set(fe.x,ue.y+13.6,fe.z),_e.rotation.y=he,c(_e);for(let e=0;e<14;e++){let t=e/13-.5,n=new J(new ht(3.55,.16,6,18),f);n.rotation.order=`YZX`,n.rotation.set(0,he,Math.PI/2),n.position.set(fe.x+ue.rx*t*me,ue.y+15.6,fe.z+ue.rz*t*me),c(n)}let ve=X(32.1004,34.7996),ye=Q(s.samples,ve.x,ve.z,0),be=s.samples[ye.index],xe=s.width+18+s.width/2+32,Se={x:be.x+be.rx*xe,z:be.z+be.rz*xe},Ce=Math.atan2(be.tx,be.tz),we=new J(new G(42,16,28),p);we.position.set(Se.x,be.y+8,Se.z),we.rotation.y=Ce,c(we);let Te=new J(new G(46,1.8,32),f);Te.position.set(Se.x,be.y+16.6,Se.z),Te.rotation.y=Ce,c(Te),ye.dist>s.width/2+10&&u(Se.x,Se.z,20);let Ee=Tt(),H=new ct({map:Ee?.map??null,roughnessMap:Ee?.roughnessMap??null,bumpMap:Ee?.bumpMap??null,bumpScale:Ee?.18:0,color:Ee?16777215:6053990,roughness:.45,metalness:0,envMapIntensity:.85,clearcoat:.22,clearcoatRoughness:.4}),De=new q({color:13157044,roughness:.72}),Oe=new q({color:1731130,roughness:.55});n.push(H,De,Oe);let ke=(e,t,n,r,i,s,l,u,d,p)=>{a.push({x:e,z:t,sx:n,sz:r,len:i,half:s,y0:l,y1:u,he:d,en:p}),o.push({ax:e-n*i*.5,az:t-r*i*.5,bx:e+n*i*.5,bz:t+r*i*.5,half:s,he:d,en:p});let m=Math.atan2(n,r),h=new J(new G(s*2,.95,i),H);h.position.set(e,(l+u)*.5,t),h.rotation.order=`YXZ`,h.rotation.y=m,h.rotation.x=-Math.atan2(u-l,i),h.receiveShadow=!0,c(h);for(let a=0;a<4;a++){let o=(a+.5)/4-.5,s=e+n*o*i,d=t+r*o*i,f=(l+u)*.5+(u-l)*o,p=Math.max(1.4,f),m=new J(new Y(.55,.72,p,8),De);m.position.set(s,p*.5,d),m.castShadow=!0,c(m)}let g=r,_=-n;for(let n of[-1,1]){let r=new J(new G(.18,.08,i*.94),f);r.position.set(e+g*(s-.22)*n,(l+u)*.5+.52,t+_*(s-.22)*n),r.rotation.order=`YXZ`,r.rotation.y=m,r.rotation.x=-Math.atan2(u-l,i),c(r)}},U=e=>{let t=Kl(e);if(!t)return Oe;let r=new Ct({map:t,fog:!1,side:2});return n.push(r),r},Ae={"Kibbutz Galuyot":`gantry-kibbutz-galuyot`,HaHagana:`gantry-hahagana`,LaGuardia:`gantry-laguardia`,HaShalom:`gantry-hashalom`,"Savidor Center":`gantry-savidor-center`,University:`gantry-university`};for(let e of[{lat:32.0525,he:`קיבוץ גלויות`,en:`Kibbutz Galuyot`},{lat:32.0547,he:`ההגנה`,en:`HaHagana`},{lat:32.062,he:`לה גרדיה`,en:`LaGuardia`},{lat:32.0735,he:`השלום`,en:`HaShalom`},{lat:32.0837,he:`סבידור מרכז`,en:`Savidor Center`},{lat:32.1035,he:`אוניברסיטה`,en:`University`}]){let t=X(e.lat,34.79605),n=Q(s.samples,t.x,t.z,0),r=s.samples[n.index],i=s.width+18,a=i/2,o={x:r.x+r.rx*a,z:r.z+r.rz*a},l=Math.atan2(r.tx,r.tz),u=r.x-r.rx*(s.width/2+2.4),p=r.z-r.rz*(s.width/2+2.4),m=r.x+r.rx*(i+s.width/2+2.4),h=r.z+r.rz*(i+s.width/2+2.4),g=9.4,_=i+s.width+16,v=new J(new G(_,1.15,16),De);v.position.set(o.x,g,o.z),v.rotation.y=l,c(v);for(let e of[-7.8,7.8]){let t=new J(new G(_,1.15,.22),f);t.position.set(o.x+r.tx*e,10.3,o.z+r.tz*e),t.rotation.y=l,c(t)}for(let e of[-(s.width/2+12),i+s.width/2+12]){let t=r.x+r.rx*e,n=r.z+r.rz*e,i=new J(new G(1.8,g,1.8),De);i.position.set(t,g*.5,n),c(i),Q(s.samples,t,n,0).dist>s.width/2+2.5&&d(t,n,1.4,.95,.95)}for(let e of[-28,-10,10,28]){let t=new J(new Y(.12,.16,3.4,6),De);t.position.set(o.x+r.rx*e,11.600000000000001,o.z+r.rz*e),c(t);let n=new J(new W(.28,8,6),new Ct({color:16760944}));n.position.set(o.x+r.rx*e,13.3,o.z+r.rz*e),c(n)}let y=U(Ae[e.en]??`gantry-hashalom`),b=new J(new pe(18,4.2),y);b.position.set(o.x,13.8,o.z),b.rotation.y=l+Math.PI,c(b);let x=b.clone();x.rotation.y=l,c(x);for(let e of[-8,8]){let t=new J(new G(.35,4.6,.35),De);t.position.set(o.x+r.rx*e,11.7,o.z+r.rz*e),c(t)}let S=new J(new G(18.4,.28,.28),De);S.position.set(o.x,13.95,o.z),S.rotation.y=l,c(S);let C=Gl(`speed90`);if(C){let e=l,t=s.width/2+4.2,n=r.x+r.rx*t,i=r.z+r.rz*t,a=new J(new Y(.08,.1,3.4,6),De);a.position.set(n,1.7,i),c(a);let o=new J(new pe(1.6,1.6),new Ct({map:C,transparent:!0,fog:!1}));o.position.set(n,3.5,i),o.rotation.y=e+Math.PI,c(o)}ke(u-r.tx*34,p-r.tz*34,r.tx,r.tz,68,10.2,.5,g,e.he,e.en),ke(u+r.tx*34,p+r.tz*34,r.tx,r.tz,68,10.2,g,.5,e.he,e.en),ke(m-r.tx*34,h-r.tz*34,r.tx,r.tz,68,10.2,.5,g,e.he,e.en),ke(m+r.tx*34,h+r.tz*34,r.tx,r.tz,68,10.2,g,.5,e.he,e.en),ke(o.x,o.z,r.rx,r.rz,_,10.2,g,g,e.he,e.en);{let t=s.width/2;ke(r.x+r.rx*(t*.42),r.z+r.rz*(t*.42),r.rx,r.rz,32,12.5,.35,g,e.he,e.en),ke(r.x-r.rx*(t*.15),r.z-r.rz*(t*.15),r.tx,r.tz,36,t*.55,.3,.3,e.he,e.en)}if(e.en===`Kibbutz Galuyot`){ke(u-r.rx*20,p-r.rz*20,r.tx,r.tz,84,6.4,.6,7.2,e.he,e.en),ke(m+r.rx*20,h+r.rz*20,r.tx,r.tz,84,6.4,7.2,.6,e.he,e.en);let t=.7071,n=r.rx*t+r.tx*t,i=r.rz*t+r.tz*t,a=Math.hypot(n,i)||1;ke(o.x-24*r.rx,o.z-24*r.rz,n/a,i/a,54,6.2,.6,g,e.he,e.en),ke(o.x+24*r.rx,o.z+24*r.rz,n/a,i/a,54,6.2,g,.6,e.he,e.en)}if(e.en===`LaGuardia`){let t=r.rx*.7071-r.tx*.7071,n=r.rz*.7071-r.tz*.7071,i=Math.hypot(t,n)||1;ke(o.x-18*r.rx,o.z-18*r.rz,t/i,n/i,44,6.2,.6,g,e.he,e.en),ke(o.x+18*r.rx,o.z+18*r.rz,t/i,n/i,44,6.2,g,.6,e.he,e.en)}}for(let e of[{lat:32.0735,he:`השלום`,en:`HaShalom`},{lat:32.0837,he:`סבידור מרכז`,en:`Savidor Center`}]){let t=X(e.lat,34.795),n=Q(s.samples,t.x,t.z,0),r=s.samples[n.index],i=s.width/2+6;ke(r.x+r.rx*i,r.z+r.rz*i,r.tx,r.tz,46,6.4,.4,8.6,e.he,e.en);let a=new J(new G(16,.85,20),De);a.position.set(r.x+r.rx*(i+14),8.7,r.z+r.rz*(i+14)),a.rotation.y=Math.atan2(r.tx,r.tz),c(a)}let je=new q({color:13157564,roughness:.7}),Me=new ct({color:11060436,roughness:.12,metalness:0,transparent:!0,opacity:.55,envMapIntensity:1.4}),Ne=new q({color:14212320,metalness:0,roughness:.28}),Pe=new q({color:12589096,roughness:.45,metalness:0}),Fe=new q({color:4856426,roughness:.42,metalness:0});n.push(je,Me,Ne,Pe,Fe);let Ie=s.width/2+9;for(let e of[{lat:32.0525,he:`קיבוץ גלויות`,kind:`galuyot`},{lat:32.0547,he:`ההגנה`,kind:`hagana`},{lat:32.0735,he:`השלום`,kind:`shalom`},{lat:32.0837,he:`סבידור`,kind:`savidor`},{lat:32.1035,he:`האוניברסיטה`,kind:`uni`}]){let t=X(e.lat,34.79605),n=Q(s.samples,t.x,t.z,0),r=s.samples[n.index],i={x:r.x+r.rx*Ie,z:r.z+r.rz*Ie},a=r.y,o=Math.atan2(r.tx,r.tz),l=e.kind===`savidor`?110:e.kind===`shalom`?96:e.kind===`galuyot`?70:78,d=new J(new G(11,.7,l),je);d.position.set(i.x,a+.55,i.z),d.rotation.y=o,c(d);let f=new J(new G(.28,.08,l),new Ct({color:15778816}));f.position.set(i.x+r.rx*5.2,a+.96,i.z+r.rz*5.2),f.rotation.y=o,c(f);let h=f.clone();h.position.set(i.x-r.rx*5.2,a+.96,i.z-r.rz*5.2),c(h);let v=e.kind===`uni`?12:14,y=new J(new G(v,e.kind===`hagana`?.35:.45,l*.92),e.kind===`shalom`?Me:Ne);y.position.set(i.x,a+(e.kind===`hagana`?5.4:6.6),i.z),y.rotation.y=o,c(y);let b=e.kind===`savidor`?7:5;for(let e of[-4.6,4.6])for(let t=-b;t<=b;t++){let n=new J(new Y(.2,.24,5.4,6),p),o=t*(l/(b*2+1.2));n.position.set(i.x+r.rx*e+r.tx*o,a+3.1,i.z+r.rz*e+r.tz*o),c(n)}let x=X(e.lat,e.kind===`uni`?34.7988:34.7932),S=Q(s.samples,x.x,x.z,0),C=e.kind===`savidor`?28:e.kind===`shalom`?24:e.kind===`hagana`?18:16,w=e.kind===`hagana`?6.4:e.kind===`uni`?7.2:9.2,T=e.kind===`hagana`?De:e.kind===`uni`?m:p,E=new J(new G(C,w,e.kind===`savidor`?40:24),T);if(E.position.set(x.x,w*.5,x.z),c(E),e.kind===`savidor`){let e=new J(new G(18,5.2,22),p);e.position.set(x.x+16,2.6,x.z),c(e);let t=new J(new Y(15,15,38,22,1,!0,Math.PI,Math.PI),g);t.rotation.z=Math.PI/2,t.position.set(x.x,w+1.6,x.z),c(t);for(let e=0;e<6;e++){let t=new J(new ht(15.1,.2,6,18,Math.PI),_);t.rotation.z=Math.PI/2,t.position.set(x.x-16+e*6.4,w+1.6,x.z),c(t)}let n=Math.hypot(x.x-i.x,x.z-i.z),r=new J(new G(Math.max(10,n),1.35,5.6),g);r.position.set((x.x+i.x)*.5,10.6,(x.z+i.z)*.5),r.rotation.y=Math.atan2(i.x-x.x,i.z-x.z),c(r)}if(e.kind===`uni`){let e=new J(new G(14,3.2,18),p);e.position.set(x.x,2,x.z+16),c(e)}if(e.kind===`shalom`){let e=new J(new G(.4,7.2,20),Me);e.position.set(x.x+10,5.2,x.z),c(e);let t=X(32.0744,34.7922),n=Math.hypot(t.x-x.x,t.z-x.z),r=new J(new G(Math.max(8,n),1.2,5),g);r.position.set((x.x+t.x)*.5,11.2,(x.z+t.z)*.5),r.rotation.y=Math.atan2(t.x-x.x,t.z-x.z),c(r);let a=Math.hypot(x.x-i.x,x.z-i.z),o=new J(new G(a,1.35,6.2),g);o.position.set((x.x+i.x)*.5,12.6,(x.z+i.z)*.5),o.rotation.y=Math.atan2(x.x-i.x,x.z-i.z),c(o)}let D=new J(new pe(18,4.2),U(`stn-`+e.kind));D.position.set(x.x,w+3.2,x.z),D.rotation.y=Math.PI/2,c(D),S.dist>s.width/2+10&&u(x.x,x.z,8)}let Le=(e,r)=>{let a=new lt,o=new q({color:15264494,roughness:.52,metalness:0});n.push(o);for(let e=0;e<6;e++){let t=new J(new G(2.9,4.1,17.2),Ne);t.position.set(0,2.55,-e*18.2),a.add(t);let n=new J(new G(2.96,.5,17.3),Fe);n.position.set(0,1.55,-e*18.2),a.add(n);let r=new J(new G(2.96,.22,17.3),Pe);r.position.set(0,1.88,-e*18.2),a.add(r);let i=new J(new G(2.92,.12,17.1),_);i.position.set(0,3.15,-e*18.2),a.add(i);let s=new J(new G(2.72,.16,17.05),o);s.position.set(0,4.68,-e*18.2),a.add(s);let c=new J(new G(.07,.95,16.2),h);c.position.set(1.48,2.42,-e*18.2),a.add(c);let l=c.clone();l.position.x=-1.48,a.add(l);let u=new J(new G(.07,.78,16.2),h);u.position.set(1.48,3.68,-e*18.2),a.add(u);let d=u.clone();d.position.x=-1.48,a.add(d)}let c=new J(new G(2.7,3.4,4.6),Ne);c.position.set(0,2.4,10.4),a.add(c);let l=new J(new G(2.74,.7,4.65),new q({color:14854168,roughness:.45}));l.position.set(0,1.15,10.4),a.add(l);let u=new J(new G(2.2,1.15,.12),h);u.position.set(0,3.05,12.68),a.add(u);let d=new J(new pe(2.35,.42),U(`dest-rail`));d.position.set(0,3.58,12.74),a.add(d);let f=new J(new G(.12,1.6,.12),_);f.position.set(0,5.4,-2),a.add(f);let p=new J(new G(2.2,.08,.08),_);p.position.set(0,6.2,-2),a.add(p);let m=new J(new G(.55,.42,.2),new Ct({color:16774344}));m.position.set(-.85,1.5,12.7),a.add(m);let g=m.clone();g.position.x=.85,a.add(g),a.scale.setScalar(1.08),t.add(a);let v=s.width/2+9,y=s.samples.map(e=>({x:e.x+e.rx*(v+r),y:e.y+.42,z:e.z+e.rz*(v+r),yaw:Math.atan2(e.tx,e.tz)}));i.push({mesh:a,pts:y,speed:.14,phase:e})};Le(0,-1.15),Le(.48,1.15);let K=jl();if(!K)throw Error(`lane arrow missing`);let Re=new Ct({map:K,side:2});for(let e of[32.055,32.061,32.067,32.0735,32.083,32.092,32.101])for(let t of[34.795,34.7971]){let n=X(e,t),r=Q(s.samples,n.x,n.z,0),i=s.samples[r.index],a=s.width/2+1.8;for(let e of[-1,1]){let t=new J(new G(.7,9.2,.7),De);t.position.set(i.x+i.rx*a*e,i.y+4.6,i.z+i.rz*a*e),c(t)}let o=new J(new G(s.width+2.4,.7,1.15),De);o.position.set(i.x,i.y+9.3,i.z),o.rotation.y=Math.atan2(i.rx,i.rz),c(o);for(let e=0;e<8;e++){let t=-s.width/2+3.2+e*(s.width-6.4)/7,n=new J(new pe(3.2,4.6),Re);n.position.set(i.x+i.rx*t,i.y+7.4,i.z+i.rz*t),n.rotation.y=Math.atan2(i.tx,i.tz),c(n)}}}function Gu(e){let{bag:t,built:n,add:r,hit:i,stone:a,white:o,cream:s,wood:c,darkArch:l}=e,u=$n(32.5078,34.8976);{let e=Q(n.samples,u.x,u.z,0);if(e.dist<n.width/2+12){let t=n.samples[e.index];u.x=t.x+t.rx*(n.width/2+28),u.z=t.z+t.rz*(n.width/2+28)}}let d=new q({color:14865072,roughness:.96});t.push(d);let f=new J(new pe(80,160),d);f.rotation.x=-Math.PI/2,f.position.set(u.x-8,.04,u.z),r(f);let p=new G(3.2,10.4,2.2),m=new G(4.2,1.2,3.2),h=new G(3.4,1.4,7.2);for(let e=0;e<2;e++){let t=e*10.6;for(let e=0;e<22;e++){let n=u.z-70+e*7.2,i=new J(p,a);i.position.set(u.x,5.2+t,n),r(i);let o=new J(m,a);if(o.position.set(u.x,10.6+t,n),r(o),e<21){let e=new J(h,a);e.position.set(u.x,9.2+t,n+3.6),r(e);let i=new J(new Y(2.1,2.1,3.6,12,1,!1,0,Math.PI),l);i.rotation.z=Math.PI/2,i.position.set(u.x,4.4+t,n+3.6),r(i)}}}let g=new J(new G(2.4,.7,154),a);g.position.set(u.x,21.6,u.z),r(g);let _=$n(32.4988,34.8896),v=new J(new ht(32,1.5,8,40),a);v.scale.set(1.55,1,1),v.rotation.x=Math.PI/2,v.position.set(_.x,.95,_.z),r(v);let y=new J(new G(4.4,1.5,42),a);y.position.set(_.x,.85,_.z),r(y);let b=$n(32.4962,34.8894),x=new J(new Y(15,24,10,22,1,!0,0,Math.PI*1.2),a);x.position.set(b.x,5.4,b.z),x.rotation.y=.6,r(x);for(let e=0;e<7;e++){let t=new J(new ht(10+e*2.15,.48,6,22,Math.PI*1.15),a);t.rotation.x=Math.PI/2,t.rotation.z=.6,t.position.set(b.x,1.15+e*1.2,b.z),r(t)}let S=new J(new G(24,1.2,6.4),a);S.position.set(b.x+4,.7,b.z+8),r(S),i(u.x,u.z,6),i(_.x,_.z,16),i(b.x,b.z,14);let C=$n(32.5014,34.8902),w=new J(new G(18,14,18),a);w.position.set(C.x,7.2,C.z),r(w);for(let[e,t]of[[-8,-8],[8,-8],[-8,8],[8,8]]){let n=new J(new Y(3.2,3.6,16,10),a);n.position.set(C.x+e,8.2,C.z+t),r(n)}i(C.x,C.z,12);let T=$n(32.5004,34.8884),E=new J(new G(8,2.2,72),a);E.position.set(T.x,1,T.z),r(E);let D=new J(new G(48,1.8,7),a);D.position.set(T.x+16,.8,T.z-32),r(D);for(let e=0;e<7;e++){let t=T.x+6+e%2*6,n=T.z-20+e*7,i=new J(new G(2.2,.7,7.6),e%2?o:s);i.position.set(t,.4,n),r(i);let a=new J(new Y(.06,.08,8.4,5),c);a.position.set(t,4.8,n),r(a)}let O=$n(32.5062,34.897);for(let e=0;e<6;e++){let t=new J(new Y(.7,.85,4.2+e%3,8),a);t.position.set(O.x+10,2.2,O.z-12+e*5),r(t)}}function Ku(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,white:o,cream:s,terracotta:c,wood:l,cyan:u,darkGlass:d}=e,p=new q({color:15261908,roughness:.55,envMapIntensity:.55}),m=new q({color:15255720,roughness:.7});t.push(p,m);let h=(e,t=24)=>{let r=Q(n.samples,e.x,e.z,0);if(r.dist<n.width/2+10){let i=n.samples[r.index];e.x=i.x+i.rx*(n.width/2+t),e.z=i.z+i.rz*(n.width/2+t)}return e},g=h(nn(31.1992,35.3682),28),_=new J(new G(22,8,14),s);_.position.set(g.x,4,g.z),r(_);for(let e=0;e<8;e++){let t=new J(new Y(.45,.55,8,8),o);t.position.set(g.x-9+e*2.6,8.2,g.z+7.4),r(t)}let v=new J(new f(12,5.4,4),s);v.rotation.y=Math.PI/4,v.position.set(g.x,14.8,g.z),r(v);let y=new J(new G(12,18,10),s);y.position.set(g.x,17,g.z),r(y);let b=h(nn(31.2016,35.3688),26),x=new J(new G(16,28,11),d);x.position.set(b.x,14,b.z),r(x);let S=new J(new G(22,8,14),s);S.position.set(b.x,4,b.z),r(S);let C=h(nn(31.2034,35.3692),26);for(let e=0;e<4;e++){let t=new J(new G(20-e*3.2,6,12-e*1.4),o);t.position.set(C.x,3.2+e*6.2,C.z),r(t)}let w=h(nn(31.1974,35.3678),26),T=new J(new G(26,12,12),m);T.position.set(w.x,6,w.z),r(T);for(let e=3;e<11;e+=2.6){let t=new J(new G(27,.14,13),s);t.position.set(w.x,e,w.z),r(t)}let E=new J(new G(18,.28,8),u);E.position.set(w.x,.2,w.z+12),r(E);for(let e=0;e<6;e++){let t=w.x-8+e*3.2,n=w.z+18,i=new J(new Y(.06,.08,2.4,5),l);i.position.set(t,1.2,n),r(i);let a=new J(new f(1.6,.35,8),e%2?o:m);a.position.set(t,2.4,n),r(a)}let D=nn(31.2052,35.3696),O=new J(new G(14,20,10),s);O.position.set(D.x,10,D.z),r(O);let k=new J(new G(15,2.2,11),c);k.position.set(D.x,16,D.z),r(k);let A=nn(31.201,35.372);for(let e=0;e<8;e++){let t=new J(new Y(6+e*3.2,8+e*3.2,.55,16),p);t.position.set(A.x,.12+e*.08,A.z+e*4),r(t)}for(let e=0;e<10;e++){let t=new J(new G(22+e%3*6,.12,14),p),n=nn(31.186+e*.004,35.3705);t.position.set(n.x,.08,n.z),r(t)}let j=new q({color:11565650,roughness:.95,flatShading:!0});t.push(j);for(let e=0;e<7;e++){let t=nn(31.17+e*.012,35.402),n=new J(new f(22+e%3*8,28+e%4*10,5),j);n.position.set(t.x,14,t.z),r(n)}i(A.x,18,A.z,16769200,28,24),a(g.x,g.z,10),a(b.x,b.z,8),a(C.x,C.z,10),a(w.x,w.z,12),a(D.x,D.z,8)}function qu(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,stone:o,white:s,cream:c,terracotta:l,wood:u,darkArch:d}=e,p=new q({color:12093784,roughness:.88,envMapIntensity:.28}),m=new q({color:9398336,roughness:.9});t.push(p,m);let h=(e,t=26)=>{let r=Q(n.samples,e.x,e.z,0);if(r.dist<n.width/2+10){let i=n.samples[r.index];e.x=i.x+i.rx*(n.width/2+t),e.z=i.z+i.rz*(n.width/2+t)}return e},g=h(mr(32.9198,35.0676),32),_=new J(new G(110,12,5.4),o);_.position.set(g.x,6,g.z),r(_);let v=new J(new G(5.4,12,70),o);v.position.set(g.x-52,6,g.z+28),r(v);for(let e=0;e<16;e++){let t=new J(new G(2.8,2.2,5.8),o);t.position.set(g.x-50+e*7,13,g.z),r(t)}let y=new J(new Y(5.6,6.4,18,12),o);y.position.set(g.x-52,10,g.z),r(y);let b=new J(new Y(6.8,5.4,2,12),o);b.position.set(g.x-52,20,g.z),r(b);for(let e=0;e<14;e++){let t=32.9192+e%7*55e-5,i=35.0692+Math.floor(e/7)*7e-4,s=mr(t,i);if(Q(n.samples,s.x,s.z,0).dist<n.width/2+8)continue;let c=5.2+e%4*.9,u=new J(new G(6.8,c,7.4),e%3==0?o:e%3==1?p:m);u.position.set(s.x,c*.5,s.z),r(u);let f=new J(new G(7.4,.32,8),l);f.position.set(s.x,c+.18,s.z),r(f);let h=new J(new Y(.65,.65,.24,10,1,!1,0,Math.PI),d);h.rotation.z=Math.PI/2,h.position.set(s.x,1.6,s.z+3.8),r(h),a(s.x,s.z,3.4)}let x=h(mr(32.9206,35.0688),28),S=new J(new G(26,7.6,26),o);S.position.set(x.x,3.8,x.z),r(S);let C=new J(new G(14,.2,14),c);C.position.set(x.x,.18,x.z),r(C);for(let[e,t]of[[-9,-9],[9,-9],[-9,9],[9,9]]){let n=new J(new Y(.72,.9,12,8),o);n.position.set(x.x+e,8,x.z+t),r(n)}let w=new J(new Y(2.1,2.6,30,10),o);w.position.set(x.x,17,x.z),r(w);let T=new J(new G(4.4,4.4,4.4),c);T.position.set(x.x,32.2,x.z),r(T);for(let e=0;e<4;e++){let t=e*Math.PI/2,n=new J(new Nt(1.05,16),c);n.position.set(x.x+Math.sin(t)*2.25,32.2,x.z+Math.cos(t)*2.25),n.lookAt(x.x+Math.sin(t)*8,32.2,x.z+Math.cos(t)*8),r(n)}let E=new J(new f(3,3.6,4),l);E.rotation.y=Math.PI/4,E.position.set(x.x,36.2,x.z),r(E);let D=mr(32.9226,35.0718),O=new J(new G(20,9,20),c);O.position.set(D.x,5.2,D.z),r(O);let k=new q({color:3050072,roughness:.38,metalness:.22,envMapIntensity:.85});t.push(k);let A=new J(new W(7.2,18,12,0,Math.PI*2,0,Math.PI/2),k);A.position.set(D.x,10.4,D.z),r(A);for(let[e,t]of[[-7,-7],[7,-7],[-7,7],[7,7]]){let n=new J(new W(2.6,12,8,0,Math.PI*2,0,Math.PI/2),k);n.position.set(D.x+e,10.2,D.z+t),r(n)}let j=new J(new Y(1.15,1.45,32,10),c);j.position.set(D.x+12,18,D.z+6),r(j);let M=new J(new Y(2.2,1.6,1.5,10),c);M.position.set(D.x+12,32,D.z+6),r(M);let N=new J(new f(1.7,3.4,8),k);N.position.set(D.x+12,34.8,D.z+6),r(N);let P=mr(32.9238,35.0714),F=new J(new G(22,14,18),o);F.position.set(P.x,8,P.z),r(F);let I=new J(new G(8,10,8),o);I.position.set(P.x-8,18,P.z),r(I);let ee=mr(32.9192,35.0682),L=new J(new G(8,.4,48),o);L.position.set(ee.x,.2,ee.z),r(L);for(let e=0;e<10;e++){let t=ee.x-10-e%2*6,n=ee.z-20+e*5.2,i=new J(new G(2.2,.75,7.6),e%2?s:c);i.position.set(t,.45,n),r(i);let a=new J(new Y(.06,.08,8,5),u);a.position.set(t,4.7,n),r(a)}i(D.x,16,D.z,16771248,28,22),a(g.x,g.z,6),a(D.x,D.z,11),a(x.x,x.z,9),a(P.x,P.z,9)}function Ju(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,copper:o}=e,s=new J(new ht(5.4,.45,8,24),i);s.rotation.x=Math.PI/2,s.position.set(8,.6,12),t(s);let c=new J(new Y(.5,.8,8,8),o);c.position.set(8,5,12),t(c);let l=new J(new Y(10,6.5,16,16),a);l.position.set(52,8,40),t(l);let u=new J(new Y(4.2,8.4,6,16),a);u.position.set(52,18,40),t(u),n(8,8,12,16771264,22,20),r(52,40,10)}function Yu(e){let{add:t,glowAt:n,hit:r,darkGlass:i,paleGlass:a,placeNycSkyline:o}=e,s=new J(new G(12,52,10),i);s.position.set(18,26,8),t(s);let c=new J(new W(2.4,12,10),a);c.position.set(18,56,8),t(c),o(-48,-40,.62),n(18,56,8,16737962,36,28),r(18,8,8)}function Xu(e){let{add:t,glowAt:n,copper:r,placeNycSkyline:i,placeGothicTower:a}=e;a(-8,-36,28),a(28,62,28),i(-70,8,.55);let o=new J(new Y(1.4,2.1,16,8),r);o.position.set(90,9,-48),t(o),n(90,18,-48,16764006,22,20)}function Zu(e){let{add:t,glowAt:n,hit:r,copper:i,gold:a,placeNycSkyline:o}=e;o(8,-120,1);let s=new J(new Y(1.6,2.4,18,8),i);s.position.set(-96,10,-180),t(s);let c=new J(new W(1.1,8,6),a);c.position.set(-96,21,-180),t(c),n(-96,22,-180,16764006,24,22),r(-96,-180,6)}function Qu(e){let{built:t,add:n,glowAt:r,hit:i,stone:a,copper:o,cream:s,terracotta:c}=e,l=$t(31.252,34.791);{let e=Q(t.samples,l.x,l.z,0);if(e.dist<t.width/2+12){let n=t.samples[e.index];l.x=n.x+n.rx*(t.width/2+26),l.z=n.z+n.rz*(t.width/2+26)}}let u=new J(new G(9.2,32,9.2),s);u.position.set(l.x,16,l.z),n(u);let d=new J(new G(14,8,14),s);d.position.set(l.x,4,l.z),n(d);let p=new J(new f(7.6,8,4),o);p.position.set(l.x,36,l.z),n(p);let m=$t(31.2435,34.79),h=new J(new Y(6.5,6.5,1.4,16),a);h.position.set(m.x,.8,m.z),n(h);let g=new J(new Y(5.2,5.2,2.4,16,1,!0),a);g.position.set(m.x,1.6,m.z),n(g);let _=new J(new f(7.2,3.6,4),c);_.position.set(m.x,4.4,m.z),n(_);let v=$t(31.262,34.801);for(let e=0;e<4;e++){let t=new J(new G(14,8+e,10),s);t.position.set(v.x+e*8,4+e*.4,v.z),n(t)}r(l.x,36,l.z,16765056,36,28),i(l.x,l.z,8),i(m.x,m.z,8)}function $u(e){let{bag:t,isNight:n,emitList:r,built:i,add:a,glowAt:o,hit:s,stone:c,white:l,cream:u,terracotta:d,cyan:p,paleGlass:m}=e,h=Rn(32.3318,34.8565);{let e=Q(i.samples,h.x,h.z,0);if(e.dist<i.width/2+10){let t=i.samples[e.index];h.x=t.x+t.rx*(i.width/2+22),h.z=t.z+t.rz*(i.width/2+22)}}let g=new J(new Y(16,16,.18,28),c);g.position.set(h.x,.12,h.z),a(g);let _=new J(new Y(10,10,.16,20),new q({color:3832386,roughness:.92}));_.position.set(h.x,.22,h.z),a(_);let v=new J(new Y(3.4,3.8,1.1,16),c);v.position.set(h.x,.7,h.z),a(v);let y=new J(new Y(.2,1.1,2.4,8),p);y.position.set(h.x,2.2,h.z),a(y);let b=new J(new Y(2.15,2.55,20,8),u);b.position.set(h.x+10,10,h.z+6),a(b);let x=new q({color:15657176,roughness:.5,emissive:3351050,emissiveIntensity:n?.7:.1});r.push({mat:x,night:.7,day:.1});for(let e=0;e<4;e++){let t=e*Math.PI/2,n=new J(new Nt(1.2,16),x);n.position.set(h.x+10+Math.sin(t)*2.6,16.5,h.z+6+Math.cos(t)*2.6),n.lookAt(h.x+10+Math.sin(t)*8,16.5,h.z+6+Math.cos(t)*8),a(n)}let S=new J(new f(3.1,4.2,4),d);S.rotation.y=Math.PI/4,S.position.set(h.x+10,22.4,h.z+6),a(S);let C=Rn(32.334,34.851),w=new q({color:15525592,roughness:.9,flatShading:!0}),T=new q({color:15259572,roughness:1});t.push(w,T);for(let e=0;e<10;e++){let t=Rn(32.327+e*.0014,34.8488),n=new J(new G(18,16+e%3*3,7),w);n.position.set(t.x,7+e%3,t.z),n.rotation.y=.08,a(n)}let E=new J(new pe(70,220),T);E.rotation.x=-Math.PI/2,E.position.set(C.x-36,.04,C.z),a(E);let D=Rn(32.3282,34.8492),O=new J(new G(14,42,12),l);O.position.set(D.x,21,D.z),a(O);for(let e=5;e<40;e+=3.2){let t=new J(new G(14.8,.16,12.8),u);t.position.set(D.x,e,D.z),a(t)}let k=new J(new G(10,4.2,8),m);k.position.set(D.x,44,D.z),a(k);let A=Rn(32.3266,34.8494),j=new J(new Y(6.4,7.2,48,12),l);j.position.set(A.x,24,A.z),a(j);for(let e=6;e<46;e+=3.6){let t=new J(new ht(6.7,.12,5,14),u);t.rotation.x=Math.PI/2,t.position.set(A.x,e,A.z),a(t)}let M=new J(new Y(8,5.2,5.4,12),u);M.position.set(A.x,50.4,A.z),a(M);let N=Rn(32.3316,34.8488),P=new J(new G(28,16,12),l);P.position.set(N.x,8,N.z),a(P);let F=new J(new G(10,22,10),u);F.position.set(N.x+12,11,N.z),a(F);for(let e=4;e<14;e+=2.6){let t=new J(new G(29,.14,13),u);t.position.set(N.x,e,N.z),a(t)}let I=Rn(32.3338,34.8486),ee=new J(new G(12,32,14),m);ee.position.set(I.x,16,I.z),ee.rotation.y=.12,a(ee);let L=new J(new G(16,8,16),u);L.position.set(I.x,4,I.z),a(L);let R=Rn(32.3324,34.8484),te=new J(new G(4.2,18,4.2),l);te.position.set(R.x,9,R.z),a(te);let ne=new J(new G(3.4,3.2,3.4),m);ne.position.set(R.x,8.4,R.z),a(ne);for(let e=0;e<12;e++){let t=new J(new G(6.4,.28,2.2),c);t.position.set(R.x-6,14-e*1.15,R.z-2-e*1.4),a(t)}let re=Rn(32.329,34.858);for(let e=0;e<4;e++){let t=new J(new G(7.2,8+e%2*2.4,8),e%2?u:l);t.position.set(re.x+14+e*9,4.4+e%2*1.2,re.z),a(t);let n=new J(new G(7.4,.2,2.4),d);n.position.set(re.x+14+e*9,3.6,re.z+4.4),a(n)}o(C.x,20,C.z,16771248,40,24),s(h.x+10,h.z+6,5),s(D.x,D.z,8),s(A.x,A.z,8),s(N.x,N.z,12),s(I.x,I.z,8)}function ed(e){let{bag:t,built:n,add:r,hit:i,placeTunnel:a,stone:o,white:s,cream:c,terracotta:l,darkGlass:u}=e,d=new q({color:3178290,roughness:.92,flatShading:!0}),p=new q({color:13213808,roughness:.82}),m=new q({color:4874808,roughness:.9,flatShading:!0}),h=new q({color:4210752,roughness:.45,metalness:.62});t.push(d,p,m,h);let g=ir(31.8338,34.9774),_=new J(new G(22,14,12),c);_.position.set(g.x,8.4,g.z),r(_);let v=new J(new G(10,9,16),c);v.position.set(g.x,6.2,g.z+8),r(v);let y=new J(new f(9.4,7.2,4),l);y.rotation.y=Math.PI/4,y.position.set(g.x,18.8,g.z),r(y);let b=new J(new G(5.4,26,5.4),c);b.position.set(g.x-10,16,g.z-2),r(b);for(let e=8;e<24;e+=5.2){let t=new J(new G(2.2,2.8,.35),u);t.position.set(g.x-10,e,g.z+2.8),r(t)}let x=new J(new f(4.2,6.4,4),l);x.rotation.y=Math.PI/4,x.position.set(g.x-10,32.2,g.z-2),r(x);let S=new J(new G(.28,3.4,.28),s);S.position.set(g.x-10,36.4,g.z-2),r(S);let C=new J(new G(28,6.4,18),c);C.position.set(g.x+8,3.4,g.z-16),r(C);let w=new J(new G(10,.2,8),m);w.position.set(g.x+8,.12,g.z-16),r(w);for(let e=0;e<7;e++)for(let t=0;t<18;t++){let n=g.x-36+t*2.4,i=g.z+18+e*3.2,a=new J(new G(.55,1.1+(t+e)%3*.35,.55),d);a.position.set(n,.7,i),r(a)}let T=ir(31.8382,34.9786),E=new J(new G(18,7.2,24),c);E.position.set(T.x,4,T.z),r(E);let D=new J(new G(8,16,8),o);D.position.set(T.x+12,10,T.z),r(D);for(let e=0;e<5;e++){let t=T.x-10+e*7,n=T.z+18,i=new J(new G(3.6,1.4,5.4),h);i.position.set(t,1.1,n),r(i);let a=new J(new Y(1.15,1.3,1.1,10),h);a.position.set(t,2.1,n),r(a);let o=new J(new Y(.16,.2,4.4,6),h);o.rotation.x=Math.PI/2,o.position.set(t,2.15,n+2.6),r(o)}let O=ir(31.815,35.023),k=Q(n.samples,O.x,O.z,0),A=n.samples[k.index],j=Math.atan2(A.tx,A.tz);a(O.x,O.z,j,28,n.width*.55,9.2,A.y);for(let e of[-1,1]){let t=new J(new G(4.2,3.6,64),o);t.position.set(O.x+A.rx*e*22,2.2+A.y,O.z+A.rz*e*22),r(t);for(let t=0;t<8;t++){let n=new J(new G(3.2,1.4,4.2),o);n.position.set(O.x+A.rx*e*22,4.6+A.y,O.z+A.rz*e*22+A.tz*(-28+t*8)),r(n)}}let M=new J(new G(n.width+10,1.4,12),o);M.position.set(O.x,A.y+9.6,O.z),M.rotation.y=j,r(M);let N=ir(31.8094,35.0388),P=new J(new G(18,14,16),o);P.position.set(N.x,18,N.z),r(P);let F=new J(new G(10,10,10),o);F.position.set(N.x-4,28,N.z+3),r(F);for(let e=0;e<6;e++){let t=e/6*Math.PI*2,n=new J(new G(4.4,3.2+e%3*2.4,3.6),o);n.position.set(N.x+Math.cos(t)*16,10+e%3,N.z+Math.sin(t)*14),n.rotation.y=t,r(n)}let I=new J(new f(18,12,7),m);I.position.set(N.x,4,N.z),r(I),i(g.x,g.z,12),i(g.x-10,g.z-2,5),i(T.x,T.z,10),i(N.x,N.z,12)}function td(e){let{built:t,add:n,glowAt:r,hit:i,stone:a,white:o,glass:s,cream:c,terracotta:l,wood:u,darkGlass:d,paleGlass:f}=e,p=Xn(32.1635,34.7965);{let e=Q(t.samples,p.x,p.z,0);if(e.dist<t.width/2+10){let n=t.samples[e.index];p.x=n.x+n.rx*(t.width/2+26),p.z=n.z+n.rz*(t.width/2+26)}}let m=new J(new G(6,1.6,72),a);m.position.set(p.x-42,.7,p.z),n(m);let h=new J(new G(48,1.4,5),a);h.position.set(p.x-22,.6,p.z-34),n(h);let g=new J(new G(52,.5,12),u);g.position.set(p.x-8,.32,p.z),n(g);let _=new J(new Y(.8,1.2,16,8),o);_.position.set(p.x-44,8,p.z-30),n(_);let v=new J(new Y(1.6,1.3,1.8,8),c);v.position.set(p.x-44,16.8,p.z-30),n(v);let y=new J(new W(.8,8,6),new Ct({color:16777136}));y.position.set(p.x-44,18.2,p.z-30),n(y);for(let e=0;e<10;e++){let t=p.x-28-e%2*8,r=p.z-26+e*6.4,i=new J(new G(2.2,.7,8.6),e%3==0?c:o);i.position.set(t,.45,r),i.rotation.y=.08,n(i);let a=new J(new G(1.5,1.1,3.4),o);a.position.set(t,1.3,r),n(a);let s=new J(new Y(.06,.08,10,5),u);s.position.set(t,5.6,r),n(s)}let b=new J(new G(18,5.2,10),c);b.position.set(p.x+8,2.7,p.z+4),n(b);let x=new J(new G(20,.4,12),l);x.position.set(p.x+8,5.5,p.z+4),n(x);let S=Xn(32.1662,34.8004),C=new J(new Y(14,16,18,20,1,!1,.35,2.45),o);C.position.set(S.x,9.2,S.z),C.rotation.y=-.4,n(C);for(let e=0;e<7;e++){let t=new J(new Y(14.6,16.4,.2,20,1,!1,.35,2.45),c);t.position.set(S.x,2.4+e*2.4,S.z),t.rotation.y=-.4,n(t)}let w=new J(new Y(12,16,2.2,20,1,!1,.35,2.45),c);w.position.set(S.x,19.2,S.z),w.rotation.y=-.4,n(w);let T=Xn(32.1648,34.8016),E=new J(new G(14,36,18),o);E.position.set(T.x,18,T.z),n(E);for(let e=5;e<34;e+=3.1){let t=new J(new G(15.2,.16,19.2),c);t.position.set(T.x,e,T.z),n(t)}let D=new J(new G(10,3.2,12),f);D.position.set(T.x,37.4,T.z),n(D);let O=Xn(32.1612,34.8068),k=new J(new G(38,11,24),o);k.position.set(O.x,5.6,O.z),n(k);let A=new J(new Y(8.4,8.4,14,6),s);A.position.set(O.x,16,O.z),n(A);let j=new J(new Y(9.2,7.2,3.2,6),f);j.position.set(O.x,24.4,O.z),n(j);let M=new J(new G(16,8,18),c);M.position.set(O.x-22,4.2,O.z+4),n(M);let N=new J(new G(16,8,18),c);N.position.set(O.x+22,4.2,O.z-4),n(N);let P=Xn(32.1594,34.8096),F=new J(new G(14,28,14),s);F.position.set(P.x,14,P.z),F.rotation.y=.18,n(F);let I=new J(new G(11,22,11),f);I.position.set(P.x+16,11,P.z+8),I.rotation.y=-.22,n(I);let ee=new J(new G(12,18,18),c);ee.position.set(P.x-14,9,P.z+10),n(ee);let L=new J(new G(9,34,9),d);L.position.set(P.x+8,17,P.z-12),n(L);for(let e=0;e<4;e++){let t=new J(new G(16-e*2.2,5.4,16-e*2.2),f);t.position.set(P.x-22,3.2+e*6,P.z-8),n(t)}r(P.x,28,P.z,8967400,44,30),r(S.x,18,S.z,16769200,32,28),i(p.x,p.z,10),i(S.x,S.z,12),i(T.x,T.z,10),i(O.x,O.z,16),i(P.x,P.z,10),i(P.x+16,P.z+8,7)}function nd(e){let{bag:t,add:n,glowAt:r,hit:i,stone:a,white:o,cyan:s}=e,c=new q({color:15789282,roughness:.9,envMapIntensity:.22}),l=new q({color:920586,roughness:1});t.push(c,l);let u=In(33.093,35.104);for(let e=0;e<10;e++){let t=18+e%4*6,r=new J(new G(22,t,12),c);r.position.set(u.x,t*.4,u.z-28+e*11),n(r);let i=new J(new Y(2.8,3.2,10,12),l);if(i.rotation.z=Math.PI/2,i.position.set(u.x-10,3.6+e%3,u.z-28+e*11),n(i),e%2==0){let t=new J(new W(3.4,10,8),l);t.position.set(u.x-8,6,u.z-24+e*11),n(t)}}let d=new J(new G(10,7,14),a);d.position.set(u.x+14,3.6,u.z),n(d);let f=new J(new G(5,4.4,8),l);f.position.set(u.x+14,3.2,u.z),n(f);for(let e=0;e<4;e++){let t=new J(new G(4.4,2.6,3.4),o);t.position.set(u.x+2-e*8,12+e*4,u.z+10),n(t);let r=new J(new G(3.2,1.4,.15),s);r.position.set(u.x+2-e*8,12.1+e*4,u.z+11.8),n(r)}let p=new J(new Y(.09,.09,42,5),new q({color:3355184,metalness:.7,roughness:.3}));p.rotation.z=.55,p.position.set(u.x-8,20,u.z+10),n(p),r(u.x,10,u.z,16771248,24,20),i(u.x,u.z,14)}function rd(e){let{bag:t,add:n,glowAt:r,hit:i,stone:a,terracotta:o}=e,s=new q({color:12081714,metalness:.45,roughness:.42});t.push(s);let c=xn(32.819,35.004);for(let e of[{lat:32.8186,lon:35.0028},{lat:32.819,lon:35.004},{lat:32.8194,lon:35.0052}]){let t=xn(e.lat,e.lon),r=new J(new G(1.4,34,1.4),s);r.position.set(t.x,17,t.z),n(r);let i=new J(new G(36,.9,.9),s);i.position.set(t.x+16,34,t.z),n(i)}let l=[{lat:32.8194,lon:34.9892,w:9,h:8},{lat:32.8198,lon:34.99,w:10,h:9},{lat:32.82,lon:34.9908,w:8.4,h:7.6},{lat:32.8192,lon:34.9914,w:11,h:8.8}];for(let e=0;e<l.length;e++){let t=l[e],r=xn(t.lat,t.lon),s=new J(new G(t.w,t.h,10),a);s.position.set(r.x,t.h*.5,r.z),n(s);let c=new J(new f(t.w*.7,3,4),o);c.rotation.y=Math.PI/4,c.position.set(r.x,t.h+1.5,r.z),n(c),i(r.x,r.z,5)}r(c.x,34,c.z,16755302,40,28),i(c.x,c.z,10)}function id(e){let{def:t,bag:n,built:r,add:i,glowAt:a,hit:o,stone:s,white:c,cream:l,darkArch:u}=e,d=xn(32.8275,34.9705),p=new J(new G(18,12,14),l);p.position.set(d.x,8,d.z),i(p);let m=new J(new G(10,8,16),l);m.position.set(d.x,6,d.z+8),i(m);let h=new J(new W(5.6,16,12,0,Math.PI*2,0,Math.PI/2),c);h.position.set(d.x,14,d.z),i(h);let g=new J(new G(.25,3.2,.25),c);g.position.set(d.x,20.2,d.z),i(g);let _=xn(32.8118,34.9884);for(let e=0;e<6;e++){let t=new J(new G(22-e,1.1,8),new q({color:e%2?13623492:15262936,roughness:.85}));t.position.set(_.x,10+e*2.2,_.z-e*7),i(t)}a(d.x,22,d.z,16771248,36,24),o(d.x,d.z,12);let v=xn(32.8268,34.9692),y=new J(new G(8,4.2,10),s);y.position.set(v.x,2.2,v.z),i(y);let b=new J(new G(3.2,3.4,.4),u);b.position.set(v.x,1.8,v.z+5.2),i(b),o(v.x,v.z,5);let x=xn(32.8298,34.9698),S=new J(new Y(1.4,1.8,14,10),l);S.position.set(x.x,7,x.z),i(S);let C=new J(new f(2,2.2,8),l);C.position.set(x.x,15.2,x.z),i(C);let w=new J(new W(1.1,10,8),new Ct({color:16773828}));w.position.set(x.x,14.4,x.z),i(w),a(x.x,14,x.z,16771248,16,14);let T=new q({color:1853992,roughness:.9,flatShading:!0}),E=new q({color:3811356,roughness:.92});n.push(T,E);let D=t.water?t.water.x:d.x-40,O=t.water?t.water.z:d.z,k=new q({color:13157564,metalness:.35,roughness:.45});n.push(k);for(let e=3;e<r.samples.length-3;e+=3){let t=r.samples[e],n=t.rx*(D-t.x)+t.rz*(O-t.z)>=0?1:-1,a=r.width/2+1.5,o=t.x+t.rx*a*n,s=t.z+t.rz*a*n,c=new J(new Y(.06,.07,1.15,5),k);c.position.set(o,t.y+.7,s),i(c);let l=-n,u=t.x+t.rx*(r.width/2+10)*l,d=t.z+t.rz*(r.width/2+10)*l,p=new J(new Y(.2,.32,6.2,6),E);p.position.set(u,t.y+3.1,d),i(p);for(let e=0;e<3;e++){let n=new J(new f(2-e*.38,4.2,7),T);n.position.set(u,t.y+5.2+e*2.2,d),i(n)}}}function ad(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,cream:o,wood:s,cyan:c}=e,l=Yt(32.788,35.543),u=new J(new G(80,1.15,3.4),i);u.position.set(l.x,.7,l.z),t(u);for(let e=0;e<8;e++){let n=new J(new Y(.22,.32,7,6),s);n.position.set(l.x-28+e*8,3.6,l.z+4),t(n);let r=new J(new W(1.8,6,4),new q({color:3832392,roughness:.9}));r.position.set(l.x-28+e*8,7.6,l.z+4),t(r)}let d=Yt(32.7685,35.549),f=new J(new Y(8,8.6,5,12),i);f.position.set(d.x,2.6,d.z),t(f);let p=new J(new Y(5.4,5.4,.4,12),c);p.position.set(d.x,.3,d.z),t(p);let m=Yt(32.7865,35.5425),h=new J(new G(12,8,10),o);h.position.set(m.x,4.2,m.z),t(h);let g=new J(new W(3.6,12,8,0,Math.PI*2,0,Math.PI/2),a);g.position.set(m.x,8.4,m.z),t(g);let _=Yt(32.786,35.5412),v=new J(new G(14,10,12),i);v.position.set(_.x,5.2,_.z),t(v),n(l.x,10,l.z,16771264,22,18),r(l.x,l.z,8),r(d.x,d.z,9),r(m.x,m.z,7),r(_.x,_.z,8)}function od(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,stone:o}=e,s=new q({color:4866104,roughness:.95,flatShading:!0}),c=new q({color:4876856,roughness:.92,flatShading:!0});t.push(s,c);let l=yn(32.992,35.689);{let e=Q(n.samples,l.x,l.z,0);if(e.dist<n.width/2+16){let t=n.samples[e.index];l.x=t.x+t.rx*(n.width/2+34),l.z=t.z+t.rz*(n.width/2+34)}}for(let e=0;e<8;e++){let t=new J(new f(16+e*2,18+e*3.4,6),e%2?c:s);t.position.set(l.x+36+e%4*18,9,l.z-24+Math.floor(e/2)*26),r(t)}let u=new J(new G(22,12,18),o);u.position.set(l.x-20,8,l.z+10),r(u);for(let[e,t]of[[-9,-7],[9,-7],[-9,7],[9,7]]){let n=new J(new Y(3.2,3.8,16,8),o);n.position.set(l.x-20+e,10,l.z+10+t),r(n)}i(l.x-20,16,l.z+10,16769184,24,20),a(l.x,l.z,12),a(l.x-20,l.z+10,12)}function sd(e){let{def:t,bag:n,built:r,add:a,glowAt:o,hit:s,stone:c,cream:l,bandMat:u}=e,d=new q({color:15922938,roughness:.88}),p=new q({color:9077880,roughness:.94,flatShading:!0}),m=new q({color:1854002,roughness:.9,flatShading:!0}),h=new q({color:3811868,roughness:.92});n.push(d,p,m,h);let g=Gt(33.3112,35.79);Gt(33.2688,35.7712);for(let e=0;e<10;e++){let n=e/10*Math.PI*1.4-.4,r=90+e%3*32;36+e%4*14;let i=new J(new _e(14+e%3*5,0),e<6?d:p);i.position.set(g.x+Math.cos(n)*r,t.elevation(1)+10+e*4,g.z+22+Math.sin(n)*r*.7),i.scale.set(2.2,3.4,2),a(i)}let _=new J(new _e(34,0),d);_.position.set(g.x+22,t.elevation(1)+22,g.z+48),_.scale.set(2.4,3.2,2.2),a(_);let v=Gt(33.2924,35.7802),y=Gt(33.3084,35.7876),b=Q(r.samples,v.x,v.z,0),x=r.samples[b.index];v.x=x.x+x.rx*(r.width/2+20),v.z=x.z+x.rz*(r.width/2+20);let S=Q(r.samples,y.x,y.z,0),C=r.samples[S.index];y.x=C.x+C.rx*(r.width/2+20),y.z=C.z+C.rz*(r.width/2+20);let w=new Y(.35,.5,14,8),T=new J(w,p);T.position.set(v.x,x.y+7,v.z),a(T);let E=new J(w,p);E.position.set(y.x,C.y+7,y.z),a(E);let D=y.x-v.x,O=C.y+13-(x.y+13),k=y.z-v.z,A=new J(new Y(.08,.08,Math.hypot(D,O,k)||1,6),u);A.position.set((v.x+y.x)*.5,(x.y+C.y)*.5+13,(v.z+y.z)*.5),A.rotation.z=Math.atan2(D,O||1),A.rotation.x=Math.atan2(k,Math.hypot(D,O)||1),a(A);for(let e=0;e<6;e++){let n=e/6*Math.PI*2,r=new J(new _e(16,0),e%2?d:p);r.position.set(g.x+22+Math.cos(n)*48,t.elevation(1)+6,g.z+48+Math.sin(n)*36),r.scale.set(1.6,2.1,1.5),a(r)}for(let e=2;e<r.samples.length-2;e+=2){let t=r.samples[e],n=t.rx*(g.x-t.x)+t.rz*(g.z-t.z)>=0?1:-1,i=new J(new G(7.4,1.6,4.2),d);i.position.set(t.x+t.rx*(r.width/2+6.4)*n,t.y+.7,t.z+t.rz*(r.width/2+6.4)*n),i.rotation.y=Math.atan2(t.tx,t.tz),a(i)}let j=Math.min(40,r.samples.length),M=Math.max(1,Math.floor(r.samples.length/j));for(let e=0;e<r.samples.length;e+=M){let t=r.samples[e],n=t.rx*(g.x-t.x)+t.rz*(g.z-t.z)>=0?1:-1;-n;let i=r.width/2+32,o=t.x+t.rx*i*n,s=t.z+t.rz*i*n,c=16+t.y*.22,l=new J(new _e(10+e%3*3,0),t.y>40?d:p);l.position.set(o,t.y+c*.22,s),l.scale.set(1.4,1.8+t.y*.012,1.2),a(l)}let N=[{lat:33.2692,lon:35.7704},{lat:33.2698,lon:35.7718},{lat:33.2684,lon:35.7724},{lat:33.2704,lon:35.7708},{lat:33.269,lon:35.77},{lat:33.2708,lon:35.7714}];for(let e=0;e<N.length;e++){let t=Gt(N[e].lat,N[e].lon),n=Q(r.samples,t.x,t.z,0),i=r.width/2+22;if(n.dist<i){let e=r.samples[n.index];t.x=e.x+e.rx*i,t.z=e.z+e.rz*i}let o=new J(new G(6.4,4.2,7.4),c);o.position.set(t.x,r.samples[n.index].y+2.2,t.z),a(o);let s=new J(new f(5.4,2.8,4),d);s.rotation.y=Math.PI/4,s.position.set(t.x,r.samples[n.index].y+5.8,t.z),a(s)}let P=t.elevation(.9);{let e=Q(r.samples,g.x,g.z,0),t=r.samples[e.index],n=t.x+t.rx*(r.width/2+22),i=t.z+t.rz*(r.width/2+22),o=new J(new G(16,5.4,10),p);o.position.set(n,P+2.8,i),a(o);let s=new J(new f(11,5.4,4),d);s.position.set(n,P+8.4,i),a(s)}let F=new J(new Nt(168,24),d);F.rotation.x=-Math.PI/2,F.position.set(g.x+18,t.elevation(1)+.35,g.z+28),a(F);let I=Gt(33.294,35.778),ee=t.elevation(.55);for(let e=0;e<12;e++){let t=e/11,n=i(I.x,g.x,t),r=i(I.z,g.z,t),o=i(ee,P,t),s=new J(new Y(.16,.2,9,6),l);if(s.position.set(n+10,o+4.5,r+6),a(s),e<11){let e=new J(new G(Math.hypot(g.x-I.x,g.z-I.z)/11+.4,.07,.07),l);e.position.set(n+10+(g.x-I.x)/22,o+8.6+(P-ee)/22,r+6+(g.z-I.z)/22),e.lookAt(g.x+10,P+9,g.z+6),a(e)}if(e%2==0){let e=new J(new G(1.4,.15,1.1),l);e.position.set(n+10,o+6.4,r+6),a(e)}}let L=Gt(33.2526,35.7147),R=new J(new G(16,9,12),c);R.position.set(L.x,10,L.z),a(R);let te=new J(new G(7,14,7),c);te.position.set(L.x,14,L.z),a(te),o(g.x-18,P+10,g.z-8,16771272,26,18),s(g.x-18,g.z-8,9),s(L.x,L.z,10)}function cd(e){let{bag:t,add:n,hit:r,wood:i}=e,a=new q({color:12105908,roughness:.7}),o=new q({color:4874808,roughness:.9,flatShading:!0}),s=new q({color:1731130,roughness:.55});t.push(a,o,s);let c=Bn(32.134,34.932),l=new J(new G(42,1.6,12),a);l.position.set(c.x,9.2,c.z),n(l);for(let e of[-1,1]){let t=new J(new G(3.6,9,3.6),a);t.position.set(c.x+e*18,4.6,c.z),n(t);let r=new J(new G(8,1.2,28),a);r.position.set(c.x+e*22,4.4,c.z),r.rotation.z=e*.18,n(r)}let u=Bn(32.21,34.978),d=new J(new G(28,.6,1.4),a);d.position.set(u.x,8.2,u.z),n(d);for(let e of[-1,1]){let t=new J(new G(.6,8.2,.6),a);t.position.set(u.x+e*13,4.2,u.z),n(t)}let f=new J(new G(10,2.4,.2),s);f.position.set(u.x,8.2,u.z+.8),n(f);let p=Bn(32.062,34.948),m=new J(new G(26,.5,1.2),a);m.position.set(p.x,7.8,p.z),n(m);for(let e=0;e<24;e++){let t=Bn(32.09+e%8*.008,34.956+Math.floor(e/8)*.01),r=new J(new W(2.2+e%3*.4,6,5),o);r.position.set(t.x,2.4,t.z),n(r);let a=new J(new Y(.16,.28,2.6,5),i);a.position.set(t.x,1.2,t.z),n(a)}r(c.x,c.z,8),r(u.x,u.z,4)}function ld(e){let{bag:t,add:n,hit:r,stone:i,white:a,cream:o,terracotta:s,paleGlass:c}=e,l=new q({color:15259572,roughness:1,flatShading:!0}),u=new q({color:6965810,roughness:.9}),d=new q({color:3107386,roughness:.86,flatShading:!0});t.push(l,u,d);for(let e=0;e<16;e++){let t=Jn(32.35+e*.008,34.848+e%3*.004),r=new J(new W(10+e%4*3,7,5),l);r.scale.y=.38,r.position.set(t.x,2.2,t.z),n(r)}for(let e=0;e<14;e++){let t=Jn(32.352+e*.009,34.862),r=new J(new Y(.18,.32,7.2,6),u);r.position.set(t.x,3.6,t.z),n(r);for(let e=0;e<6;e++){let r=e/6*Math.PI*2,i=new J(new f(.45,3.2,5),d);i.rotation.z=1.05,i.rotation.y=r,i.position.set(t.x+Math.cos(r)*.4,7.4,t.z+Math.sin(r)*.4),n(i)}}let p=Jn(32.35,34.868),m=new J(new G(10,42,10),a);m.position.set(p.x,21,p.z),n(m);let h=new J(new Y(5.2,5.6,36,10),o);h.position.set(p.x+16,18,p.z+6),n(h);let g=new J(new G(8,28,12),c);g.position.set(p.x-14,14,p.z+8),n(g);let _=Jn(32.48,34.892);for(let e=0;e<9;e++){let t=new J(new Y(.7,.85,8.4,8),i);if(t.position.set(_.x-18+e*4.4,4.4,_.z+16),n(t),e<8){let t=new J(new ht(2.1,.45,6,10,Math.PI),i);t.rotation.z=Math.PI,t.position.set(_.x-16+e*4.4,8.4,_.z+16),n(t)}}let v=new J(new G(16,5.4,10),o);v.position.set(_.x,2.8,_.z),n(v);let y=new J(new G(18,.4,12),s);y.position.set(_.x,5.6,_.z),n(y),r(p.x,p.z,8),r(_.x,_.z,10)}function ud(e){let{bag:t,add:n,hit:r,cream:i,terracotta:a,wood:o}=e,s=new q({color:11565650,roughness:.95,flatShading:!0}),c=new q({color:3107386,roughness:.86,flatShading:!0});t.push(s,c);for(let e=0;e<10;e++){let t=Tn(30.66+e*.012,35.255+e%2*.018),r=new J(new f(16+e%4*6,22+e%5*8,5),s);r.position.set(t.x,10+e%3*4,t.z),n(r)}for(let e=0;e<12;e++){let t=Tn(30.668+e*.008,35.228),r=new J(new G(14,12+e%4*4,8),s);r.position.set(t.x,6+e%4*2,t.z),n(r)}for(let e=0;e<16;e++){let t=Tn(30.7+e%8*.006,35.244+Math.floor(e/8)*.008),r=new J(new Y(.18,.28,8.4,6),o);r.position.set(t.x,4.2,t.z),n(r);let i=new J(new W(2.4,6,5),c);i.position.set(t.x,8.8,t.z),n(i)}let l=Tn(30.748,35.268),u=new J(new G(14,5.2,10),i);u.position.set(l.x,2.7,l.z),n(u);let d=new J(new G(16,.4,12),a);d.position.set(l.x,5.5,l.z),n(d);let p=new J(new Y(2.8,2.8,6.4,12),i);p.position.set(l.x+12,3.2,l.z),n(p),r(l.x,l.z,8)}function dd(e){let{add:t,glowAt:n,hit:r,white:i,cream:a,paleGlass:o}=e,s=Cn(32.091,34.887),c=new J(new G(32,12,22),a);c.position.set(s.x,6.2,s.z),t(c);let l=new J(new Y(6.4,6.4,10,12),o);l.position.set(s.x,8,s.z),t(l);let u=Cn(32.09,34.867),d=new J(new G(22,18,14),i);d.position.set(u.x,9.2,u.z),t(d);let f=new J(new G(28,10,10),i);f.position.set(u.x+8,5.2,u.z+10),t(f),n(s.x,14,s.z,16764040,36,24),r(s.x,s.z,12),r(u.x,u.z,10)}function fd(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,terracotta:o,wood:s}=e,c=pn(31.9638,34.8045),l=new J(new G(16,11,14),i);l.position.set(c.x,5.6,c.z),t(l);for(let e of[-7,7]){let n=new J(new Y(1.6,1.8,16,8),i);n.position.set(c.x+e,9,c.z+6),t(n);let r=new J(new f(2.1,3.2,4),o);r.position.set(c.x+e,18.4,c.z+6),t(r)}let u=new J(new W(5.2,14,10,0,Math.PI*2,0,Math.PI/2),a);u.position.set(c.x,11,c.z),t(u);let d=pn(31.9618,34.8072),p=new J(new G(20,7,12),s);p.position.set(d.x,3.6,d.z),t(p);let m=new J(new Y(1.6,1.6,4,10),s);m.rotation.z=Math.PI/2,m.position.set(d.x,1.8,d.z+8),t(m),n(c.x,16,c.z,16771264,24,20),r(c.x,c.z,10),r(d.x,d.z,10)}function pd(e){let{bag:t,add:n,glowAt:r,hit:i,white:a,cream:o}=e,s=new q({color:12081714,metalness:.45,roughness:.42});t.push(s);let c=en(31.821,34.647);for(let e of[{lat:31.8204,lon:34.6464},{lat:31.8212,lon:34.647},{lat:31.822,lon:34.6476}]){let t=en(e.lat,e.lon),r=new J(new G(1.4,32,1.4),s);r.position.set(t.x,16,t.z),n(r);let i=new J(new G(28,.8,.8),s);i.position.set(t.x+14,32,t.z),n(i)}r(c.x,32,c.z,16755302,36,26);let l=en(31.8198,34.6458),u=new J(new Y(1.4,1.8,20,8),o);u.position.set(l.x,10,l.z),n(u);let d=new J(new f(2.4,2.8,8),a);d.position.set(l.x,21,l.z),n(d),r(l.x,22,l.z,16771248,24,20),i(c.x,c.z,10),i(l.x,l.z,6)}function md(e){let{add:t,hit:n,stone:r}=e,i=gn(31.663,34.548);for(let e of[{lat:31.6622,lon:34.5472},{lat:31.6628,lon:34.5478},{lat:31.6634,lon:34.5484},{lat:31.664,lon:34.549},{lat:31.6646,lon:34.5496}]){let n=gn(e.lat,e.lon),i=new J(new G(12,8,3.2),r);i.position.set(n.x,4,n.z),t(i)}let a=new J(new Y(3.2,3.8,14,8),r);a.position.set(i.x+12,7,i.z),t(a),n(i.x,i.z,12)}function hd(e){let{def:t,bag:n,built:r,add:i,glowAt:a,hit:o,stone:s,cream:c,merlonWall:l,placeDome:u}=e,d=t.elevation(.94);rr(31.7866,35.2344);let p=rr(31.7938,35.2452),m=rr(31.7912,35.2454);{let e=Q(r.samples,p.x,p.z,0),t=r.samples[e.index];p.x=t.x+t.rx*(r.width/2+24),p.z=t.z+t.rz*(r.width/2+24);let n=Q(r.samples,m.x,m.z,0),i=r.samples[n.index];m.x=i.x+i.rx*(r.width/2+22),m.z=i.z+i.rz*(r.width/2+22)}let h=new J(new G(26,12,14),c);h.position.set(p.x,d*.78+6,p.z),i(h);let g=new J(new G(7,26,7),s);g.position.set(p.x+8,d*.78+14,p.z),i(g);let _=new J(new G(16,1.6,7),s);_.position.set(m.x,d+.9,m.z),i(_);let v=new J(new G(16,.9,.28),c);v.position.set(m.x,d+1.8,m.z-3),i(v);let y=rr(31.778,35.2354),b=rr(31.7767,35.2342),x=rr(31.7766,35.2054);u(y.x,y.z),l(b.x,b.z+18,70,.2,11),l(b.x+28,b.z-8,58,1.1,11);let S=new J(new G(28,8,18),s);S.position.set(x.x,4.2,x.z),i(S);let C=new q({color:2972216,roughness:.9,flatShading:!0}),w=new q({color:12890250,roughness:.95,flatShading:!0});n.push(C,w);for(let e=0;e<16;e++){let t=e/16*Math.PI*2,n=220+e%4*90,r=48+e%5*22,a=new J(new f(36+e%3*12,r,5),w);a.position.set(m.x+Math.cos(t)*n,d*.12+r*.18,m.z+Math.sin(t)*n*.85),i(a)}for(let e=0;e<12;e++){let t=e/12*Math.PI*2,n=new J(new f(42+e%3*12,44+e%4*16,5),w);n.position.set(m.x+Math.cos(t)*420,d*.08+16,m.z+Math.sin(t)*360),i(n)}for(let e=0;e<10;e++){let t=e/10*Math.PI*2+.2,n=new J(new f(58+e%3*16,52+e%4*18,5),w);n.position.set(m.x+Math.cos(t)*620,18,m.z+Math.sin(t)*540),i(n)}for(let e=0;e<8;e++){let t=e/8*Math.PI*2+.4,n=new J(new f(72+e%3*18,62+e%4*22,5),w);n.position.set(m.x+Math.cos(t)*920,22,m.z+Math.sin(t)*780),i(n)}for(let e=0;e<32;e++){let n=.06+e/32*.85,r=rr(31.7866+n*.005,35.2344+n*.01+Math.sin(e)*.0018),a=t.elevation(n),o=e%2?1:-1,s=new J(new f(1.2,6.8,7),C);s.position.set(r.x+o*(13+e%4*3),a+3.4,r.z+e%3*3),i(s)}a(m.x,d+4,m.z,16769184,22,18),a(y.x,16,y.z,16765040,36,28),o(p.x,p.z,12),o(m.x,m.z,6),o(y.x,y.z,10),o(x.x,x.z,10)}function gd(e){let{add:t,hit:n,stone:r,merlonWall:i,minaret:a,ottomanGate:o,placeDome:s}=e,c=rr(31.7764,35.2276),l=rr(31.7794,35.226),u=rr(31.7817,35.2304),d=rr(31.7808,35.2368),f=rr(31.7748,35.2342),p=rr(31.7728,35.2292),m=rr(31.7762,35.2284),h=rr(31.778,35.2354),g=rr(31.7767,35.2342),_=rr(31.7778,35.2318),v=(e,t=26)=>{let n=_.x-e.x,r=_.z-e.z,i=Math.hypot(n,r)||1;return{x:e.x+n/i*t,z:e.z+r/i*t}},y=v(c),b=v(l),x=v(u),S=v(d),C=v(f),w=v(p);o(y.x,y.z,.4),o(x.x,x.z,2.2),o(S.x,S.z,3.3),o(w.x,w.z,5.2),i((y.x+b.x)*.5,(y.z+b.z)*.5,48,Math.atan2(b.x-y.x,b.z-y.z),12),i((b.x+x.x)*.5,(b.z+x.z)*.5,58,Math.atan2(x.x-b.x,x.z-b.z),12),i((x.x+S.x)*.5,(x.z+S.z)*.5,62,Math.atan2(S.x-x.x,S.z-x.z),12),i((S.x+C.x)*.5,(S.z+C.z)*.5,70,Math.atan2(C.x-S.x,C.z-S.z),12),i((C.x+w.x)*.5,(C.z+w.z)*.5,55,Math.atan2(w.x-C.x,w.z-C.z),12),i((w.x+y.x)*.5,(w.z+y.z)*.5,52,Math.atan2(y.x-w.x,y.z-w.z),12);let T=new J(new G(18,12,18),r),E=v(m,22);T.position.set(E.x,7,E.z),t(T),a(E.x+3,E.z-2,30),s(h.x,h.z),n(E.x,E.z,8),n(g.x,g.z,8)}function _d(e){let{add:t,hit:n,cream:r,paleGlass:i}=e,a=Pn(31.907,35.007),o=new J(new G(24,12,16),r);o.position.set(a.x,6,a.z),t(o);let s=new J(new Y(5.4,5.4,11,12),i);s.position.set(a.x,7.2,a.z),t(s),n(a.x,a.z,12)}function vd(e){let{group:t,def:n,bag:r,shadows:i,built:a,add:o,glowAt:s,hit:c,placeTunnel:l,_dummy:u,samp:d,segsOf:p}=e,m=new q({color:6961192,roughness:.97,flatShading:!0}),h=new q({color:12868658,roughness:.94,flatShading:!0}),g=new q({color:14725240,roughness:.92,flatShading:!0}),_=new q({color:15258280,roughness:.9,flatShading:!0}),v=new q({color:11028520,roughness:.95,flatShading:!0}),y=new q({color:4860960,roughness:.96,flatShading:!0}),b=new q({color:11037250,roughness:.95,flatShading:!0});r.push(m,h,g,_,v,y,b);let x=pr(30.585,34.802),S=new J(new Nt(420,28),h);S.rotation.x=-Math.PI/2,S.position.set(x.x,.4,x.z),o(S);let C=new J(new G(28,.3,380),m);C.position.set(x.x+8,.55,x.z),o(C);let w=new _e(1,0),T=Math.min(64,a.samples.length),E=new Lt(w,g,T);E.castShadow=i;let D=0,O=Math.max(1,Math.floor(a.samples.length/T));for(let e=0;e<a.samples.length&&D<T;e+=O){let t=a.samples[e],n=-(t.rx*(x.x-t.x)+t.rz*(x.z-t.z)>=0?1:-1),r=a.width/2+22+e%4*6,i=t.x+t.rx*r*n,o=t.z+t.rz*r*n;u.position.set(i,t.y+2.4,o);let s=3.4+e%5*1.4;u.scale.set(s*1.4,s*.7,s),u.rotation.set(e*.4,e*.7,e*.2),u.updateMatrix(),E.setMatrixAt(D++,u.matrix)}E.count=D,E.instanceMatrix.needsUpdate=!0,t.add(E);{let e=[],t=[],n=p(a);for(let t=0;t<=n;t++){let n=d(a,t),r=-(n.rx*(x.x-n.x)+n.rz*(x.z-n.z)>=0?1:-1),i=a.width/2+9.5,o=n.y-4,s=n.y+150+Math.min(90,n.y*.55);e.push(n.x+n.rx*i*r,o,n.z+n.rz*i*r),e.push(n.x+n.rx*i*r,s,n.z+n.rz*i*r)}for(let e=0;e<n;e++){let n=e*2;t.push(n,n+1,n+2,n+1,n+3,n+2)}let i=new zt;i.setAttribute(`position`,new wt(e,3)),i.setIndex(t),i.computeVertexNormals(),r.push(i);let s=new J(i,b);s.receiveShadow=!0,o(s)}for(let e=0;e<22;e++){let t=e/22*Math.PI*2+.15,n=new J(new f(80+e%5*24,130+e%4*40,6),e%3==0?y:e%3==1?b:g);n.position.set(x.x+Math.cos(t)*560,52,x.z+Math.sin(t)*400),o(n)}let k=[_,g,b,v,h];for(let e=1;e<a.samples.length-1;e+=3){let t=a.samples[e],n=-(t.rx*(x.x-t.x)+t.rz*(x.z-t.z)>=0?1:-1);for(let e=0;e<5;e++){let r=new J(new G(16,3.6,10),k[e]),i=a.width/2+12+e*3.2;r.position.set(t.x+t.rx*i*n,t.y+2.2+e*3.5,t.z+t.rz*i*n),r.rotation.y=Math.atan2(t.tx,t.tz),o(r)}}let A=pr(30.6132,34.801);{let e=Q(a.samples,A.x,A.z,0),t=a.samples[e.index];A.x=t.x+t.rx*(a.width/2+26),A.z=t.z+t.rz*(a.width/2+26)}let j=n.elevation(.02),M=new J(new G(18,.32,12),_);M.position.set(A.x,j+.2,A.z),o(M);let N=new q({color:6969416,roughness:.7,metalness:.2});r.push(N);for(let e of[-16,-4]){let t=new J(new G(18,.08,.08),N);t.position.set(A.x,j+1.15,A.z+e),o(t)}for(let e of[-8,0,8]){let t=new J(new Y(.07,.08,1.15,6),N);t.position.set(A.x+e,j+.7,A.z-6),o(t)}let P=pr(30.5992,34.806),F=pr(30.5964,34.8044),I=Math.atan2(F.x-P.x,F.z-P.z),ee=n.elevation(.55);l(P.x,P.z,I,42,a.width*.62,7.6,ee);let L=Math.cos(I),R=-Math.sin(I),te=new J(new G(22,36,30),y);te.position.set(P.x-L*28,ee+18,P.z-R*28),o(te);let ne=new J(new G(22,32,30),h);ne.position.set(P.x+L*28,ee+16,P.z+R*28),o(ne);let re=new q({color:6978104,roughness:.92,flatShading:!0});r.push(re);for(let e=0;e<22;e++){let t=new J(new W(1.1+e%3*.4,6,5),re);t.position.set(x.x+e%9*28-90,1.4,x.z+Math.floor(e/9)*34-30),o(t)}s(A.x,j+5,A.z,16763e3,24,20),c(A.x,A.z,4),c(P.x-L*28,P.z-R*28,8),c(P.x+L*28,P.z+R*28,8)}function yd(e){let{add:t,hit:n,stone:r,cream:i}=e,a=tr(30.847,34.781),o=new J(new G(10,4,8),i);o.position.set(a.x,2.2,a.z),t(o);let s=tr(30.794,34.773),c=new J(new G(16,6,12),r);c.position.set(s.x,3.2,s.z),t(c),n(a.x,a.z,8),n(s.x,s.z,10)}function bd(e){let{add:t}=e,n=[bn(29.546,34.916),bn(29.548,34.92),bn(29.55,34.924),bn(29.552,34.918),bn(29.554,34.926),bn(29.547,34.928),bn(29.556,34.922)];for(let e=0;e<n.length;e++){let r=n[e],i=new J(new f(16+e*3,24+e*5,5),new q({color:10771002,roughness:.95,flatShading:!0}));i.position.set(r.x,12,r.z),t(i)}}function xd(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,cream:o,terracotta:s,wood:c,placeAzrieli:l,placeTlvTowers:u}=e,d=X(32.0547,34.7556),p=new J(new Y(2.6,3.1,20,12),i);p.position.set(d.x,10,d.z),t(p);let m=new J(new G(5.2,5.2,5.2),o);m.position.set(d.x,21.4,d.z),t(m);let h=new J(new Nt(1.8,16),a);h.position.set(d.x,21.4,d.z+2.7),t(h);let g=new J(new f(3.2,4.2,4),s);g.rotation.y=Math.PI/4,g.position.set(d.x,26.2,d.z),t(g),l(.72),u(.62);let _=X(32.1044,34.7776),v=new J(new Y(3.4,5.2,78,16),o);v.position.set(_.x,39,_.z),t(v);let y=new J(new Y(4.6,3.8,2.4,16),o);y.position.set(_.x,79,_.z),t(y);for(let e=0;e<5;e++){let n=new J(new Y(3.55,3.7,2.6,14),e%2?s:a);n.position.set(_.x,66+e*2.8,_.z),t(n)}let b=X(32.0893,34.7732),x=new J(new Y(16,17,28,16,1,!1,.55,2.05),a);x.position.set(b.x,14,b.z),x.rotation.y=-.35,t(x);let S=Xn(32.1635,34.7965),C=new J(new G(36,.5,10),c);C.position.set(S.x,.3,S.z),t(C);let w=Xn(32.1674,34.7982),T=new J(new Y(12,14,14,16,1,!1,.35,2.45),a);T.position.set(w.x,7.2,w.z),T.rotation.y=-.4,t(T),n(_.x,78,_.z,16724016,28,24),r(d.x,d.z,6),r(_.x,_.z,6),r(b.x,b.z,12),r(w.x,w.z,12)}function Sd(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,stone:o,copper:s,cream:c,terracotta:l,darkGlass:u}=e,d=Kn(32.7014,35.2962);{let e=Q(n.samples,d.x,d.z,0);if(e.dist<n.width/2+16){let t=n.samples[e.index];d.x=t.x+t.rx*(n.width/2+32),d.z=t.z+t.rz*(n.width/2+32)}}let p=new q({color:9075304,roughness:.82,envMapIntensity:.4});t.push(p);let m=new J(new G(30,18,22),p);m.position.set(d.x,9.2,d.z),r(m);let h=new J(new G(20,11,16),c);h.position.set(d.x,21.5,d.z),r(h);let g=new J(new Y(6.4,7.4,13,8),c);g.position.set(d.x,32,d.z),r(g);for(let e=0;e<8;e++){let t=e/8*Math.PI*2+Math.PI/8,n=new J(new G(1.2,12,.8),c);n.position.set(d.x+Math.cos(t)*6.8,32,d.z+Math.sin(t)*6.8),r(n);let i=new J(new G(1.6,3.6,.3),u);i.position.set(d.x+Math.cos(t)*6.3,32,d.z+Math.sin(t)*6.3),i.lookAt(d.x,32,d.z),r(i)}let _=new J(new f(7.8,11,8),p);_.position.set(d.x,44,d.z),r(_);let v=new J(new G(.32,4.4,.32),c);v.position.set(d.x,50.4,d.z),r(v);let y=new J(new G(2.3,.32,.32),c);y.position.set(d.x,49.6,d.z),r(y);let b=new J(new G(6.2,28,6.2),p);b.position.set(d.x+18,14,d.z-6),r(b);let x=new J(new f(4.2,6,4),c);x.rotation.y=Math.PI/4,x.position.set(d.x+18,31,d.z-6),r(x);let S=new J(new G(18,12,.4),c);S.position.set(d.x,12,d.z+11.2),r(S);for(let e=0;e<3;e++)for(let t=0;t<4;t++){let n=new J(new G(3.2,2.8,.18),e+t===3?s:p);n.position.set(d.x-6+t*4,8.2+e*3.2,d.z+11.4),r(n)}let C=Kn(32.7068,35.2972),w=new J(new Y(2.8,3.2,2.4,12),o);w.position.set(C.x,1.3,C.z),r(w);let T=new J(new f(3.8,3,4),l);T.position.set(C.x,4,C.z),r(T);let E=Kn(32.697,35.288),D=new J(new G(48,22,18),o);D.position.set(E.x,11,E.z),r(D);for(let e=0;e<8;e++){let t=Kn(32.704+e*35e-5,35.2994+e%3*2e-4);if(Q(n.samples,t.x,t.z,0).dist<n.width/2+6)continue;let i=new J(new G(4.2,3.4,4.6),e%2?c:o);i.position.set(t.x,1.7,t.z),r(i);let a=new J(new G(4.8,.12,5),l);a.position.set(t.x,3.5,t.z),r(a)}i(d.x,44,d.z,16771264,40,32),a(d.x,d.z,14),a(d.x+18,d.z-6,5),a(C.x,C.z,4),a(E.x,E.z,16)}function Cd(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,stone:o,gold:s,cream:c}=e,l=hn(32.967,35.495);{let e=Q(n.samples,l.x,l.z,0);if(e.dist<n.width/2+14){let t=n.samples[e.index];l.x=t.x+t.rx*(n.width/2+28),l.z=t.z+t.rz*(n.width/2+28)}}let u=new J(new Y(8.4,9.6,14,8),o);u.position.set(l.x,9,l.z),r(u);let d=new J(new Y(4.4,8.4,5,8),o);d.position.set(l.x,18.5,l.z),r(d);let f=new q({color:3108528,roughness:.42,metalness:.14,envMapIntensity:.75}),p=new q({color:14214384,roughness:.7});t.push(f,p);let m=hn(32.966,35.493);for(let e of[{lat:32.9683,lon:35.4926},{lat:32.9686,lon:35.4938},{lat:32.9674,lon:35.493},{lat:32.9692,lon:35.492}]){let t=hn(e.lat,e.lon),n=new J(new G(11,8,11),o);n.position.set(t.x,5,t.z),r(n);let i=new J(new W(4.6,14,10,0,Math.PI*2,0,Math.PI/2),f);i.position.set(t.x,9.2,t.z),r(i);let c=new J(new Y(.35,.55,1.8,8),s);c.position.set(t.x,14.2,t.z),r(c),a(t.x,t.z,7)}let h=[{lat:32.9664,lon:35.4922,h:6},{lat:32.9668,lon:35.4934,h:5.4},{lat:32.9676,lon:35.4942,h:7.2},{lat:32.9688,lon:35.4918,h:5.8},{lat:32.9658,lon:35.4938,h:6.4}];for(let e=0;e<h.length;e++){let t=h[e],n=hn(t.lat,t.lon),i=new J(new G(6.5,t.h,7),e%2?p:c);i.position.set(n.x,t.h*.5,n.z),r(i);let o=new J(new G(1.2,2.2,.2),f);o.position.set(n.x,1.2,n.z+3.6),r(o),a(n.x,n.z,4)}i(m.x,14,m.z,6727912,32,26),a(l.x,l.z,10),a(m.x,m.z,14)}function wd(e){let{bag:t,built:n,add:r,glowAt:i,hit:a,stone:o,cream:s,terracotta:c}=e,l=jn(31.3157,35.3538);{let e=Q(n.samples,l.x,l.z,0);if(e.dist<n.width/2+40){let t=n.samples[e.index];l.x=t.x+t.rx*(n.width/2+58),l.z=t.z+t.rz*(n.width/2+58)}}let u=new q({color:10518616,roughness:.96,flatShading:!0}),d=new q({color:7230520,roughness:.97,flatShading:!0});t.push(u,d);let f=new J(new Y(38,52,44,8),u);f.position.set(l.x,22,l.z),r(f);let p=new J(new Y(34,36,3.2,8),o);p.position.set(l.x,45.2,l.z),r(p);for(let e=0;e<8;e++){let t=e/8*Math.PI*2+Math.PI/8,n=new J(new G(18,16,10),e%2?d:u);n.position.set(l.x+Math.cos(t)*40,14,l.z+Math.sin(t)*28),n.rotation.y=t,r(n)}for(let e=0;e<12;e++){let t=e/12*Math.PI*2,n=new J(new G(4.2,2.4,2.2),o);n.position.set(l.x+Math.cos(t)*32,48.2,l.z+Math.sin(t)*24),n.rotation.y=t,r(n)}let m=new J(new G(28,4.2,8),o);m.position.set(l.x-4,48.4,l.z-6),r(m);for(let e=0;e<5;e++){let t=new J(new G(5.2,3.6,14),o);t.position.set(l.x-16+e*7,48.2,l.z+8),r(t)}let h=jn(31.3172,35.3536);for(let e=0;e<3;e++){let t=16-e*3.2,n=new J(new G(t,3.4,8-e*.8),o);n.position.set(h.x,42-e*9,h.z+8+e*7),r(n);let i=4-e;for(let n=0;n<i;n++){let a=new J(new Y(.35,.42,4.8,8),s);a.position.set(h.x-t*.32+n*(t*.64/Math.max(1,i-1)),45.2-e*9,h.z+8+e*7),r(a)}}let g=jn(31.3102,35.3648),_=new J(new G(14,4.2,10),s);_.position.set(g.x,2.2,g.z),r(_);let v=new J(new G(15,.4,11),c);v.position.set(g.x,4.4,g.z),r(v),i(l.x,50,l.z,16769184,40,32),a(l.x,l.z,22),a(h.x,h.z+12,6),a(g.x,g.z,6)}function Td(e){let{add:t,glowAt:n,hit:r,white:i,wood:a}=e,o=rn(32.017,34.741);for(let e of[{lat:32.0158,lon:34.7406,h:18},{lat:32.0172,lon:34.741,h:22},{lat:32.0186,lon:34.7414,h:20},{lat:32.02,lon:34.7418,h:24}]){let n=rn(e.lat,e.lon),a=new J(new G(9,e.h,8),i);a.position.set(n.x,e.h*.5,n.z),t(a),r(n.x,n.z,6)}let s=rn(32.023,34.742),c=new J(new G(4,.4,22),a);c.position.set(s.x,.22,s.z),t(c),n(o.x,20,o.z,16771248,22,18),r(o.x+24,o.z,12)}function Ed(e){let{add:t,glowAt:n,hit:r,white:i,cream:a,terracotta:o}=e,s=Dn(31.9078,34.818),c=new J(new Y(8.4,8.4,8,16),a);c.position.set(s.x,5,s.z),t(c);let l=new J(new W(8.6,16,8,0,Math.PI*2,0,Math.PI/2),o);l.position.set(s.x,9,s.z),t(l);for(let e of[{lat:31.9082,lon:34.8112,w:16,h:9,d:10},{lat:31.909,lon:34.8098,w:14,h:11,d:12},{lat:31.9074,lon:34.8106,w:18,h:8,d:10},{lat:31.9086,lon:34.8122,w:12,h:14,d:10}]){let n=Dn(e.lat,e.lon),a=new J(new G(e.w,e.h,e.d),i);a.position.set(n.x,e.h*.5,n.z),t(a),r(n.x,n.z,8)}n(s.x,12,s.z,16771264,28,22),r(s.x,s.z,10)}function Dd(e){let{add:t,glowAt:n,hit:r,white:i,wood:a,cyan:o}=e,s=Qn(33.006,35.094),c=new J(new G(6.5,.25,160),o);c.position.set(s.x,.12,s.z),t(c);for(let e=0;e<8;e++){let n=new J(new Y(.28,.4,8,6),a);n.position.set(s.x+(e%2?8:-8),4,s.z-70+e*18),t(n);let r=new J(new f(2.4,3.2,6),new q({color:2779704,roughness:.88}));r.position.set(s.x+(e%2?8:-8),9,s.z-70+e*18),t(r)}let l=Qn(33.0082,35.0924),u=new J(new G(14,16,10),i);u.position.set(l.x,8,l.z),t(u),n(s.x,4,s.z,6736096,22,28),r(l.x,l.z,8)}function Od(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,cream:o}=e,s=dr(31.9294,34.866),c=new J(new G(5.2,28,5.2),o);c.position.set(s.x,14,s.z),t(c);let l=new J(new G(6.2,3.2,6.2),o);l.position.set(s.x,29,s.z),t(l);let u=dr(31.9278,34.8668),d=new J(new G(18,10,14),i);d.position.set(u.x,6,u.z),t(d);let f=new J(new W(5.4,12,8),a);f.position.set(u.x,13,u.z),t(f),n(s.x,30,s.z,16771264,28,24),r(s.x,s.z,8),r(u.x,u.z,10)}function kd(e){let{add:t,glowAt:n,hit:r,white:i,cream:a}=e,o=Mn(32.0076,34.7792),s=new J(new Y(7.2,9.4,12,10),i);s.position.set(o.x,7,o.z),t(s);let c=new J(new ht(8.2,.5,6,16),i);c.rotation.x=Math.PI/2,c.position.set(o.x,13,o.z),t(c);for(let e of[{lat:32.0086,lon:34.7798,w:14,h:12,d:10},{lat:32.0094,lon:34.7786,w:16,h:9,d:12},{lat:32.0072,lon:34.7778,w:18,h:8,d:11}]){let n=Mn(e.lat,e.lon),i=new J(new G(e.w,e.h,e.d),a);i.position.set(n.x,e.h*.5,n.z),t(i),r(n.x,n.z,7)}n(o.x,14,o.z,15791352,26,22),r(o.x,o.z,10)}function Ad(e){let{add:t,glowAt:n,hit:r,stone:i,cream:a}=e,o=vn(32.503,35.502),s=new J(new Y(10,12,6,16,1,!0,0,Math.PI),i);s.position.set(o.x,3.2,o.z),s.rotation.y=.4,t(s);for(let e of[{lat:32.5032,lon:35.5026},{lat:32.5036,lon:35.5038},{lat:32.504,lon:35.505},{lat:32.5044,lon:35.5062},{lat:32.5048,lon:35.5074}]){let n=vn(e.lat,e.lon),r=new J(new Y(.45,.55,9,8),a);r.position.set(n.x,4.6,n.z),t(r);let i=new J(new G(1.3,.4,1.3),a);i.position.set(n.x,9.3,n.z),t(i)}let c=vn(32.48,35.42),l=new J(new f(16,22,5),new q({color:9071176,roughness:.95,flatShading:!0}));l.position.set(c.x,10,c.z),t(l),n(o.x,8,o.z,16769200,22,20),r(o.x,o.z,12),r(c.x,c.z,14)}function jd(e){let{bag:t,add:n,glowAt:r,hit:i,cream:a}=e,o=new q({color:12081714,metalness:.35,roughness:.48});t.push(o);let s=un(32.47,34.888),c=[un(32.4698,34.8874),un(32.4704,34.8886)];for(let e of c){let t=new J(new Y(3.2,4.4,52,12),o);t.position.set(e.x,26,e.z),n(t)}let l=new J(new G(28,10,16),a);l.position.set(s.x,5,s.z+16),n(l),r(s.x,50,s.z,16746564,36,40),i(s.x,s.z,14)}function Md(e){let{add:t,glowAt:n,hit:r,stone:i,white:a,cream:o,paleGlass:s}=e,c=or(31.9514,34.8882),l=new J(new Y(2.4,3.2,28,10),o);l.position.set(c.x,14,c.z),t(l);let u=new J(new G(16,10,12),i);u.position.set(c.x+8,5.2,c.z+4),t(u);let d=or(31.978,34.888),f=new J(new G(36,8,16),a);f.position.set(d.x,4.2,d.z),t(f);let p=new J(new Y(4.2,4.6,4,12),s);p.position.set(d.x,22,d.z),t(p),n(d.x,24,d.z,8967408,28,24),r(c.x,c.z,8),r(d.x,d.z,12)}function Nd(e){let{add:t,glowAt:n,hit:r,stone:i}=e,a=Wn(33.215,35.58);for(let e=0;e<5;e++){let n=new J(new f(12+e*2,18+e*4,5),new q({color:5925448,roughness:.95,flatShading:!0}));n.position.set(a.x+e*10,8+e,a.z+e%2*16),t(n)}let o=Wn(33.207,35.567),s=new J(new G(6,8,4),i);s.position.set(o.x,4.2,o.z),t(s),n(o.x,8,o.z,16771264,20,18),r(o.x,o.z,8)}function Pd(e){let{add:t,glowAt:n,hit:r,white:i}=e,a=cr(32.185,34.853);for(let e=0;e<12;e++){let n=new J(new f(2.2,7,6),new q({color:2779704,roughness:.88}));n.position.set(a.x-10+e%4*8,3.6,a.z+Math.floor(e/4)*10),t(n)}let o=cr(32.184,34.865),s=new J(new G(28,10,16),i);s.position.set(o.x,5,o.z),t(s),n(o.x,10,o.z,15791352,22,20),r(o.x,o.z,12)}function Fd(e){let{add:t,glowAt:n,hit:r,cream:i}=e,a=qt(32.61,35.29),o=new J(new ht(16,1.1,8,28),i);o.rotation.x=Math.PI/2,o.position.set(a.x,.4,a.z),t(o);let s=qt(32.55,35.33),c=new J(new f(22,28,5),new q({color:8022600,roughness:.95,flatShading:!0}));c.position.set(s.x,12,s.z),t(c),n(a.x,2,a.z,16771264,18,22),r(s.x,s.z,16)}function Id(e){let{add:t,glowAt:n,hit:r,stone:i}=e,a=kn(32.175,34.908),o=new J(new Y(10,10,.3,16),new q({color:3832386,roughness:.9}));o.position.set(a.x,.15,a.z),t(o);let s=new J(new G(1.4,12,1.4),i);s.position.set(a.x,6,a.z),t(s),n(a.x,12,a.z,16771264,18,16),r(a.x,a.z,8)}function Ld(e){let{add:t,hit:n,white:r}=e;for(let e of[{lat:31.2572,lon:35.2122,h:4.2},{lat:31.258,lon:35.2134,h:5.6},{lat:31.2588,lon:35.2126,h:4.8},{lat:31.2576,lon:35.214,h:6.2}]){let i=_n(e.lat,e.lon),a=new J(new G(8,e.h,6),r);a.position.set(i.x,e.h*.5,i.z),t(a),n(i.x,i.z,4)}let i=_n(31.27,35.24),a=new J(new f(28,18,5),new q({color:12886128,roughness:.96,flatShading:!0}));a.position.set(i.x,8,i.z),t(a),n(i.x,i.z,16)}var Rd={hayarkon:Iu,oldjaffa:Lu,telaviv:Ru,namal:zu,jerusalem:Bu,haifa:Vu,eilat:Hu,rothschild:Uu,ayalon:Wu,caesarea:Gu,deadsea:Ku,acre:qu,centralpark:Ju,timessquare:Yu,brooklynbridge:Xu,manhattan:Zu,beersheva:Qu,netanya:$u,hw1:ed,herzliya:td,hanikra:nd,haifaport:rd,stellamaris:id,tiberias:ad,golan:od,hermon:sd,hw6:cd,hw2:ld,hw90:ud,petah:dd,rishon:fd,ashdod:pd,ashkelon:md,scopus:hd,walls:gd,modiin:_d,ramon:vd,hw40:yd,eilatmtn:bd,gushdan:xd,nazareth:Sd,tzfat:Cd,masada:wd,batyam:Td,rehovot:Ed,nahariya:Dd,ramla:Od,holon:kd,beitshan:Ad,hadera:jd,lod:Md,kshmona:Nd,raanana:Pd,afula:Fd,ksaba:Id,arad:Ld};function zd(e,t){Rd[e](t)}function Bd(e){let t=Fu(e);zd(e.def.id,t);let{def:n,built:r,add:i,hit:a,isNight:o,colliders:s}=t;Pu(n,r,i,a,o,(e,t)=>{for(let n of s)if(Math.hypot(n.x-e,n.z-t)<(n.r??6)+14)return!0;return!1})}var $=new C,Vd=new D;function Hd(e=2){let t=ut(e)||ut(8)||ut(4)||ut(3);if(!t)throw Error(`baked asphalt missing`);return t}function Ud(){let e=uu();if(!e)throw Error(`herodian texture missing`);return e}function Wd(e=`blue`){let t=iu(e);if(!t)throw Error(`curtain texture missing`);return t}function Gd(e){let t=su(e);if(!t)throw Error(`curb texture missing`);return t}function Kd(){let e=bu();if(!e)throw Error(`foliage texture missing`);return e}function qd(){let e=xu();if(!e)throw Error(`bark texture missing`);return e}function Jd(){let e=tu();if(!e)throw Error(`sidewalk texture missing`);return e}function Yd(e){let t=Ql();if(!t)throw Error(`ground texture missing`);return t}function Xd(){let e=Yl();if(!e)throw Error(`foam texture missing`);return e}function Zd(e){let t=Gl(e);if(!t)throw Error(`sign texture missing`);return t}function Qd(){let e=Bl();if(!e)throw Error(`water normal missing`);return e}function $d(){let e=Vl();if(!e)throw Error(`checker texture missing`);return e}function ef(e,...t){let n=e>=128?Fl():Il();if(!n)throw Error(`flare texture missing`);return n}function tf(e){return e.closed?e.samples.length:Math.max(1,e.samples.length-1)}function nf(e,t){let n=e.samples.length;return e.samples[e.closed?t%n:Math.min(t,n-1)]}function rf(e){let t=e.width/2,n=[],r=[],i=[],a=[],o=tf(e);for(let a=0;a<=o;a++){let s=nf(e,a),c=(a===o?e.length:s.s)/6;n.push(s.x-s.rx*t,s.y+.04,s.z-s.rz*t),n.push(s.x+s.rx*t,s.y+.04,s.z+s.rz*t),r.push(0,c,1,c),i.push(0,1,0,0,1,0)}for(let e=0;e<o;e++){let t=e*2;a.push(t,t+1,t+2,t+1,t+3,t+2)}let s=new zt;return s.setAttribute(`position`,new wt(n,3)),s.setAttribute(`uv`,new wt(r,2)),s.setAttribute(`normal`,new wt(i,3)),s.setIndex(a),s.computeVertexNormals(),s}function af(e,t){let n=e.width/2,r=[],i=[],a=[],o=[],s=tf(e);for(let o=0;o<=s;o++){let c=nf(e,o),l=(o===s?e.length:c.s)/6,u=c.x+c.rx*t,d=c.z+c.rz*t;r.push(u-c.rx*n,c.y+.04,d-c.rz*n),r.push(u+c.rx*n,c.y+.04,d+c.rz*n),i.push(0,l,1,l),a.push(0,1,0,0,1,0)}for(let e=0;e<s;e++){let t=e*2;o.push(t,t+1,t+2,t+1,t+3,t+2)}let c=new zt;return c.setAttribute(`position`,new wt(r,3)),c.setAttribute(`uv`,new wt(i,2)),c.setAttribute(`normal`,new wt(a,3)),c.setIndex(o),c.computeVertexNormals(),c}function of(e,t,n,r=.02){let i=[],a=[],o=[],s=tf(e);for(let o=0;o<=s;o++){let c=nf(e,o),l=(o===s?e.length:c.s)/8,u=c.x+c.rx*t,d=c.z+c.rz*t;i.push(u-c.rx*n,c.y+r,d-c.rz*n),i.push(u+c.rx*n,c.y+r,d+c.rz*n),a.push(0,l,1,l)}for(let e=0;e<s;e++){let t=e*2;o.push(t,t+1,t+2,t+1,t+3,t+2)}let c=new zt;return c.setAttribute(`position`,new wt(i,3)),c.setAttribute(`uv`,new wt(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function sf(e,t){let n=e.width/2+.42,r=n+3.2,i=[],a=[],o=[],s=tf(e);for(let o=0;o<=s;o++){let c=nf(e,o),l=(o===s?e.length:c.s)/8,u=c.rx*t,d=c.rz*t;i.push(c.x+u*n,c.y+.18,c.z+d*n),i.push(c.x+u*r,c.y+.18,c.z+d*r),a.push(0,l,1,l)}for(let e=0;e<s;e++){let t=e*2;o.push(t,t+1,t+2,t+1,t+3,t+2)}let c=new zt;return c.setAttribute(`position`,new wt(i,3)),c.setAttribute(`uv`,new wt(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function cf(e,t,n=.28,r=.28,i=.08,a=0){let o=e.width/2-n,s=[],c=[],l=tf(e);for(let n=0;n<=l;n++){let c=nf(e,n),l=c.x+c.rx*(o*t+a),u=c.z+c.rz*(o*t+a);s.push(l-c.rx*r,c.y+i,u-c.rz*r),s.push(l+c.rx*r,c.y+i,u+c.rz*r)}for(let e=0;e<l;e++){let t=e*2;c.push(t,t+1,t+2,t+1,t+3,t+2)}let u=new zt;return u.setAttribute(`position`,new wt(s,3)),u.setIndex(c),u.computeVertexNormals(),u}function lf(e){return e.id===`ayalon`?8:e.id===`telaviv`||e.id===`namal`||e.id===`gushdan`||e.id===`hw1`||e.id===`hw2`||e.id===`hw6`||e.theme===`highway`?4:(e.id===`rothschild`||e.id===`hayarkon`||e.id,3)}function uf(e,t,n=0){let r=e.width/2,i=r+.55,a=[],o=[],s=[],c=tf(e);for(let s=0;s<=c;s++){let l=nf(e,s),u=(s===c?e.length:l.s)/2.4,d=l.rx*t,f=l.rz*t;a.push(l.x+d*r+l.rx*n,l.y+.06,l.z+f*r+l.rz*n),a.push(l.x+d*i+l.rx*n,l.y+.58,l.z+f*i+l.rz*n),o.push(0,u,1,u)}for(let e=0;e<c;e++){let t=e*2;s.push(t,t+1,t+2,t+1,t+3,t+2)}let l=new zt;return l.setAttribute(`position`,new wt(a,3)),l.setAttribute(`uv`,new wt(o,2)),l.setIndex(s),l.computeVertexNormals(),l}function df(e,t,n=0){let r=e.width/2+.62,i=r+.42,a=[],o=[],s=[],c=tf(e);for(let o=0;o<=c;o++){let l=nf(e,o),u=l.rx*t,d=l.rz*t;a.push(l.x+u*r+l.rx*n,l.y+.08,l.z+d*r+l.rz*n),a.push(l.x+u*i+l.rx*n,l.y+1.35,l.z+d*i+l.rz*n);let f=o/c*(e.length/2.4);s.push(0,f,1,f)}for(let e=0;e<c;e++){let t=e*2;o.push(t,t+1,t+2,t+1,t+3,t+2)}let l=new zt;return l.setAttribute(`position`,new wt(a,3)),l.setAttribute(`uv`,new wt(s,2)),l.setIndex(o),l.computeVertexNormals(),l}function ff(e,t){let n=e.samples,r=e.width/2+.48,i=[],a=[],o=[],s=n.length;for(let a=0;a<=s;a++){let c=n[a%s],l=c.rx*t,u=c.rz*t;i.push(c.x+l*r,c.y+.22,c.z+u*r),i.push(c.x+l*r,c.y+.72,c.z+u*r);let d=a/s*(e.length/3);o.push(0,d,1,d)}for(let e=0;e<s;e++){let t=e*2;a.push(t,t+1,t+2,t+1,t+3,t+2)}let c=new zt;return c.setAttribute(`position`,new wt(i,3)),c.setAttribute(`uv`,new wt(o,2)),c.setIndex(a),c.computeVertexNormals(),c}function pf(e,t){let n=e.samples,r=e.width/2+3.95,i=r+8.5,a=[],o=[],s=[],c=n.length;for(let s=0;s<=c;s++){let l=n[s%c],u=(s===c?e.length:l.s)/10,d=l.rx*t,f=l.rz*t;a.push(l.x+d*r,l.y+.03,l.z+f*r),a.push(l.x+d*i,l.y+.01,l.z+f*i),o.push(0,u,1,u)}for(let e=0;e<c;e++){let t=e*2;s.push(t,t+1,t+2,t+1,t+3,t+2)}let l=new zt;return l.setAttribute(`position`,new wt(a,3)),l.setAttribute(`uv`,new wt(o,2)),l.setIndex(s),l.computeVertexNormals(),l}function mf(e,t,n){let r=ft.degToRad(90-n.elevation),i=ft.degToRad(n.azimuth);t.setFromSphericalCoords(1,r,i);let a=e.material.uniforms;a.turbidity.value=n.turbidity,a.rayleigh.value=n.rayleigh,a.mieCoefficient.value=n.mieCoefficient,a.mieDirectionalG.value=n.mieDirectionalG,a.sunPosition.value.copy(t)}function hf(e,t,n,r){if(!e){r.copy(t);return}let i=ft.degToRad(46),a=ft.degToRad(n+172);r.setFromSphericalCoords(1,i,a)}function gf(e,t,n,r,i,a,o,s){t.color.setHex(e?6981808:11061480),t.groundColor.setHex(e?2761756:4870728),t.intensity=e?.52:.68,n.color.setHex(e?13161704:16773328),n.intensity=e?.38:1.12,n.position.copy(a).multiplyScalar(95),o.setHex(e?16760944:16767136),s&&(s.visible=!1),r.color.setHex(e?16760944:12900592),r.intensity=e?.48:.28,e?r.position.set(8,22,-10):(r.position.copy(a).multiplyScalar(-50),r.position.y=Math.abs(r.position.y)+30),i.color.setHex(e?4874368:11584728),i.intensity=e?.28:.32}function _f(){let e=1100,t=new Float32Array(e*3);for(let n=0;n<e;n++){let e=c(n,1)*Math.PI*2,r=Math.acos(c(n,2)*.78),i=640+c(n,3)*90;t[n*3]=i*Math.sin(r)*Math.cos(e),t[n*3+1]=i*Math.cos(r),t[n*3+2]=i*Math.sin(r)*Math.sin(e)}let n=new zt;n.setAttribute(`position`,new wt(t,3));let r=new tt({color:15659770,size:2.2,sizeAttenuation:!1,transparent:!0,opacity:.92,depthWrite:!1,fog:!1});return{mesh:new m(n,r),geo:n,mat:r}}async function vf(e,n,r,a,o=`clear`){let c=new lt,d=[],p=!1,m=new Set;for(let e of[bu(),xu(),Eu(),Du(),pu(),gu(),uu(),su(`city`),su(`stone`),su(`dirt`),su(`sand`),iu(`blue`),iu(`teal`),iu(`dark`),iu(`gold`),iu(`white`),tu(),Ql(),Yl(),ju(),Gl(`stop`),Gl(`yield`),Gl(`none`),Gl(`speed50`),Gl(`speed80`),Gl(`speed90`),Bl(),Vl(),Fl(),Il(),jl()])e&&m.add(e);let g=e=>(m.has(e)||d.push(e),e),_=t(e.seed),v=a,y=a?.9:.5,b=o,x=null,S=null,C=null,w=null,T=[],E=null,O=tn(e,v,b),k=new Cl;k.visible=!1;let A=new K,j=new K;mf(k,A,O),hf(v,A,e.sky.azimuth,j);let M=new Ke;c.add(M);let N=new U;N.castShadow=r,N.shadow.mapSize.set(r?2048:512,r?2048:512),N.shadow.camera.near=8,N.shadow.camera.far=220,N.shadow.camera.left=-58,N.shadow.camera.right=58,N.shadow.camera.top=58,N.shadow.camera.bottom=-58,N.shadow.bias=-6e-5,N.shadow.normalBias=.022,N.shadow.radius=v?.55:.85,N.shadow.blurSamples=4,c.add(N),c.add(N.target);let P=new U;P.castShadow=r,P.shadow.mapSize.set(r?1024:256,r?1024:256),P.shadow.camera.near=2,P.shadow.camera.far=90,P.shadow.camera.left=-18,P.shadow.camera.right=18,P.shadow.camera.top=18,P.shadow.camera.bottom=-18,P.shadow.bias=-4e-5,P.shadow.normalBias=.018,P.intensity=r?.04:0,c.add(P),c.add(P.target);let F=new U;c.add(F);let ee=new mt(16777215,.1);c.add(ee);let L=new D,R=null;if(r){let e=g(ef(128,`rgba(255,248,230,0.95)`,`rgba(255,210,140,0.28)`)),t=g(ef(64,`rgba(255,180,90,0.45)`,`rgba(255,120,40,0)`));R=new bl,R.addElement(new xl(e,190,0,L)),R.addElement(new xl(t,52,.18)),R.addElement(new xl(t,78,.36)),R.addElement(new xl(t,36,.58)),N.add(R)}gf(v,M,N,F,ee,j,L,R),v&&(e.theme===`manhattan`||e.theme===`park`)&&(M.color.setHex(6981832),M.intensity=.58,N.intensity=1.22,F.color.setHex(16734858),F.intensity=.55,ee.color.setHex(3820136),ee.intensity=.32);let te=_f();g(te.geo),g(te.mat),te.mesh.visible=v,te.mesh.frustumCulled=!1,c.add(te.mesh);let ne=g(new Ct({color:15265528,fog:!1})),re=new J(g(new W(12,16,16)),ne);re.position.copy(j).multiplyScalar(420),re.visible=v,re.frustumCulled=!1,c.add(re);let z=g(new Ct({color:13162736,transparent:!0,opacity:.18,depthWrite:!1,blending:2,fog:!1})),B=new J(g(new W(28,12,12)),z);B.position.copy(re.position),B.visible=v,c.add(B);let ie=g(new Ct({color:16774348,fog:!1,toneMapped:!1})),ae=new J(g(new W(12,16,16)),ie);ae.position.copy(j).multiplyScalar(900),ae.visible=!v,ae.frustumCulled=!1,c.add(ae);let V=g(new Ct({color:16771232,transparent:!0,opacity:.28,depthWrite:!1,blending:2,fog:!1,toneMapped:!1})),oe=new J(g(new W(28,12,12)),V);oe.position.copy(ae.position),oe.visible=!v,oe.frustumCulled=!1,c.add(oe);let se=g(new Ct({color:v?2771564:3972832,fog:!1,depthWrite:!1,side:1,toneMapped:!1})),ce=new J(g(new W(8200,40,20)),se);ce.frustumCulled=!1,ce.renderOrder=-2e3,c.add(ce);let le=420;for(let e of n.samples)le=Math.max(le,Math.hypot(e.x,e.z));let ue=e.id===`ayalon`?13685976:e.theme===`desert`?e.sand:e.theme===`stone`?15260872:e.theme===`carmel`?12896424:e.theme===`snow`?15791352:e.theme===`jaffa`?14865084:13946822,de=g(Yd(e.ground));de.wrapS=de.wrapT=h,de.repeat.set(90,90);let fe=new J(g(new pe(Math.max(e.id===`scopus`||e.id===`hermon`||e.id===`ramon`?4200:1200,le*(e.id===`scopus`?5.4:2.8)),Math.max(e.id===`scopus`||e.id===`hermon`||e.id===`ramon`?4200:1200,le*(e.id===`scopus`?5.4:2.8)))),g(new q({map:de,color:ue,roughness:.97,metalness:0,envMapIntensity:.12})));fe.rotation.x=-Math.PI/2,fe.position.y=-.4,fe.receiveShadow=!0,c.add(fe);let me=g(new Ct({color:v?924204:e.theme===`desert`||e.id===`ramon`?8893656:e.theme===`snow`||e.id===`hermon`?12113136:4889304,side:1,fog:!1,depthWrite:!1,toneMapped:!1})),he=new J(g(new W(8600,24,10,0,Math.PI*2,0,Math.PI*.54)),me);if(he.position.y=-80,he.frustumCulled=!1,c.add(he),e.theme===`carmel`||e.theme===`snow`||e.id===`ramon`||e.id===`jerusalem`||e.id===`scopus`||e.id===`hw1`||e.id===`masada`||e.id===`eilatmtn`||e.id===`golan`||e.id===`nazareth`||e.id===`tzfat`||e.id===`stellamaris`){let t=g(new q({color:e.id===`ramon`?11565642:e.id===`hermon`?13950438:e.id===`jerusalem`||e.id===`scopus`?12890250:4874808,roughness:.96,envMapIntensity:.18,flatShading:!0})),r=[],i=[],a=tf(n),o=e.id===`ramon`?280:e.id===`hermon`?250:e.theme===`carmel`?160:78,s=0,l=0,u=!1;if(e.id===`ramon`){let e=pr(30.585,34.802);s=e.x,l=e.z}else if(e.id===`hermon`){let e=Gt(33.3112,35.79);s=e.x,l=e.z,u=!0}else e.water?(s=e.water.x,l=e.water.z):(s=n.samples[n.samples.length-1].x,l=n.samples[n.samples.length-1].z);for(let t=0;t<=a;t++){let i=nf(n,t),a=n.width/2+1.2,c=i.rx*(s-i.x)+i.rz*(l-i.z)>=0?1:-1;u&&(c=-c);let d=e.id===`ramon`?i.y+180+Math.min(110,i.y*.7):e.id===`masada`?i.y+28+i.y*.35:e.id===`hermon`?i.y+148+i.y*.6:e.theme===`carmel`?i.y+78:i.y+8,f=Math.max(-.35,i.y*.05-2),p=c===-1?f:d,m=c===1?f:d;r.push(i.x-i.rx*a,i.y-.15,i.z-i.rz*a),r.push(i.x-i.rx*o,p,i.z-i.rz*o),r.push(i.x+i.rx*a,i.y-.15,i.z+i.rz*a),r.push(i.x+i.rx*o,m,i.z+i.rz*o)}for(let e=0;e<a;e++){let t=e*4;i.push(t,t+1,t+4,t+1,t+5,t+4),i.push(t+2,t+6,t+3,t+3,t+6,t+7)}let d=new zt;d.setAttribute(`position`,new wt(r,3)),d.setIndex(i),d.computeVertexNormals();let f=new J(g(d),t);f.receiveShadow=!0,c.add(f)}let ge=lf(e),ye=Hd(ge);ut(ge)||d.push(ye.map,ye.roughnessMap,ye.bumpMap);let be=g(new ct({map:ye.map,roughnessMap:ye.roughnessMap,bumpMap:ye.bumpMap,bumpScale:.36,color:16777215,roughness:.48,metalness:0,envMapIntensity:.85,clearcoat:.28,clearcoatRoughness:.4,reflectivity:.28}));be.userData.lanes=ge,be.customProgramCacheKey=()=>`rush-road-${ge}`,kl(be);let xe=new J(g(rf(n)),be);xe.receiveShadow=!0,c.add(xe);let Se=g(new Ct({color:16777215,fog:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));c.add(new J(g(cf(n,1,.16,.46)),Se)),c.add(new J(g(cf(n,-1,.16,.46)),Se));{let t=g(new G(.2,.045,4.4)),r=g(new Ct({color:16251124,fog:!1})),i=e.id===`ayalon`?[0,n.width+18]:[0],a=Math.min(2800,Math.floor(n.samples.length/2)*(ge-1)*i.length),o=new Lt(t,r,Math.max(1,a)),s=0,l=n.width/2,u=n.width/ge,d=Math.max(2,Math.floor(n.samples.length/140));for(let e of i)for(let t=0;t<n.samples.length&&s<a;t+=d){let r=n.samples[t];if(Math.floor(r.s/9)%2!=0)for(let t=1;t<ge&&s<a;t++){let n=-l+t*u;$.position.set(r.x+r.rx*(e+n),r.y+.09,r.z+r.rz*(e+n)),$.rotation.set(0,Math.atan2(r.tx,r.tz),0),$.scale.set(1,1,1),$.updateMatrix(),o.setMatrixAt(s++,$.matrix)}}o.count=s,o.instanceMatrix.needsUpdate=!0,c.add(o)}{let t=g(new Ct({color:16761856,fog:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));if(c.add(new J(g(cf(n,1,.85,.1)),t)),c.add(new J(g(cf(n,-1,.85,.1)),t)),e.id===`ayalon`){let e=n.width+18,r=new J(g(af(n,e)),be);r.receiveShadow=!0,c.add(r),c.add(new J(g(cf(n,1,.16,.46,.08,e)),Se)),c.add(new J(g(cf(n,-1,.16,.46,.08,e)),Se)),c.add(new J(g(cf(n,1,.62,.09,.08,e)),t)),c.add(new J(g(cf(n,-1,.62,.09,.08,e)),t));let i=n.width/2+9,a=g(Yd(0));a.wrapS=a.wrapT=h,a.repeat.set(6,80);let o=new J(g(of(n,i,8.64)),g(new q({map:a,color:6973536,roughness:.96,metalness:0})));o.receiveShadow=!0,c.add(o);let s=new I;s.moveTo(-.3,0),s.lineTo(.3,0),s.lineTo(.14,.38),s.lineTo(.08,.88),s.lineTo(-.08,.88),s.lineTo(-.14,.38),s.closePath();let l=g(new Qe(s,{depth:2.6,bevelEnabled:!1}));l.translate(0,0,-1.3),l.computeVertexNormals();let u=g(new q({color:11840160,roughness:.86,metalness:0})),d=[-n.width/2-.5,n.width/2+.5,i,e-n.width/2-.5,e+n.width/2+.5],f=new Lt(l,u,160*d.length),p=0,m=Math.max(1,Math.floor(n.samples.length/160));for(let e=0;e<n.samples.length&&p<160*d.length;e+=m){let t=n.samples[e];for(let e of d){if(p>=160*d.length)break;$.position.set(t.x+t.rx*e,t.y+.06,t.z+t.rz*e),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1.2,1.4,1),$.updateMatrix(),f.setMatrixAt(p++,$.matrix)}}f.count=p,f.instanceMatrix.needsUpdate=!0,c.add(f);let _=g(new G(.14,.1,3.4)),v=g(new q({color:10133670,metalness:.72,roughness:.28})),y=new Lt(_,v,440),b=0,x=Math.max(1,Math.floor(n.samples.length/220));for(let e=0;e<n.samples.length&&b<440;e+=x){let t=n.samples[e];for(let e of[-1.15,1.15])$.position.set(t.x+t.rx*(i+e),t.y+.16,t.z+t.rz*(i+e)),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),y.setMatrixAt(b++,$.matrix)}y.count=b,y.instanceMatrix.needsUpdate=!0,c.add(y);let S=g(new G(.05,.05,3.4)),C=g(new Ct({color:2895410})),w=g(new G(.18,6.2,.18)),T=g(new q({color:6975606,metalness:.55,roughness:.4})),E=new Lt(S,C,200),D=new Lt(w,T,48),O=0,k=Math.max(1,Math.floor(n.samples.length/200));for(let e=0;e<n.samples.length&&O<200;e+=k){let t=n.samples[e];$.position.set(t.x+t.rx*i,t.y+5.35,t.z+t.rz*i),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),E.setMatrixAt(O++,$.matrix)}E.count=O,E.instanceMatrix.needsUpdate=!0,c.add(E);let A=0,j=Math.max(1,Math.floor(n.samples.length/48));for(let e=0;e<n.samples.length&&A<48;e+=j){let t=n.samples[e];$.position.set(t.x+t.rx*(i+2.4),t.y+3.1,t.z+t.rz*(i+2.4)),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),D.setMatrixAt(A++,$.matrix)}D.count=A,D.instanceMatrix.needsUpdate=!0,D.castShadow=!0,c.add(D);let M=g(new G(.22,3.4,4.4)),N=g(new q({color:13157562,roughness:.9,metalness:0})),P=[-n.width/2-1.4,e+n.width/2+1.4],F=new Lt(M,N,90*P.length),ee=0,L=Math.max(1,Math.floor(n.samples.length/90));for(let e=0;e<n.samples.length&&ee<90*P.length;e+=L){let t=n.samples[e];for(let e of P){if(ee>=90*P.length)break;$.position.set(t.x+t.rx*e,t.y+1.72,t.z+t.rz*e),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),F.setMatrixAt(ee++,$.matrix)}}F.count=ee,F.instanceMatrix.needsUpdate=!0,F.castShadow=!0,F.receiveShadow=!0,c.add(F);let R=g(new G(.1,.62,.9)),te=g(new Ct({color:12851224,fog:!1})),ne=g(new Ct({color:15987178,fog:!1})),re=[-n.width/2-.62,e+n.width/2+.62],z=new Lt(R,te,100*re.length),B=new Lt(R,ne,100*re.length),ie=0,ae=0,V=0,oe=Math.max(1,Math.floor(n.samples.length/100));for(let e=0;e<n.samples.length&&V<100*re.length;e+=oe){let t=n.samples[e];for(let e of re){if(V>=100*re.length)break;$.position.set(t.x+t.rx*e,t.y+.95,t.z+t.rz*e),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),V%2==0?z.setMatrixAt(ie++,$.matrix):B.setMatrixAt(ae++,$.matrix),V+=1}}z.count=ie,B.count=ae,z.instanceMatrix.needsUpdate=!0,B.instanceMatrix.needsUpdate=!0,c.add(z,B)}}{let t=jl(),r=g(new pe(2.8,3.6));r.rotateX(-Math.PI/2);let i=g(new Ct({map:t??void 0,color:t?16777215:16773248,transparent:!!t,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,fog:!1,side:2})),a=Math.min(e.id===`ayalon`?48:28,Math.max(8,Math.floor(n.samples.length/(e.id===`ayalon`?9:14)))),o=new Lt(r,i,a),s=Math.max(1,Math.floor(n.samples.length/a)),l=0,u=e.id===`ayalon`?1.55:Math.min(1.2,Math.max(.72,n.width/18));for(let e=2;e<n.samples.length-2&&l<a;e+=s){let t=n.samples[e];$.position.set(t.x,t.y+.06,t.z),$.scale.set(u,1,u),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.updateMatrix(),o.setMatrixAt(l++,$.matrix)}if(o.count=l,o.instanceMatrix.needsUpdate=!0,c.add(o),e.id===`ayalon`){let e=n.width+18,t=new Lt(r,i,a),o=0;for(let r=2;r<n.samples.length-2&&o<a;r+=s){let i=n.samples[r];$.position.set(i.x+i.rx*e,i.y+.06,i.z+i.rz*e),$.scale.set(u,1,u),$.rotation.set(0,Math.atan2(i.tx,i.tz)+Math.PI,0),$.updateMatrix(),t.setMatrixAt(o++,$.matrix)}t.count=o,t.instanceMatrix.needsUpdate=!0,c.add(t)}}let Ce=e.theme===`bauhaus`||e.theme===`stone`||e.theme===`jaffa`||e.id===`telaviv`||e.id===`rothschild`||e.id===`hayarkon`,we=g(new G(.42,.035,2.4)),Te=g(new Ct({color:16250094})),Ee=g(new G(n.width*.92,.04,.38)),H=(e,t)=>{let r=Math.min(n.samples.length-1,Math.floor(e*n.samples.length)),i=n.samples[r],a=Math.atan2(i.tx,i.tz);if(t){let e=Math.max(6,Math.round(n.width/.85));for(let t=0;t<e;t++){let r=-n.width/2+.5+t*(n.width/e),o=new J(we,Te);o.position.set(i.x+i.rx*r,i.y+.07,i.z+i.rz*r),o.rotation.y=a,c.add(o)}}else{let e=new J(Ee,Te);e.position.set(i.x,i.y+.07,i.z),e.rotation.y=a,c.add(e)}};H(.012,!1),H(.022,!0),Ce&&(H(.48,!1),H(.5,!0));let De=g(new Ct({map:ju()??void 0,color:ju()?2763824:1842720,transparent:!0,opacity:.34,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})),Oe=g(new G(Math.max(1.6,n.width/Math.max(2,ge)*.55),.02,4.2)),ke=Math.min(180,Math.floor(n.length/8)),Ae=new Lt(Oe,De,ke),je=n.width/2-n.width/ge/2,Me=0;for(let e=0;e<n.samples.length&&Me<ke;e+=Math.max(2,Math.floor(n.samples.length/ke))){let t=n.samples[e];$.position.set(t.x+t.rx*je,t.y+.05,t.z+t.rz*je),$.scale.set(1,1,1),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.updateMatrix(),Ae.setMatrixAt(Me++,$.matrix)}if(Ae.count=Me,Ae.instanceMatrix.needsUpdate=!0,c.add(Ae),T.push(Ae),e.id===`ayalon`){let e=n.width+18,t=new Lt(Oe,De,ke),r=0,i=Math.max(2,Math.floor(n.samples.length/ke));for(let a=0;a<n.samples.length&&r<ke;a+=i){let i=n.samples[a];$.position.set(i.x+i.rx*(e-je),i.y+.05,i.z+i.rz*(e-je)),$.scale.set(1,1,1),$.rotation.set(0,Math.atan2(i.tx,i.tz)+Math.PI,0),$.updateMatrix(),t.setMatrixAt(r++,$.matrix)}t.count=r,t.instanceMatrix.needsUpdate=!0,c.add(t),T.push(t)}let Ne=g(Gd(e.theme===`stone`?`stone`:e.theme===`desert`?`sand`:e.theme===`carmel`||e.theme===`snow`?`dirt`:`city`)),Pe=g(new q({map:Ne,color:16777215,roughness:.52,metalness:.05,envMapIntensity:.2,emissive:3805708,emissiveIntensity:.14}));if(c.add(new J(g(uf(n,1)),Pe)),c.add(new J(g(uf(n,-1)),Pe)),e.id===`ayalon`){let e=n.width+18;c.add(new J(g(uf(n,1,e)),Pe)),c.add(new J(g(uf(n,-1,e)),Pe))}{let t=g(new G(.2,.09,.32)),r=g(new Ct({color:16773808,fog:!1})),i=e.id===`ayalon`?[0,n.width+18]:[0],a=Math.min(e.id===`ayalon`?560:320,Math.max(24,Math.floor(n.samples.length/1.5)*i.length)),o=new Lt(t,r,a),s=0,l=Math.max(2,Math.floor(n.samples.length/(a/(2*i.length))));for(let e of i)for(let t=0;t<n.samples.length&&s<a;t+=l){let r=n.samples[t],i=n.width/2-.4;for(let t of[1,-1]){if(s>=a)break;$.position.set(r.x+r.rx*(e+i*t),r.y+.14,r.z+r.rz*(e+i*t)),$.scale.set(1,1,1),$.rotation.set(0,Math.atan2(r.tx,r.tz),0),$.updateMatrix(),o.setMatrixAt(s++,$.matrix)}}o.count=s,o.instanceMatrix.needsUpdate=!0,c.add(o)}let Fe=su(`city`),Ie=Fe?g(Fe.clone()):void 0;Ie&&(Ie.wrapS=Ie.wrapT=h,Ie.needsUpdate=!0);let Le=g(new q({map:Ie,color:14209732,roughness:.58,metalness:.06,envMapIntensity:.4}));if(e.theme!==`desert`&&e.theme!==`snow`&&e.id!==`rothschild`&&e.theme!==`stone`&&e.theme!==`jaffa`&&e.theme!==`carmel`){c.add(new J(g(df(n,1)),Le)),c.add(new J(g(df(n,-1)),Le));let t=g(new Ct({color:16052458,fog:!1}));if(c.add(new J(g(cf(n,1,-.78,.14,1.38)),t)),c.add(new J(g(cf(n,-1,-.78,.14,1.38)),t)),e.id===`ayalon`){let e=n.width+18;c.add(new J(g(df(n,1,e)),Le)),c.add(new J(g(df(n,-1,e)),Le)),c.add(new J(g(cf(n,1,-.78,.14,1.38,e)),t)),c.add(new J(g(cf(n,-1,-.78,.14,1.38,e)),t))}}let Re=g(Jd());Re.repeat.set(1,8);let ze=g(new q({map:Re,roughness:.88,metalness:.04,envMapIntensity:.3}));if(e.theme!==`highway`&&e.id!==`ayalon`&&e.theme!==`desert`&&e.theme!==`snow`&&e.theme!==`carmel`){let e=new J(g(sf(n,1)),ze),t=new J(g(sf(n,-1)),ze);e.receiveShadow=!0,t.receiveShadow=!0,c.add(e,t)}let Be=g(new q({color:e.sand,roughness:.96,metalness:.02,envMapIntensity:.18}));if(c.add(new J(g(pf(n,1)),Be)),c.add(new J(g(pf(n,-1)),Be)),e.theme!==`desert`&&e.theme!==`snow`&&e.id!==`ramon`&&e.id!==`hermon`&&e.id!==`masada`&&e.id!==`deadsea`){let t=e.theme===`highway`||e.id===`ayalon`||e.id===`hw1`||e.id===`hw2`||e.id===`hw6`,r=t?[`speed90`,`speed80`,`none`]:[`stop`,`speed50`,`yield`],i={};for(let e of[`stop`,`yield`,`none`,`speed50`,`speed80`,`speed90`])i[e]=g(Zd(e));let a=g(new q({color:9080984,roughness:.55,metalness:.4})),o=g(new Y(.07,.09,3.2,6));o.translate(0,1.6,0);let s=t?10:14,l=Math.max(3,Math.floor(n.samples.length/s)),u=0;for(let e=8;e<n.samples.length-8&&u<s;e+=l){let t=n.samples[e],s=r[u%r.length],l=u%2?1:-1,d=n.width/2+1.85,f=t.x+t.rx*d*l,p=t.z+t.rz*d*l,m=Math.atan2(t.tx,t.tz)+(l>0?0:Math.PI),h=new J(o,a);h.position.set(f,t.y,p),c.add(h);let g=new J(new pe(s===`stop`||s===`yield`?1.15:.95,s===`stop`||s===`yield`?1.15:.95),new Ct({map:i[s],transparent:!0,depthWrite:!1,fog:!1}));g.position.set(f,t.y+3.05,p),g.rotation.y=m,c.add(g),u++}if(e.id===`ayalon`){let e=n.width+18,t=0;for(let u=12;u<n.samples.length-8&&t<s;u+=l){let s=n.samples[u],l=r[t%r.length],d=t%2?1:-1,f=e+n.width/2+1.85,p=s.x+s.rx*(d>0?f:e-n.width/2-1.85),m=s.z+s.rz*(d>0?f:e-n.width/2-1.85),h=Math.atan2(s.tx,s.tz)+(d>0?Math.PI:0),g=new J(o,a);g.position.set(p,s.y,m),c.add(g);let _=new J(new pe(.95,.95),new Ct({map:i[l],transparent:!0,depthWrite:!1,fog:!1}));_.position.set(p,s.y+3.05,m),_.rotation.y=h,c.add(_),t++}}if(!t){let e=g(new q({color:1711128,roughness:.5})),t=g(new Ct({color:16722474})),r=g(new Ct({color:16761896})),i=g(new Ct({color:v?4063082:1739320}));for(let s of[.22,.71]){let l=nf(n,Math.floor(s*tf(n))),u=n.width/2+1.7,d=l.x+l.rx*u,f=l.z+l.rz*u,p=new J(o,a);p.position.set(d,l.y,f),c.add(p);let m=new J(new G(.38,1.05,.28),e);m.position.set(d,l.y+3.35,f),c.add(m);let h=(e,t)=>{let n=new J(new W(.12,8,6),t);n.position.set(d,l.y+e,f+l.tz*.16),c.add(n)};h(3.62,t),h(3.35,r),h(3.08,i)}}}let Ve=g(new ct({color:10134442,metalness:.82,roughness:.28,roughnessMap:ut(3)?.roughnessMap,envMapIntensity:1.25}));e.theme!==`desert`&&e.theme!==`snow`&&e.theme!==`carmel`&&e.id!==`ayalon`&&(c.add(new J(g(ff(n,1)),Ve)),c.add(new J(g(ff(n,-1)),Ve)));let He=null,Ue=!0;if(r){He=new Sl(new pe(42,80),{clipBias:.003,textureWidth:768,textureHeight:768,color:v?4871528:9085108}),He.rotation.x=-Math.PI/2,He.position.y=.026;let e=He.material;e.transparent=!0,e.opacity=v?.36:.22,c.add(He),d.push({dispose(){He?.dispose()}})}let We=e.waters?.length?e.waters:e.water?[e.water]:[],Ge=ll(e,n,We),qe=[],Je=g(new Y(.08,.1,.78,5));Je.translate(0,.4,0);let Ye=g(new q({color:3027510,metalness:.55,roughness:.42})),Xe=[];if(e.theme!==`desert`&&e.theme!==`snow`&&e.theme!==`carmel`&&e.id!==`ayalon`)for(let e=0;e<n.samples.length;e+=5){let t=n.samples[e],r=dl(t.x,t.z,Ge);if(r&&r.dist<r.street.half+5)continue;let i=n.width/2+.48;Xe.push({x:t.x+t.rx*i,y:t.y,z:t.z+t.rz*i}),Xe.push({x:t.x-t.rx*i,y:t.y,z:t.z-t.rz*i})}if(Xe.length){let e=new Lt(Je,Ye,Xe.length);e.castShadow=r;for(let t=0;t<Xe.length;t++){let n=Xe[t];$.position.set(n.x,n.y,n.z),$.scale.set(1,1,1),$.rotation.set(0,0,0),$.updateMatrix(),e.setMatrixAt(t,$.matrix)}e.instanceMatrix.needsUpdate=!0,c.add(e)}if(Ge.length){let e=g(new G(1,1,1)),t=new Lt(e,be,Ge.length);t.receiveShadow=!0;for(let e=0;e<Ge.length;e++){let n=Ge[e],r=n.bx-n.ax,i=n.bz-n.az,a=Math.hypot(r,i)||1;$.position.set((n.ax+n.bx)*.5,.045,(n.az+n.bz)*.5),$.scale.set(n.half*2,.06,a),$.rotation.set(0,Math.atan2(r,i),0),$.updateMatrix(),t.setMatrixAt(e,$.matrix)}t.instanceMatrix.needsUpdate=!0,c.add(t);let n=g(new G(.28,.04,1.1)),r=g(new q({color:15920872,roughness:.55,emissive:2236440,emissiveIntensity:v?.35:0})),i=Math.min(Ge.length*5,140),a=new Lt(n,r,i),o=0;for(let e of Ge){let t=e.bx-e.ax,n=e.bz-e.az,r=Math.hypot(t,n)||1,s=t/r,c=n/r,l=Math.atan2(t,n);for(let t=0;t<5&&o<i;t++){let n=e.ax+s*(1.2+t*.55),r=e.az+c*(1.2+t*.55);$.position.set(n,.08,r),$.scale.set(1,1,1),$.rotation.set(0,l+Math.PI/2,0),$.updateMatrix(),a.setMatrixAt(o,$.matrix),o+=1}}a.count=o,a.instanceMatrix.needsUpdate=!0,c.add(a)}let Ze,$e=[],et=[];if(We.length){let t=g(Qd());for(let e of We){let n=g(new ct({color:e.color,roughness:v?.03:.08,metalness:.08,transparent:!0,opacity:v?.9:.82,envMapIntensity:v?2.6:1.7,clearcoat:1,clearcoatRoughness:.06,ior:1.33,normalMap:t,normalScale:new Bt(1.15,1.15)}));v&&n.color.multiplyScalar(.65);let r=new J(g(new pe(Math.max(e.w*1.4,900),Math.max(e.d,1600),8,8)),n);r.rotation.x=-Math.PI/2,r.position.set(e.x,-.12,e.z),c.add(r),$e.push(r),et.push(n),Ze||=r}let n=We[0],r=new J(g(new pe(Math.max(n.w*.55,420),Math.max(n.d,2200))),g(new q({color:e.sand,roughness:1,envMapIntensity:.2})));r.rotation.x=-Math.PI/2,r.position.set(n.x+n.w*.28,-.18,n.z),e.theme!==`manhattan`&&e.theme!==`park`&&c.add(r);let i=new J(g(new pe(n.w*.14,n.d*.92)),g(new Ct({map:g(Xd()),transparent:!0,opacity:.82,depthWrite:!1})));i.rotation.x=-Math.PI/2,i.position.set(n.x+n.w*.14,-.03,n.z),e.theme!==`manhattan`&&e.theme!==`park`&&c.add(i)}if(e.id===`ayalon`){let e=g(Qd()),t=g(new ct({color:v?1718856:2779768,roughness:.06,metalness:.06,transparent:!0,opacity:.84,envMapIntensity:v?2.2:1.5,clearcoat:1,clearcoatRoughness:.08,ior:1.33,normalMap:e,normalScale:new Bt(.9,.9)})),r=n.width/2+9-5.2,i=new J(g(of(n,r,2.2,-.16)),t);i.receiveShadow=!0,c.add(i),$e.push(i),et.push(t);let a=g(new G(.32,1.35,4.6)),o=g(new q({color:11841702,roughness:.9,metalness:0})),s=[r-2.35,r+2.35],l=new Lt(a,o,220),u=0,d=Math.max(1,Math.floor(n.samples.length/110));for(let e=0;e<n.samples.length&&u<220;e+=d){let t=n.samples[e];for(let e of s){if(u>=220)break;$.position.set(t.x+t.rx*e,t.y+.55,t.z+t.rz*e),$.rotation.set(0,Math.atan2(t.tx,t.tz),0),$.scale.set(1,1,1),$.updateMatrix(),l.setMatrixAt(u++,$.matrix)}}l.count=u,l.instanceMatrix.needsUpdate=!0,l.castShadow=!0,l.receiveShadow=!0,c.add(l)}for(let t of e.clearZones??[]){let n=new J(g(new pe(t.w,t.d)),g(new q({color:e.theme===`park`||e.id===`manhattan`?3828292:e.ground,roughness:.95,envMapIntensity:.2})));n.rotation.x=-Math.PI/2,n.position.set(t.x,-.28,t.z),n.receiveShadow=!0,c.add(n)}let tt=e.city===`nyc`,nt=tt?await l(()=>import(`./nyc-canvas-B629CVT2.js`),__vite__mapDeps([0,1,2])):null,it=nt?g(nt.facadeTexture(e.theme,!1)):null,at=nt?g(nt.facadeTexture(e.theme,!0)):null,ot=nt?g(nt.windowEmitTexture()):null,st=g(new G(1,1,1));st.translate(0,.5,0);let dt=g(new q({map:!tt||e.theme===`jaffa`?null:v?at:it,emissive:new D(!tt||e.theme===`jaffa`?0:v?16763e3:0),emissiveMap:!tt||e.theme===`jaffa`?null:ot,emissiveIntensity:!tt||e.theme===`jaffa`?0:v?e.theme===`manhattan`?2.6:1.35:0,roughness:e.theme===`jaffa`?.86:.68,metalness:v?.16:.08,envMapIntensity:v?.95:.5})),pt=e.id===`timessquare`,ht=r?e.theme===`manhattan`?pt?240:200:160:e.theme===`manhattan`?280:220,gt=[],_t=e.id===`manhattan`?-90:-200,vt=e.id===`manhattan`?90:200;e.id,e.id;let yt=e.theme===`desert`||e.theme===`highway`||e.theme===`snow`?18:e.theme===`port`?16:e.theme===`jaffa`?11:e.theme===`manhattan`?pt?9:14:e.theme===`park`?16:13,bt=(e,t)=>{for(let n of We)if(Math.abs(e-n.x)<n.w*.42&&Math.abs(t-n.z)<n.d*.42)return!0;return!1},xt=(t,n)=>{for(let r of e.clearZones??[])if(Math.abs(t-r.x)<r.w*.5&&Math.abs(n-r.z)<r.d*.5)return!0;return!1};if((e.id===`hayarkon`||e.id===`namal`||e.id===`netanya`||e.id===`herzliya`||e.id===`eilat`||e.id===`batyam`||e.id===`ashkelon`||e.id===`nahariya`||e.id===`oldjaffa`||e.id===`gushdan`)&&We.length){let e=g(new Y(.16,.34,8.2,8)),t=g(new q({map:g(qd()),color:5914672,roughness:.92})),i=g(new f(.42,4.1,6));i.translate(0,-1.75,0);let a=g(new q({map:g(Kd()),color:3832370,roughness:.72,side:0,depthWrite:!0})),o=g(new W(.55,8,6)),s=new Lt(e,t,28),l=new Lt(i,a,336),u=new Lt(o,a,28);s.castShadow=r,l.castShadow=r;let d=We[0],p=0,m=0,h=Math.max(4,Math.floor(n.samples.length/28));for(let e=0;e<n.samples.length&&p<28;e+=h){let t=n.samples[e],r=n.width/2+7.4,i=Math.hypot(t.x+t.rx*r-d.x,t.z+t.rz*r-d.z)<Math.hypot(t.x-t.rx*r-d.x,t.z-t.rz*r-d.z)?1:-1,a=t.x+t.rx*r*i,o=t.z+t.rz*r*i;if(!(bt(a,o)||xt(a,o))){$.position.set(a,t.y+4.1,o),$.scale.set(1,1,1),$.rotation.set(0,0,0),$.updateMatrix(),s.setMatrixAt(p,$.matrix),$.position.set(a,t.y+8.05,o),$.scale.set(1,1,1),$.updateMatrix(),u.setMatrixAt(p,$.matrix);for(let e=0;e<12;e++){let n=e/12*Math.PI*2;$.position.set(a,t.y+8.05,o),$.scale.set(.95+e%3*.1,1,1),$.rotation.set(1.02,n,.1),$.updateMatrix(),l.setMatrixAt(m,$.matrix),m++}p++}}s.count=p,l.count=m,u.count=p,s.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,u.instanceMatrix.needsUpdate=!0,c.add(s,l,u)}let St=()=>e.theme===`desert`?4+_()*10:e.theme===`jaffa`?3.4+_()*4.2:e.theme===`stone`?4.2+_()*7.5:e.theme===`carmel`?3.6+_()*5.5:e.theme===`port`?5+_()*14:e.theme===`highway`?16+_()*38:e.theme===`manhattan`?18+_()*48+(e.id===`timessquare`?8:0):e.theme===`park`?14+_()*26:e.theme===`snow`?4+_()*8:11+_()*26,Tt=e.theme===`highway`||e.theme===`desert`||e.theme===`snow`?14:7,Et=0,Dt=0;for(let e of n.samples)Et+=e.x,Dt+=e.z;Et/=n.samples.length,Dt/=n.samples.length;for(let t=0;t<n.samples.length&&gt.length<ht*.7&&e.city===`nyc`;t+=Tt){let r=n.samples[t];if(!(r.y>8))for(let t of[-1,1]){let i=n.width/2+16.5+_()*2.2,a=r.x+r.rx*i*t,o=r.z+r.rz*i*t;if(bt(a,o)||xt(a,o))continue;let s=dl(a,o,Ge);s&&s.dist<s.street.half+6||gt.push({x:a,z:o,y:r.y,sx:e.theme===`jaffa`?5.2+_()*2.8:e.theme===`manhattan`?10+_()*6:10+_()*4,sy:St(),sz:e.theme===`jaffa`?5.2+_()*2.6:e.theme===`manhattan`?8+_()*5:7+_()*3,rot:Math.atan2(-r.rx*t,-r.rz*t)})}}for(let t=_t;t<vt&&gt.length<ht;t+=yt)for(let r=-200;r<200&&gt.length<ht;r+=yt){if(e.city!==`nyc`)continue;let i=t+(_()-.5)*(e.theme===`manhattan`?3:6),a=r+(_()-.5)*(e.theme===`manhattan`?3:6);if(bt(i,a)||xt(i,a))continue;let o=dl(i,a,Ge);if(o&&o.dist<o.street.half+(pt?3.2:7))continue;let s=Q(n.samples,i,a,0);if(s.dist<n.width/2+(pt?8:16))continue;let c=s.index/n.samples.length;if((c<.05||c>.95)&&s.dist<n.width/2+16||s.dist>(e.id===`manhattan`?90:140))continue;let l=n.samples[s.index];gt.push({x:i,z:a,y:l.y,sx:e.theme===`jaffa`?4.8+_()*2.4:e.theme===`manhattan`?8+_()*7:7+_()*6,sy:St(),sz:e.theme===`jaffa`?4.8+_()*2.4:e.theme===`manhattan`?8+_()*7:7+_()*6,rot:Math.atan2(l.x-i,l.z-a)})}let Ot=new Lt(st,dt,gt.length);Ot.castShadow=r,Ot.receiveShadow=!0,Ot.instanceMatrix.setUsage(u);let kt=e.theme===`stone`?[13350810,12032632,13943460]:e.theme===`desert`?[14730394,13213808,14200954]:e.theme===`carmel`?[15656664,14274754,13156530]:e.theme===`jaffa`?[12096096,12886128,10910798,13808780,10120776]:e.theme===`port`?[13156532,11577496,10130056]:e.theme===`highway`?[15265522,13687008,15922936,13161692]:e.theme===`manhattan`?[13161696,10135732,14542058,6978184,15262940]:e.theme===`park`?[15261908,13945016,13154468,15789284]:e.theme===`snow`?[16054524,14739696,13687008]:[15920868,15261906,14472390,16249578];for(let e=0;e<gt.length;e++){let t=gt[e];$.position.set(t.x,t.y+t.sy*.5,t.z),$.scale.set(t.sx,t.sy,t.sz),$.rotation.set(0,t.rot,0),$.updateMatrix(),Ot.setMatrixAt(e,$.matrix),Ot.setColorAt(e,Vd.setHex(kt[e%kt.length]))}if(Ot.instanceMatrix.needsUpdate=!0,Ot.instanceColor&&(Ot.instanceColor.needsUpdate=!0),c.add(Ot),e.theme===`jaffa`){let e=g(new f(1,1,4)),t=g(new q({color:10771002,roughness:.82,flatShading:!0})),n=new Lt(e,t,gt.length);for(let e=0;e<gt.length;e++){let t=gt[e];$.position.set(t.x,t.y+t.sy+1.1,t.z),$.scale.set(t.sx*.78,2.2,t.sz*.78),$.rotation.set(0,t.rot+Math.PI/4,0),$.updateMatrix(),n.setMatrixAt(e,$.matrix)}n.instanceMatrix.needsUpdate=!0,c.add(n)}let At=e.city===`nyc`?gt.filter(e=>e.sy>16):[];if(At.length){let e=new Lt(st,dt,At.length);e.castShadow=r;for(let t=0;t<At.length;t++){let n=At[t],r=n.sy>28?.62:.74,i=Math.max(2.4,n.sy*.16);$.position.set(n.x,n.y+n.sy+i*.5,n.z),$.scale.set(n.sx*r,i,n.sz*r),$.rotation.set(0,n.rot,0),$.updateMatrix(),e.setMatrixAt(t,$.matrix),e.setColorAt(t,Vd.setHex(kt[t%kt.length]))}e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0),c.add(e)}let jt=g(new pe(.82,1.18)),Mt=g(new q({color:6985904,emissive:16760944,emissiveIntensity:v?.82:.02,roughness:.16,metalness:.58,envMapIntensity:1.45,side:2})),Pt=Math.min(gt.length*28,1800),Ft=new Lt(jt,Mt,Pt),It=new K,Rt=0,Vt=[{ax:0,az:1,yaw:0},{ax:0,az:-1,yaw:Math.PI},{ax:1,az:0,yaw:Math.PI/2},{ax:-1,az:0,yaw:-Math.PI/2}];for(let e=0;e<gt.length&&Rt<Pt;e++){let t=gt[e],n=Math.max(1,Math.min(8,Math.floor(t.sy/3.4)));for(let e of Vt){let r=e.ax===0?t.sx:t.sz,i=r>9?3:r>6?2:1,a=(e.ax===0?t.sz:t.sx)*.51+.04;for(let o=0;o<n&&Rt<Pt;o++)for(let n=0;n<i&&Rt<Pt;n++){let s=(n-(i-1)*.5)*Math.min(2.2,r*.28),c=e.ax*a+(e.az===0?0:s),l=e.az*a+(e.ax===0?0:s),u=1.5+o*3.1;$.position.set(t.x,t.y,t.z),$.rotation.set(0,t.rot,0),$.scale.set(1,1,1),$.updateMatrix(),It.set(c,u,l).applyMatrix4($.matrix),$.position.copy(It),$.rotation.set(0,t.rot+e.yaw,0),$.updateMatrix(),Ft.setMatrixAt(Rt++,$.matrix)}}}Ft.count=Rt,Ft.instanceMatrix.needsUpdate=!0,c.add(Ft);let Ht=g(new q({color:v?3815476:6972508,roughness:.88,metalness:.08,envMapIntensity:.35})),Ut=new Lt(st,Ht,gt.length);Ut.receiveShadow=!0;for(let e=0;e<gt.length;e++){let t=gt[e];$.position.set(t.x,t.y+t.sy+.12,t.z),$.scale.set(t.sx*1.04,.24,t.sz*1.04),$.rotation.set(0,t.rot,0),$.updateMatrix(),Ut.setMatrixAt(e,$.matrix)}Ut.instanceMatrix.needsUpdate=!0,c.add(Ut);let Wt=e.theme===`manhattan`||e.theme===`park`,Kt=g(new Y(Wt?.7:.45,Wt?.75:.45,Wt?1.1:.7,8)),qt=g(new ct({color:Wt?9071176:14212320,metalness:Wt?.12:.72,roughness:Wt?.72:.28,envMapIntensity:1.1})),Jt=new Lt(Kt,qt,e.theme===`jaffa`||e.theme===`carmel`||e.theme===`stone`?0:Math.min(gt.length,Wt?70:90));for(let e=0;e<Jt.count;e++){let t=gt[e];$.position.set(t.x+1.1,t.y+t.sy+(Wt?.6:.4),t.z),$.scale.set(1,1,1),$.rotation.set(0,0,0),$.updateMatrix(),Jt.setMatrixAt(e,$.matrix)}c.add(Jt);let Yt=null;if((e.city===`nyc`||e.theme===`carmel`||e.theme===`stone`||e.id===`hermon`||e.id===`hw1`)&&e.id!==`deadsea`&&e.id!==`hayarkon`&&e.id!==`ayalon`&&e.id!==`ramon`){let t=e.id,n=e.theme===`jaffa`||e.theme===`carmel`||t===`hermon`||e.theme===`stone`||t===`hw1`,r=e.theme===`manhattan`?48:n?44:36,i=g(n?new f(1,1,6):new G(1,1,1));n||i.translate(0,.5,0);let a=g(new q({color:v?1713202:t===`ramon`?11565642:t===`hermon`?15265524:e.theme===`carmel`||t===`hw1`?4020788:e.theme===`stone`?12890250:12103844,roughness:.92,metalness:.04,envMapIntensity:v?.35:.22,flatShading:!0})),o=new Lt(i,a,r);for(let i=0;i<r;i++){let a=i/r*Math.PI*2+.07,s=t===`ramon`||t===`hermon`?le*1.45+i%6*70:e.theme===`stone`||t===`hw1`?le*1.55+i%6*55:le*1.15+i%6*28,c=t===`ramon`?52+i%6*22:t===`hermon`?64+i%5*26:e.theme===`carmel`||t===`hw1`?38+i%6*16:e.theme===`stone`?36+i%5*18:22+i%8*16+(e.theme===`manhattan`?28:0);$.position.set(Math.cos(a)*s,n?c*.18:0,Math.sin(a)*s),$.scale.set(t===`ramon`?42+i%4*14:t===`hermon`?38+i%4*12:e.theme===`carmel`||t===`hw1`?32+i%4*12:e.theme===`stone`?38+i%4*14:16+i%4*7,c,t===`ramon`?36:t===`hermon`?32:e.theme===`carmel`||t===`hw1`?28:e.theme===`stone`?32:12+i%3*5),$.rotation.set(0,a,0),$.updateMatrix(),o.setMatrixAt(i,$.matrix)}o.instanceMatrix.needsUpdate=!0,Yt=o,c.add(o)}let Xt=Wt,Zt=e.theme===`stone`,$t=e.theme===`carmel`||e.id===`hermon`||e.id===`hw1`,en=e.theme===`desert`&&e.id!==`ramon`,nn=(e.theme===`bauhaus`||e.id===`telaviv`||e.id===`namal`||e.id===`hayarkon`)&&e.id!==`ayalon`&&e.id!==`rothschild`,rn=g(new Y($t?.22:en?.16:Zt?.14:nn?.42:Xt?.22:.16,$t?.38:en?.28:Zt?.22:nn?.62:Xt?.34:.26,$t?7.4:en?3.6:Zt?3.2:nn?7.2:Xt?5.2:4.6,8));rn.translate(0,$t?3.7:en?1.8:Zt?1.6:nn?3.6:Xt?2.6:2.3,0);let an=g(new q({map:g(qd()),color:$t?6969408:en?9071176:Zt?7231552:9071182,roughness:.92,envMapIntensity:.18})),on=g($t||Zt?new f($t?2.15:1.15,$t?5.6:7.6,8):en?new f(3.4,1.6,8):new W(nn?2.15:1.7,8,6)),sn=g(new q({map:g(Kd()),color:$t?e.id===`hermon`?2449952:1853992:en?6982200:Zt?1853992:e.theme===`park`?3832386:3107386,roughness:.86,envMapIntensity:.28,flatShading:$t||Zt,side:0,depthWrite:!0})),cn=[];if(($t||Zt||en||nn||Wt)&&e.id!==`timessquare`&&e.id!==`ramon`){let e=$t?5:en?7:nn?8:Zt?6:Xt?8:6;for(let t=0;t<n.samples.length;t+=e){let e=n.samples[t];if(!(!$t&&!en&&e.y>14))for(let r of $t||en?[-1,1]:[t%12==0?1:-1]){let i=n.width/2+($t?14+t%5*4.2:en?12+t%4*4:nn?12.5:Zt?16:7.2);cn.push({x:e.x+e.rx*i*r,z:e.z+e.rz*i*r,y:e.y})}}}if(e.theme===`park`)for(let e=-40;e<=40;e+=14)for(let t=-100;t<=120;t+=14)bt(e,t)||Q(n.samples,e,t,0).dist<n.width/2+6||cn.push({x:e+(_()-.5)*6,z:t+(_()-.5)*6,y:0});if($t){let t=e.id===`hw1`?380:180,r=e.id===`hw1`?28:24;for(let e=-t;e<=t;e+=r)for(let i=-t;i<=t;i+=r){if(bt(e,i))continue;let t=Q(n.samples,e,i,0);if(t.dist<n.width/2+16)continue;let r=n.samples[t.index];cn.push({x:e+(_()-.5)*8,z:i+(_()-.5)*8,y:r.y*.72})}}if(e.id===`manhattan`)for(let e=-22;e<=22;e+=12)for(let t=52;t<=124;t+=12)bt(e,t)||cn.push({x:e+(_()-.5)*4,z:t+(_()-.5)*4,y:0});if(e.id===`ayalon`)for(let e=0;e<n.samples.length;e+=11){let t=n.samples[e],r=n.width/2+38;cn.push({x:t.x+t.rx*r,z:t.z+t.rz*r,y:t.y})}let un=new Lt(rn,an,cn.length),dn=$t?3:1,fn=new Lt(on,sn,$t||Zt||en?cn.length*dn:cn.length*(nn?6:5));S=un,x=fn,un.castShadow=r,fn.castShadow=r;let pn=0,mn=g(new q({color:15921906,roughness:.88,flatShading:!0})),hn=$t&&e.id===`hermon`&&cn.length?new Lt(on,mn,cn.length):null,gn=0;for(let e=0;e<cn.length;e++){let t=cn[e],n=1+_()*.45;if($.position.set(t.x,t.y,t.z),$.scale.set(1,n,1),$.rotation.set(0,_()*6,0),$.updateMatrix(),un.setMatrixAt(e,$.matrix),$t||Zt){if($t){for(let e=0;e<3;e++){$.position.set(t.x,t.y+(4.6+e*2.55)*n,t.z);let r=1.28-e*.28+_()*.12;$.scale.set(r,n*.72,r),$.updateMatrix(),fn.setMatrixAt(pn,$.matrix),pn++}hn&&t.y>36&&($.position.set(t.x,t.y+11.4*n,t.z),$.scale.set(.55,n*.42,.55),$.updateMatrix(),hn.setMatrixAt(gn++,$.matrix))}else $.position.set(t.x,t.y+5.4*n,t.z),$.scale.set(.85+_()*.35,n,.85+_()*.35),$.updateMatrix(),fn.setMatrixAt(pn,$.matrix),pn++}else if(en)$.position.set(t.x,t.y+4.1*n,t.z),$.scale.set(1.15+_()*.4,.55,1.15+_()*.4),$.updateMatrix(),fn.setMatrixAt(pn,$.matrix),pn++;else{let e=t.y+(nn?6.8:4.8)*n,r=nn?[[0,0,0,1.22],[1.25,.35,.5,.88],[-1.15,.3,-.55,.84],[.25,.95,-.2,.76],[.85,-.15,-1,.7],[-.9,-.1,.95,.7]]:[[0,0,0,1.08],[.82,.32,.42,.78],[-.68,.26,-.48,.74],[.15,.72,-.12,.62],[.55,-.18,-.7,.58]];for(let[i,a,o,s]of r)$.position.set(t.x+i,e+a*n,t.z+o),$.scale.set(s,s*.86*n,s),$.rotation.set(0,0,0),$.updateMatrix(),fn.setMatrixAt(pn,$.matrix),pn++}}if(un.instanceMatrix.needsUpdate=!0,fn.count=pn,fn.instanceMatrix.needsUpdate=!0,cn.length&&c.add(un,fn),cn.length&&e.theme!==`desert`&&e.id!==`timessquare`){let e=Math.min(36,cn.length),t=g(new pe(6.4,7.6)),n=g(new Ct({map:g(Kd()),transparent:!0,alphaTest:.32,side:2,depthWrite:!1})),r=new Lt(t,n,e*2),i=0,a=Math.max(1,Math.floor(cn.length/e));for(let t=0;t<cn.length&&i<e*2;t+=a){let e=cn[t],n=e.x+(t%2?16:-16),a=e.z+(t%3?10:-10);$.position.set(n,e.y+3.6,a),$.scale.set(1,1,1),$.rotation.set(0,.4,0),$.updateMatrix(),r.setMatrixAt(i++,$.matrix),$.rotation.set(0,.4+Math.PI/2,0),$.updateMatrix(),r.setMatrixAt(i++,$.matrix)}r.count=i,r.instanceMatrix.needsUpdate=!0,c.add(r),C=r}if(hn&&(hn.count=gn,hn.instanceMatrix.needsUpdate=!0,gn&&c.add(hn)),cn.length){let e=g(new Nt(2.4,10));e.rotateX(-Math.PI/2);let t=g(new Ct({color:329224,transparent:!0,opacity:.28,depthWrite:!1})),n=new Lt(e,t,cn.length);for(let e=0;e<cn.length;e++){let t=cn[e];$.position.set(t.x,t.y+.04,t.z),$.scale.set(nn?1.6:en?1.4:1,1,nn?1.6:1),$.rotation.set(0,0,0),$.updateMatrix(),n.setMatrixAt(e,$.matrix)}n.instanceMatrix.needsUpdate=!0,c.add(n),w=n}if(e.theme===`desert`||e.id===`ramon`){let t=g(new _e(1.2,0)),i=g(new q({color:e.id===`ramon`?11037242:12886128,roughness:.96,flatShading:!0})),a=new Lt(t,i,80);a.castShadow=r;let o=0;for(let e=0;e<n.samples.length&&o<80;e+=Math.max(2,Math.floor(n.samples.length/40))){let t=n.samples[e],r=o%2?1:-1,i=n.width/2+14+o%5*5;$.position.set(t.x+t.rx*i*r,t.y+.4,t.z+t.rz*i*r);let s=.8+o%4*.55;$.scale.set(s,s*(.5+o%3*.25),s),$.rotation.set(_()*1.2,_()*6,_()*.6),$.updateMatrix(),a.setMatrixAt(o++,$.matrix)}a.count=o,a.instanceMatrix.needsUpdate=!0,c.add(a)}let _n=g(new Y(.07,.09,5.2,5));_n.translate(0,2.6,0);let vn=g(new q({color:2764338,metalness:0,roughness:.62,envMapIntensity:.5})),yn=g(new W(.18,8,8)),bn=g(new ct({color:15920864,emissive:v?16760944:2236962,emissiveIntensity:v?6.2:.1,roughness:.22,metalness:.05})),xn=g(new W(.95,8,8)),Sn=g(new Ct({color:16760944,transparent:!0,opacity:v?.78:0,blending:2,depthWrite:!1})),Cn=e.id===`ramon`||e.id===`hermon`?0:e.id===`ayalon`?Math.floor(n.samples.length/8):e.id===`hw1`||e.id===`hw2`||e.id===`hw6`?Math.floor(n.samples.length/16):e.theme===`carmel`?Math.floor(n.samples.length/18):Math.floor(n.samples.length/10),wn=Math.max(1,Math.floor(n.samples.length/Math.max(1,Cn))),Tn=new Lt(_n,vn,Math.max(1,Cn)),En=new Lt(yn,bn,Math.max(1,Cn)),Dn=new Lt(xn,Sn,Math.max(1,Cn)),On=[];for(let e=0;e<Cn;e++){let t=n.samples[e*wn%n.samples.length],r=e%2==0?1:-1,i=n.width/2+2.7,a=t.x+t.rx*i*r,o=t.z+t.rz*i*r;On.push(new K(a,t.y+5.15,o)),$.position.set(a,t.y,o),$.scale.set(1,1,1),$.rotation.set(0,0,0),$.updateMatrix(),Tn.setMatrixAt(e,$.matrix),$.position.y=t.y+5.15,$.updateMatrix(),En.setMatrixAt(e,$.matrix),$.scale.set(1.15,1.15,1.15),Dn.setMatrixAt(e,$.matrix)}Cn&&c.add(Tn,En,Dn);let kn=g(new Nt(7.2,20));kn.rotateX(-Math.PI/2);let An=g(new Ct({color:16760944,transparent:!0,opacity:v?.58:0,blending:2,depthWrite:!1})),jn=new Lt(kn,An,Math.max(1,Cn));jn.renderOrder=2;for(let e=0;e<Cn;e++){let t=n.samples[e*wn%n.samples.length],r=On[e];$.position.set(r.x,t.y+.055,r.z),$.scale.set(1.35,1,1.15),$.rotation.set(0,0,0),$.updateMatrix(),jn.setMatrixAt(e,$.matrix)}if(jn.visible=v&&Cn>0,Cn&&c.add(jn),e.id===`ayalon`&&Cn){let e=n.width+18,t=new Lt(_n,vn,Cn),r=new Lt(yn,bn,Cn),i=new Lt(kn,An,Cn);i.renderOrder=2;let a=e+n.width/2+2.7;for(let e=0;e<Cn;e++){let o=n.samples[(e*wn+Math.floor(wn/2))%n.samples.length],s=o.x+o.rx*a,c=o.z+o.rz*a;$.position.set(s,o.y,c),$.scale.set(1,1,1),$.rotation.set(0,0,0),$.updateMatrix(),t.setMatrixAt(e,$.matrix),$.position.y=o.y+5.15,$.updateMatrix(),r.setMatrixAt(e,$.matrix),$.position.y=o.y+.055,$.scale.set(1.35,1,1.15),$.updateMatrix(),i.setMatrixAt(e,$.matrix)}t.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,i.visible=v,c.add(t,r,i)}let Mn=e.id===`ramon`||e.id===`hermon`||e.theme===`carmel`||e.theme===`desert`||e.theme===`snow`||e.id===`hw1`||e.id===`hw2`||e.id===`hw6`||e.id===`ayalon`||e.id===`rothschild`||e.id===`hayarkon`||e.id===`oldjaffa`||e.id===`jerusalem`?0:r?72:28;if(Mn){let e=g(new G(.42,.95,.32)),t=g(new W(.16,6,5)),r=g(new q({color:2764340,roughness:.85,metalness:.05})),i=g(new q({color:7260356,roughness:.7})),a=new Lt(e,r,Mn),o=new Lt(e,i,Math.max(1,Math.floor(Mn/3))),s=new Lt(t,g(new q({color:12886138,roughness:.7})),Mn),l=0;for(let e=0;e<Mn;e++){let t=n.samples[(e*11+4)%n.samples.length],r=e%2==0?1:-1,i=n.width/2+2.35+e%5*.18,c=t.x+t.rx*i*r,u=t.z+t.rz*i*r,d=t.y+.55,f=Math.atan2(-t.rx*r,-t.rz*r);$.position.set(c,d,u),$.rotation.set(0,f,0),$.scale.set(1,.9+e%4*.08,1),$.updateMatrix(),a.setMatrixAt(e,$.matrix),$.position.y=d+.62,$.scale.set(1,1,1),$.updateMatrix(),s.setMatrixAt(e,$.matrix),e%3==0&&l<o.count&&($.position.set(c,d,u),$.scale.set(1.05,.92,1.05),$.updateMatrix(),o.setMatrixAt(l,$.matrix),l+=1)}o.count=l,c.add(a,o,s)}let Nn=g(new G(8.5,4.2,.22)),Pn=g(new G(.22,5.4,.22)),Fn=g(new q({color:2764338,metalness:0,roughness:.5})),In=[{bg:`#163048`,fg:`#f2eee8`,t:`RUSH`},{bg:`#1a3a6a`,fg:`#6ec8c4`,t:`PULSE 101`},{bg:`#2a8f8a`,fg:`#f2eee8`,t:`יפו`},{bg:`#1c1c1c`,fg:`#f5c400`,t:`TLV`}];if(e.city===`nyc`&&nt)for(let e=0;e<In.length;e++){let t=In[e],r=g(nt.adBoardTexture(t.bg,t.fg,t.t)),i=g(new q({map:r,emissive:new D(t.fg),emissiveIntensity:v?.45:.08,roughness:.45})),a=n.samples[Math.floor(n.samples.length*(.18+e*.2))%n.samples.length],o=e%2==0?1:-1,s=n.width/2+7.5,l=a.x+a.rx*s*o,u=a.z+a.rz*s*o,d=new J(Nn,i);d.position.set(l,a.y+4.4,u),d.lookAt(a.x,a.y+3.2,a.z),c.add(d);let f=new J(Pn,Fn);f.position.set(l,a.y+2.6,u),c.add(f)}let Ln=[];if(r)for(let e=0;e<10;e++){let t=On[e]??new K,n=new ve(16760944,v?200:0,44,.9,.65,1.2);n.position.copy(t),n.target.position.set(t.x,t.y-5.2,t.z),n.castShadow=!1,c.add(n,n.target),Ln.push(n)}let Rn=g(new Nt(1.8,10));Rn.rotateX(-Math.PI/2);let zn=g(new ct({color:1843752,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:2.6,transparent:!0,opacity:.78})),Bn=[],Vn=new Lt(Rn,zn,26);for(let e=0;e<26;e++){let t=n.samples[Math.floor(e/26*n.samples.length)%n.samples.length],r=(_()-.5)*n.width*.72,i=.65+_()*1.5,a=_()*6;Bn.push({x:t.x+t.rx*r,y:t.y+.07,z:t.z+t.rz*r,sx:i,sz:i*.5,rot:a}),$.position.set(Bn[e].x,Bn[e].y,Bn[e].z),$.scale.set(i,1,i*.5),$.rotation.set(0,a,0),$.updateMatrix(),Vn.setMatrixAt(e,$.matrix)}Vn.visible=v||b!==`clear`,c.add(Vn),E=Vn;let Hn=new lt;Hn.visible=v;let Un=g(new G(3.4,.55,.1)),Wn=[g(new Ct({color:7260356})),g(new Ct({color:16731533})),g(new Ct({color:16761165}))],Gn=Math.max(e.id===`timessquare`?7:18,Math.floor(n.samples.length/22));for(let e=0;e<n.samples.length;e+=Gn){let t=n.samples[e],r=e%(Gn*2)==0?1:-1,i=new J(Un,Wn[e%3]);i.position.set(t.x+t.rx*(n.width/2+6.2)*r,t.y+8+_()*10,t.z+t.rz*(n.width/2+6.2)*r),i.rotation.y=Math.atan2(t.tx,t.tz)+Math.PI/2,Hn.add(i)}c.add(Hn);let Kn=[];if(r)for(let e=0;e<Math.min(2,Hn.children.length);e++){let t=Hn.children[e*2],n=Wn[e%3].color,r=new rt(n.getHex(),v?42:0,16,2);t&&r.position.copy(t.position),c.add(r),Kn.push(r)}let qn=[],Jn=[];Jn.push({mat:Mt,night:.82,day:.02});let Yn=[],Xn=[];Bd({group:c,def:e,bag:d,shadows:r,isNight:v,glows:qn,emitList:Jn,colliders:Yn,movers:Xn,ramps:qe,streets:Ge,built:n,support:{_dummy:$,barkTexture:qd,curtainTexture:Wd,foliageTexture:Kd,herodianTexture:Ud,samp:nf,segsOf:tf}}),e.city===`nyc`&&(await l(()=>import(`./nyc-landmarks-BlPC51Hy.js`),__vite__mapDeps([3,2,1]))).addNycLandmarks(c,e,d,r,v,qn,Jn,Yn);let Zn=Math.max(3,Math.floor(n.samples.length/360)),Qn=n.width/2+1.55;for(let e=0;e<n.samples.length;e+=Zn){let t=n.samples[e];Yn.push({x:t.x+t.rx*Qn,z:t.z+t.rz*Qn,r:.62,kind:`barrier`}),Yn.push({x:t.x-t.rx*Qn,z:t.z-t.rz*Qn,r:1.05,kind:`barrier`})}let $n=0;for(let e of gt){if($n>=80)break;Q(n.samples,e.x,e.z,0).dist<n.width/2+8||(Yn.push({x:e.x,z:e.z,r:Math.max(e.sx,e.sz)*.42,kind:`building`}),$n+=1)}let er=n.samples[0],tr=new J(g(new G(n.width,.05,1.8)),g(new q({map:g($d()),roughness:.45,metalness:.08})));if(tr.position.set(er.x,er.y+.08,er.z),tr.rotation.y=Math.atan2(er.tx,er.tz),c.add(tr),e.open){let e=n.samples[n.samples.length-1],t=new J(g(new G(n.width,.05,1.8)),g(new q({map:g($d()),roughness:.45,metalness:.08})));t.position.set(e.x,e.y+.08,e.z),t.rotation.y=Math.atan2(e.tx,e.tz),c.add(t)}let nr=g(new q({color:1842724,roughness:.42,metalness:0})),rr=g(new Ct({color:16250094})),ir=g(new Ct({color:6283476}));for(let e=0;e<n.checkpoints.length;e++){let t=n.checkpoints[e],i=n.samples[Math.floor(t*n.samples.length)%n.samples.length],a=e===0,o=a?8.4:6.4,s=n.width*.56;for(let e of[-1,1]){let t=new J(g(new G(.28,o,.28)),nr);t.position.set(i.x+i.rx*s*e,i.y+o*.5,i.z+i.rz*s*e),t.castShadow=r,c.add(t)}let l=new J(g(new G(n.width*1.16,a?.85:.55,.14)),a?rr:ir);if(l.position.set(i.x,i.y+o-.2,i.z),l.rotation.y=Math.atan2(i.tx,i.tz),c.add(l),a){let e=new J(g(new G(.5,.5,.18)),g(new q({color:3066993,emissive:1748309,emissiveIntensity:2.2})));e.position.set(i.x,i.y+o+.45,i.z),c.add(e)}}let ar=(e,t,n)=>{if(!N.castShadow){N.intensity=0,P.intensity=0,P.visible=!1;return}N.target.position.set(e,t,n),N.position.set(e+j.x*72,t+Math.max(28,j.y*72),n+j.z*72),N.target.updateMatrixWorld(),N.shadow.camera.updateProjectionMatrix(),P.target.position.set(e,t,n),P.position.set(e+j.x*42,t+Math.max(18,j.y*42),n+j.z*42),P.target.updateMatrixWorld(),P.shadow.camera.updateProjectionMatrix(),P.color.copy(N.color),P.visible=N.castShadow},or=(e,t,n,r)=>{if(!He||!Ue)return;He.visible=!0,He.position.set(e,t+.03,n),He.rotation.set(-Math.PI/2,r,0);let i=He.material,a=b===`rain`||b===`storm`;if(i.opacity=a?v?.58:.38:v?.34:.22,i.uniforms?.color){let e=a?v?6976392:10136508:v?3818840:8954036;i.uniforms.color.value.setHex(e)}},sr=(e,t,n)=>{let r=e*.001;he.position.x=t,he.position.z=n;for(let e of Xn){if(e.pts.length<2)continue;let t=((r*e.speed+e.phase)%1+1)%1*(e.pts.length-1),n=Math.min(e.pts.length-2,Math.floor(t)),i=e.pts[n],a=e.pts[n+1],o=t-n;e.mesh.position.set(i.x+(a.x-i.x)*o,i.y+(a.y-i.y)*o,i.z+(a.z-i.z)*o);let s=i.yaw+Math.atan2(Math.sin(a.yaw-i.yaw),Math.cos(a.yaw-i.yaw))*o;e.mesh.rotation.y=s}if($e.length){for(let e of $e)e.position.y=-.1+Math.sin(r*.7)*.06;if(et.length)for(let e of et)e.normalMap&&(e.normalMap.offset.x=r*.04,e.normalMap.offset.y=r*.026)}if(b===`storm`){let t=Math.sin(e*.013)>.992,n=ln(y);ee.intensity=t?n>.5?1.8:1.2:i(.22,.34,n),M.intensity=t?1.4:i(.55,.52,n)}let a=b===`storm`?1:b===`rain`?.82:i(.08,.42,ln(y));Vn.visible=a>.1,zn.opacity=.32+a*.58;let o=1+Math.sin(r*2.2)*.035*(b===`clear`?.4:1);for(let e=0;e<Bn.length;e++){let t=Bn[e];$.position.set(t.x,t.y,t.z),$.scale.set(t.sx*o,1,t.sz*o),$.rotation.set(0,t.rot+r*.04,0),$.updateMatrix(),Vn.setMatrixAt(e,$.matrix)}if(Vn.instanceMatrix.needsUpdate=!0,He){let e=He.material;e.opacity=b===`clear`?i(.1,.4,ln(y)):.28+a*.35}if(ln(y)<.4||Ln.length===0||On.length===0)return;let s=On.map((e,r)=>({i:r,d:(e.x-t)*(e.x-t)+(e.z-n)*(e.z-n)})).sort((e,t)=>e.d-t.d);for(let e=0;e<Ln.length;e++){let t=On[s[e]?.i??0];Ln[e].position.copy(t),Ln[e].target.position.set(t.x,t.y-5.2,t.z)}},cr=fe.material,lr=ze,X=()=>{let e=ln(y);if(Vn.visible=b===`rain`||b===`storm`||b===`clear`&&e>.35,b===`rain`||b===`storm`?(be.color.setHex(e>.5?13685976:15265006),be.roughness=b===`storm`?.12:.18,be.metalness=0,be.envMapIntensity=e>.5?1.25:1.1,be.clearcoat=.62,be.clearcoatRoughness=.14,zn.opacity=b===`storm`?.9:.78):e>.45?(be.color.setHex(15264494),be.roughness=.26,be.metalness=0,be.envMapIntensity=1.12,be.clearcoat=.48,be.clearcoatRoughness=.2):(be.color.setHex(16777215),be.roughness=.28,be.metalness=0,be.envMapIntensity=1.05,be.clearcoat=.42,be.clearcoatRoughness=.28),be.userData.uWet){let e=ln(y),t=Tl(e>.5,b,e<=.5&&y<.38);be.userData.uWet.value=wl[t].wetness}},ur=new D(9356520),dr=new D(13162734),fr=new D(6981808),mr=new D(16773852),hr=new D(16769200),gr=new D(12898524),_r=new K,Z=t=>{y=(t%1+1)%1;let n=ln(y);v=n>.48;let r=n<=.5&&y<.38,a=Qt(e,y,b);if(mf(k,A,a),se.map=null,se.color.setHex(n>.5?2771564:3972832),se.needsUpdate=!0,n<.58)j.copy(A);else{let t=ft.degToRad(46),r=ft.degToRad(e.sky.azimuth+172);_r.setFromSphericalCoords(1,t,r),j.copy(A).lerp(_r,(n-.58)/.42)}if(n>.5?(M.color.copy(fr),N.color.copy(gr),M.intensity=.98,N.intensity=.72,F.color.setHex(16758880),F.intensity=.72,ee.color.setHex(5929112),ee.intensity=.58):r?(M.color.copy(dr),N.color.copy(hr),M.intensity=.66,N.intensity=.98,F.color.setHex(16760976),F.intensity=.24,ee.color.setHex(13682872),ee.intensity=.26):(M.color.copy(ur),N.color.copy(mr),M.intensity=.62,N.intensity=.82,F.color.setHex(10139856),F.intensity=.22,ee.color.setHex(11057352),ee.intensity=.24),M.groundColor.setHex(n>.5?1709072:5919304),N.position.copy(j).multiplyScalar(95),L.setHex(n>.55?16760944:16767136),R&&(R.visible=!1),N.shadow.radius=i(1.05,.7,n),n>.5&&(e.theme===`manhattan`||e.theme===`park`)&&(M.color.setHex(6981832),M.intensity=i(.26,.52,n),N.intensity=i(.72,1.02,n),F.color.setHex(16734858),F.intensity=i(.1,.42,n)),te.mesh.visible=n>.5,te.mat.opacity=s((n-.45)*2.4,0,.92),re.visible=n>.55,B.visible=n>.55,re.position.copy(j).multiplyScalar(420),B.position.copy(re.position),z.opacity=n>.55?.38:0,z.needsUpdate=!0,ae.visible=n<.5,oe.visible=n<.5,ae.position.copy(j).multiplyScalar(900),oe.position.copy(ae.position),V.opacity=r?.38:.26,Sn.opacity=n>.45?.58:0,Sn.needsUpdate=!0,X(),cr.color.setHex(n>.5?5923436:ue),cr.envMapIntensity=i(.14,.08,n),me.color.setHex(n>.5?1980500:y<.38?6991584:4889304),lr.color.setHex(n>.5?9078400:12892324),lr.envMapIntensity=i(.22,.16,n),Be.color.setHex(n>.5?4867128:e.sand),Le.color.setHex(n>.5?9078396:12893358),et.length)for(let e=0;e<et.length;e++){let t=We[e],r=et[e];r.color.setHex(t.color),n>.35&&r.color.multiplyScalar(i(1,.5,n)),r.envMapIntensity=i(1.7,2.6,n),r.roughness=i(.08,.03,n),r.opacity=i(.82,.9,n)}tt&&(dt.map=n>.48?at:it,dt.emissive.setHex(n>.4?16763e3:0),dt.emissiveIntensity=n*(e.theme===`manhattan`?3.2:1.85),dt.metalness=i(.08,.16,n),dt.envMapIntensity=i(.5,1.15,n),dt.needsUpdate=!0),bn.emissive.setHex(n>.4?16760944:2236962),bn.emissiveIntensity=i(.08,7.2,n),Sn.opacity=n>.4?.22+n*.42:0,jn.visible=n>.4&&Cn>0,An.opacity=n>.4?.32+n*.4:0,Hn.visible=n>.32;for(let e of Ln)e.intensity=n*210;for(let e of Kn)e.intensity=n*42;for(let e of qn)e.light.intensity=n*e.on;for(let e of Jn)e.mat.emissiveIntensity=i(e.day,e.night,n);return X(),a};return X(),Nu({group:c,sun:A,sky:k,dir:N,dirNear:P,waterMesh:Ze,colliders:Yn,streets:Ge,ramps:qe,getNight:()=>v,getWeather:()=>b,followShadows:ar,followMirror:or,setPlanar(e){Ue=!!e,He&&(He.visible=Ue)},sunDir:j,tick:sr,setTime:e=>Z(e?.9:.5),setClock:Z,getClock:()=>y,setWeather:e=>(b=e,Z(y)),setLod:e=>{let t=e===`high`,n=e===`mid`;x&&(x.visible=t||n,x.castShadow=t),S&&(S.castShadow=t),C&&(C.visible=t),w&&(w.visible=t||n),Jt.visible=t||n,Jt.castShadow=t,Yt&&(Yt.visible=t||n);for(let e of T)e.visible=t||n;E&&(E.visible=t)},dispose(){if(p)return;p=!0;let e=Xs();Qs(c,e);let t=new Set([...e.geometries,...e.materials]);for(let e=d.length-1;e>=0;--e){let n=d[e];if(!t.has(n))try{n.dispose()}catch{}}d.length=0,N.shadow.map?.dispose(),N.shadow.mapPass?.dispose(),P.shadow.map?.dispose(),P.shadow.mapPass?.dispose()}})}var yf=120;function bf(e,t){return e.length?e[Math.min(e.length-1,Math.floor(t/100*e.length))]:0}var xf=class{buf=[];i=0;filled=0;last=0;backend=`unknown`;constructor(){this.buf=Array(yf).fill(0)}push(e){this.last=e,this.buf[this.i]=e,this.i=(this.i+1)%yf,this.filled<yf&&this.filled++}snapshot(){let e=this.buf.slice(0,this.filled).sort((e,t)=>e-t);return{n:this.filled,p50:+bf(e,50).toFixed(2),p95:+bf(e,95).toFixed(2),p99:+bf(e,99).toFixed(2),last:+this.last.toFixed(2),backend:this.backend}}};function Sf(e){e.outputColorSpace=V,e.toneMapping=4}var Cf=class e{gl;telem=new xf;disposed=!1;profile;static init(t,n){let r=new Mo({canvas:t,antialias:!(t.clientWidth<700||/Mobi|Android/i.test(navigator.userAgent))&&!n.composer,alpha:!1,powerPreference:`high-performance`}),i=new e(r,n);return i.setQuality(n),i.resize(t.clientWidth,Math.max(1,t.clientHeight),Math.min(window.devicePixelRatio||1,1)*n.pixelScale),Sf(r),i.telem.backend=r.capabilities.isWebGL2?`webgl2`:`webgl1`,i}static async probeWebGPU(){let e=async()=>{if(!navigator.gpu)throw Error(`no navigator.gpu`);let{WebGPURenderer:e}=await l(async()=>{let{WebGPURenderer:e}=await import(`./three.webgpu-C5y8vDrg.js`);return{WebGPURenderer:e}},__vite__mapDeps([4,2,1])),t=new e({canvas:document.createElement(`canvas`),antialias:!1,powerPreference:`high-performance`});return await t.init(),t.dispose(),{ok:!0,reason:`init`}};try{return await Promise.race([e(),new Promise(e=>setTimeout(()=>e({ok:!1,reason:`webgpu init timeout`}),4e3))])}catch(e){return console.info(`[gfx] webgpu fail`,e),{ok:!1,reason:e instanceof Error?e.message:`fail`}}}constructor(e,t){this.gl=e,this.profile=t}setEnvironment(e){this.gl.toneMappingExposure=e}setQuality(e){this.profile=e,this.gl.shadowMap.enabled=e.shadows>0,this.gl.shadowMap.type=2}resize(e,t,n){this.gl.setPixelRatio(n),this.gl.setSize(e,t,!1)}render(e,t){this.disposed||this.gl.render(e,t)}getTelemetry(){return this.telem.snapshot()}getProfile(){return this.profile}dispose(){this.disposed||(this.disposed=!0,this.gl.setAnimationLoop(null),this.gl.dispose())}},wf={compat:{version:1,id:`compat`,pixelScale:1,shadows:0,composer:!1,bloom:!1,planar:!1,targetFps:30},balanced:{version:1,id:`balanced`,pixelScale:.75,shadows:1,composer:!0,bloom:!1,planar:!1,targetFps:60},high:{version:1,id:`high`,pixelScale:.85,shadows:1,composer:!0,bloom:!0,planar:!0,targetFps:60},ultra:{version:1,id:`ultra`,pixelScale:1,shadows:1,composer:!0,bloom:!0,planar:!0,targetFps:60},photo:{version:1,id:`photo`,pixelScale:1,shadows:1,composer:!0,bloom:!0,planar:!0,targetFps:30}};function Tf(e){return e===`low`?wf.compat:e===`mid`?wf.balanced:wf.high}var Ef={owner:`race-engine`,kind:`other`,shared:!1};function Df(e,t){return e.owner===t.owner&&e.kind===t.kind&&!!e.shared==!!t.shared}var Of=class{items=new Map;dead=!1;sequence=0;disposedIds=[];disposalErrors=[];retain(e,t,n=Ef){if(!e.trim())throw Error(`resource id must not be empty`);let r={...Ef,...n};if(this.dead)return this.disposeOne(e,t),!1;let i=this.items.get(e);if(i){if(i.dispose!==t)throw Error(`resource ${e} retained with a different disposer`);if(!Df(i.metadata,r))throw Error(`resource ${e} retained with different ownership metadata`);return i.count+=1,!0}return this.items.set(e,{count:1,dispose:t,metadata:r,order:this.sequence++}),!0}release(e){let t=this.items.get(e);return!t||(--t.count,t.count>0)?!1:(this.items.delete(e),this.disposeOne(e,t.dispose),!0)}disposeAll(){if(this.dead)return{alreadyDisposed:!0,disposed:0,errors:this.disposalErrors.length,outstanding:0};this.dead=!0;let e=[...this.items.entries()].sort((e,t)=>t[1].order-e[1].order);this.items.clear();let t=this.disposedIds.length;for(let[t,n]of e)this.disposeOne(t,n.dispose);return{alreadyDisposed:!1,disposed:this.disposedIds.length-t,errors:this.disposalErrors.length,outstanding:this.items.size}}snapshot(){let e=[...this.items.entries()].sort((e,t)=>e[1].order-t[1].order).map(([e,t])=>({id:e,count:t.count,owner:t.metadata.owner,kind:t.metadata.kind,shared:!!t.metadata.shared,order:t.order}));return{state:this.dead?`disposed`:`active`,leaseIds:e.length,retainedReferences:e.reduce((e,t)=>e+t.count,0),disposedIds:[...this.disposedIds],disposalErrors:[...this.disposalErrors],outstanding:e}}size(){return this.items.size}disposeOne(e,t){try{t()}catch(t){this.disposalErrors.push(`${e}: ${t instanceof Error?t.message:String(t)}`)}finally{this.disposedIds.push(e)}}};function kf(e){let t=Math.max(0,e);return{planar:t<1,bloom:t<2,csm:t<3,pixelExtra:Math.max(0,t-3)}}var Af=class{step=0;over=0;cool=0;note(e,t){if(e>20)return this.over++,this.cool=0,this.over>=90&&this.step<8?(this.step++,this.over=0,`drop`):null;if(this.over=0,e<16){if(this.cool+=t,this.cool>=5&&this.step>0)return this.step--,this.cool=0,`raise`}else this.cool=0;return null}reset(){this.step=0,this.over=0,this.cool=0}},jf=Un;function Mf(e){e.preventDefault(),this.glLost=!0}function Nf(){this.glLost=!1,this.opts.onRestore?.()}function Pf(e){return this.quality!==`low`&&!this.lite||e-this.lastPresent>=1e3/30}function Ff(){let e=this.canvas.clientWidth,t=Math.max(1,this.canvas.clientHeight);this.gfx.resize(e,t,this.renderer.getPixelRatio()),this.camera.aspect=e/t,this.camera.updateProjectionMatrix();let n=new Bt;this.renderer.getDrawingBufferSize(n),this.post.setSize(n.x,n.y)}function If(){if(this.disposed||this.glLost||this.disposed)return;let e=performance.now(),t=(e-this.last)/1e3;if(this.last=e,t=Math.min(t,.1),this.telem.push(t*1e3),!this.soft&&this.quality!==`low`){let e=this.telem.snapshot();this.dyn.note(e.p95,t)&&this.applyGfxStep()}let n=this.input.keys.has(`KeyC`)||this.input.keys.has(`KeyV`)||!!navigator.getGamepads?.()?.[0]?.buttons[3]?.pressed;n&&!this.hoodEdge&&!this.photo&&(this.camMode=0,this.hood=!1),this.hoodEdge=n;let r=this.input.keys.has(`KeyT`);if(r&&!this.radioEdge&&this.cycleRadio(),this.radioEdge=r,this.radioToast>0&&(this.radioToast=Math.max(0,this.radioToast-t)),this.banterT>0&&(this.banterT-=t,this.banterT<=0&&(this.banter=``)),this.autoCycle&&!this.photo&&!this.paused&&this.racing&&(this.clock=(this.clock+t/120)%1,this.clockBake+=t,ln(this.clock)>.5===this.world.night?(this.world.setClock(this.clock),this.applyLook()):(this.applyClockSky(!0),this.clockBake=0)),this.photo){this.stepPhoto(t),this.world.tick(e,this.player.x,this.player.z),this.world.followMirror(this.player.x,this.player.y,this.player.z,this.player.yaw),this.post.setDrive(0,!1),this.post.render(),this.flushSnap(),this.hudTimer+=t,this.hudTimer>.08&&(this.hudTimer=0,this.pushHud());return}if(this.replaying&&(this.input.keys.has(`Enter`)||this.input.keys.has(`KeyX`))&&this.skipReplay(),this.paused&&!this.photo){this.post.render(),this.flushSnap();return}this.acc=Math.min(this.acc+t,On);let i=0;for(;this.acc>=jf&&i<24;)this.fixed(jf),this.acc-=jf,i++;if(this.acc>=jf&&i>=24&&(this.timeVoided=!0),this.world.tick(e,this.player.x,this.player.z),this.nowSec=e/1e3,!this.shouldPresent(e)){this.hudTimer+=t,this.hudTimer>.08&&(this.hudTimer=0,this.pushHud());return}this.lastPresent=e,this.present(t),this.world.followShadows(this.player.x,this.player.y,this.player.z),this.updateCsm(),this.updateProbe();let a=s(Math.abs(this.player.speed)/52,0,1);this.post.setDrive(a,this.player.boostT>0),this.post.render(),this.flushSnap(),this.hudTimer+=t,this.hudTimer>.08&&(this.hudTimer=0,this.pushHud())}function Lf(e){let t=document.createElement(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);if(!n)return;n.drawImage(e,0,0),n.font=`${Math.max(13,Math.round(t.width/78))}px ui-sans-serif, system-ui, sans-serif`,n.fillStyle=`rgba(255,255,255,0.7)`,n.textAlign=`right`,n.textBaseline=`bottom`,n.fillText(`PHOTO MODE · RUSH`,t.width-18,t.height-16);let r=document.createElement(`a`);r.href=t.toDataURL(`image/png`),r.download=`rush-photo-${Date.now()}.png`,r.click()}function Rf(){if(!this.disposed){if(!this.captureSceneEnv())try{let e=Vc(this.renderer,this.world.night);this.setEnvRT(e),this.scene.environment=e.texture}catch{}if(this.scene.environmentIntensity=this.world.night?.52:.88,!this.disposed)try{let e=Bc(this.renderer,this.scene,this.camera,this.world.night,this.lite);this.leases.release(`post`)||this.post.dispose(),this.post=e,this.leases.retain(`post`,()=>e.dispose(),{owner:`race-engine`,kind:`post-stack`}),this.post.setTier(this.quality),this.applyGfxStep(),this.onResize()}catch{}}}function zf(){if(this.replaying||this.disposed)return;this.photo=!0,this.paused=!0,this.photoYaw=this.player.yaw+Math.PI,this.photoPitch=.22,this.photoDist=8,this.photoHide=!1,this.photoLock=null,this.drivePR=this.renderer.getPixelRatio(),this.driveExposure=this.renderer.toneMappingExposure;let e=Math.min(window.devicePixelRatio||1,1.35);this.renderer.setPixelRatio(Math.max(this.drivePR,e)),this.renderer.toneMappingExposure=this.driveExposure*1.05,this.onResize(),this.pushHud()}function Bf(){this.photo=!1,this.photoHide=!1,this.photoLock=null,this.post.setFilter(0),this.renderer.setPixelRatio(this.drivePR),this.renderer.toneMappingExposure=this.driveExposure,this.onResize(),this.pushHud()}function Vf(e,t,n=52,r=22,i=28,a=40){this.enterPhoto(),this.photoHide=!0;let o=Q(this.built.samples,e,t,0),s=this.built.samples[o.index];this.player.spawn(this.built,o.index/Math.max(1,this.built.samples.length-1),0),this.photoLock={px:s.x-s.tx*i,py:r,pz:s.z-s.tz*i,lx:e,ly:n,lz:t,fov:a},this.pushHud()}function Hf(){return this.photo}function Uf(){this.snapPhoto=!0}function Wf(){if(this.snapPhoto){this.snapPhoto=!1;try{Lf(this.renderer.domElement)}catch{}}}function Gf(){this.photoFilter=(this.photoFilter+1)%this.filterNames.length,this.post.setFilter(this.photoFilter),this.pushHud()}function Kf(){this.photoHide=!this.photoHide,this.pushHud()}function qf(e){this.autoCycle=e,this.clockBake=0,this.pushHud()}function Jf(){return this.autoCycle}function Yf(e){this.disposed||(this.clock=e?.9:.5,this.applyClockSky(!1))}function Xf(){let e=ln(this.clock),t=e<=.5&&this.clock<.38,n=Tl(e>.5,this.weather,t);this.gfx.setEnvironment(wl[n].exposure);let r=El[Dl(this.trackDef.theme,this.trackDef.id)];this.fog.color.setHex(e>.5?r.nightCol:r.dayCol),this.fog.density=e>.5?r.night:r.day,this.scene.fog=this.fog,this.applyAltitudeLook()}function Zf(e){if(this.disposed)return;this.world.setClock(this.clock);let t=ln(this.clock);this.applyLook(),this.scene.background=new D(t>.5?2771564:3972832),this.scene.environmentIntensity=t>.5?.52:.7,this.post.setNight(t>.5);let n=t>.42;for(let e of this.visuals)dc(e,n);for(let e of this.trafficVis)dc(e,n);for(let e of this.copVis)dc(e,n);if(!e||this.soft){this.pushHud();return}if(!this.captureSceneEnv())try{let e=Vc(this.renderer,this.world.night);this.setEnvRT(e),this.scene.environment=e.texture}catch{}this.pushHud()}function Qf(){if(this.disposed||this.soft||this.quality===`low`)return!1;let e=null,t=[];try{e=new qr(this.trackDef.id===`ayalon`?128:96);let n=new $e(4,400,e);n.position.set(this.player.x,this.player.y+26,this.player.z);let r=e=>{e.visible&&(e.visible=!1,t.push(e))};for(let e of this.visuals)r(e.group);for(let e of this.trafficVis)r(e.group);for(let e of this.copVis)r(e.group);n.update(this.renderer,this.scene),this.leases.release(`boot-env`);let i=e;return this.scene.environment=i.texture,this.leases.retain(`boot-env`,()=>i.dispose(),{owner:`race-engine`,kind:`render-target`}),e=null,!0}catch{return e?.dispose(),!1}finally{for(let e of t)e.visible=!0}}function $f(){let e=El[Dl(this.trackDef.theme,this.trackDef.id)];if(this.trackDef.id!==`ramon`&&this.trackDef.id!==`hermon`&&this.trackDef.id!==`jerusalem`&&this.trackDef.id!==`scopus`&&this.trackDef.theme!==`carmel`||ln(this.clock)>.5)return;if(this.trackDef.id===`hermon`){let t=s(this.player.y/110,0,1);this.fog.density=i(e.day,e.night*.62,t),this.fog.color.lerp(new D(13162728),t*.28);return}if(this.trackDef.id===`scopus`){let t=s(this.player.y/52,0,1);this.fog.density=i(e.day,e.night*.5,t),this.fog.color.lerp(new D(13688040),t*.2);return}if(this.trackDef.id===`jerusalem`){let t=s(this.player.y/54,0,1);this.fog.density=i(e.day,e.day*.85,t);return}if(this.trackDef.theme===`carmel`){let t=s(this.player.y/48,0,1);this.fog.density=i(e.day,e.night*.7,t);return}let t=s(1-this.player.y/110,0,1);this.fog.density=i(e.day,e.night*.9,t),this.fog.color.lerp(new D(14206112),t*.4)}function ep(){if(!this.probeCam||!this.probeRT||this.soft||(this.probeTick++,this.probeTick%8!=1))return;for(let e of this.visuals)e.group.visible=!1;this.probeCam.position.set(this.player.x,this.player.y+1.05,this.player.z),this.probeCam.update(this.renderer,this.scene);let e=ln(this.clock)>.5?.8:1.2;for(let t of this.visuals)t.group.visible=!0,t.group.traverse(n=>{let r=n.material;r&&r.isMeshPhysicalMaterial&&(r.envMap=this.probeRT.texture,r===t.bodyMat&&(r.envMapIntensity=e))})}function tp(){let e=this.dyn.step,t=kf(e);this.droppedTier=e>0,this.world.setPlanar(t.planar),this.post.setBloom(t.bloom),this.csmMuted=!t.csm||this.quality===`low`||this.soft;let n=this.lite?1:this.quality===`mid`?.75:.85,r=Math.max(.5,n*.85**t.pixelExtra);typeof navigator<`u`&&/mobi|android|iphone|ipad/i.test(navigator.userAgent),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1)*r),this.onResize(),this.trimCsm()}function np(e){if(this.photoLock){let e=this.photoLock;this.camera.position.set(e.px,e.py,e.pz),this.camera.lookAt(e.lx,e.ly,e.lz),Math.abs(this.camera.fov-e.fov)>.2&&(this.camera.fov=e.fov,this.camera.updateProjectionMatrix()),this.post.setFilter(this.photoFilter);return}let t=this.input.poll();this.photoYaw+=t.steer*1.55*e,this.photoPitch=s(this.photoPitch+(t.throttle-t.brake)*.7*e,-.4,.85),t.nitro&&(this.photoDist=Math.max(3.2,this.photoDist-9*e)),t.drift&&(this.photoDist=Math.min(22,this.photoDist+9*e));let n=this.player,r=-Math.sin(this.photoYaw),i=-Math.cos(this.photoYaw),a=Math.sin(this.photoPitch),o=Math.cos(this.photoPitch);this.camera.position.set(n.x-r*this.photoDist*o,n.y+1.1+this.photoDist*a,n.z-i*this.photoDist*o),this.camera.lookAt(n.x,n.y+.55,n.z),Math.abs(this.camera.fov-(48+this.fovExtra))>.2&&(this.camera.fov=48+this.fovExtra,this.camera.updateProjectionMatrix()),this.post.setFilter(this.photoFilter);for(let t=0;t<this.racers.length;t++){let n=this.racers[t];pc(this.visuals[t],n.yaw,0,0,0,e,n.x,n.y,n.z,n.pitch,0)}}function rp(e){let t=this.player;Math.abs(t.dirt-this.lastDirt)>.035&&(uc(this.visuals[0],t.damage,t.dirt),this.lastDirt=t.dirt);for(let t=0;t<this.racers.length;t++){let n=this.racers[t],r=t===0?this.input.poll().steer:s(n.roll*-3,-1,1);pc(this.visuals[t],n.yaw,n.speed,r,t===0?this.input.poll().brake:0,e,n.x,n.y,n.z,n.roll,n.pitch,n.surfaceKind);let i=this.blobs[t];if(i){let e=this.world.sunDir;i.position.set(n.x-e.x*.7,n.y+.04,n.z-e.z*.7);let t=1.05+Math.abs(n.speed)*.014;i.scale.set(t,1,.92+Math.abs(n.speed)*.008),i.rotation.y=n.yaw,i.visible=!n.eliminated,i.material.opacity=(this.world.night?.68:.5)*(n.airborne?.12:1)}}for(let t=0;t<this.traffic.length;t++){let n=this.traffic[t];pc(this.trafficVis[t],n.yaw,n.speed,0,0,e,n.x,n.y,n.z,n.roll,n.pitch,n.surfaceKind)}for(let t=0;t<this.cops.length;t++){let n=this.cops[t];pc(this.copVis[t],n.yaw,n.speed,0,0,e,n.x,n.y,n.z,n.roll,n.pitch),fc(this.copVis[t],this.nowSec+t*.17)}let n=-Math.sin(t.yaw),r=-Math.cos(t.yaw);if(t.drifting||t.impact>.18||t.wheelsLocked){let i=t.impact>.18?1.4:.8;for(let e=0;e<8;e++){let a=Math.floor(c(this.tickId,e,1)*60)*3;this.sparkPos[a]=t.x-n*1.6+(c(this.tickId,e,2)-.5)*i,this.sparkPos[a+1]=t.y+.12+c(this.tickId,e,3)*.35,this.sparkPos[a+2]=t.z-r*1.6+(c(this.tickId,e,4)-.5)*i}this.sparks.geometry.getAttribute(`position`).needsUpdate=!0,this.sparks.visible=!0;let a=this.sparks.material;if(a.color.setHex(t.lastHit===`building`?16742968:t.lastHit===`car`?16054008:16769152),a.size=t.lastHit===`building`?.26:.16,this.skidAcc+=Math.abs(t.speed)*e,this.skidAcc>.55){this.skidAcc=0,this.skidDummy.position.set(t.x-n*1.5,t.y+.03,t.z-r*1.5),this.skidDummy.rotation.y=t.yaw,this.skidDummy.scale.set(1,1,1.1+Math.abs(t.speed)*.018),this.skidDummy.updateMatrix();let e=this.skidI%180;this.skidMesh.setMatrixAt(e,this.skidDummy.matrix),this.skidI+=1,this.skidMesh.count=Math.min(180,this.skidI),this.skidMesh.instanceMatrix.needsUpdate=!0}}else this.sparks.visible=!1;this.ping=Math.max(0,this.ping-e*1.7);let i=this.built.checkpoints[this.player.nextCheckpoint]??0,a=this.built.samples[Math.floor(i*this.built.samples.length)%this.built.samples.length];this.gate.position.set(a.x,a.y+2.55,a.z),this.gate.lookAt(a.x+a.tx,a.y+2.55,a.z+a.tz),this.gate.scale.setScalar(1+this.ping*.18),this.gate.material.emissiveIntensity=1.15+this.ping*2.2,this.gate.visible=this.racing&&!this.player.finished&&!this.replaying,(t.drifting||!t.onTrack&&Math.abs(t.speed)>10||this.weather!==`clear`&&Math.abs(t.speed)>14)&&this.smokes.length<64&&c(this.tickId,21)<(t.onTrack?.55:.88)&&this.smokes.push({x:t.x-n*1.7+(c(this.tickId,22)-.5)*.9,y:t.y+.08,z:t.z-r*1.7+(c(this.tickId,23)-.5)*.9,s:.45,life:1,yaw:t.yaw});for(let t=this.smokes.length-1;t>=0;t--){let n=this.smokes[t];n.life-=e*1.15,n.s+=e*1.6,n.y+=e*.35,n.life<=0&&this.smokes.splice(t,1)}for(let e=0;e<this.smokes.length;e++){let t=this.smokes[e];this.smokeDummy.position.set(t.x,t.y,t.z),this.smokeDummy.rotation.y=t.yaw,this.smokeDummy.scale.setScalar(t.s),this.smokeDummy.updateMatrix(),this.smokeMesh.setMatrixAt(e,this.smokeDummy.matrix)}this.smokeMesh.count=this.smokes.length,this.smokeMesh.instanceMatrix.needsUpdate=!0;let o=!t.onTrack;if(this.smokeMesh.material.opacity=this.weather===`clear`?o?.38:.24:.32,this.smokeMesh.material.color.setHex(o?9071176:this.weather===`clear`?11581630:13161692),t.boostT>0||t.drafting){for(let e=0;e<10;e++){let i=e*3;this.boostPos[i]=t.x-n*(1.8+e*.12)+(c(this.tickId,e,31)-.5)*.35,this.boostPos[i+1]=t.y+.28+c(this.tickId,e,32)*.12,this.boostPos[i+2]=t.z-r*(1.8+e*.12)+(c(this.tickId,e,33)-.5)*.35}this.boostPts.geometry.getAttribute(`position`).needsUpdate=!0,this.boostPts.visible=!0}else this.boostPts.visible=!1;if(this.snapCamera(!1,e),this.world.followShadows(this.player.x,this.player.y,this.player.z),this.updateCsm(),this.world.followMirror(this.player.x,this.player.y,this.player.z,this.player.yaw),this.rainMesh&&this.rainPos){this.rainMesh.visible=this.quality!==`low`;let t=this.camera.position,n=this.trackDef.theme===`snow`?9:this.weather===`hamsin`?5:this.weather===`storm`?38:26,r=this.rainPos.length/3;for(let i=0;i<r;i++){let r=i*3;this.rainPos[r+1]-=n*e,this.weather===`hamsin`&&(this.rainPos[r]+=6*e),this.rainPos[r+1]<t.y-4&&(this.rainPos[r]=t.x+(c(this.tickId,i,41)-.5)*34,this.rainPos[r+1]=t.y+8+c(this.tickId,i,42)*10,this.rainPos[r+2]=t.z+(c(this.tickId,i,43)-.5)*34)}this.rainMesh.geometry.getAttribute(`position`).needsUpdate=!0}if(this.ghostVis&&this.ghostFrames.length&&!this.replaying){let t=Zt(this.ghostFrames,this.racing?this.totalTime:0);t&&(this.ghostVis.group.visible=!0,pc(this.ghostVis,t.yaw,18,0,0,e,t.x,t.y,t.z,0,0),this.ghostDelta=this.totalTime-this.ghostFrames.length*.16*this.player.progress)}if(this.rivalGhostVis&&this.rivalGhostFrames.length&&!this.replaying){let t=Xt(this.rivalGhostFrames,this.racing?this.totalTime:0);if(t){this.rivalGhostVis.group.visible=!0,pc(this.rivalGhostVis,t.yaw,22,0,0,e,t.x,t.y,t.z,0,0);let n=this.rivalGhostFrames.length*.16,r=(this.player.progress+this.player.lap)*n;this.rivalGhostDelta=this.totalTime-r}}}function ip(e,t=.016){let n=this.player;this.lookBack=!this.replaying&&(this.input.keys.has(`KeyB`)||!!navigator.getGamepads?.()?.[0]?.buttons[11]?.pressed||!!navigator.getGamepads?.()?.[0]?.buttons[13]?.pressed);let i=-Math.sin(n.yaw),a=-Math.cos(n.yaw),o=Math.cos(n.yaw),c=-Math.sin(n.yaw),l=this.lookBack?-1:1,u=this.lookBack?0:this.camMode,d=9.2+s(Math.abs(n.speed)/22,0,2.6),f=2.28,p=0;if(u===1?(d=.18,f=1.16,p=.36):u===2?(d=1.35,f=.52):u===3&&(d=.4,f=16,p=.2),this.desired.set(n.x-i*d*l+o*p,n.y+f,n.z-a*d*l+c*p),e)this.cam.copy(this.desired);else{let e=u===1||u===2||this.lookBack?14:u===3?4.5:7.5;this.cam.x=r(this.cam.x,this.desired.x,e,t),this.cam.y=r(this.cam.y,this.desired.y,e,t),this.cam.z=r(this.cam.z,this.desired.z,e,t)}if(u!==3&&u!==1&&n.onTrack&&!n.sideStreet&&this.mode!==`roam`){let e=Q(this.built.samples,this.cam.x,this.cam.z,n.sampleIndex),t=this.built.width/2+7;if(e.dist>t){let n=this.built.samples[e.index],r=(this.cam.x-n.x)/(e.dist||1),i=(this.cam.z-n.z)/(e.dist||1);this.cam.x=n.x+r*t,this.cam.z=n.z+i*t}for(let e of this.world.colliders){let t=this.cam.x-e.x,n=this.cam.z-e.z,r=Math.hypot(t,n),i=e.r+2.4;r<i&&r>1e-4&&(this.cam.x=e.x+t/r*i,this.cam.z=e.z+n/r*i)}let r=this.built.samples[n.sampleIndex];this.cam.y<r.y+1.55&&(this.cam.y=r.y+1.55)}let m=this.replaying?0:this.trauma*this.trauma;this.camera.position.set(this.cam.x+Math.sin(this.tickId*.73)*m*.14,this.cam.y+Math.cos(this.tickId*1.17)*m*.08,this.cam.z+Math.sin(this.tickId*.91)*m*.14);let h=u===3?.2:u===1?9:8+s(Math.abs(n.speed)/14,0,8);this.look.set(n.x+i*h*l,n.y+(u===3?.4:u===1?.98:.62),n.z+a*h*l),this.camera.lookAt(this.look);let g=(u===1?64:u===2?78:u===3?52:58+s(Math.abs(n.speed)/14,0,8)+(n.boostT>0||n.drafting?3:0))+this.fovExtra;Math.abs(this.camera.fov-g)>.2&&(this.camera.fov=g,this.camera.updateProjectionMatrix())}function ap(e){this.fovExtra=s(e,0,12)}function op(){let e=this.standings(),t=e.indexOf(this.player)+1,n=this.bestLap>12&&this.bestLap<400?this.bestLap:75,r=``,i=0;if(e.length>1){let a=t>1?e[t-2]:e[1];if(a){r=a.name;let e=a.lap+a.progress-(this.player.lap+this.player.progress);i=t>1?e*n:-e*n}}this.opts.onHud({speedKmh:Math.abs(this.player.speed)*3.6,lap:Math.min(this.totalLaps,this.player.lap+1),totalLaps:this.totalLaps,pointToPoint:!!this.trackDef.open,lapTime:this.lapTime,bestLap:Number.isFinite(this.bestLap)?this.bestLap:0,totalTime:this.totalTime,position:t,totalRacers:this.racers.length,street:an(this.trackDef,this.player.progress,this.opts.langHe),poi:sn(this.trackDef,this.player.x,this.player.z,this.opts.langHe),night:this.world.night,driftCharge:this.player.driftCharge/2.1,nitro:this.player.nitro,boosting:this.player.boostT>0,drifting:this.player.drifting,wrongWay:this.player.wrongWayT>.45,countdown:this.countdown,finished:this.player.finished,place:t,onTrack:this.player.onTrack,sideStreet:this.opts.langHe?this.player.sideStreet:this.player.sideStreetEn,minimap:[...this.racers.map((e,t)=>({x:e.x,z:e.z,yaw:e.yaw,isPlayer:t===0})),...this.traffic.map(e=>({x:e.x,z:e.z,yaw:e.yaw,isPlayer:!1,traffic:!0})),...this.cops.map(e=>({x:e.x,z:e.z,yaw:e.yaw,isPlayer:!1,cop:!0}))],trackPoly:this.poly,poiMarks:this.trackDef.pois.map(e=>({x:e.x,z:e.z})),progress:this.player.progress,mode:this.mode,driftScore:Math.round(this.player.driftScore),heat:this.heat,heatMax:this.heatMax,busted:this.busted,chasing:this.mode===`heat`&&this.racing&&!this.busted&&!this.escaping,copCount:this.cops.length,cooldown:this.cooldown,wanted:this.wanted,escaping:this.escaping,knockoutAlive:this.racers.filter(e=>!e.eliminated).length,weather:this.weather,ghost:!!this.ghostVis&&!this.replaying,ghostDelta:this.ghostDelta,drafting:this.player.drafting,damage:this.player.damage,replay:this.replaying,camName:this.camNames[this.camMode]??`chase`,rewind:this.rewinding,rewinds:this.rewindBuf.length*.05,photo:this.photo,photoFilter:this.opts.langHe?this.filterHe[this.photoFilter]??`ללא`:this.filterNames[this.photoFilter]??`none`,photoHide:this.photoHide,radio:this.opts.langHe?No[this.audio.getStation()].he:No[this.audio.getStation()].en,rpm:this.player.rpm,cycle:this.autoCycle,replaySlow:this.replaySlow,checkpointPing:this.ping,rivalName:r,rivalGap:i,sector:this.sectorIdx,sectorDelta:this.sectorDelta,gear:this.player.gear,surface:this.player.surfaceKind,tod:dn(this.clock,this.opts.langHe),dirt:this.player.dirt,banter:this.banter,combo:this.combo,driftBonus:this.bonusT>0?this.driftBonus:``,driftAngle:this.player.driftAngle,poiHunt:this.poiGot.size,poiNeed:this.trackDef.pois.length,ghostRival:!!this.rivalGhostVis&&!this.replaying,ghostRivalDelta:this.rivalGhostDelta,navAngle:this.navAngle(),handling:this.player.handling,absOn:this.player.assists.abs,tcsOn:this.player.assists.tcs,escOn:this.player.assists.esc,absActive:this.player.absActive,tcsActive:this.player.tcsActive,escActive:this.player.escActive,slipRatio:this.player.slipRatio,physicsHz:120,msP95:this.telem.snapshot().p95,backend:this.telem.backend,kinMix:this.player.kinMix,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures})}function sp(e){this.leases.release(`env-rt`),this.envRT=e,this.leases.retain(`env-rt`,()=>e.dispose(),{owner:`race-engine`,kind:`render-target`})}function cp(){this.csm&&this.scene.traverse(e=>{let t=e.material;if(!t)return;let n=Array.isArray(t)?t:[t];for(let e of n)e&&(e.isMeshStandardMaterial||e.isMeshPhysicalMaterial)&&(this.csm.setupMaterial(e),kl(e))})}function lp(){return this.soft||this.quality===`low`||this.csmMuted?0:this.quality===`high`?3:1}function up(){if(!this.csm)return;let e=this.csmWanted();this.csm.lights.forEach((t,n)=>{t.visible=n<e})}function dp(){if(!this.csm)return;let e=this.csmWanted();if(e===0){for(let e of this.csm.lights)e.intensity=0;return}this.csm.lightDirection.copy(this.world.sunDir).multiplyScalar(-1).normalize();let t=ln(this.clock)>.5?.16:1.22;this.csm.lights.forEach((n,r)=>{n.visible=r<e,n.intensity=r<e?t:0}),this.csm.update()}function fp(e){try{let t=navigator.getGamepads?.()?.[0]?.vibrationActuator;if(!t?.playEffect)return;t.playEffect(`dual-rumble`,{duration:70+e*140,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,e*.65),startDelay:0})}catch{}}function pp(e){if(this.tickId+=1,this.replaying){this.stepReplay(e);return}if((this.input.keys.has(`KeyR`)||this.input.touchRewind||navigator.getGamepads?.()?.[0]?.buttons[2]?.pressed)&&this.racing&&this.countdown<=0&&!this.player.finished&&this.rewindBuf.length>1){this.stepRewind(e);return}if(this.rewinding&&this.post.setFilter(0),this.rewinding=!1,this.countdown>0){let t=this.countdown;this.countdown-=e,Math.floor(t)!==Math.floor(this.countdown)&&this.countdown>0&&this.audio.beep(this.countdown>1?520:780,.1,.16),t>0&&this.countdown<=0&&(this.racing=!0,this.audio.beep(980,.22,.2))}if(this.freeze>0){if(this.freeze-=e,this.recordReplay(e),this.countdown>0||this.totalTime<2.5)this.freeze=0;else return}this.impactCd=Math.max(0,this.impactCd-e);let t=this.input.poll();this.countdown>0&&(t.throttle=0,t.brake=0,t.nitro=!1,t.drift=!1),this.racing&&!this.player.finished&&(this.totalTime+=e,this.lapTime+=e);for(let n=0;n<this.racers.length;n++){let r=this.racers[n],i=r.progress,a=n===0?t:hl(r,this.built,this.player);n!==0&&this.countdown>0&&(a.throttle=0,a.brake=0,a.drift=!1),r.step(e,a,this.built,this.racing&&this.countdown<=0,this.world.colliders.concat(this.extraHits),this.world.streets,this.world.ramps);let o=r.consumeCheckpoints(this.built,i);if(o.checkpoint&&n===0&&(this.audio.checkpoint(),this.ping=1),n===0&&this.racing&&this.countdown<=0&&!this.player.finished){this.sectorClock+=e;let t=o.lapComplete?0:Math.min(2,Math.floor(this.player.progress*3));o.lapComplete?(this.closeSector(2),this.sectorIdx=0):t!==this.sectorIdx&&(this.closeSector(this.sectorIdx),this.sectorIdx=t)}o.lapComplete&&n===0&&(this.laps.push(this.lapTime),this.lapTime<this.bestLap&&(this.bestLap=this.lapTime),this.lapTime=0,r.lap>=this.totalLaps&&this.mode!==`roam`&&this.endRace()),o.lapComplete&&this.mode===`knockout`&&this.checkKnockout()}this.applyAltitudeLook(),this.mode===`roam`&&this.stampPois(),this.player.wrongWayT>.45&&this.racing&&!this.player.finished?(this.wrongBeep-=e,this.wrongBeep<=0&&(this.audio.beep(220,.16,.12),this.wrongBeep=.9)):this.wrongBeep=0;for(let t of this.traffic){let n=gl(t,this.built);this.countdown>0&&(n.throttle=0,n.brake=0),t.step(e,n,this.built,this.racing&&this.countdown<=0,this.world.colliders.concat(this.extraHits),this.world.streets,this.world.ramps)}for(let t of this.cops){let n=_l(t,this.built,this.player,this.heat);this.countdown>0&&(n.throttle=0,n.brake=0,n.nitro=!1),t.step(e,n,this.built,this.racing&&this.countdown<=0,this.world.colliders.concat(this.extraHits),this.world.streets,this.world.ramps)}this.mode===`heat`&&this.racing&&!this.player.finished&&this.stepHeat(e),this.racing&&this.countdown<=0&&!this.player.finished?vl(this.player,this.racers):this.player.drafting=!1;let n=yl([...this.racers,...this.traffic,...this.cops]);if(this.player.nitroPulse&&this.audio.whoosh(),this.player.impact>.55&&this.impactCd<=0?(this.audio.impact(this.player.impact),this.trauma=Math.min(1,this.trauma+this.player.impact*.7),this.freeze=.012,this.impactCd=.22,this.player.damage=Math.min(1,this.player.damage+this.player.impact*(this.player.lastHit===`building`?.08:.04)),uc(this.visuals[0],this.player.damage,this.player.dirt),fp(this.player.impact),this.mode===`heat`&&(this.bustAcc=Math.min(2.7,this.bustAcc+.38)),this.combo=0,this.comboHold=0):n>10&&this.impactCd<=0&&(this.audio.impact(Math.min(1,n/18)),this.trauma=Math.min(1,this.trauma+.28),this.impactCd=.18,this.player.damage=Math.min(1,this.player.damage+.05),uc(this.visuals[0],this.player.damage,this.player.dirt),fp(.35)),this.audio.updateEngine(Math.abs(this.player.speed),this.player.boostT>0,this.player.drifting,this.player.slip,this.player.rpm),this.audio.pulseMusic(this.world.night,e),this.audio.updateSiren(this.mode===`heat`&&this.racing&&!this.busted&&!this.escaping,e),this.audio.updateRain(this.weather===`rain`||this.weather===`storm`,this.weather===`storm`),this.racing&&!this.player.finished&&(this.ghostAcc+=e,this.ghostAcc>=.16&&(this.ghostAcc=0,this.ghostBuf.push({x:this.player.x,y:this.player.y,z:this.player.z,yaw:this.player.yaw})),this.recordReplay(e)),this.player.drifting&&(this.trauma=Math.min(.35,this.trauma+e*.12)),this.player.surfaceKind===`curb`&&(this.trauma=Math.min(.45,this.trauma+e*.35)),this.player.surfaceKind===`sand`&&(this.trauma=Math.min(.3,this.trauma+e*.12)),this.trauma=Math.max(0,this.trauma-e*2.4),this.racing&&this.countdown<=0&&this.stepDriftCraft(e),this.racing&&this.countdown<=0&&this.racers.length>1&&!this.player.finished){let e=this.standings().indexOf(this.player)+1;e!==this.lastPlace&&this.totalTime>2.2&&(this.banter=_c(e<this.lastPlace,this.opts.langHe,this.rivalIdx),this.banterT=2.8),this.lastPlace=e}}function mp(e){if(this.bonusT=Math.max(0,this.bonusT-e),this.missCd=Math.max(0,this.missCd-e),this.player.drifting?(this.lastDrifting||(this.combo=Math.min(12,Math.max(1,this.combo+1))),this.comboHold=1.25):(this.comboHold-=e,this.comboHold<=0&&(this.combo=0)),this.lastDrifting=this.player.drifting,this.player.comboMul=1+this.combo*.18,!this.player.drifting||this.missCd>0||this.player.finished){this.bonusT<=0&&(this.driftBonus=``);return}let t=[...this.racers,...this.traffic,...this.cops];for(let e of t){if(e===this.player||e.eliminated)continue;let t=Math.hypot(e.x-this.player.x,e.z-this.player.z);if(t<2.3||t>6.4||Math.abs(this.player.speed-e.speed)<6)continue;let n=Math.round((220+(6.4-t)*80)*this.player.comboMul);this.player.driftScore+=n,this.combo=Math.min(12,this.combo+1),this.missCd=.7,this.bonusT=1.4,this.driftBonus=this.opts.langHe?`ניר-מיס +${n}`:`Near miss +${n}`,this.trauma=Math.min(1,this.trauma+.22);break}}function hp(){return[...this.racers].sort((e,t)=>t.raceScore()-e.raceScore())}function gp(e){if(this.busted||this.player.finished)return;let t=1/0;for(let e of this.cops)t=Math.min(t,Math.hypot(e.x-this.player.x,e.z-this.player.z));if(this.wanted=1+Math.min(4,Math.floor(this.heatMax*4.2)),t<18){this.escaping=!1,this.cooldown=Math.max(0,this.cooldown-e*.55);let n=1-t/18,r=1.15-s(Math.abs(this.player.speed)/52,0,.7);this.bustAcc+=e*n*r*(.85+this.wanted*.08)}else t>40?(this.escaping=!0,this.cooldown=Math.min(1,this.cooldown+e/7.2),this.bustAcc=Math.max(0,this.bustAcc-e*.45),this.cooldown>=1&&(this.wanted=Math.max(1,this.wanted-1),this.heatMax=Math.max(.12,this.heatMax-.22),this.cooldown=0,this.escaping=!1,this.bustAcc*=.35,this.banter=this.opts.langHe?`איבדת אותם. קירור.`:`You lost them. Cooldown.`,this.banterT=2.8,this.pushCopsBack())):(this.escaping=!1,this.cooldown=Math.max(0,this.cooldown-e*.18));this.heat=s(this.bustAcc/2.7,0,1),this.heatMax=Math.max(this.heatMax,this.heat),this.totalTime>5&&this.ensureCops(Math.min(this.lite?3:5,this.wanted+1)),this.blockCd=Math.max(0,this.blockCd-e),this.heat>.32&&this.blockCd<=0&&this.totalTime>8&&!this.blockGroup&&this.spawnRoadblock(),this.tickRoadblock(),this.bustAcc>=2.7&&(this.busted=!0,this.player.finished=!0,this.audio.bust(),this.trauma=1,this.endRace())}function _p(){for(let e=0;e<this.cops.length;e++){let t=(this.player.progress-.12-e*.03+1)%1;this.cops[e].spawn(this.built,t,this.cops[e].aiOffset),this.cops[e].speed=18}}function vp(e){for(;this.cops.length<e;)this.addCop(this.cops.length)}function yp(e){let t=this.trackDef.city===`nyc`,n=15920872,r=t?1718890:1454152,i=cn[0],a=new pl({...i,id:i.id,color:n,accent:r,maxSpeed:54+e*1.1,accel:5.4,brake:32,turnRate:2.35,grip:.94,drag:.48,mass:1.18},t?`NYPD`:`Police`);a.isAi=!0,a.isCop=!0,a.aiSkill=.96,a.aiOffset=(e%2==0?-1:1)*2.4,a.nitro=.55,a.baseGrip=ml[this.trackDef.theme]??1,a.surfaceGrip=a.baseGrip,a.spawn(this.built,(this.player.progress-.1-e*.03+1)%1,a.aiOffset),this.cops.push(a);let o=lc(n,r,!1,!1,`gt`,!0);dc(o,this.world.night),this.scene.add(o.group),this.copVis.push(o)}function bp(){let t=(this.player.progress+.15)%1,n=il(this.built.samples,t),r=Math.atan2(-n.tx,-n.tz);this.built.width*.22;let i=e(`${this.opts.trackId}|${t.toFixed(4)}`)>.5?1:-1,a=new lt,o=new q({color:9080984,roughness:.72,metalness:.12}),s=new q({color:15228960,roughness:.55}),c=[],l=(e,t)=>{let i=n.x+n.rx*e,s=n.z+n.rz*e,l=new J(new G(1.4,1.15,2.6),o);l.position.set(i,n.y+.6,s),l.rotation.y=r,l.castShadow=!this.lite,a.add(l),c.push({x:i,z:s,r:t,kind:`barrier`})};l(i*(this.built.width*.38),2.4),l(i*(this.built.width*.18),2.2),l(-i*(this.built.width*.4),2.1);for(let e=0;e<4;e++){let t=i*(.08+e*.12)*this.built.width,r=new J(new f(.28,.9,6),s);r.position.set(n.x+n.rx*t,n.y+.48,n.z+n.rz*t),a.add(r)}this.scene.add(a),this.blockGroup=a,this.extraHits=c,this.blockT=t,this.blockCd=20,this.banter=this.opts.langHe?`מחסום קדימה. יש פער.`:`Roadblock ahead. There's a gap.`,this.banterT=2.6}function xp(){if(!this.blockGroup||this.blockT<0)return;let e=this.player.progress-this.blockT;e<-.5&&(e+=1),e>.12&&this.clearRoadblock()}function Sp(){let e=this.player,t=this.built.checkpoints;if(!t.length)return 0;let n=(e.nextCheckpoint%t.length+t.length)%t.length,r=this.built.samples[Math.floor(t[n]*this.built.samples.length)%this.built.samples.length],i=r.x-e.x,a=r.z-e.z,o=-Math.sin(e.yaw),s=-Math.cos(e.yaw),c=Math.cos(e.yaw),l=-Math.sin(e.yaw);return Math.atan2(i*c+a*l,i*o+a*s)}function Cp(){if(this.player.finished||this.countdown>0)return;let e=this.trackDef.pois;for(let t=0;t<e.length;t++){if(this.poiGot.has(t))continue;let n=e[t];Math.hypot(this.player.x-n.x,this.player.z-n.z)<n.r*.72&&(this.poiGot.add(t),this.audio.checkpoint(),this.ping=1,this.banter=this.opts.langHe?n.he:n.en,this.banterT=2.2)}e.length>0&&this.poiGot.size>=e.length&&this.endRace()}function wp(){this.blockGroup&&(this.scene.remove(this.blockGroup),this.blockGroup.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(e=>e.dispose()):n?.dispose()})),this.blockGroup=null,this.extraHits=[],this.blockT=-1}function Tp(){let e=this.racers.filter(e=>!e.eliminated&&!e.finished),t=Math.max(0,...e.map(e=>e.lap));if(t<=this.koMarked||(this.koMarked=t,e.length<=1))return;let n=[...e].sort((e,t)=>e.raceScore()-t.raceScore())[0];if(n.eliminated=!0,n.finished=!0,this.audio.impact(.65),n===this.player){this.endRace();return}let r=this.racers.filter(e=>!e.eliminated&&!e.finished);r.length===1&&r[0]===this.player&&(this.player.lap=this.totalLaps,this.endRace())}function Ep(e){let t=this.sectorClock;if(this.sectorClock=0,t<.4)return;let n=(e%3+3)%3,r=this.bestSectors[n];this.sectorDelta=Number.isFinite(r)&&r<1e8?t-r:0,t<r&&(this.bestSectors[n]=t)}function Dp(){if(this.finishedSent||this.pendingResult)return;this.player.finished=!0,this.audio.finish(),this.audio.cheer();let e=this.standings().indexOf(this.player)+1;this.mode===`heat`&&(e=this.busted?4:1),(this.mode===`time`||this.mode===`drift`||this.mode===`roam`)&&(e=1),this.mode===`knockout`&&this.player.eliminated&&(e=this.racers.filter(e=>!e.eliminated).length+1);let t=!this.timeVoided&&!this.qaForcedFinish&&Number.isFinite(this.totalTime)&&this.totalTime>=8,n={place:e,totalTime:this.totalTime,bestLap:Number.isFinite(this.bestLap)?this.bestLap:this.totalTime,laps:this.laps.slice(),trackId:this.opts.trackId,carId:this.opts.carId,mode:this.mode,driftScore:Math.round(this.player.driftScore),busted:this.busted,heatMax:this.heatMax,eventId:this.opts.eventId,weather:this.weather,cash:0,ghostBeaten:!1,line:vc(e,this.busted,this.opts.langHe,this.rivalIdx),eligible:t};this.cashWon=t?mn(n):0,n.cash=this.cashWon,t&&!this.busted&&(this.ghostBeaten=zn(this.opts.trackId,this.totalTime,this.ghostBuf),n.ghostBeaten=this.ghostBeaten),wn(this.opts.carId,this.player.damage),this.pendingResult=n,this.emitFinish()}function Op(){this.finishedSent||!this.pendingResult||(this.finishedSent=!0,this.replaying=!1,this.opts.onFinish(this.pendingResult))}function kp(){this.replaying&&(this.replaying=!1,this.emitFinish())}function Ap(){this.replayBuf.push(this.racers.map(e=>({x:e.x,y:e.y,z:e.z,yaw:e.yaw,speed:e.speed}))),this.replayBuf.length>140&&this.replayBuf.shift()}function jp(e){!this.racing||this.player.finished||(this.replayAcc+=e,this.replayAcc>=.1&&(this.replayAcc=0,this.recordSnap()),this.rewindAcc+=e,this.rewindAcc>=.05&&(this.rewindAcc=0,this.rewindBuf.push(this.takePack()),this.rewindBuf.length>100&&this.rewindBuf.shift()))}function Mp(){return{totalTime:this.totalTime,lapTime:this.lapTime,heat:this.heat,bustAcc:this.bustAcc,cooldown:this.cooldown,wanted:this.wanted,cars:this.racers.map(e=>e.snap()),traffic:this.traffic.map(e=>e.snap()),cops:this.cops.map(e=>e.snap())}}function Np(e){this.totalTime=e.totalTime,this.lapTime=e.lapTime,this.heat=e.heat,this.bustAcc=e.bustAcc,this.cooldown=e.cooldown??this.cooldown,this.wanted=e.wanted??this.wanted;for(let t=0;t<this.racers.length;t++){let n=e.cars[t];n&&this.racers[t].load(n)}for(let t=0;t<this.traffic.length;t++){let n=e.traffic[t];n&&this.traffic[t].load(n)}for(let t=0;t<this.cops.length;t++){let n=e.cops[t];n&&this.cops[t].load(n)}uc(this.visuals[0],this.player.damage);let t=Math.max(0,Math.floor(this.totalTime/.16));this.ghostBuf.length>t&&(this.ghostBuf.length=t);let n=Math.max(0,Math.floor(this.totalTime/.1));this.replayBuf.length>n&&(this.replayBuf.length=n)}function Pp(e){for(this.rewinding=!0,this.rewindTickT+=e,this.rewindTickT>.08&&(this.rewindTickT=0,this.audio.rewindTick()),this.rewindAcc+=e;this.rewindAcc>=.05&&this.rewindBuf.length>1;){this.rewindAcc-=.05,this.rewindBuf.pop();let e=this.rewindBuf[this.rewindBuf.length-1];e&&this.applyPack(e)}this.post.setFilter(0)}function Fp(e){let t=this.replayBuf.length*.1,n=this.replayT<1.35||this.replayT>t-2.1;if(this.replayT+=n?e*.42:e,this.replaySlow=n,this.replayT>=t){this.skipReplay();return}let r=Math.min(this.replayBuf.length-1,Math.floor(this.replayT/.1)),i=this.replayBuf[r],a=this.replayBuf[Math.min(this.replayBuf.length-1,r+1)],o=Math.min(1,(this.replayT-r*.1)/.1);for(let e=0;e<this.racers.length;e++){let t=i[e],n=a[e]??t;if(!t)continue;let r=this.racers[e];r.x=t.x+(n.x-t.x)*o,r.y=t.y+(n.y-t.y)*o,r.z=t.z+(n.z-t.z)*o;let s=n.yaw-t.yaw;for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;r.yaw=t.yaw+s*o,r.speed=t.speed+(n.speed-t.speed)*o}Math.floor(this.replayT/2.8)!==Math.floor((this.replayT-e)/2.8)&&(this.camMode=0,this.hood=!1)}function Ip(){return!1}function Lp(){}function Rp(e){return e}function zp(e){let t=e.getContext(),n=t.getExtension(`WEBGL_debug_renderer_info`),r=n?String(t.getParameter(n.UNMASKED_RENDERER_WEBGL)||``):``,i=String(t.getParameter(t.RENDERER)||``);return/swiftshader|llvmpipe|softpipe|microsoft basic render|subzero/i.test(`${r} ${i}`)}var Bp=class{renderer;gfx;leases=new Of;scene;camera;input;audio;world;post;envRT;probeRT=null;probeCam=null;probeTick=0;built;trackDef;player;racers;visuals;blobs=[];sparks;sparkPos;cam=new K;look=new K;desired=new K;disposed=!1;paused=!1;racing=!1;countdown=1.45;totalTime=0;lapTime=0;bestLap=1/0;laps=[];acc=0;last=0;trauma=0;fog=new st(790552,.005);hood=!1;hudTimer=0;hoodEdge=!1;lookBack=!1;autoCycle=!1;clock=.5;clockBake=0;lastDirt=-1;replaySlow=!1;banter=``;banterT=0;lastPlace=4;rivalIdx=0;combo=0;comboHold=0;lastDrifting=!1;poiGot=new Set;wrongBeep=0;driftBonus=``;bonusT=0;missCd=0;gate;ping=0;snapPhoto=!1;sectorClock=0;sectorIdx=0;sectorDelta=0;bestSectors=[1/0,1/0,1/0];fovExtra=0;skidMesh;skidI=0;skidAcc=0;skidDummy=new C;smokeMesh;smokeDummy=new C;smokes=[];boostPts;boostPos;traffic=[];trafficVis=[];freeze=0;impactCd=0;poly;opts;canvas;lite=!1;quality=`high`;droppedTier=!1;dyn=new Af;csmMuted=!1;lastPresent=0;webgpuTried=!1;webgpuOk=!1;webgpuReason=``;soft=!1;mode=`circuit`;totalLaps=3;cops=[];copVis=[];heat=0;heatMax=0;bustAcc=0;busted=!1;cooldown=0;wanted=1;escaping=!1;extraHits=[];csm=null;blockGroup=null;blockT=-1;blockCd=0;finishedSent=!1;koMarked=0;nowSec=0;weather=`clear`;rainMesh=null;rainPos=null;ghostVis=null;ghostFrames=[];ghostBuf=[];ghostAcc=0;ghostBeaten=!1;cashWon=0;ghostDelta=0;rivalGhostVis=null;rivalGhostFrames=[];rivalGhostDelta=0;camMode=0;replaying=!1;replayT=0;replayBuf=[];replayAcc=0;pendingResult=null;camNames=[`chase`];rewindBuf=[];rewindAcc=0;rewinding=!1;rewindTickT=0;radioEdge=!1;radioToast=0;photo=!1;photoHide=!1;photoYaw=0;photoPitch=.22;photoDist=8;photoFilter=0;photoLock=null;drivePR=1;driveExposure=1;filterNames=[`none`,`warm`,`neon`,`mono`,`film`,`blockbuster`,`bleach`,`polaroid`];filterHe=[`ללא`,`חם`,`ניאון`,`שחור-לבן`,`פילם`,`הוליווד`,`בליץ'`,`פולארויד`];ready;booted=!1;tickId=0;timeVoided=!1;qaForcedFinish=!1;glLost=!1;telem;constructor(e,t){this.canvas=e,this.opts=t,this.trackDef=on(t.trackId),this.built=rl(this.trackDef),this.weather=t.weather??`clear`;let n=e.clientWidth<700||/Mobi|Android/i.test(navigator.userAgent);this.quality=t.quality===`low`||t.quality===`mid`?t.quality:`high`,this.lite=this.quality===`low`,this.fovExtra=t.fovExtra??0,this.gfx=Cf.init(e,Tf(this.quality)),this.renderer=this.gfx.gl,this.telem=this.gfx.telem;let r=zp(this.renderer);this.soft=r,r&&(this.lite=!0);let i=!n&&!r;this.renderer.shadowMap.enabled=i,this.renderer.shadowMap.type=2,this.scene=new Ut;let a=El[Dl(this.trackDef.theme,t.trackId)],o=this.trackDef.theme===`desert`||t.trackId===`ramon`?4892892:this.trackDef.theme===`snow`||t.trackId===`hermon`?7254232:3117012;this.gfx.setEnvironment(t.night?wl.night.exposure:wl.summer14.exposure),this.fog=new st(t.night?a.nightCol:a.dayCol,t.night?a.night:a.day),this.scene.fog=this.fog,this.scene.background=new D(t.night?1582134:o);let s=a.far>=12e3||t.trackId===`scopus`||t.trackId===`jerusalem`;this.camera=new k(68,e.clientWidth/Math.max(1,e.clientHeight),.28,s?Math.max(a.far,12e3):a.far),this.opts.onBoot?.(.12),e.addEventListener(`webglcontextlost`,this.onContextLost),e.addEventListener(`webglcontextrestored`,this.onContextRestored),this.ready=this.assemble(i,r)}async assemble(e,t){if(await new Promise(e=>requestAnimationFrame(()=>e())),await new Promise(e=>requestAnimationFrame(()=>e())),this.disposed)return;if(this.opts.onBoot?.(.18),typeof location<`u`&&new URLSearchParams(location.search).get(`webgpu`)===`1`){this.webgpuTried=!0;let e=await Cf.probeWebGPU();this.webgpuOk=e.ok,this.webgpuReason=e.reason,console.info(`[gfx] webgpu`,e.ok?`ok`:`fail`,e.reason)}if(await ku(),await yt(this.trackDef.id),await Ks(),await Mu(this.renderer),await Ys(),await Us(this.renderer),await Cu(),await cu(),await au(),await nu(),await $l(),await Xl(),await ql(),await Hl(),await Ll(),await Ml(),this.trackDef.id===`oldjaffa`&&await mu(),this.trackDef.id===`rothschild`&&await _u(),(this.trackDef.id===`jerusalem`||this.trackDef.id===`scopus`||this.trackDef.id===`walls`)&&await du(),this.disposed)return;if(this.world=await vf(this.trackDef,this.built,e,this.opts.night,this.weather),this.world.setLod?.(this.quality),this.disposed){this.world.dispose();return}if(this.opts.onBoot?.(.72),await new Promise(e=>requestAnimationFrame(()=>e())),this.disposed){this.world.dispose();return}if(this.clock=this.opts.night?.9:.5,this.scene.add(this.world.group),!this.soft&&this.quality!==`low`&&this.renderer.shadowMap.enabled){this.world.dir.castShadow=!1,this.world.dirNear.castShadow=!1;let e=this.quality===`high`;this.csm=new tl({camera:this.camera,parent:this.scene,cascades:e?3:1,maxFar:e?160:90,mode:`practical`,shadowMapSize:e?1024:512,lightIntensity:1.25,lightNear:1,lightFar:e?280:140,lightMargin:28,shadowBias:-8e-5});let t=this.csm;this.leases.retain(`csm`,()=>{t.remove(),t.dispose(),this.csm===t&&(this.csm=null)},{owner:`race-engine`,kind:`csm`}),this.bindCsm()}let n=()=>({composer:null,bloom:null,grade:null,setSize(){},setDrive(){},setNight(){},setFilter(){},setBudget(){},setTier(){},setBloom(){},render:()=>this.renderer.render(this.scene,this.camera),dispose(){}});this.setEnvRT(new Pt(1,1)),this.post=n(),!t&&this.quality!==`low`&&requestAnimationFrame(()=>this.upgradeGraphics()),this.input=new bc(this.canvas),this.audio=new Io,this.audio.setVoice(Kt(this.opts.carId).body);let r=fn(Kt(this.opts.carId),Jt());this.player=new pl(r,r.nameHe),this.player.roam=(this.opts.mode??`circuit`)===`roam`||this.opts.trackId===`gushdan`,this.player.weatherGrip=ur[this.weather]??1,this.player.weather=this.weather,this.player.handling=this.opts.handling??`arcade`,this.player.assists={...this.opts.assists??Yn},this.player.damage=qn(this.opts.carId),this.mode=this.opts.mode??`circuit`,this.totalLaps=this.trackDef.open?1:sr[this.mode],this.racers=[this.player],fr(this.mode)&&cn.filter(e=>e.id!==this.opts.carId).slice(0,3).forEach((e,t)=>{let n=Hn[t%Hn.length],r=new pl(e,this.opts.langHe?n.he:n.en);r.isAi=!0,r.aiSkill=.9-t*.05,r.aiOffset=(t%2==0?-1:1)*(2.2+t*.4),r.handling=this.player.handling,r.assists={abs:!0,tcs:!0,esc:!0},r.weather=this.weather,this.racers.push(r)});let i=ur[this.weather]??1,a=ml[this.trackDef.theme]??1;for(let e of this.racers)e.weatherGrip=i,e.weather=this.weather,e.baseGrip=a,e.surfaceGrip=a;if(this.visuals=this.racers.map((n,r)=>{let i=lc(n.stats.color,n.stats.accent,e,r===0&&!t&&this.quality!==`low`,n.stats.body,n.stats.kit===`police`,r===0?this.opts.tune:void 0);return dc(i,this.opts.night),r===0&&uc(i,this.player.damage,this.player.dirt),this.scene.add(i.group),i}),!t&&this.quality!==`low`){this.probeRT=new qr(96);let e=this.probeRT;this.leases.retain(`probe-rt`,()=>{e.dispose(),this.probeRT===e&&(this.probeRT=null)},{owner:`race-engine`,kind:`render-target`}),this.probeCam=new $e(1.2,220,this.probeRT)}let o=ju();if(!o)throw Error(`blob texture missing`);let s=new pe(4.9,2.45);s.rotateX(-Math.PI/2);let c=new Ct({map:o,transparent:!0,opacity:this.opts.night?.68:.5,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});this.blobs=this.racers.map(()=>{let e=new J(s,c);return e.renderOrder=1,e.frustumCulled=!1,this.scene.add(e),e});let l=this.built.samples.length;this.poly=[];for(let e=0;e<l;e+=4)this.poly.push({x:this.built.samples[e].x,z:this.built.samples[e].z});this.sparkPos=new Float32Array(180);let d=new zt;d.setAttribute(`position`,new At(this.sparkPos,3)),this.sparks=new m(d,new tt({color:16763e3,size:.18,transparent:!0,opacity:.85,depthWrite:!1})),this.scene.add(this.sparks),this.gate=new J(new ht(this.built.width*.42,.08,8,24),new q({color:7260356,emissive:3855560,emissiveIntensity:1.6,roughness:.25,metalness:.2,transparent:!0,opacity:.85})),this.gate.rotation.y=Math.PI/2,this.scene.add(this.gate);let f=new pe(.62,1.55);f.rotateX(-Math.PI/2);let p=new Ct({map:o,color:1184790,transparent:!0,opacity:.48,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});this.skidMesh=new Lt(f,p,180),this.skidMesh.instanceMatrix.setUsage(u),this.skidMesh.count=0,this.scene.add(this.skidMesh);let h=new pe(1.6,1.6);h.rotateX(-Math.PI/2);let g=new Ct({map:o,color:11581630,transparent:!0,opacity:.26,depthWrite:!1});this.smokeMesh=new Lt(h,g,64),this.smokeMesh.instanceMatrix.setUsage(u),this.smokeMesh.count=0,this.scene.add(this.smokeMesh),this.boostPos=new Float32Array(90);let _=new zt;_.setAttribute(`position`,new At(this.boostPos,3)),this.boostPts=new m(_,new tt({color:8315100,size:.22,transparent:!0,opacity:.8,depthWrite:!1})),this.boostPts.visible=!1,this.scene.add(this.boostPts),this.spawnTraffic(),En(this.mode)&&this.spawnCops(),this.spawnRain(),this.spawnGhost(),this.placeGrid(),this.bindCsm(),this.snapCamera(!0),this.world.followShadows(this.player.x,this.player.y,this.player.z),this.updateCsm(),this.onResize=this.onResize.bind(this),window.addEventListener(`resize`,this.onResize),requestAnimationFrame(()=>this.onResize()),this.last=performance.now();try{this.renderer.compile(this.scene,this.camera)}catch{}if(!this.captureSceneEnv())try{let e=Vc(this.renderer,this.world.night);this.setEnvRT(e),this.scene.environment=e.texture}catch{}this.scene.environmentIntensity=this.world.night?.42:.7,this.renderer.setAnimationLoop(()=>this.frame()),this.rivalIdx=(this.opts.eventId?.length??1)%4;let v=this.opts.eventId?Vn(this.opts.eventId):null;this.banter=gc(v,this.opts.langHe),this.banterT=5.5,this.pushHud(),this.booted=!0,this.opts.onBoot?.(1)}placeGrid(){let e=this.racers.length;for(let t=0;t<e;t++){let e=t===0?.03:(.03-.012*t+1)%1,n=t===0?this.trackDef.id===`rothschild`?-10.2:-2.2:this.racers[t].aiOffset;t===0&&(this.racers[t].aiOffset=n),this.racers[t].spawn(this.built,e,n)}this.clearSpawnHits()}clearSpawnHits(){let e=this.built.samples[0],t=this.built.width/2+14,n=this.world.colliders.filter(n=>{if(Math.hypot(n.x-e.x,n.z-e.z)<t)return!1;for(let e of this.racers)if(Math.hypot(n.x-e.x,n.z-e.z)<n.r+4.5)return!1;return!0});this.world.colliders.length=0,this.world.colliders.push(...n)}spawnTraffic(){let e=this.trackDef.theme===`highway`||this.trackDef.id===`gushdan`||this.trackDef.id===`hw90`,t=this.lite?4:e?11:this.mode===`roam`?9:7,n=this.trackDef.city===`nyc`,r=cn[0];for(let i=0;i<t;i++){let a=n?i%2?`taxi`:`sedan`:i%5==0?`bus`:e&&i%4==1?`truck`:i%2?`taxi`:`sherut`,o=a===`taxi`?16106496:a===`bus`?15262932:a===`truck`?3817028:a===`sedan`?1842206:15789284,s=a===`taxi`?1710620:a===`bus`?1727546:15920872,c=a===`taxi`||a===`bus`?`hatch`:a===`truck`?`muscle`:`gt`,l=new pl({...r,id:r.id,color:o,accent:s,maxSpeed:a===`truck`?16:a===`bus`?18:21,accel:a===`truck`?1.6:a===`bus`?1.9:2.6,brake:7,turnRate:a===`truck`?1.35:1.7,grip:.88,drag:a===`truck`?.9:.7,mass:a===`truck`?1.8:a===`bus`?1.45:1.05},n?`Taxi`:a===`bus`?`Egged`:a===`truck`?`Truck`:a===`taxi`?`Taxi`:`Sherut`);l.isAi=!0,l.isTraffic=!0,l.aiSkill=.48+i%3*.08;let u=this.trackDef.id===`rothschild`?10.2:Math.min(a===`truck`?2.6:3.4,this.built.width*.28);l.aiOffset=(i%2==0?-1:1)*u,l.baseGrip=ml[this.trackDef.theme]??1,l.surfaceGrip=l.baseGrip,l.weatherGrip=ur[this.weather]??1,l.weather=this.weather,l.handling=`simcade`,l.assists={abs:!0,tcs:!0,esc:!1},l.spawn(this.built,(.12+i/t)%1,l.aiOffset),this.traffic.push(l);let d=lc(o,s,!1,!1,c);a===`bus`&&d.group.scale.set(1.12,1.22,1.38),a===`truck`&&d.group.scale.set(1.18,1.28,1.42),dc(d,this.opts.night),this.scene.add(d.group),this.trafficVis.push(d)}}spawnCops(){let e=this.lite?2:3,t=this.trackDef.city===`nyc`,n=15920872,r=t?1718890:1454152,i=cn[0];for(let a=0;a<e;a++){let e=new pl({...i,id:i.id,color:n,accent:r,maxSpeed:54,accel:5.4,brake:32,turnRate:2.35,grip:.94,drag:.48,mass:1.18},t?`NYPD`:`Police`);e.isAi=!0,e.isCop=!0,e.aiSkill=.96,e.aiOffset=(a%2==0?-1:1)*2.4,e.nitro=.55,e.baseGrip=ml[this.trackDef.theme]??1,e.surfaceGrip=e.baseGrip,e.weatherGrip=ur[this.weather]??1,e.weather=this.weather,e.handling=this.player.handling,e.assists={abs:!0,tcs:!0,esc:!0},e.spawn(this.built,(.86-a*.04+1)%1,e.aiOffset),this.cops.push(e);let o=lc(n,r,!1,!1,`gt`,!0);dc(o,this.opts.night),this.scene.add(o.group),this.copVis.push(o)}}spawnRain(){let e=this.trackDef.theme===`snow`,t=this.weather===`hamsin`;if(this.weather===`clear`&&!e)return;let n=this.lite?280:e?720:t?640:this.weather===`storm`?900:560,r=new Float32Array(n*3);for(let e=0;e<n;e++)r[e*3]=(c(e,1)-.5)*36,r[e*3+1]=c(e,2)*22,r[e*3+2]=(c(e,3)-.5)*36;this.rainPos=r;let i=new zt;i.setAttribute(`position`,new At(r,3));let a=new tt({color:e?16054524:t?12886128:this.weather===`storm`?12109004:13950436,size:e?.16:t?.11:this.weather===`storm`?.09:.06,transparent:!0,opacity:e?.72:t?.42:.55,depthWrite:!1});this.rainMesh=new m(i,a),this.scene.add(this.rainMesh)}spawnGhost(){if(this.mode===`roam`)return;let e=(e,t)=>{e.bodyMat.transparent=!0,e.bodyMat.opacity=.3,e.bodyMat.metalness=.2,e.bodyMat.roughness=.35,e.bodyMat.emissive.setHex(t),e.bodyMat.emissiveIntensity=.32,e.bodyMat.depthWrite=!1,dc(e,!1)},t=er(this.opts.trackId);if(t?.frames.length){this.ghostFrames=t.frames;let n=lc(7260356,1454152,!1,!1,this.player.stats.body);e(n,7260356),this.scene.add(n.group),this.ghostVis=n}let n=Math.max(18,this.built.length/34);if(this.rivalGhostFrames=lr(this.built.samples,this.built.length,n),this.rivalGhostFrames.length>8){let t=lc(15778816,3811848,!1,!1,`gt`);e(t,15778816),this.scene.add(t.group),this.rivalGhostVis=t}}upgradeGraphics(){return Rf.call(Rp(this))}unlockAudio(){this.audio.unlock()}setPaused(e){this.photoLock&&!e||(this.paused=e,!e&&this.photo&&this.exitPhoto())}applyQuality(e){this.quality=e===`low`||e===`mid`?e:`high`,this.lite=this.quality===`low`||this.soft,this.droppedTier=!1,this.dyn.reset(),this.csmMuted=this.quality===`low`||this.soft,typeof navigator<`u`&&/mobi|android|iphone|ipad/i.test(navigator.userAgent);let t=this.lite?1:this.quality===`mid`?.75:.85;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1)*t),this.renderer.shadowMap.enabled=this.quality!==`low`&&!this.soft,this.quality===`low`?this.post.setTier(`low`):this.post.composer?this.post.setTier(this.quality):this.upgradeGraphics(),this.world.setLod?.(this.quality),this.rainMesh&&(this.rainMesh.visible=this.quality!==`low`&&this.weather!==`clear`&&this.weather!==`hamsin`),this.trimCsm(),this.applyGfxStep(),this.onResize()}isPaused(){return this.paused}restartRace(){this.placeGrid(),this.player.damage=0,this.player.dirt=0,this.visuals[0]&&uc(this.visuals[0],0,0),this.countdown=0,this.racing=!0,this.player.finished=!1,this.paused=!1}toggleMute(){return this.audio.setMuted(!this.audio.isMuted()),this.audio.isMuted()}setTouch(e){this.input.setTouch(e)}enterPhoto(){return zf.call(Rp(this))}exitPhoto(){return Bf.call(Rp(this))}frameWorld(e,t,n=52,r=22,i=28,a=40){return Vf.call(Rp(this),e,t,n,r,i,a)}isPhoto(){return Hf.call(Rp(this))}capturePhoto(){return Uf.call(Rp(this))}flushSnap(){return Wf.call(Rp(this))}cyclePhotoFilter(){return Gf.call(Rp(this))}togglePhotoHud(){return Kf.call(Rp(this))}cycleRadio(){let e=this.audio.cycleStation();return this.radioToast=2.6,No[e]}setAutoCycle(e){return qf.call(Rp(this),e)}getAutoCycle(){return Jf.call(Rp(this))}setNight(e){return Yf.call(Rp(this),e)}applyLook(){return Xf.call(Rp(this))}applyClockSky(e){return Zf.call(Rp(this),e)}captureSceneEnv(){return Qf.call(Rp(this))}applyAltitudeLook(){return $f.call(Rp(this))}updateProbe(){return ep.call(Rp(this))}onContextLost=e=>Mf.call(Rp(this),e);onContextRestored=()=>Nf.call(Rp(this));applyGfxStep(){return tp.call(Rp(this))}shouldPresent(e){return Pf.call(Rp(this),e)}onResize(){return Ff.call(Rp(this))}frame(){return If.call(Rp(this))}fixed(e){return pp.call(Rp(this),e)}stepDriftCraft(e){return mp.call(Rp(this),e)}standings(){return hp.call(Rp(this))}stepHeat(e){return gp.call(Rp(this),e)}pushCopsBack(){return _p.call(Rp(this))}ensureCops(e){return vp.call(Rp(this),e)}addCop(e){return yp.call(Rp(this),e)}spawnRoadblock(){return bp.call(Rp(this))}tickRoadblock(){return xp.call(Rp(this))}navAngle(){return Sp.call(Rp(this))}stampPois(){return Cp.call(Rp(this))}clearRoadblock(){return wp.call(Rp(this))}checkKnockout(){return Tp.call(Rp(this))}closeSector(e){return Ep.call(Rp(this),e)}endRace(){return Dp.call(Rp(this))}emitFinish(){return Op.call(Rp(this))}skipReplay(){return kp.call(Rp(this))}recordSnap(){return Ap.call(Rp(this))}recordReplay(e){return jp.call(Rp(this),e)}takePack(){return Mp.call(Rp(this))}applyPack(e){return Np.call(Rp(this),e)}stepRewind(e){return Pp.call(Rp(this),e)}stepPhoto(e){return np.call(Rp(this),e)}stepReplay(e){return Fp.call(Rp(this),e)}present(e){return rp.call(Rp(this),e)}snapCamera(e,t=.016){return ip.call(Rp(this),e,t)}setFovExtra(e){return ap.call(Rp(this),e)}pushHud(){return op.call(Rp(this))}qaHookAllowed(){return Ip.call(Rp(this))}exposeControls(){return Lp.call(Rp(this))}setEnvRT(e){return sp.call(Rp(this),e)}bindCsm(){return cp.call(Rp(this))}csmWanted(){return lp.call(Rp(this))}trimCsm(){return up.call(Rp(this))}updateCsm(){return dp.call(Rp(this))}dispose(){if(this.disposed)return;this.disposed=!0,this.renderer.setAnimationLoop(null),this.canvas.removeEventListener(`webglcontextlost`,this.onContextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.onContextRestored),window.removeEventListener(`resize`,this.onResize),this.clearRoadblock(),this.input?.dispose(),this.audio?.dispose(),this.leases.disposeAll(),this.world?.dispose();let e=Xs();for(let t of this.visuals??[])mc(t,e);for(let t of this.trafficVis??[])mc(t,e);for(let t of this.copVis??[])mc(t,e);this.ghostVis&&mc(this.ghostVis,e),this.rivalGhostVis&&mc(this.rivalGhostVis,e),Qs(this.scene,e),this.scene.environment=null,this.scene.background=null,this.renderer.renderLists.dispose(),this.gfx.dispose()}};export{Bp as RaceEngine};