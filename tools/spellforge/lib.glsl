#version 300 es
precision highp float; precision highp int; precision highp sampler3D;

uniform float u_time,u_age,u_life,u_dur,u_soft,u_add,u_dummy;
uniform vec3 u_hand,u_handL,u_chest,u_handRel,u_head;
uniform float u_htraj;   // 1 when handAt() has a stage-caster trajectory; in fights the hero's current hands stand in
uniform vec2 u_arms;   // stage mannequin arm raise (right, left), 0 = rest, 1 = the authored cast pose   // u_handRel: casting hand latched on the release frame   // rigged caster hands (world m), when the effect declares a caster
uniform vec2 u_res,u_nf;
uniform vec3 u_cam,u_right,u_up,u_fwd;
uniform mat4 u_vp,u_ivp,u_model;
uniform sampler2D u_noise,u_depth;
uniform sampler3D u_vol;
uniform vec4 u_lpos[8];
uniform vec3 u_lcol[8];
uniform highp sampler2D u_cdat;
uniform vec3 u_keyDir,u_keyCol,u_amb,u_fog,u_zen;
uniform vec3 u_mouse,u_hit;uniform float u_click;
uniform vec4 u_shad[4];

#define PI 3.14159265359
#define TAU 6.28318530718
#define sat(x) clamp(x,0.,1.)

// ---------- hashes ----------
float hash11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float hash21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float hash31(vec3 p3){p3=fract(p3*.1031);p3+=dot(p3,p3.zyx+31.32);return fract((p3.x+p3.y)*p3.z);}
vec2 hash22(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}
vec3 hash33(vec3 p3){p3=fract(p3*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yxz+33.33);return fract((p3.xxy+p3.yxx)*p3.zyx);}
vec4 hash41(float p){vec4 p4=fract(vec4(p)*vec4(.1031,.1030,.0973,.1099));p4+=dot(p4,p4.wzxy+33.33);return fract((p4.xxyz+p4.yzzw)*p4.zywx);}

// ---------- math / shaping ----------
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float remap(float x,float a,float b,float c,float d){return c+(x-a)*(d-c)/(b-a);}
float remap01(float x,float a,float b){return sat((x-a)/(b-a));}
float easeOut(float x){x=sat(x);return 1.-(1.-x)*(1.-x)*(1.-x);}
float easeIn(float x){x=sat(x);return x*x*x;}
float easeInOut(float x){x=sat(x);return x*x*(3.-2.*x);}
float easeOutExpo(float x){x=sat(x);return 1.-exp2(-10.*x);}
float easeOutBack(float x){x=sat(x);float c=1.70158;float y=x-1.;return 1.+(c+1.)*y*y*y+c*y*y;}
// 0 -> 1 -> 0 window: rises over [a,a+s], falls over [b-s2,b]
float pulse(float x,float a,float b,float s,float s2){return smoothstep(a,a+s,x)*(1.-smoothstep(b-s2,b,x));}
// attack/decay envelope for one-shots: fast rise to 1 at 'atk', exponential-ish fall to 0 at 1
float adsr(float x,float atk){return x<atk?sat(x/atk):pow(sat(1.-(x-atk)/(1.-atk)),2.);}
float band(float x,float c,float w){return smoothstep(w,0.,abs(x-c));}
float inv(float d,float w){return w/(abs(d)+w);}
// erosion: reveal 'm' as threshold climbs (alpha-erosion / dissolve, the workhorse of stylized VFX)
float erode(float m,float th,float soft){return smoothstep(th,th+soft,m);}

// ---------- procedural noise (use in vertex shaders or when you need exact control) ----------
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float vnoise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+17.1;a*=.5;}return s;}
float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vnoise3(p);p=p*2.03+17.1;a*=.5;}return s;}
// voronoi: x=F1, y=F2, z=cell id. (y-x) gives crack lines.
vec3 voronoi(vec2 x){vec2 n=floor(x),f=fract(x);float f1=8.,f2=8.,id=0.;
  for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(i,j);vec2 o=hash22(n+g);vec2 r=g+o-f;float d=dot(r,r);
    if(d<f1){f2=f1;f1=d;id=hash21(n+g);}else if(d<f2){f2=d;}}
  return vec3(sqrt(f1),sqrt(f2),id);}
// curl-ish 2D flow from noise (divergence free): use to advect UVs or particles
vec2 curl2(vec2 p){float e=.1;float a=vnoise(p+vec2(0,e)),b=vnoise(p-vec2(0,e)),c=vnoise(p+vec2(e,0)),d=vnoise(p-vec2(e,0));return vec2(a-b,d-c)/(2.*e);}
vec3 curl3(vec3 p){ // cheap pseudo-curl for particle turbulence
  return vec3(vnoise3(p+vec3(0,13.1,7.7))-.5, vnoise3(p+vec3(31.4,0,3.3))-.5, vnoise3(p+vec3(5.5,21.7,0))-.5)*2.;}

float smin(float x,float y,float k){float h=sat(.5+.5*(y-x)/k);return mix(y,x,h)-k*h*(1.-h);}
// rotate p around a unit axis (tumbling debris, instanced meshes)
vec3 rotAxis(vec3 p,vec3 ax,float a){float c=cos(a),s=sin(a);return p*c+cross(ax,p)*s+ax*dot(ax,p)*(1.-c);}
vec3 bez2(vec3 a,vec3 b,vec3 c,float t){float u=1.-t;return u*u*a+2.*u*t*b+t*t*c;}
vec3 bez3(vec3 a,vec3 b,vec3 c,vec3 d,float t){float u=1.-t;return u*u*u*a+3.*u*u*t*b+3.*u*t*t*c+t*t*t*d;}
// jagged (unsmoothed) 1D noise in -1..1: lightning, cracks, glitches
float jag(float x,float seed){float i=floor(x),f=fract(x);return mix(hash11(i+seed*7.13),hash11(i+1.+seed*7.13),f)*2.-1.;}
// 3D voronoi: x = distance to nearest cell border, y = F1, z = cell id. c = vector to the cell centre.
vec3 voronoi3(vec3 x,out vec3 c){vec3 n=floor(x),f=fract(x);float f1=8.,f2=8.,ci=0.;vec3 r1=vec3(0.),r2=vec3(1.);
  for(int k=-1;k<=1;k++)for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec3 g=vec3(float(i),float(j),float(k));vec3 r=g+hash33(n+g)-f;float d=dot(r,r);
    if(d<f1){f2=f1;r2=r1;f1=d;r1=r;ci=hash31(n+g+7.3);}else if(d<f2){f2=d;r2=r;}}
  c=r1;return vec3(dot(.5*(r1+r2),normalize(r2-r1+1e-5)),sqrt(f1),ci);}
// 3D sdf primitives for raymarched forms in 'ray' layers
float sdSphere(vec3 p,float r){return length(p)-r;}
float sdEllipsoid(vec3 p,vec3 r){float k0=length(p/r),k1=length(p/(r*r));return k0*(k0-1.)/k1;}
float sdBox3(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdCapsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;return length(pa-ba*sat(dot(pa,ba)/dot(ba,ba)))-r;}
float sdTorus(vec3 p,vec2 t){return length(vec2(length(p.xz)-t.x,p.y))-t.y;}
float sdCone(vec3 p,float h,float r){vec2 q=vec2(length(p.xz),p.y);vec2 k=vec2(h,r);float d=max(dot(q,normalize(k)),-p.y-0.);return max(d,p.y-h);}
// random point on the mannequin surface (object space) from four randoms, and the outward direction there
vec3 bodySurf(vec4 h){float a=h.y*TAU;vec3 c;vec2 e;
  if(h.x<.3){float sd=h.z<.5?-1.:1.;float y=fract(h.z*2.)*.84+.03;c=vec3(sd*.105,y,0.);e=vec2(mix(.075,.097,y/.87));}
  else if(h.x<.66){float y=mix(.86,1.5,h.z);c=vec3(0.,y,0.);e=vec2(.21,.145)*mix(.85,1.08,smoothstep(.86,1.4,y));}
  else if(h.x<.86){float sd=h.z<.5?-1.:1.;float f=fract(h.z*2.);c=vec3(sd*mix(.39,.3,f),mix(.83,1.44,f),0.);e=vec2(.06);}
  else{c=vec3(0.,1.69,0.);e=vec2(.11)*sqrt(max(1.-pow(h.z*2.-1.,2.),0.));c.y+=(h.z*2.-1.)*.12;}
  return c+vec3(cos(a)*e.x,0.,sin(a)*e.y);}

// ---------- tiling noise textures (fast path; authored like a packed AAA noise sheet) ----------
// u_noise 256^2 RGBA, REPEAT, mipped:  R = perlin fbm   G = billowy worley fbm   B = fine perlin fbm   A = crack lines (worley F2-F1)
// u_vol   64^3  RGBA, REPEAT:          R = perlin-worley  G = worley fbm  B = fine worley  A = perlin fbm
vec4 nz(vec2 uv){return texture(u_noise,uv);}
// explicit-LOD lookup: use inside raymarch loops and for polar/atan lookups (no seam at the angle wrap)
vec4 nzL(vec2 uv){return textureLod(u_noise,uv,0.);}
vec4 nz3(vec3 p){return texture(u_vol,p);}
// ---------- anti-repetition: stochastic hex-tiling (Mikkelsen, "Practical Real-Time Hex-Tiling", JCGT 11(3) 2022;
// lattice and barycentrics as in Heitz & Neyret 2018). Three lookups on a hex lattice, each with its own random offset and
// rotation, blended with a luminance-aware contrast so features stay crisp instead of ghosting. Use for any large or
// slowly-scaled surface (ground, walls, funnels, skies) where the 256^2 noise sheet would visibly repeat.
vec2 hexHash(ivec2 v){return fract(sin(vec2(dot(vec2(v),vec2(127.1,311.7)),dot(vec2(v),vec2(269.5,183.3))))*43758.5453);}
void hexTri(vec2 st,out vec3 w,out ivec2 v1,out ivec2 v2,out ivec2 v3){
  st*=2.*1.7320508;vec2 sk=vec2(st.x-.57735027*st.y,1.15470054*st.y);ivec2 b=ivec2(floor(sk));
  vec3 t=vec3(fract(sk),0.);t.z=1.-t.x-t.y;float s=step(0.,-t.z),s2=2.*s-1.;
  w=vec3(-t.z*s2,s-t.y*s2,s-t.x*s2);v1=b+ivec2(int(s),int(s));v2=b+ivec2(int(s),1-int(s));v3=b+ivec2(1-int(s),int(s));}
vec2 hexUV(vec2 uv,ivec2 v,out mat2 R){vec2 h=hexHash(v);float a=h.x*6.2831853;R=mat2(cos(a),sin(a),-sin(a),cos(a));
  vec2 c=vec2(float(v.x)+.5*float(v.y),.8660254*float(v.y))/(2.*1.7320508);return R*(uv-c)+c+h*7.13;}
// vertex-stage safe variant (no derivatives)
vec4 nzHL(vec2 uv){vec3 w;ivec2 v1,v2,v3;hexTri(uv,w,v1,v2,v3);mat2 R1,R2,R3;
  vec4 A=textureLod(u_noise,hexUV(uv,v1,R1),0.),B=textureLod(u_noise,hexUV(uv,v2,R2),0.),C=textureLod(u_noise,hexUV(uv,v3,R3),0.);
  w=pow(max(w,vec3(0.)),vec3(5.));w/=max(w.x+w.y+w.z,1e-6);return A*w.x+B*w.y+C*w.z;}
#ifdef FRAG
vec4 nzH(vec2 uv){vec3 w;ivec2 v1,v2,v3;hexTri(uv,w,v1,v2,v3);vec2 dx=dFdx(uv),dy=dFdy(uv);mat2 R1,R2,R3;
  vec2 a=hexUV(uv,v1,R1),b=hexUV(uv,v2,R2),c=hexUV(uv,v3,R3);
  vec4 A=textureGrad(u_noise,a,R1*dx,R1*dy),B=textureGrad(u_noise,b,R2*dx,R2*dy),C=textureGrad(u_noise,c,R3*dx,R3*dy);
  vec3 l=vec3(dot(A.rgb,vec3(.3,.5,.2)),dot(B.rgb,vec3(.3,.5,.2)),dot(C.rgb,vec3(.3,.5,.2)));
  w*=mix(vec3(1.),l*1.6+.2,.6);w=pow(max(w,vec3(0.)),vec3(7.));w/=max(w.x+w.y+w.z,1e-6);return A*w.x+B*w.y+C*w.z;}
#else
vec4 nzH(vec2 uv){return nzHL(uv);}
#endif
// triplanar with hex-tiling on each plane
vec4 triH(vec3 p,vec3 n){vec3 w=pow(abs(n),vec3(4.));w/=w.x+w.y+w.z;return nzH(p.zy)*w.x+nzH(p.xz+.37)*w.y+nzH(p.xy+.71)*w.z;}
// ---------- 3D simplex noise (Ashima Arts / Stefan Gustavson, webgl-noise, MIT licence) ----------
vec3 sxMod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 sxMod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 sxPerm(vec4 x){return sxMod289(((x*34.)+10.)*x);}vec4 sxTis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=sxMod289(i);
  vec4 p=sxPerm(sxPerm(sxPerm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 nm=sxTis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
// fbm on simplex (non-repeating), ridged variant, and Quilez-style domain warp (f(p + fbm(p + fbm(p))))
float sfbm(vec3 p,int oct){float a=.5,s=0.,n=0.;for(int i=0;i<6;i++){if(i>=oct)break;s+=a*snoise(p);n+=a;p=p*2.02+vec3(13.1,7.3,3.9);a*=.5;}return s/n;}
float sridge(vec3 p,int oct){float a=.5,s=0.,n=0.;for(int i=0;i<6;i++){if(i>=oct)break;float r=1.-abs(snoise(p));s+=a*r*r;n+=a;p=p*2.03+vec3(5.7,1.3,9.1);a*=.5;}return s/n;}
float swarp(vec3 p,float k){vec3 q=vec3(sfbm(p,3),sfbm(p+vec3(5.2,1.3,2.8),3),sfbm(p+vec3(1.7,9.2,4.1),3));return sfbm(p+k*q,4);}
// triplanar lookup of the noise sheet for meshes without good uvs
vec4 tri(vec3 p,vec3 n){vec3 w=pow(abs(n),vec3(4.));w/=w.x+w.y+w.z;return nz(p.zy)*w.x+nz(p.xz+.37)*w.y+nz(p.xy+.71)*w.z;}
float fbmT(vec2 uv){return nz(uv).r*.6+nz(uv*2.7+.31).b*.3+nz(uv*6.1+.73).r*.1;}
// two-phase flow-map sampling of the noise sheet (channel r) along 'flow'
float flowN(vec2 uv,vec2 flow,float t){float p0=fract(t),p1=fract(t+.5);
  float a=nz(uv-flow*p0).r,b=nz(uv-flow*p1+.37).r;return mix(a,b,abs(p0*2.-1.));}

// ---------- colour ----------
vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(TAU*(c*t+d));}
vec3 hsv(float h,float s,float v){vec3 k=abs(fract(h+vec3(0.,2./3.,1./3.))*6.-3.)-1.;return v*mix(vec3(1.),sat(k),s);}
vec3 hueShift(vec3 c,float a){const vec3 k=vec3(.57735);float ca=cos(a*TAU),sa=sin(a*TAU);return c*ca+cross(k,c)*sa+k*dot(k,c)*(1.-ca);}
float luma(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
vec3 ramp3(vec3 a,vec3 b,vec3 c,float t){t=sat(t);return t<.5?mix(a,b,t*2.):mix(b,c,t*2.-2.+1.);}
vec3 ramp4(vec3 a,vec3 b,vec3 c,vec3 d,float t){t=sat(t)*3.;return t<1.?mix(a,b,t):t<2.?mix(b,c,t-1.):mix(c,d,t-2.);}
// HDR fire gradient: black -> deep red -> orange -> yellow-white
vec3 fireRamp(float t){t=max(t,0.);return pow(vec3(t),vec3(1.,2.6,6.))*vec3(3.2,2.,1.6);}
// single-tint energy gradient: low t = deep saturated tint, t~1 = full tint, t>1 = white-hot core. Works for any element colour.
vec3 glow(float t,vec3 tint){t=max(t,0.);vec3 c=pow(max(tint,vec3(.002)),vec3(mix(1.7,1.,sat(t))));return c*t*(1.+1.5*t)+vec3(.45)*pow(min(t,4.),4.);}

// realistic fire: blackbody-style ramp. t 0 = smoke black, .3 deep red, .6 orange, 1 yellow, >1.3 white. HDR.
vec3 blackbody(float t){t=max(t,0.);return vec3(1.,.42,.12)*pow(t,1.6)*2.2*vec3(1.,sat(t*.9),sat(t*t*.55))+vec3(.9,.95,1.)*pow(max(t-1.,0.),2.)*2.;}
// tinted flame ramp for magical fire: deep tint at the edge, pure tint in the body, pale hot core
vec3 flame(float t,vec3 tint){t=max(t,0.);vec3 k=pow(max(tint,vec3(.003)),vec3(mix(.85,.4,smoothstep(.2,1.,t))));return glow(t,k);}
// star field on a direction vector (skies, void interiors)
vec3 stars(vec3 d,float sc){vec3 g=d*sc;vec3 c=floor(g);vec3 h=hash33(c);float r=length(fract(g)-.5-(h-.5)*.6);
  float b=smoothstep(.17,0.,r)*step(.45,h.y)*(.1+.9*pow(h.z,6.))*(.72+.28*sin(u_time*(1.5+h.x*4.)+h.y*50.));return mix(vec3(1.,.78,.55),vec3(.62,.8,1.),h.x)*b;}

// ---------- uv ----------
// centred uv (-1..1) -> (angle 0..1, radius)
vec2 polar(vec2 p){return vec2(atan(p.y,p.x)/TAU+.5,length(p));}
vec2 twirl(vec2 p,float k){return rot(k*length(p))*p;}

// ---------- sdf ----------
float sdCircle(vec2 p,float r){return length(p)-r;}
float sdRing(vec2 p,float r,float w){return abs(length(p)-r)-w;}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}
float sdRBox(vec2 p,vec2 b,float r){return sdBox(p,b-r)-r;}
float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;return length(pa-ba*sat(dot(pa,ba)/dot(ba,ba)));}
float sdNgon(vec2 p,float r,float n){float a=atan(p.x,p.y),s=TAU/n;return cos(floor(.5+a/s)*s-a)*length(p)-r;}
float sdStar(vec2 p,float r,float n,float m){float an=PI/n,en=PI/m;vec2 acs=vec2(cos(an),sin(an)),ecs=vec2(cos(en),sin(en));
  float bn=mod(atan(p.x,p.y),2.*an)-an;p=length(p)*vec2(cos(bn),abs(sin(bn)));p-=r*acs;p+=ecs*clamp(-dot(p,ecs),0.,r*acs.y/ecs.y);return length(p)*sign(p.x);}
float sdHex(vec2 p,float r){const vec3 k=vec3(-.866025404,.5,.577350269);p=abs(p);p-=2.*min(dot(k.xy,p),0.)*k.xy;p-=vec2(clamp(p.x,-k.z*r,k.z*r),r);return length(p)*sign(p.y);}
// hex grid: xy = cell-local coords, z = distance to cell edge (0 at edge .. .5 centre), w = cell id
vec4 hexGrid(vec2 p){const vec2 s=vec2(1.,1.7320508);vec4 hc=floor(vec4(p,p-vec2(.5,1.))/s.xyxy)+.5;
  vec4 h=vec4(p-hc.xy*s,p-(hc.zw+.5)*s);vec4 r=dot(h.xy,h.xy)<dot(h.zw,h.zw)?vec4(h.xy,hc.xy):vec4(h.zw,hc.zw+.5);
  vec2 q=abs(r.xy);float e=.5-max(dot(q,s*.5),q.x);return vec4(r.xy,e,hash21(r.zw));}
// procedural rune glyph: p in [-1,1]^2, returns distance to strokes
float rune(vec2 p,float id){float d=1e3;
  for(int i=0;i<5;i++){vec4 h=hash41(id*7.31+float(i)*3.7+1.);vec2 a=(floor(h.xy*3.)-1.)*vec2(.5,.78),b=(floor(h.zw*3.)-1.)*vec2(.5,.78);d=min(d,sdSeg(p,a,b));}
  return d;}
// ring of n runes at radius r (p centred). returns stroke mask 0..1
float runeRing(vec2 p,float r,float n,float size,float seed){vec2 pc=polar(p);float k=pc.x*n;float i=floor(k);
  vec2 q=vec2((fract(k)-.5)*TAU*r/n,pc.y-r)/size;if(abs(q.x)>1.||abs(q.y)>1.)return 0.;
  return smoothstep(.16,.06,rune(q,i+seed*13.));}

// ---------- sprites (uv 0..1) ----------
float softDot(vec2 uv){float d=length(uv-.5)*2.;return sat(1.-d)*sat(1.-d);}
float hotDot(vec2 uv){float d=length(uv-.5)*2.;return .06/(d*d+.06)*sat(1.-d);}
// 4-point glint
float glint(vec2 uv){vec2 p=abs(uv-.5)*2.;float s=.02/(p.x*p.y*8.+.02)*sat(1.-max(p.x,p.y));return s*s+hotDot(uv)*.6;}
// angular debris chip / shard mask (seed 0..1 picks the shape)
float chip(vec2 uv,float seed){vec2 p=(uv-.5)*2.;p=rot(seed*6.283)*p;float d=max(abs(p.x)*(1.2+seed)+p.y*.6,max(-p.y*1.4-.5+seed*.3,abs(p.x*.7-p.y*.4)-.55));return smoothstep(.72,.6,d);}
// eroding smoke puff mask: rnd = per-particle randoms, age 0..1
float puff(vec2 uv,vec4 rnd,float age){float d=length(uv-.5)*2.;float n=nz(uv*.5+rnd.xy*3.+vec2(0.,-age*.25)).r*.6+nz(uv*1.3+rnd.zw).g*.4;return erode(sat(1.-d)*n*2.2,mix(.16,1.,age),.32);}
// soft vapour wisp mask for small or sparse sprites (puff() looks chunky below about 30 cm)
float vapour(vec2 uv,vec4 rnd,float age){float d=length(uv-.5)*2.;float n=nz(uv*.35+rnd.xy*3.+vec2(0.,-age*.2)).r;return sat(1.-d)*sat(1.-d)*smoothstep(age*.7,age*.7+.5,n+.25)*(1.-age*age);}
// streak along v (for stretched sparks)
float streak(vec2 uv){vec2 p=uv-.5;return sat(1.-abs(p.x)*2.)*sat(1.-abs(p.y)*2.)*inv(p.x,.06);}

// ---------- lighting ----------
// reflection environment: backdrop gradient, a soft moon window along the key light, a dim floor bounce. rough blurs it.
vec3 env(vec3 d,float rough){float h=d.y;vec3 c=mix(u_fog*2.2,u_zen*1.5,sat(h*.6+.4))+vec3(.01,.011,.014);
  float k=dot(d,u_keyDir);c+=u_keyCol*(smoothstep(mix(.93,.3,rough),1.,k)*mix(1.6,.25,rough)+pow(sat(k),3.)*.06);
  float az=atan(d.z,d.x);c+=u_keyCol*.35*smoothstep(mix(.2,.9,rough),0.,abs(az+2.2))*smoothstep(-.2,.15,h)*smoothstep(.75,.3,h)*(1.-rough*.7);
  c+=u_amb*.6*smoothstep(.1,-.6,h);return c;}
float fresnel(vec3 n,vec3 v,float p){return pow(1.-sat(dot(n,v)),p);}
vec3 brdf(vec3 alb,float rough,float metal,vec3 n,vec3 v,vec3 l){
  float nl=sat(dot(n,l));vec3 h=normalize(l+v);float nh=sat(dot(n,h));float a=max(rough*rough,.02);float a2=a*a;
  float d=a2/(PI*pow(nh*nh*(a2-1.)+1.,2.));vec3 f0=mix(vec3(.04),alb,metal);
  vec3 f=f0+(1.-f0)*pow(1.-sat(dot(h,v)),5.);return (alb*(1.-metal)/PI+d*f*.25)*nl;}
// stage lighting: moon key + hemisphere ambient + up to 8 effect point lights (u_lpos.w = radius)
vec3 shade(vec3 alb,float rough,float metal,vec3 n,vec3 v,vec3 p){
  vec3 c=alb*(1.-metal*.6)*u_amb*(.55+.45*n.y);
  c+=brdf(alb,rough,metal,n,v,u_keyDir)*u_keyCol;
  for(int i=0;i<8;i++){vec3 d=u_lpos[i].xyz-p;float r=length(d);float att=pow(sat(1.-r/max(u_lpos[i].w,.001)),2.)/(1.+r*r);
    c+=brdf(alb,max(rough,.38),metal,n,v,d/max(r,1e-4))*u_lcol[i]*att*PI;}
  vec3 f0=mix(vec3(.04),alb,metal);vec3 rf=reflect(-v,n);float fr=pow(1.-sat(dot(n,v)),5.);
  c+=mix(f0,vec3(1.),fr*(1.-rough))*env(rf,rough)*(1.-rough*.85);
  return c;}
// light the effect adds at point p (for lit smoke / fake volumetric lighting)
vec3 fxLight(vec3 p){vec3 c=vec3(0);for(int i=0;i<8;i++){vec3 d=u_lpos[i].xyz-p;float r=length(d);c+=u_lcol[i]*pow(sat(1.-r/max(u_lpos[i].w,.001)),2.)/(1.+r*r);}return c;}

// stage mannequin material (use on your own geo:'dummy' layers so they match the stage actors)
vec3 dummyMat(vec3 op,vec3 n,vec3 v,vec3 p){float k=nz(op.xy*1.3+op.z*.7).r,k2=nz(op.xy*4.+op.z*3.).b;vec3 alb=vec3(.17,.165,.18)*(.65+.6*k)*(.85+.3*k2);
  float visor=step(1.66,op.y)*step(op.y,1.7)*smoothstep(.035,.07,op.z);alb*=1.-visor*.93;
  return shade(alb,.36+.25*k,.6,n,v,p)+fresnel(n,v,3.5)*u_amb*.8;}
// lighting for a smoke/dust sprite as if it were a soft sphere: key light, ambient and the effect lights wrap around it
vec3 puffLit(vec2 uv,vec3 p,vec3 alb){vec2 q=uv*2.-1.;float z=sqrt(max(1.-dot(q,q),0.));vec3 n=normalize(u_right*q.x+u_up*q.y-u_fwd*z);
  vec3 c=u_amb*(.6+.4*n.y)+u_keyCol*(.25+.75*sat(dot(n,u_keyDir)*.6+.4))*.45;
  for(int i=0;i<8;i++){vec3 d=u_lpos[i].xyz-p;float r=length(d);float att=pow(sat(1.-r/max(u_lpos[i].w,.001)),2.)/(1.+r*r);c+=u_lcol[i]*att*(.25+.75*sat(dot(n,d/max(r,1e-4))*.6+.4));}
  return alb*c;}

// combat / data texture: 64 texels per row
vec4 cd(int i){return texelFetch(u_cdat,ivec2(i%64,i/64),0);}
// rigged caster hands at any time t (s) of the effect, from 64 samples over u_dur (written by combat/gfx.js at texel 6720)
vec3 handAt(float t){if(u_htraj<.5)return u_hand;float x=clamp(t/max(u_dur,.001),0.,1.)*63.;int i=int(floor(x));int j=min(i+1,63);return mix(cd(6720+i).xyz,cd(6720+j).xyz,fract(x));}
vec3 handLAt(float t){if(u_htraj<.5)return u_handL;float x=clamp(t/max(u_dur,.001),0.,1.)*63.;int i=int(floor(x));int j=min(i+1,63);return mix(cd(6784+i).xyz,cd(6784+j).xyz,fract(x));}
float linZ(float d){float z=d*2.-1.;return 2.*u_nf.x*u_nf.y/(u_nf.y+u_nf.x-z*(u_nf.y-u_nf.x));}

#ifdef FRAG
float aa(float d){float w=fwidth(d);return smoothstep(w,-w,d);}
float stroke(float d,float w){float f=fwidth(d);return smoothstep(w+f,w-f,abs(d));}
vec3 flatN(vec3 p){return normalize(cross(dFdx(p),dFdy(p)));}
#endif

// ---------- crystalline ice: thin bright rims, dark refractive depth, faceted internal glints, frost bloom ----------
// N world normal, V view dir, P world pos, thick 0..1 (how deep the ice reads), frost 0..1 (rime coverage), seed per shard
vec3 iceMat(vec3 N,vec3 V,vec3 P,float thick,float frost,float seed,float spark){
  float f=fresnel(N,V,3.);vec3 deep=vec3(.015,.05,.085)*(1.-.5*thick),body=vec3(.18,.42,.6);
  float facet=floor(snoise(P*9.+seed*13.)*3.)/3.;vec3 Nf=normalize(N+.35*vec3(facet,snoise(P*7.1+seed),-facet));
  vec3 c=shade(mix(body,deep,thick),.06,0.,Nf,V,P)*.65+deep;
  c+=vec3(.55,.8,1.)*pow(f,1.5)*1.3+vec3(.9,.97,1.)*pow(max(snoise(P*38.+V*3.+seed*7.),0.),9.)*9.*spark;
  float fr=smoothstep(.35,.8,sfbm(P*6.+seed,3)*.5+.5)*frost;c=mix(c,shade(vec3(.72,.82,.9),.85,0.,N,V,P)+vec3(.05,.07,.09),fr);
  return c;}
// default sparkle strength 1; pass spark (0..2) to the seven-argument form
vec3 iceMat(vec3 N,vec3 V,vec3 P,float thick,float frost,float seed){return iceMat(N,V,P,thick,frost,seed,1.);}
