import{U as mt,N as Vt,P as $t,a as Ut,b as pt,e as it,H as Ht,p as Bt,i as yt,c as _e,d as Ye,w as W,f as qt,r as xe,g as zt}from"./entry.B0YtdMGf.js";import{p as pe,n as at}from"./stores.BSndGV9U.js";import{z as Me,t as $e,A as ye}from"./scheduler.RGCH8erx.js";const Yt=!0;class Ne extends Error{constructor(i,s){super(i),this.name="DevalueError",this.path=s.join("")}}function st(n){return Object(n)!==n}const Gt=Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Wt(n){const i=Object.getPrototypeOf(n);return i===Object.prototype||i===null||Object.getOwnPropertyNames(i).sort().join("\0")===Gt}function Jt(n){return Object.prototype.toString.call(n).slice(8,-1)}function Zt(n){switch(n){case'"':return'\\"';case"<":return"\\u003C";case"\\":return"\\\\";case`
`:return"\\n";case"\r":return"\\r";case"	":return"\\t";case"\b":return"\\b";case"\f":return"\\f";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:return n<" "?`\\u${n.charCodeAt(0).toString(16).padStart(4,"0")}`:""}}function fe(n){let i="",s=0;const t=n.length;for(let c=0;c<t;c+=1){const u=n[c],a=Zt(u);a&&(i+=n.slice(s,c)+a,s=c+1)}return`"${s===0?n:i+n.slice(s)}"`}function Xt(n){return Object.getOwnPropertySymbols(n).filter(i=>Object.getOwnPropertyDescriptor(n,i).enumerable)}const Kt=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function ot(n){return Kt.test(n)?"."+n:"["+JSON.stringify(n)+"]"}function Qt(n,i){const s=[],t=new Map,c=[],u=[];let a=0;function d(m){if(typeof m=="function")throw new Ne("Cannot stringify a function",u);if(t.has(m))return t.get(m);if(m===void 0)return mt;if(Number.isNaN(m))return Vt;if(m===1/0)return $t;if(m===-1/0)return Ut;if(m===0&&1/m<0)return pt;const E=a++;t.set(m,E);for(const{key:N,fn:V}of c){const A=V(m);if(A)return s[E]=`["${N}",${d(A)}]`,E}let p="";if(st(m))p=Ce(m);else{const N=Jt(m);switch(N){case"Number":case"String":case"Boolean":p=`["Object",${Ce(m)}]`;break;case"BigInt":p=`["BigInt",${m}]`;break;case"Date":p=`["Date","${!isNaN(m.getDate())?m.toISOString():""}"]`;break;case"RegExp":const{source:A,flags:J}=m;p=J?`["RegExp",${fe(A)},"${J}"]`:`["RegExp",${fe(A)}]`;break;case"Array":p="[";for(let h=0;h<m.length;h+=1)h>0&&(p+=","),h in m?(u.push(`[${h}]`),p+=d(m[h]),u.pop()):p+=Ht;p+="]";break;case"Set":p='["Set"';for(const h of m)p+=`,${d(h)}`;p+="]";break;case"Map":p='["Map"';for(const[h,_]of m)u.push(`.get(${st(h)?Ce(h):"..."})`),p+=`,${d(h)},${d(_)}`,u.pop();p+="]";break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":{const _=it(m.buffer);p='["'+N+'","'+_+'"]';break}case"ArrayBuffer":{p=`["ArrayBuffer","${it(m)}"]`;break}default:if(!Wt(m))throw new Ne("Cannot stringify arbitrary non-POJOs",u);if(Xt(m).length>0)throw new Ne("Cannot stringify POJOs with symbolic keys",u);if(Object.getPrototypeOf(m)===null){p='["null"';for(const h in m)u.push(ot(h)),p+=`,${fe(h)},${d(m[h])}`,u.pop();p+="]"}else{p="{";let h=!1;for(const _ in m)h&&(p+=","),h=!0,u.push(ot(_)),p+=`${fe(_)}:${d(m[_])}`,u.pop();p+="}"}}}return s[E]=p,E}const y=d(n);return y<0?`${y}`:`[${s.join(",")}]`}function Ce(n){const i=typeof n;return i==="string"?fe(n):n instanceof String?fe(n.toString()):n===void 0?mt.toString():n===0&&1/n<0?pt.toString():i==="bigint"?`["BigInt","${n}"]`:String(n)}const ht=Yt;function Ue(n,i,s){return n[i]=s,"skip"}function en(n,i){return i.value!==void 0&&typeof i.value!="object"&&i.path.length<n.length}function te(n,i,s={}){s.modifier||(s.modifier=c=>en(i,c)?void 0:c.value);const t=X(n,i,s.modifier);if(t)return s.value===void 0||s.value(t.value)?t:void 0}function X(n,i,s){if(!i.length)return;const t=[i[0]];let c=n;for(;c&&t.length<i.length;){const a=t[t.length-1],d=s?s({parent:c,key:String(a),value:c[a],path:t.map(y=>String(y)),isLeaf:!1,set:y=>Ue(c,a,y)}):c[a];if(d===void 0)return;c=d,t.push(i[t.length])}if(!c)return;const u=i[i.length-1];return{parent:c,key:String(u),value:c[u],path:i.map(a=>String(a)),isLeaf:!0,set:a=>Ue(c,u,a)}}function Q(n,i,s=[]){for(const t in n){const c=n[t],u=c===null||typeof c!="object",a={parent:n,key:t,value:c,path:s.concat([t]),isLeaf:u,set:y=>Ue(n,t,y)},d=i(a);if(d==="abort")return d;if(d==="skip")continue;if(!u){const y=Q(c,i,a.path);if(y==="abort")return y}}}function tn(n,i){return n===i||n.size===i.size&&[...n].every(s=>i.has(s))}function ut(n,i){const s=new Map;function t(a,d){return a instanceof Date&&d instanceof Date&&a.getTime()!==d.getTime()||a instanceof Set&&d instanceof Set&&!tn(a,d)||a instanceof File&&d instanceof File&&a!==d}function c(a){return a instanceof Date||a instanceof Set||a instanceof File}function u(a,d){const y=d?X(d,a.path):void 0;function m(){return s.set(a.path.join(" "),a.path),"skip"}if(c(a.value)&&(!c(y==null?void 0:y.value)||t(a.value,y.value)))return m();a.isLeaf&&(!y||a.value!==y.value)&&m()}return Q(n,a=>u(a,i)),Q(i,a=>u(a,n)),Array.from(s.values())}function Z(n,i,s){const t=typeof s=="function";for(const c of i){const u=X(n,c,({parent:a,key:d,value:y})=>((y===void 0||typeof y!="object")&&(a[d]={}),a[d]));u&&(u.parent[u.key]=t?s(c,u):s)}}function le(n){return n.toString().split(/[[\].]+/).filter(i=>i)}function he(n){return n.reduce((i,s)=>{const t=String(s);return typeof s=="number"||/^\d+$/.test(t)?i+=`[${t}]`:i?i+=`.${t}`:i+=t,i},"")}var nn=be;function be(n){let i=n;var s={}.toString.call(n).slice(8,-1);if(s=="Set")return new Set([...n].map(c=>be(c)));if(s=="Map")return new Map([...n].map(c=>[be(c[0]),be(c[1])]));if(s=="Date")return new Date(n.getTime());if(s=="RegExp")return RegExp(n.source,rn(n));if(s=="Array"||s=="Object"){i=Array.isArray(n)?[]:{};for(var t in n)i[t]=be(n[t])}return i}function rn(n){if(typeof n.source.flags=="string")return n.source.flags;var i=[];return n.global&&i.push("g"),n.ignoreCase&&i.push("i"),n.multiline&&i.push("m"),n.sticky&&i.push("y"),n.unicode&&i.push("u"),i.join("")}function q(n){return n&&typeof n=="object"?nn(n):n}class D extends Error{constructor(i){super(i),Object.setPrototypeOf(this,D.prototype)}}function an(n,i){var c;const s={};function t(u){if("_errors"in s||(s._errors=[]),!Array.isArray(s._errors))if(typeof s._errors=="string")s._errors=[s._errors];else throw new D("Form-level error was not an array.");s._errors.push(u.message)}for(const u of n){if(!u.path||u.path.length==1&&!u.path[0]){t(u);continue}const d=!/^\d$/.test(String(u.path[u.path.length-1]))&&((c=te(i,u.path.filter(p=>/\D/.test(String(p)))))==null?void 0:c.value),y=X(s,u.path,({value:p,parent:N,key:V})=>(p===void 0&&(N[V]={}),N[V]));if(!y){t(u);continue}const{parent:m,key:E}=y;d?(E in m||(m[E]={}),"_errors"in m[E]?m[E]._errors.push(u.message):m[E]._errors=[u.message]):E in m?m[E].push(u.message):m[E]=[u.message]}return s}function ct(n,i,s){return s?n:(Q(i,t=>{Array.isArray(t.value)&&t.set(void 0)}),Q(n,t=>{!Array.isArray(t.value)&&t.value!==void 0||Z(i,[t.path],t.value)}),i)}function sn(n){return bt(n,[])}function bt(n,i){return Object.entries(n).filter(([,t])=>t!==void 0).flatMap(([t,c])=>{if(Array.isArray(c)&&c.length>0){const u=i.concat([t]);return{path:he(u),messages:c}}else return bt(n[t],i.concat([t]))})}function ft(n){!n.flashMessage||!ht||He(n)&&(document.cookie=`flash=; Max-Age=0; Path=${n.flashMessage.cookiePath??"/"};`)}function He(n){return!n.flashMessage||!ht?!1:n.syncFlashMessage}function Be(n){const i=JSON.parse(n);return i.data&&(i.data=Bt(i.data)),i}function Ve(n){return HTMLElement.prototype.cloneNode.call(n)}function on(n,i=()=>{}){const s=async({action:c,result:u,reset:a=!0,invalidateAll:d=!0})=>{u.type==="success"&&(a&&HTMLFormElement.prototype.reset.call(n),d&&await yt()),(location.origin+location.pathname===c.origin+c.pathname||u.type==="redirect"||u.type==="error")&&_e(u)};async function t(c){var J,h,_,ge,we;if(((J=c.submitter)!=null&&J.hasAttribute("formmethod")?c.submitter.formMethod:Ve(n).method)!=="post")return;c.preventDefault();const a=new URL((h=c.submitter)!=null&&h.hasAttribute("formaction")?c.submitter.formAction:Ve(n).action),d=(_=c.submitter)!=null&&_.hasAttribute("formenctype")?c.submitter.formEnctype:Ve(n).enctype,y=new FormData(n),m=(ge=c.submitter)==null?void 0:ge.getAttribute("name");m&&y.append(m,((we=c.submitter)==null?void 0:we.getAttribute("value"))??"");const E=new AbortController;let p=!1;const V=await i({action:a,cancel:()=>p=!0,controller:E,formData:y,formElement:n,submitter:c.submitter})??s;if(p)return;let A;try{const M=new Headers({accept:"application/json","x-sveltekit-action":"true"});d!=="multipart/form-data"&&M.set("Content-Type",/^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(d)?d:"application/x-www-form-urlencoded");const ke=d==="multipart/form-data"?y:new URLSearchParams(y),de=await fetch(a,{method:"POST",headers:M,cache:"no-store",body:ke,signal:E.signal});A=Be(await de.text()),A.type==="error"&&(A.status=de.status)}catch(M){if((M==null?void 0:M.name)==="AbortError")return;A={type:"error",error:M}}V({action:a,formData:y,formElement:n,update:M=>s({action:a,result:A,reset:M==null?void 0:M.reset,invalidateAll:M==null?void 0:M.invalidateAll}),result:A})}return HTMLFormElement.prototype.addEventListener.call(n,"submit",t),{destroy(){HTMLFormElement.prototype.removeEventListener.call(n,"submit",t)}}}const gt="noCustomValidity";async function lt(n,i){"setCustomValidity"in n&&n.setCustomValidity(""),!(gt in n.dataset)&&wt(n,i)}function un(n,i){for(const s of n.querySelectorAll("input,select,textarea,button")){if("dataset"in s&&gt in s.dataset||!s.name)continue;const t=X(i,le(s.name)),c=t&&typeof t.value=="object"&&"_errors"in t.value?t.value._errors:t==null?void 0:t.value;if(wt(s,c),c)return}}function wt(n,i){const s=i&&i.length?i.join(`
`):"";n.setCustomValidity(s),s&&n.reportValidity()}const cn=(n,i=0)=>{const s=n.getBoundingClientRect();return s.top>=i&&s.left>=0&&s.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&s.right<=(window.innerWidth||document.documentElement.clientWidth)},fn=(n,i=1.125,s="smooth")=>{const u=n.getBoundingClientRect().top+window.pageYOffset-window.innerHeight/(2*i);window.scrollTo({left:0,top:u,behavior:s})},ln=["checkbox","radio","range","file"];function dt(n){const i=!!n&&(n instanceof HTMLSelectElement||n instanceof HTMLInputElement&&ln.includes(n.type)),s=!!n&&n instanceof HTMLSelectElement&&n.multiple,t=!!n&&n instanceof HTMLInputElement&&n.type=="file";return{immediate:i,multiple:s,file:t}}var x;(function(n){n[n.Idle=0]="Idle",n[n.Submitting=1]="Submitting",n[n.Delayed=2]="Delayed",n[n.Timeout=3]="Timeout"})(x||(x={}));const dn=new Set;function mn(n,i,s){let t=x.Idle,c,u;const a=dn;function d(){y(),E(t!=x.Delayed?x.Submitting:x.Delayed),c=window.setTimeout(()=>{c&&t==x.Submitting&&E(x.Delayed)},s.delayMs),u=window.setTimeout(()=>{u&&t==x.Delayed&&E(x.Timeout)},s.timeoutMs),a.add(y)}function y(){clearTimeout(c),clearTimeout(u),c=u=0,a.delete(y),E(x.Idle)}function m(){a.forEach(h=>h()),a.clear()}function E(h){t=h,i.submitting.set(t>=x.Submitting),i.delayed.set(t>=x.Delayed),i.timeout.set(t>=x.Timeout)}const p=n;function N(h){const _=h.target;s.selectErrorText&&_.select()}function V(){s.selectErrorText&&p.querySelectorAll("input").forEach(h=>{h.addEventListener("invalid",N)})}function A(){s.selectErrorText&&p.querySelectorAll("input").forEach(h=>h.removeEventListener("invalid",N))}const J=n;{V();const h=_=>{_.clearAll?m():y(),_.cancelled||setTimeout(()=>qe(J,s),1)};return Me(()=>{A(),h({cancelled:!0})}),{submitting(){d()},completed:h,scrollToFirstError(){setTimeout(()=>qe(J,s),1)},isSubmitting:()=>t===x.Submitting||t===x.Delayed}}}const qe=async(n,i)=>{if(i.scrollToError=="off")return;const s=i.errorSelector;if(!s)return;await $e();let t;if(t=n.querySelector(s),!t)return;t=t.querySelector(s)??t;const c=i.stickyNavbar?document.querySelector(i.stickyNavbar):null;typeof i.scrollToError!="string"?t.scrollIntoView(i.scrollToError):cn(t,(c==null?void 0:c.offsetHeight)??0)||fn(t,void 0,i.scrollToError);function u(d){return typeof i.autoFocusOnError=="boolean"?i.autoFocusOnError:!/iPhone|iPad|iPod|Android/i.test(d)}if(!u(navigator.userAgent))return;let a;if(a=t,["INPUT","SELECT","BUTTON","TEXTAREA"].includes(a.tagName)||(a=a.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea')),a)try{a.focus({preventScroll:!0}),i.selectErrorText&&a.tagName=="INPUT"&&a.select()}catch{}};function Fe(n,i,s){const t=X(n,i,({parent:c,key:u,value:a})=>(a===void 0&&(c[u]=/\D/.test(u)?{}:[]),c[u]));if(t){const c=s(t.value);t.parent[t.key]=c}return n}function pn(n,i,s){const t=n.form,c=le(i),u=Ye(t,a=>{const d=X(a,c);return d==null?void 0:d.value});return{subscribe(...a){const d=u.subscribe(...a);return()=>d()},update(a,d){t.update(y=>Fe(y,c,a),d??s)},set(a,d){t.update(y=>Fe(y,c,()=>a),d??s)}}}function yn(n,i){const s="form"in n;if(!s&&(i==null?void 0:i.taint)!==void 0)throw new D("If options.taint is set, the whole superForm object must be used as a proxy.");return s}function Se(n,i,s){const t=le(i);if(yn(n,s))return pn(n,i,s);const c=Ye(n,u=>{const a=X(u,t);return a==null?void 0:a.value});return{subscribe(...u){const a=c.subscribe(...u);return()=>a()},update(u){n.update(a=>Fe(a,t,u))},set(u){n.update(a=>Fe(a,t,()=>u))}}}function ze(n){let i={};const s=Array.isArray(n);for(const[t,c]of Object.entries(n))!c||typeof c!="object"||(s?i={...i,...ze(c)}:i[t]=ze(c));return i}const Te=new WeakMap,ue=new WeakMap,vt=n=>{throw n.result.error},hn={applyAction:!0,invalidateAll:!0,resetForm:!0,autoFocusOnError:"detect",scrollToError:"smooth",errorSelector:'[aria-invalid="true"],[data-invalid]',selectErrorText:!1,stickyNavbar:void 0,taintedMessage:!1,onSubmit:void 0,onResult:void 0,onUpdate:void 0,onUpdated:void 0,onError:vt,dataType:"form",validators:void 0,customValidity:!1,clearOnSubmit:"message",delayMs:500,timeoutMs:8e3,multipleSubmits:"prevent",SPA:void 0,validationMethod:"auto"};function bn(n){return`Duplicate form id's found: "${n}". Multiple forms will receive the same data. Use the id option to differentiate between them, or if this is intended, set the warnings.duplicateId option to false in superForm to disable this warning. More information: https://superforms.rocks/concepts/multiple-forms`}let Et=!1;try{SUPERFORMS_LEGACY&&(Et=!0)}catch{}let ce=!1;try{globalThis.STORIES&&(ce=!0)}catch{}function An(n,i){var rt;let s,t={},c;{if((t.legacy??Et)&&(t.resetForm===void 0&&(t.resetForm=!1),t.taintedMessage===void 0&&(t.taintedMessage=!0)),ce&&t.applyAction===void 0&&(t.applyAction=!1),typeof t.SPA=="string"&&(t.invalidateAll===void 0&&(t.invalidateAll=!1),t.applyAction===void 0&&(t.applyAction=!1)),c=t.validators,t={...hn,...t},(t.SPA===!0||typeof t.SPA=="object")&&t.validators===void 0&&console.warn("No validators set for superForm in SPA mode. Add a validation adapter to the validators option, or set it to false to disable this warning."),!n)throw new D("No form data sent to superForm. Make sure the output from superValidate is used (usually data.form) and that it's not null or undefined. Alternatively, an object with default values for the form can also be used, but then constraints won't be available.");m(n)===!1&&(n={id:t.id??Math.random().toString(36).slice(2,10),valid:!1,posted:!1,errors:{},data:n,shape:ze(n)}),n=n;const e=n.id=t.id??n.id,r=ye(pe)??(ce?{}:void 0);if(((rt=t.warnings)==null?void 0:rt.duplicateId)!==!1)if(!Te.has(r))Te.set(r,new Set([e]));else{const o=Te.get(r);o!=null&&o.has(e)?console.warn(bn(e)):o==null||o.add(e)}if(ue.has(n)||ue.set(n,n),s=ue.get(n),n=q(s),Me(()=>{var o;jt(),_t(),Lt();for(const f of Object.values(U))f.length=0;(o=Te.get(r))==null||o.delete(e)}),t.dataType!=="json"){const o=(f,l)=>{if(!(!l||typeof l!="object")){if(Array.isArray(l))l.length>0&&o(f,l[0]);else if(!(l instanceof Date)&&!(l instanceof File)&&!(l instanceof FileList))throw new D(`Object found in form field "${f}". Set the dataType option to "json" and add use:enhance to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`)}};for(const[f,l]of Object.entries(n.data))o(f,l)}}const u={formId:n.id,form:q(n.data),constraints:n.constraints??{},posted:n.posted,errors:q(n.errors),message:q(n.message),tainted:void 0,valid:n.valid,submitting:!1,shape:n.shape},a=u,d=W(t.id??n.id);function y(e){return Object.values(e).filter(o=>m(o)!==!1)}function m(e){return!e||typeof e!="object"||!("valid"in e&&"errors"in e&&typeof e.valid=="boolean")?!1:"id"in e&&typeof e.id=="string"?e.id:!1}const E=W(n.data),p={subscribe:E.subscribe,set:(e,r={})=>{const o=q(e);return Ke(o,r.taint??!0),E.set(o)},update:(e,r={})=>E.update(o=>{const f=e(o);return Ke(f,r.taint??!0),f})};function N(){return t.SPA===!0||typeof t.SPA=="object"}function V(e){var r;return e>400?e:(typeof t.SPA=="boolean"||typeof t.SPA=="string"||(r=t.SPA)==null?void 0:r.failStatus)||e}async function A(e={}){const r=e.formData??a.form;let o={},f;const l=e.adapter??t.validators;if(typeof l=="object"){if(l!=c&&!("jsonSchema"in l))throw new D('Client validation adapter found in options.validators. A full adapter must be used when changing validators dynamically, for example "zod" instead of "zodClient".');if(f=await l.validate(r),!f.success)o=an(f.issues,l.shape??a.shape??{});else if(e.recheckValidData!==!1)return A({...e,recheckValidData:!1})}else f={success:!0,data:{}};const g={...a.form,...r,...f.success?f.data:{}};return{valid:f.success,posted:!1,errors:o,data:g,constraints:a.constraints,message:void 0,id:a.formId,shape:a.shape}}function J(e){if(!t.onChange||!e.paths.length||e.type=="blur")return;let r;const o=e.paths.map(he);e.type&&e.paths.length==1&&e.formElement&&e.target instanceof Element?r={path:o[0],paths:o,formElement:e.formElement,target:e.target,set(f,l,g){Se({form:p},f,g).set(l)},get(f){return ye(Se(p,f))}}:r={paths:o,target:void 0,set(f,l,g){Se({form:p},f,g).set(l)},get(f){return ye(Se(p,f))}},t.onChange(r)}async function h(e,r=!1,o){e&&(t.validators=="clear"&&Y.update(g=>(Z(g,e.paths,void 0),g)),setTimeout(()=>J(e)));let f=!1;if(r||(t.validationMethod=="onsubmit"||t.validationMethod=="submit-only"||t.validationMethod=="onblur"&&(e==null?void 0:e.type)=="input"||t.validationMethod=="oninput"&&(e==null?void 0:e.type)=="blur")&&(f=!0),f||!e||!t.validators||t.validators=="clear"){if(e!=null&&e.paths){const g=(e==null?void 0:e.formElement)??me();g&&_(g)}return}const l=await A({adapter:o});return l.valid&&(e.immediate||e.type!="input")&&p.set(l.data,{taint:"ignore"}),await $e(),ge(l.errors,e,r),l}function _(e){const r=new Map;if(t.customValidity&&e)for(const o of e.querySelectorAll("[name]")){if(typeof o.name!="string"||!o.name.length)continue;const f="validationMessage"in o?String(o.validationMessage):"";r.set(o.name,{el:o,message:f}),lt(o,void 0)}return r}async function ge(e,r,o){const{type:f,immediate:l,multiple:g,paths:H}=r,ee=a.errors,ne={};let L=new Map;const j=r.formElement??me();j&&(L=_(j)),Q(e,S=>{if(!Array.isArray(S.value))return;const I=[...S.path];I[I.length-1]=="_errors"&&I.pop();const oe=I.join(".");function B(){if(Z(ne,[S.path],S.value),t.customValidity&&re&&L.has(oe)){const{el:C,message:ie}=L.get(oe);ie!=S.value&&(setTimeout(()=>lt(C,S.value)),L.clear())}}if(o)return B();const Ae=S.path[S.path.length-1]=="_errors",re=S.value&&H.some(C=>Ae?I&&C&&I.length>0&&I[0]==C[0]:oe==C.join("."));if(re&&t.validationMethod=="oninput"||l&&!g&&re)return B();if(g){const C=te(ye(Y),S.path.slice(0,-1));if(C!=null&&C.value&&typeof(C==null?void 0:C.value)=="object"){for(const ie of Object.values(C.value))if(Array.isArray(ie))return B()}}const K=te(ee,S.path);if(K&&K.key in K.parent)return B();if(Ae){if(t.validationMethod=="oninput"||f=="blur"&&It(he(S.path.slice(0,-1))))return B()}else if(f=="blur"&&re)return B()}),Y.set(ne)}function we(e,r={}){return r.keepFiles&&Q(a.form,o=>{if(!(o.parent instanceof FileList)&&(o.value instanceof File||o.value instanceof FileList)){const f=te(e,o.path);(!f||!(f.key in f.parent))&&Z(e,[o.path],o.value)}}),p.set(e,r)}function M(e,r){return e&&r&&t.resetForm&&(t.resetForm===!0||t.resetForm())}function ke(e=!0){let r=a.form,o=a.tainted;if(e){const f=Nt(a.form);r=f.data;const l=f.paths;l.length&&(o=q(o)??{},Z(o,l,!1))}return{valid:a.valid,posted:a.posted,errors:a.errors,data:r,constraints:a.constraints,message:a.message,id:a.formId,tainted:o,shape:a.shape}}async function de(e,r){e.valid&&r&&M(e.valid,r)?Ie({message:e.message,posted:!0}):Ee({form:e,untaint:r,keepFiles:!0,skipFormData:t.invalidateAll=="force"}),U.onUpdated.length&&await $e();for(const o of U.onUpdated)o({form:e})}function Ie(e={}){e.newState&&(s.data={...s.data,...e.newState});const r=q(s);r.data={...r.data,...e.data},e.id!==void 0&&(r.id=e.id),Ee({form:r,untaint:!0,message:e.message,keepFiles:!1,posted:e.posted,resetted:!0})}async function At(e){if(e.type=="error")throw new D(`ActionResult of type "${e.type}" cannot be passed to update function.`);if(e.type=="redirect"){M(!0,!0)&&Ie({posted:!0});return}if(typeof e.data!="object")throw new D("Non-object validation data returned from ActionResult.");const r=y(e.data);if(!r.length)throw new D("No form data returned from ActionResult. Make sure you return { form } in the form actions.");for(const o of r)o.id===a.formId&&await de(o,e.status>=200&&e.status<300)}const se=W(u.message),Oe=W(u.constraints),Pe=W(u.posted),Ge=W(u.shape),je=W(n.errors),Y={subscribe:je.subscribe,set(e,r){return je.set(ct(e,a.errors,r==null?void 0:r.force))},update(e,r){return je.update(o=>ct(e(o),a.errors,r==null?void 0:r.force))},clear:()=>Y.set({})};let k=null;function St(e){var r;k&&e&&Object.keys(e).length==1&&((r=e.paths)!=null&&r.length)&&k.target&&k.target instanceof HTMLInputElement&&k.target.type.toLowerCase()=="file"?k.paths=e.paths:k=e,setTimeout(()=>{h(k)},0)}function Tt(e,r,o,f,l){k===null&&(k={paths:[]}),k.type=e,k.immediate=r,k.multiple=o,k.formElement=f,k.target=l}function We(){return(k==null?void 0:k.paths)??[]}function _t(){k=null}const R={defaultMessage:"Leave page? Changes that you made may not be saved.",state:W(),message:t.taintedMessage,clean:q(n.data),forceRedirection:!1};function Je(){return t.taintedMessage&&!a.submitting&&!R.forceRedirection&&Xe()}function Ze(e){if(!Je())return;e.preventDefault(),e.returnValue="";const{taintedMessage:r}=t,f=typeof r=="function"||r===!0?R.defaultMessage:r;return(e||window.event).returnValue=f||R.defaultMessage,f}async function Mt(e){if(!Je())return;const{taintedMessage:r}=t,o=typeof r=="function";if(o&&e.cancel(),e.type==="leave")return;const f=o||r===!0?R.defaultMessage:r;let l;try{l=o?await r():window.confirm(f||R.defaultMessage)}catch{l=!1}if(l&&e.to)try{R.forceRedirection=!0,await zt(e.to.url,{...e.to.params});return}finally{R.forceRedirection=!1}else!l&&!o&&e.cancel()}function Ft(){t.taintedMessage=R.message}function kt(){return R.state}function It(e){if(!a.tainted)return!1;if(!e)return!!a.tainted;const r=te(a.tainted,le(e));return!!r&&r.key in r.parent}function Xe(e){if(!arguments.length)return ve(a.tainted);if(typeof e=="boolean")return e;if(typeof e=="object")return ve(e);if(!a.tainted||e===void 0)return!1;const r=te(a.tainted,le(e));return ve(r==null?void 0:r.value)}function ve(e){if(!e)return!1;if(typeof e=="object"){for(const r of Object.values(e))if(ve(r))return!0}return e===!0}function Ke(e,r){if(r=="ignore")return;const o=ut(e,a.form),f=ut(e,R.clean).map(l=>l.join());o.length&&(r=="untaint-all"||r=="untaint-form"?R.state.set(void 0):R.state.update(l=>(l||(l={}),Z(l,o,(g,H)=>{if(!f.includes(g.join()))return;const ee=X(e,g),ne=X(R.clean,g);return ee&&ne&&ee.value===ne.value?void 0:r===!0?!0:r==="untaint"?void 0:H.value}),l)),St({paths:o}))}function Ot(e,r){R.state.set(e),r&&(R.clean=r)}const De=W(!1),Qe=W(!1),et=W(!1),tt=[R.state.subscribe(e=>u.tainted=q(e)),p.subscribe(e=>u.form=q(e)),Y.subscribe(e=>u.errors=q(e)),d.subscribe(e=>u.formId=e),Oe.subscribe(e=>u.constraints=e),Pe.subscribe(e=>u.posted=e),se.subscribe(e=>u.message=e),De.subscribe(e=>u.submitting=e),Ge.subscribe(e=>u.shape=e)];function Pt(e){tt.push(e)}function jt(){tt.forEach(e=>e())}let $;function me(){return $}function Dt(e){$=document.createElement("form"),$.method="POST",$.action=e,nt($),document.body.appendChild($)}function Rt(e){$&&($.action=e)}function Lt(){$!=null&&$.parentElement&&$.remove(),$=void 0}const xt=Ye(Y,e=>e?sn(e):[]);t.taintedMessage=void 0;function Ee(e){const r=e.form,o=e.message??r.message;if((e.untaint||e.resetted)&&Ot(typeof e.untaint=="boolean"?void 0:e.untaint,r.data),e.skipFormData!==!0&&we(r.data,{taint:"ignore",keepFiles:e.keepFiles}),se.set(o),e.resetted?Y.update(()=>({}),{force:!0}):Y.set(r.errors),d.set(r.id),Pe.set(e.posted??r.posted),r.constraints&&Oe.set(r.constraints),r.shape&&Ge.set(r.shape),u.valid=r.valid,t.flashMessage&&He(t)){const f=t.flashMessage.module.getFlash(pe);o&&ye(f)===void 0&&f.set(o)}}const U={onSubmit:t.onSubmit?[t.onSubmit]:[],onResult:t.onResult?[t.onResult]:[],onUpdate:t.onUpdate?[t.onUpdate]:[],onUpdated:t.onUpdated?[t.onUpdated]:[],onError:t.onError?[t.onError]:[]};window.addEventListener("beforeunload",Ze),Me(()=>{window.removeEventListener("beforeunload",Ze)}),qt(Mt),Pt(pe.subscribe(async e=>{ce&&e===void 0&&(e={status:200});const r=e.status>=200&&e.status<300;if(t.applyAction&&e.form&&typeof e.form=="object"){const o=e.form;if(o.type==="error")return;for(const f of y(o)){const l=ue.has(f);f.id!==a.formId||l||(ue.set(f,f),await de(f,r))}}else if(e.data&&typeof e.data=="object")for(const o of y(e.data)){const f=ue.has(o);if(o.id!==a.formId||f)continue;t.invalidateAll==="force"&&(s.data=o.data);const l=M(o.valid,!0);Ee({form:o,untaint:r,keepFiles:!l,resetted:l})}})),typeof t.SPA=="string"&&Dt(t.SPA);function nt(e,r){if(t.SPA!==void 0&&e.method=="get"&&(e.method="post"),typeof t.SPA=="string"?t.SPA.length&&e.action==document.location.href&&(e.action=t.SPA):$=e,r){if(r.onError){if(t.onError==="apply")throw new D('options.onError is set to "apply", cannot add any onError events.');if(r.onError==="apply")throw new D('Cannot add "apply" as onError event in use:enhance.');U.onError.push(r.onError)}r.onResult&&U.onResult.push(r.onResult),r.onSubmit&&U.onSubmit.push(r.onSubmit),r.onUpdate&&U.onUpdate.push(r.onUpdate),r.onUpdated&&U.onUpdated.push(r.onUpdated)}Ft();let o;async function f(L){const j=dt(L.target);j.immediate&&!j.file&&await new Promise(S=>setTimeout(S,0)),o=We(),Tt("input",j.immediate,j.multiple,e,L.target??void 0)}async function l(L){if(a.submitting||!o||We()!=o)return;const j=dt(L.target);j.immediate&&!j.file&&await new Promise(S=>setTimeout(S,0)),h({paths:o,immediate:j.multiple,multiple:j.multiple,type:"blur",formElement:e,target:L.target??void 0}),o=void 0}e.addEventListener("focusout",l),e.addEventListener("input",f),Me(()=>{e.removeEventListener("focusout",l),e.removeEventListener("input",f)});const g=mn(e,{submitting:De,delayed:Qe,timeout:et},t);let H,ee;const ne=on(e,async L=>{let j,S=t.validators;const I={...L,jsonData(w){if(t.dataType!=="json")throw new D("options.dataType must be set to 'json' to use jsonData.");j=w},validators(w){S=w},customRequest(w){ee=w}},oe=I.cancel;let B=!1;function Re(w){const b={...w,posted:!0},v=b.valid?200:V(400),O={form:b},T=b.valid?{type:"success",status:v,data:O}:{type:"failure",status:v,data:O};setTimeout(()=>ie({result:T}),0)}function Ae(){switch(t.clearOnSubmit){case"errors-and-message":Y.clear(),se.set(void 0);break;case"errors":Y.clear();break;case"message":se.set(void 0);break}}async function re(w,b){var v;if(w.status=b,t.onError!=="apply"){const O={result:w,message:se,form:n};for(const T of U.onError)T!=="apply"&&(T!=vt||!((v=t.flashMessage)!=null&&v.onError))&&await T(O)}t.flashMessage&&t.flashMessage.onError&&await t.flashMessage.onError({result:w,flashMessage:t.flashMessage.module.getFlash(pe)}),t.applyAction&&(t.onError=="apply"?await _e(w):await _e({type:"failure",status:V(w.status),data:w}))}function K(w={resetTimers:!0}){return B=!0,w.resetTimers&&g.isSubmitting()&&g.completed({cancelled:B}),oe()}if(I.cancel=K,g.isSubmitting()&&t.multipleSubmits=="prevent")K({resetTimers:!1});else{g.isSubmitting()&&t.multipleSubmits=="abort"&&H&&H.abort(),g.submitting(),H=I.controller;for(const w of U.onSubmit)try{await w(I)}catch(b){K(),re({type:"error",error:b},500)}}if(B&&t.flashMessage&&ft(t),!B){const w=!N()&&(e.noValidate||(I.submitter instanceof HTMLButtonElement||I.submitter instanceof HTMLInputElement)&&I.submitter.formNoValidate);let b;const v=async()=>await A({adapter:S});if(Ae(),w||(b=await v(),b.valid||(K({resetTimers:!1}),Re(b))),!B){t.flashMessage&&(t.clearOnSubmit=="errors-and-message"||t.clearOnSubmit=="message")&&He(t)&&t.flashMessage.module.getFlash(pe).set(void 0);const O="formData"in I?I.formData:I.data;if(o=void 0,N())b||(b=await v()),K({resetTimers:!1}),Re(b);else if(t.dataType==="json"){b||(b=await v());const T=q(j??b.data);Q(T,P=>{if(P.value instanceof File){const F="__superform_file_"+he(P.path);return O.append(F,P.value),P.set(void 0)}else if(Array.isArray(P.value)&&P.value.length&&P.value.every(F=>F instanceof File)){const F="__superform_files_"+he(P.path);for(const z of P.value)O.append(F,z);return P.set(void 0)}}),Object.keys(T).forEach(P=>{typeof O.get(P)=="string"&&O.delete(P)});const ae=C(Qt(T),t.jsonChunkSize??5e5);for(const P of ae)O.append("__superform_json",P)}if(!O.has("__superform_id")){const T=a.formId;T!==void 0&&O.set("__superform_id",T)}typeof t.SPA=="string"&&Rt(t.SPA)}}function C(w,b){const v=Math.ceil(w.length/b),O=new Array(v);for(let T=0,ae=0;T<v;++T,ae+=b)O[T]=w.substring(ae,ae+b);return O}async function ie(w){let b=!1;H=null;let v="type"in w.result&&"status"in w.result?w.result:{type:"error",status:V(parseInt(String(w.result.status))||500),error:w.result.error instanceof Error?w.result.error:w.result};const O=()=>b=!0,T={result:v,formEl:e,formElement:e,cancel:O},ae=ce||!N()?()=>{}:at.subscribe(F=>{var z,G;!F||((z=F.from)==null?void 0:z.route.id)===((G=F.to)==null?void 0:G.route.id)||O()});function P(F,z,G){z.result={type:"error",error:F,status:V(G)}}for(const F of U.onResult)try{await F(T)}catch(z){P(z,T,Math.max(v.status??500,400))}if(v=T.result,!b){if((v.type==="success"||v.type==="failure")&&v.data){const F=y(v.data);if(!F.length)throw new D("No form data returned from ActionResult. Make sure you return { form } in the form actions.");for(const z of F){if(z.id!==a.formId)continue;const G={form:z,formEl:e,formElement:e,cancel:()=>b=!0,result:v};for(const Le of U.onUpdate)try{await Le(G)}catch(Ct){P(Ct,G,Math.max(v.status??500,400))}v=G.result,b||(t.customValidity&&un(e,G.form.errors),M(G.form.valid,v.type=="success")&&G.formElement.querySelectorAll('input[type="file"]').forEach(Le=>Le.value=""))}}b||(v.type!=="error"?(v.type==="success"&&t.invalidateAll&&await yt(),t.applyAction?await _e(v):await At(v)):await re(v,Math.max(v.status??500,400)))}if(b&&t.flashMessage&&ft(t),b||v.type!="redirect")g.completed({cancelled:b});else if(ce)g.completed({cancelled:b,clearAll:!0});else{const F=at.subscribe(z=>{z||(setTimeout(()=>{try{F&&F()}catch{}}),g.isSubmitting()&&g.completed({cancelled:b,clearAll:!0}))})}ae()}if(!B&&ee){oe();const w=await ee(L);let b;w instanceof Response?b=Be(await w.text()):w instanceof XMLHttpRequest?b=Be(w.responseText):b=w,b.type==="error"&&(b.status=w.status),ie({result:b})}return ie});return{destroy:()=>{for(const[L,j]of Object.entries(U))U[L]=j.filter(S=>S===t[L]);ne.destroy()}}}function Nt(e){const r=[];if(Q(e,f=>{if(f.value instanceof File)return r.push(f.path),"skip";if(Array.isArray(f.value)&&f.value.length&&f.value.every(l=>l instanceof File))return r.push(f.path),"skip"}),!r.length)return{data:e,paths:r};const o=q(e);return Z(o,r,f=>{var l;return(l=te(s.data,f))==null?void 0:l.value}),{data:o,paths:r}}return{form:p,formId:d,errors:Y,message:se,constraints:Oe,tainted:kt(),submitting:xe(De),delayed:xe(Qe),timeout:xe(et),options:t,capture:ke,restore:e=>{Ee({form:e,untaint:e.tainted??!0})},async validate(e,r={}){if(!t.validators)throw new D("options.validators must be set to use the validate method.");r.update===void 0&&(r.update=!0),r.taint===void 0&&(r.taint=!1),typeof r.errors=="string"&&(r.errors=[r.errors]);let o;const f=le(e);"value"in r?r.update===!0||r.update==="value"?(p.update(H=>(Z(H,[f],r.value),H),{taint:r.taint}),o=a.form):(o=q(a.form),Z(o,[f],r.value)):o=a.form;const l=await A({formData:o}),g=te(l.errors,f);return g&&g.value&&r.errors&&(g.value=r.errors),(r.update===!0||r.update=="errors")&&Y.update(H=>(Z(H,[f],g==null?void 0:g.value),H)),g==null?void 0:g.value},async validateForm(e={}){if(!t.validators&&!e.schema)throw new D("options.validators or the schema option must be set to use the validateForm method.");const r=e.update?await h({paths:[]},!0,e.schema):A({adapter:e.schema}),o=me();return e.update&&o&&setTimeout(()=>{o&&qe(o,{...t,scrollToError:e.focusOnError===!1?"off":t.scrollToError})},1),r||A({adapter:e.schema})},allErrors:xt,posted:Pe,reset(e){return Ie({message:e!=null&&e.keepMessage?a.message:void 0,data:e==null?void 0:e.data,id:e==null?void 0:e.id,newState:e==null?void 0:e.newState})},submit(e){const r=me()?me():e&&e instanceof HTMLElement?e.closest("form"):void 0;if(!r)throw new D("use:enhance must be added to the form to use submit, or pass a HTMLElement inside the form (or the form itself) as an argument.");if(!r.requestSubmit)return r.submit();const o=e&&(e instanceof HTMLButtonElement&&e.type=="submit"||e instanceof HTMLInputElement&&["submit","image"].includes(e.type));r.requestSubmit(o?e:void 0)},isTainted:Xe,enhance:nt}}new TextEncoder;let gn=!1;try{SUPERFORMS_LEGACY&&(gn=!0)}catch{}export{An as s};