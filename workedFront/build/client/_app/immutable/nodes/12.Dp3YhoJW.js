import{s as q,d as m,n as f}from"../chunks/scheduler.RGCH8erx.js";import{S as $,i as d,e as _,s as v,c as h,h as I,m as u,j as p,n as g,o as P,g as o}from"../chunks/index.BHBwDQaC.js";function S(r){let s,a,t,i,l,c;return{c(){s=_("input"),a=v(),t=_("img"),this.h()},l(e){s=h(e,"INPUT",{}),a=I(e),t=h(e,"IMG",{alt:!0,src:!0}),this.h()},h(){u(t,"alt","qr"),m(t.src,i=`https://qrtag.net/api/qr.png?url=${r[0]}`)||u(t,"src",i)},m(e,n){p(e,s,n),g(s,r[0]),p(e,a,n),p(e,t,n),l||(c=P(s,"input",r[1]),l=!0)},p(e,[n]){n&1&&s.value!==e[0]&&g(s,e[0]),n&1&&!m(t.src,i=`https://qrtag.net/api/qr.png?url=${e[0]}`)&&u(t,"src",i)},i:f,o:f,d(e){e&&(o(s),o(a),o(t)),l=!1,c()}}}function j(r,s,a){let t;function i(){t=this.value,a(0,t)}return[t,i]}class M extends ${constructor(s){super(),d(this,s,j,S,q,{})}}export{M as component};
