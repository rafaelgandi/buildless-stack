/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/nested-css-to-flat@1.0.5/src/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const e=e=>"object"==typeof e&&null!==e,n="STATE_KEY",t="STATE_VALUE",r="NODE_AT_GROUP_KEY",i="NODE_AT_GROUP_VALUE",s="COMMENT_START",d=(e,n=1)=>{const t=[];let r="";for(let i=0;i<e.length;i++){const s=e[i];if(";"===s)t.push(r.trim()),r="";else if("@"===s&&""===r.trim()){const{node:r,endIndex:s}=o(e.substr(i),n+1);t.push(r),i+=s}else if("&"===s&&""===r.trim()){const{node:r,endIndex:s}=o(e.substr(i),n+1);t.push(r),i+=s}else if([".",":",">"].some((e=>s===e))&&""===r.trim()){const{node:r,endIndex:s}=o(e.substr(i-1),n+1);t.push(r),i+=s}else{if("}"===s)return""!==r.trim()&&t.push(r.trim()),{val:t,endIndex:i-1};r+=s}}return{val:t,endIndex:e.length-1}},o=(e,l=0)=>{const u={};let c=n,f=n,a="",m=0;for(let b=0;b<e.length;b++){const p=e[b];if("}"===p&&l>0)return{node:u,endIndex:b};if(c===i||"}"!==p)switch("/"===p&&"*"===e[b+1]&&(f=c,c=s,b+=2),c){case s:"*"===p&&"/"===e[b+1]&&(c=f,b+=2,m=b);break;case n:if(""===a.trim()&&"@"===p.trim())c=r,a+=p.trim();else if("{"===p)c=t,a=a.trim(),u[a]=u[a]||[];else{if(":"===p&&" "===e[b+1]){b=m;const{val:E,endIndex:I}=d(e.substr(b),l+1);return{node:E,endIndex:b+I}}a+=p}break;case t:const{val:$,endIndex:h}=d(e.substr(b),l+1);b+=h,u[a]=[...u[a],...$],c=n,a="",m=b;break;case r:";"===p?(u[a]=void 0,a="",m=b,c=n):"{"===p?(a=a.trim(),x(o(e.substr(b+1),l+1)),c=i):a+=p;break;case i:if(""===p.trim())break;"}"!==p?x(o(e.substr(b),l+1)):(a="",m=b,c=n)}function x(e){u[a.trim()]=[...u[a]||[],...Array.isArray(e.node)?e.node:[e.node]],b+=e.endIndex+1}}return{node:u,endIndex:e.length}};function l(n){return((n,t="")=>{const r={},i=(n,t="")=>(t=t.indexOf(",")>-1&&0!==t.indexOf(":is")?`:is(${t})`:t,Object.entries(n).map((([n,s])=>(n=n.replace(/\@nest/gi,""),""!==t&&[".",":",">"].some((e=>n.startsWith(e)))&&!n.includes("&")&&(n="& "+n),0===(n=n.replace(/\&/gi,t)).indexOf("@media")?(r[n]=r[n]||"",r[n]+=s?s.filter(e).reduce(((e,n)=>e+`${i(n,t)} `),""):null,""):0===n.indexOf("@")?` ${n} { ${s.filter((n=>!e(n))).join(";")}${s.filter(e).map((e=>i(e,n))).join(" ")} }`:s?`${n} { ${s.filter((n=>!e(n))).join(";")} } ${s.filter(e).map((e=>i(e,n))).join(" ")}`:`${n.trim()};`))).join("").trim());return i(n,t)+Object.entries(r).reduce(((e,[n,t])=>e+(t?`${n} { ${t.trimEnd()} }`:`${n};`))," ").trimEnd()})(o(n).node)}export{l as transform};export default null;
