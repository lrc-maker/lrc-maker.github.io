import{R as n,a as A,r as b,j as e,u as P,e as L,m as F,T as u,k as W,v as z}from"./index-w9hTxAbw.js";const C={url:"https://github.com/magic-akari/lrc-maker",wiki:"https://github.com/magic-akari/lrc-maker/wiki"};async function D(){const a="akari-lrc-maker";"serviceWorker"in navigator&&(await caches.keys().then(async r=>Promise.all(r.filter(l=>l.startsWith(a)).map(async l=>caches.delete(l)))),await navigator.serviceWorker.getRegistration().then(r=>{r&&r.unregister().then(()=>{location.reload()})}))}var K=[["en-US","English"],["ja","日本語"],["ko-KR","한국어"],["pl-PL","Polski"],["pt-BR","Português"],["sk-SK","Slovenčina"],["zh-CN","简体中文"],["zh-HK","繁體中文(香港)"],["zh-TW","繁體中文"]],d={hash:"db7d34e",updateTime:"2025-02-16T21:57:35+08:00",version:"5.8.0"};const q={type:"number",step:1},k=(a,r)=>{const l=n.useRef(null);n.useEffect(()=>{const c=l.current;if(c){const i=()=>{c.value=a.toString()};return c.addEventListener("change",i),()=>c.removeEventListener("change",i)}},[a]);const h=n.useCallback(c=>{c.target.validity.valid&&r(c)},[r]);return{...q,ref:l,onChange:h,defaultValue:a}},G=K,U=()=>{const{prefState:a,prefDispatch:r,lang:l}=n.useContext(A,b.lang||b.prefState),h=n.useCallback(s=>{r({type:"themeColor",payload:s.target.value})},[r]),c=n.useRef(null),i=n.useCallback(s=>{let t=s.value;if(!s.validity.valid){s.value=s.defaultValue;return}if(t.length===3){const[o,f,g]=t;t=o+o+f+f+g+g}t.length<6&&(t=t.padEnd(6,"0")),r({type:"themeColor",payload:"#"+t})},[r]),v=n.useCallback(s=>i(s.target),[i]),N=n.useCallback(s=>{s.preventDefault();const o=s.target.elements.namedItem("user-color-input-text");return i(o)},[i]);n.useEffect(()=>{c.current.value=a.themeColor.slice(1)},[a.themeColor]);const p=n.useCallback(s=>{r({type:s.target.name,payload:s.target.value})},[r]),y=n.useCallback(()=>{D()},[]),T=n.useMemo(()=>{const s=new Date(d.updateTime),t={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short",hour12:!1};return new Intl.DateTimeFormat(a.lang,t).format(s)},[a.lang]),S=n.useCallback(s=>{r({type:"lang",payload:s.target.value})},[r]),I=n.useCallback(()=>r({type:"builtInAudio",payload:s=>!s.builtInAudio}),[r]),M=n.useCallback(()=>r({type:"screenButton",payload:s=>!s.screenButton}),[r]),w=n.useCallback(s=>{r({type:"themeMode",payload:Number.parseInt(s.target.value,10)})},[r]),E=n.useCallback(s=>{r({type:"fixed",payload:Number.parseInt(s.target.value,10)})},[r]),B=n.useMemo(()=>G.map(([s,t])=>e.jsx("option",{value:s,children:t},s)),[]),R=n.useMemo(()=>Object.values(P).map(s=>{const t=s===a.themeColor,o=["color-picker","ripple"];return t&&o.push("checked"),e.jsx("label",{className:o.join(L.space),style:{backgroundColor:s},children:e.jsx("input",{hidden:!0,type:"radio",name:"theme-color",value:s,checked:t,onChange:h})},s)}),[h,a.themeColor]),m=n.useMemo(()=>({backgroundColor:a.themeColor}),[a.themeColor]),_=n.useMemo(()=>F("   hello   世界～   ",a.spaceStart,a.spaceEnd),[a.spaceStart,a.spaceEnd]),x=n.useRef(null),j=n.useRef(null);return n.useEffect(()=>{j.current.type==="color"&&x.current.removeAttribute("for")},[]),e.jsxs("div",{className:"preferences",children:[e.jsxs("ul",{children:[e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.version}),e.jsx("span",{className:"select-all",children:d.version})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.commitHash}),e.jsx("span",{className:"select-all",children:d.hash})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.updateTime}),e.jsx("span",{children:T})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.repo}),e.jsx("a",{className:"link",href:C.url,target:"_blank",rel:"noopener noreferrer",children:"Github"})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.help}),e.jsx("a",{className:"link",href:C.wiki,target:"_blank",rel:"noopener noreferrer",children:"Github Wiki"})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.language}),e.jsx("div",{className:"option-select",children:e.jsx("select",{value:a.lang,onChange:S,"aria-label":l.preferences.language,children:B})})]})}),e.jsx("li",{children:e.jsxs("label",{className:"list-item",children:[e.jsx("span",{children:l.preferences.builtInAudio}),e.jsxs("label",{className:"toggle-switch",children:[e.jsx("input",{type:"checkbox",checked:a.builtInAudio,onChange:I,"aria-label":l.preferences.builtInAudio}),e.jsx("span",{className:"toggle-switch-label"})]})]})}),e.jsx("li",{children:e.jsxs("label",{className:"list-item",children:[e.jsx("span",{children:l.preferences.spaceButton}),e.jsxs("label",{className:"toggle-switch",children:[e.jsx("input",{type:"checkbox",checked:a.screenButton,onChange:M,"aria-label":l.preferences.spaceButton}),e.jsx("span",{className:"toggle-switch-label"})]})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.themeMode.label}),e.jsx("div",{className:"option-select",children:e.jsxs("select",{name:"theme-mode",value:a.themeMode,onChange:w,"aria-label":l.preferences.themeMode.label,children:[e.jsx("option",{value:u.auto,children:l.preferences.themeMode.auto}),e.jsx("option",{value:u.light,children:l.preferences.themeMode.light}),e.jsx("option",{value:u.dark,children:l.preferences.themeMode.dark})]})})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.themeColor}),e.jsxs("details",{className:"dropdown",children:[e.jsxs("summary",{children:[e.jsx("span",{className:"color-picker ripple hash",style:m,children:"#"}),e.jsx("span",{className:"current-theme-color",children:a.themeColor.slice(1)})]}),e.jsxs("form",{className:"dropdown-body color-wall",onSubmit:N,children:[R,e.jsxs("label",{className:"color-picker ripple user-color-label hash",htmlFor:"user-color-input-text",style:m,ref:x,children:["#",e.jsx("input",{type:"color",className:"color-picker pseudo-hidden",value:a.themeColor,onChange:h,ref:j})]}),e.jsx("input",{ref:c,id:"user-color-input-text",name:"user-color-input-text",className:"user-color-input-text",type:"text",pattern:"[\\da-f]{3,6}",required:!0,autoCapitalize:"none",autoComplete:"off",autoCorrect:"off",spellCheck:!1,defaultValue:a.themeColor.slice(1),onBlur:v})]})]})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.lrcFormat}),e.jsxs("span",{children:[e.jsx("time",{className:"format-example-time",children:W(83.456,a.fixed)}),e.jsx("span",{className:"format-example-text",children:_})]})]})}),e.jsx("li",{children:e.jsxs("section",{className:"list-item",children:[e.jsx("span",{children:l.preferences.fixed}),e.jsx("div",{className:"option-select",children:e.jsxs("select",{name:"fixed",value:a.fixed,onChange:E,"aria-label":l.preferences.lrcFormat,children:[e.jsx("option",{value:0,children:"0"}),e.jsx("option",{value:1,children:"1"}),e.jsx("option",{value:2,children:"2"}),e.jsx("option",{value:3,children:"3"})]})})]})}),e.jsx("li",{children:e.jsxs("label",{className:"list-item",children:[e.jsx("label",{htmlFor:"space-start",children:l.preferences.leftSpace}),e.jsx("input",{name:"spaceStart",id:"space-start",required:!0,min:-1,...k(a.spaceStart,p)})]})}),e.jsx("li",{children:e.jsxs("label",{className:"list-item",children:[e.jsx("label",{htmlFor:"space-end",children:l.preferences.rightSpace}),e.jsx("input",{name:"spaceEnd",id:"space-end",required:!0,min:-1,...k(a.spaceEnd,p)})]})}),e.jsx("li",{className:"ripple",onTransitionEnd:y,children:e.jsx("section",{className:"list-item",children:l.preferences.clearCache})})]}),e.jsx(z,{})]})};export{U as Preferences};
