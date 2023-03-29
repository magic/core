function e(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{},s=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),s.forEach(function(t){var s,i;s=e,i=o[t],t in s?Object.defineProperty(s,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):s[t]=i})}return e}function t(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):(function(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);o.push.apply(o,s)}return o})(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))}),e}function o(e,t){if(null==e)return{};var o,s,i=function(e,t){if(null==e)return{};var o,s,i={},a=Object.keys(e);for(s=0;s<a.length;s++)o=a[s],t.indexOf(o)>=0||(i[o]=e[o]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(s=0;s<a.length;s++)o=a[s],!(t.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(e,o)&&(i[o]=e[o])}return i}(()=>{let{h:s,app:i}=(()=>{var e={},t=[],o=t.map,s=Array.isArray,i="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:setTimeout,a=function(e){var t="";if("string"==typeof e)return e;if(s(e)&&e.length>0)for(var o,i=0;i<e.length;i++)""!==(o=a(e[i]))&&(t+=(t&&" ")+o);else for(var i in e)e[i]&&(t+=(t&&" ")+i);return t},r=function(e,t){var o={};for(var s in e)o[s]=e[s];for(var s in t)o[s]=t[s];return o},l=function(e){return e.reduce(function(e,t){return e.concat(t&&!0!==t?"function"==typeof t[0]?[t]:l(t):0)},t)},c=function(e,t){if(e!==t)for(var o in r(e,t)){var i,a;if(e[o]!==t[o]&&(i=e[o],a=t[o],!(s(i)&&s(a))||i[0]!==a[0]||"function"!=typeof i[0]))return!0;t[o]=e[o]}},n=function(e,t,o){for(var s,i,a=0,r=[];a<e.length||a<t.length;a++)s=e[a],r.push((i=t[a])?!s||i[0]!==s[0]||c(i[1],s[1])?[i[0],i[1],i[0](o,i[1]),s&&s[2]()]:s:s&&s[2]());return r},m=function(e,t,o,s,i,l){if("key"===t);else if("style"===t)for(var c in r(o,s))o=null==s||null==s[c]?"":s[c],"-"===c[0]?e[t].setProperty(c,o):e[t][c]=o;else"o"===t[0]&&"n"===t[1]?((e.actions||(e.actions={}))[t=t.slice(2)]=s)?o||e.addEventListener(t,i):e.removeEventListener(t,i):!l&&"list"!==t&&t in e?e[t]=null==s?"":s:null!=s&&!1!==s&&("class"!==t||(s=a(s)))?e.setAttribute(t,s):e.removeAttribute(t)},p=function(e,t,o){var s=e.props,i=3===e.type?document.createTextNode(e.name):(o=o||"svg"===e.name)?document.createElementNS("http://www.w3.org/2000/svg",e.name,{is:s.is}):document.createElement(e.name,{is:s.is});for(var a in s)m(i,a,null,s[a],t,o);for(var r=0,l=e.children.length;r<l;r++)i.appendChild(p(e.children[r]=x(e.children[r]),t,o));return e.node=i},d=function(e){return null==e?null:e.key},u=function(e,t,o,s,i,a){if(o===s);else if(null!=o&&3===o.type&&3===s.type)o.name!==s.name&&(t.nodeValue=s.name);else if(null==o||o.name!==s.name)t=e.insertBefore(p(s=x(s),i,a),t),null!=o&&e.removeChild(o.node);else{var l,c,n,g,h=o.props,f=s.props,b=o.children,y=s.children,w=0,v=0,j=b.length-1,k=y.length-1;for(var T in a=a||"svg"===s.name,r(h,f))("value"===T||"selected"===T||"checked"===T?t[T]:h[T])!==f[T]&&m(t,T,h[T],f[T],i,a);for(;v<=k&&w<=j&&null!=(n=d(b[w]))&&n===d(y[v]);)u(t,b[w].node,b[w],y[v]=x(y[v++],b[w++]),i,a);for(;v<=k&&w<=j&&null!=(n=d(b[j]))&&n===d(y[k]);)u(t,b[j].node,b[j],y[k]=x(y[k--],b[j--]),i,a);if(w>j)for(;v<=k;)t.insertBefore(p(y[v]=x(y[v++]),i,a),(c=b[w])&&c.node);else if(v>k)for(;w<=j;)t.removeChild(b[w++].node);else{for(var T=w,M={},C={};T<=j;T++)null!=(n=b[T].key)&&(M[n]=b[T]);for(;v<=k;){if(n=d(c=b[w]),g=d(y[v]=x(y[v],c)),C[n]||null!=g&&g===d(b[w+1])){null==n&&t.removeChild(c.node),w++;continue}null==g||1===o.type?(null==n&&(u(t,c&&c.node,c,y[v],i,a),v++),w++):(n===g?(u(t,c.node,c,y[v],i,a),C[g]=!0,w++):null!=(l=M[g])?(u(t,t.insertBefore(l.node,c&&c.node),l,y[v],i,a),C[g]=!0):u(t,c&&c.node,null,y[v],i,a),v++)}for(;w<=j;)null==d(c=b[w++])&&t.removeChild(c.node);for(var T in M)null==C[T]&&t.removeChild(M[T].node)}}return s.node=t},g=function(e,t){for(var o in e)if(e[o]!==t[o])return!0;for(var o in t)if(e[o]!==t[o])return!0},h=function(e){return"object"==typeof e?e:b(e)},x=function(e,t){return 2===e.type?((!t||!t.lazy||g(t.lazy,e.lazy))&&((t=h(e.lazy.view(e.lazy))).lazy=e.lazy),t):e},f=function(e,t,o,s,i,a){return{name:e,props:t,children:o,node:s,type:a,key:i}},b=function(o,s){return f(o,e,t,s,void 0,3)},y=function(t){return 3===t.nodeType?b(t.nodeValue,t):f(t.nodeName.toLowerCase(),e,o.call(t.childNodes,y),t,void 0,1)};return{h:function(t,o){for(var i,a=[],r=[],l=arguments.length;l-- >2;)a.push(arguments[l]);for(;a.length>0;)if(s(i=a.pop()))for(var l=i.length;l-- >0;)a.push(i[l]);else!1===i||!0===i||null==i||r.push(h(i));return o=o||e,"function"==typeof t?t(o,r):f(t,o,r,void 0,o.key)},app:function(e){var t={},o=!1,a=e.view,r=e.node,c=r&&y(r),m=e.subscriptions,p=[],d=function(e){f(this.actions[e.type],e)},g=function(e){return t!==e&&(t=e,m&&(p=n(p,l([m(t)]),f)),a&&!o&&i(b,o=!0)),t};let{middleware:x=e=>e}=e,f=x((e,o)=>"function"==typeof e?f(e(t,o)):s(e)?"function"==typeof e[0]||s(e[0])?f(e[0],"function"==typeof e[1]?e[1](o):e[1]):(l(e.slice(1)).map(function(e){e&&e[0](f,e[1])},g(e[0])),t):g(e));var b=function(){o=!1,r=u(r.parentNode,r,c,c=h(a(t)),d)};f(e.init)}}})(),a=e=>(t={},o)=>{let i=(e,...t)=>t.some(t=>t===typeof e);if(i(o,"undefined")){if(t.props)return s(e,{},[t]);i(t,"string","number","function")||Array.isArray(t)?(o=t,t={}):i(t.View,"function")&&(o=t.View,t={})}return s(e,t,o)},r=a("a");a("abbr"),a("address"),a("animate"),a("animateMotion"),a("animateTransform"),a("area"),a("article"),a("aside"),a("audio"),a("b"),a("base"),a("bdi"),a("bdo"),a("blockquote"),a("body"),a("br");let l=a("button");a("canvas"),a("caption");let c=a("circle");a("cite"),a("clipPath");let n=a("code");a("col"),a("colgroup"),a("data"),a("datalist"),a("dd"),a("defs"),a("del"),a("desc"),a("description"),a("details"),a("dfn"),a("dialog"),a("discard");let m=a("div");a("dl"),a("dt"),a("ellipse"),a("em"),a("embed"),a("feBlend"),a("feColorMatrix"),a("feComponentTransfer"),a("feComposite"),a("feConvolveMatrix"),a("feDiffuseLighting"),a("feDisplacementMap"),a("feDistantLight"),a("feDropShadow"),a("feFlood"),a("feFuncA"),a("feFuncB"),a("feFuncG"),a("feFuncR"),a("feGaussianBlur"),a("feImage"),a("feMerge"),a("feMergeNode"),a("feMorphology"),a("feOffset"),a("fePointLight"),a("feSpecularLighting"),a("feSpotLight"),a("feTile"),a("feTurbulence"),a("fieldset"),a("figcaption"),a("figure"),a("filter");let p=a("footer");a("foreignObject"),a("form");let d=a("g"),u=a("h1"),g=a("h2"),h=a("h3"),x=a("h4"),f=a("h5");a("h6"),a("hatch"),a("hatchpath"),a("head");let b=a("header");a("hgroup"),a("hr"),a("html"),a("i"),a("iframe"),a("image");let y=a("img"),w=a("input");a("ins"),a("kbd"),a("label"),a("legend");let v=a("li");a("line"),a("linearGradient"),a("link");let j=a("main");a("map"),a("mark"),a("marker"),a("mask"),a("mesh"),a("meshgradient"),a("meshpatch"),a("meshrow"),a("meta"),a("metadata"),a("meter"),a("mpath");let k=a("nav");a("noscript"),a("object"),a("ol"),a("optgroup"),a("option"),a("output");let T=a("p");a("param");let M=a("path");a("pattern"),a("picture"),a("polygon"),a("polyline");let C=a("pre");a("progress"),a("q"),a("radialGradient"),a("rb"),a("rect"),a("rp"),a("rt"),a("rtc"),a("ruby"),a("s"),a("samp"),a("script"),a("section"),a("select"),a("set"),a("small"),a("solidcolor"),a("source");let E=a("span");a("stop"),a("strong"),a("style"),a("sub"),a("summary"),a("sup");let P=a("svg");a("symbol"),a("table"),a("tbody"),a("td"),a("template"),a("text"),a("textPath"),a("textarea"),a("tfoot"),a("th"),a("thead"),a("time"),a("title"),a("tr"),a("track"),a("tspan"),a("u");let O=a("ul");a("unknown"),a("use"),a("video"),a("view"),a("wbr");let $=o=>Object.entries(o.blog).map(([s])=>N(t(e({},o),{year:s,link:o.url}))),L=o=>{let s;let{blog:i,link:a,month:r,url:l,year:c}=o,n=Object.entries(i[c][r]),m=[r];return a?s=`${a}${r}/`:m.push(" - ",c),[h(s?W({to:s},m):m),n.map(([i,a])=>a.map(a=>A(t(e({},o,a.state),{name:a.name,link:s,day:i}))))]},S=(e,t)=>{let{url:o,title:s,description:i}=e,[a,r,l,c,n,m,p]=o.split("/");return[g(s),T(i),t,x("Blog Archives:"),T(W({to:`/${r}/${l}/${c}/`},`year: ${c}`)),T(W({to:`/${r}/${l}/${c}/${n}/`},`month: ${n} ${c}`))]},A=e=>m([x([e.day,"-",e.month,"-",e.year," - ",W({to:e.name},e.title)]),T(e.description)]),N=o=>{let s;let{link:i,year:a,blog:r,url:l}=o;return i?s=`${i}${a}/`:l.endsWith(`${a}/`)&&(s=l),m([g(i?W({to:s},a):a),Object.entries(r[a]).map(([i,a])=>L(t(e({},o),{month:i,days:a,link:s})))])},I=e=>{e="string"==typeof e?{header:e}:e;let t=e.header||e.title;return m({class:"Component"},[t&&f(t),T(["Component, a second component in ",W({to:"https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs"},"/assets/modules/Component.mjs")])])},_=()=>m({class:"Credits"},["made with a few bits of ",W({to:"https://magic.github.io/",target:"_blank",rel:"noopener"},"magic")]),D=(e,t=[])=>p({class:"Footer"},[m({class:"Container"},[_(),t])]),R=e=>{if("string"==typeof e)e={project:e};else if(!e.project)return;let{branch:t="master",host:o="github"}=e,{project:s=!1}=e,i="",a=s;s.startsWith("@")?(i="@",s=s.substr(1)):a=s.split("/")[1];let r=[["npm",(e=s)=>e&&{to:`https://www.npmjs.com/package/${a}`,src:`https://img.shields.io/npm/v/${i}${e}?color=blue`}],["node",(e=s)=>e&&{src:`https://img.shields.io/node/v/${i}${e}?color=blue`}],["license",(e=s)=>e&&{src:`https://img.shields.io/npm/l/${i}${e}?color=blue`}],["travis",(e=s)=>e&&{to:`https://travis-ci.com/${e}`,src:`https://img.shields.io/travis/com/${e}/${t}`}],["appveyor",(e=s)=>{if(e){let[o,s]=e.split("/");return{to:`https://ci.appveyor.com/project/${o=o.replace(/-/g,"")}/${s}/branch/${t}`,src:`https://img.shields.io/appveyor/ci/${o}/${s}/${t}.svg`}}}],["coveralls",(e=s)=>({to:`https://coveralls.io/${o}/${e}`,src:`https://img.shields.io/coveralls/${o}/${e}/${t}.svg`})],["snyk",(e=s)=>e&&{to:`https://snyk.io/test/${o}/${e}`,src:`https://img.shields.io/snyk/vulnerabilities/github/${e}.svg`}]].map(([t,o])=>o(e[t]));if(r.length)return O({class:"GitBadges"},r.map(({to:e,src:t})=>{if(!t)return;let o=V({src:t,height:"23"});return e?v(W({to:e},o)):v(o)}))},B=t=>{let{badges:o=!0,items:s=[],org:i,host:a="github",header:r,desc:l=t.description}=t,c={};return t.class?t.class.includes("GitList")||(c.class=`GitList ${t.class}`):c.class="GitList",t.id?c.id=t.id:c.id=i,c.id.startsWith("gl")||(c.id=`gl-${c.id}`),m(c,[r&&g(r),l&&m({class:"description"},l),O({id:`${c.id}-ul`},[s.map(t=>B.Item(e({badges:o,org:i,id:`${c.id}-li`,host:a},t)))])])};B.Item=e=>{let{name:t,org:o,id:s,host:i,badges:a=!0}=e,r=e.desc||e.description;return v({id:`${s}-${t}`,class:"GitListItem"},[h([W({to:`https://${o}.${i}.io/${t}`},`@${o}/${t} demo`)]),r&&T(r),T(W({to:`https://${i}.com/${o}/${t}`},"git repository")),a&&R(`@${o}/${t}`)])};let z=(e={},t=[])=>{let{logo:o,menu:s,logotext:i,hash:a,url:r}=e;if(o||s||i)return b({class:"Header"},[G(),i&&T(i),s&&F({url:r,hash:a,menu:s}),t])},V=e=>{if("string"==typeof e&&(e={src:e}),e.src)return e.alt||(e.title?e.alt=e.title:(e.role="presentation",e.alt="",e.loading=e.loading||"lazy")),y(e)},q=()=>B({org:"magic-libraries",header:[W({to:"https://magic-libraries.github.io"},"@magic-libraries")],desc:["@magic libraries are pieces of client side functionality."," they are not intended to be used in markdown,"," instead, a developer will use them when creating @magic-modules,"," which can then be used from markdown pages."],items:[{name:"db",description:"key => value store using localstorage"},{name:"gql",description:["the @magic-libraries/gql module"," encodes template strings to graphql queries ready to be sent to a server."]},{name:"http",description:"http request effect for @magic."},{name:"is",description:"the @magic-libraries/is module unifies the javascript type testing apis."},{name:"json",description:["the @magic-libraries/json module parses and stringifies json."," it also returns errors instead of throwing them."]},{name:"prevent-default",description:["the @magic-libraries/prevent-default module"," invokes event.preventDefault as a hyperapp effect."]},{name:"slugify",description:"makes strings url safe. opinionated."},{name:"try-catch",description:["the @magic-libraries/try-catch module"," returns errors instead of throwing them."]},{name:"uri",description:["the @magic-libraries/uri module"," encodes objects to uri strings and decodes uri strings to objects."]}]}),J=(e={})=>P({class:"LightSwitch icon",onclick:et.changeTheme,height:25,width:25,viewBox:"0 0 352 460"},[M({d:"M149 48C96 48 48 95 47 143c-1 13 19 17 20 0-1-35 48-75 83-75 15 0 12-22-1-20z"}),M({d:"M176 0C74 0 0 83 0 176c9 91 84 118 100 204h20c-16-92-97-138-100-204C22 70 105 21 176 20zM95 400c2 68 20 48 40 60h82c20-12 38 8 40-60z"}),M({d:"M175 0c102 0 177 83 177 176-9 91-86 118-102 204h-20c16-92 99-138 102-204-2-106-86-155-157-156z"})]),W=(e,t)=>{var{to:s,action:i=et.go,text:a}=e,l=o(e,["to","action","text"]);let{href:c,nofollow:n,noreferrer:m}=l,p=o(l,["href","nofollow","noreferrer"]);s=s||c||"",p.href=s,a&&t?a=[a,t]:a||(a=t||s);let d="/"===s[0]||"#"===s[0];return d?p.onclick=[i,ee.preventDefault]:(p.target="_blank",p.rel="noopener",n&&(p.rel+=" nofollow"),m&&(p.rel+=" noreferrer")),r(p,a)},G=()=>W({to:"/core/",class:"Logo"},[P({viewBox:"0 0 512 444"},[M({d:"M512 444L256 0 0 444z",fill:"#663695"}),c({cx:"256",cy:"294",r:"130",fill:"#fff"}),c({cx:"256",cy:"281",r:"40",fill:"#663695"}),M({d:"M256 350v44m24-44l1 13c1 27 29 27 29-7m-160-72s46-47 106-47c59 0 106 47 106 47s-47 43-106 43c-60 0-106-43-106-43zm65-75a134 134 0 0189 2",class:"stroke"}),M({d:"M256 81v53m184 270l-43-29M72 404l43-29",class:"stroke white"})])]),F=(o={})=>{let{collapse:s=!0,menu:i,hash:a}=o,{class:r="",url:l}=o;return r.includes("Menu")||(r=`Menu ${r}`.trim()),a&&!l.endsWith(a)&&(l+=`#${a}`),k({className:r},O(i.map(o=>H(t(e({},o),{url:l,collapse:s})))))},H=t=>{let{collapse:s,items:i=[],text:a,url:r}=t,l=o(t,["collapse","items","text","url"]),c={class:{}},{to:n}=l;n===r&&(c.class.active=!0);let m=[],p=!s||r.includes(n);return p&&i.length&&(m=O(i.map(t=>H(e({url:r,collapse:s},t))))),v(c,[n?W(l,a):E(l,a),m])},U=e=>m({class:"Mod"},[h("Mod.Mod"),T(["this is Mod. it gets loaded from ",W({to:"https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs"},"/assets/modules/Mod.mjs")]),T(["the state of this module: ",JSON.stringify(e.module)])]),K=()=>B({class:"ModuleList",org:"magic-modules",header:[W({to:"https://magic-modules.github.io/"},"@magic-modules")],description:["modules are the building blocks of ",W({to:"https://magic.github.io/core/"},"@magic"),". modules can be used to add both client and server functionality to your @magic app."],items:[{name:"about-magic",description:"AboutMagic shows some information about @magic."},{name:"accordion",description:"Accordion shows a list of items that horizontally open/close."},{name:"cite",description:"Makes Citations easy. Adds Quote around quotes and a minimally styled paragraph around the author."},{name:"example-list",description:"ExampleList shows a list of @magic-examples pages."},{name:"gdpr",description:"Gdpr compliant popup that allows users to allow or deny cookies."},{name:"git-badges",description:"GitBadges shows a list of github repository status badges."},{name:"git-list",description:"show a list of git repositories like the one you are looking at."},{name:"hero",description:"Hero modules are full screen top of page content."},{name:"language-switch",description:"LanguageSwitch provides simple multilanguage support for magic."},{name:"library-list",description:"LibraryList shows a list of all @magic-libraries libraries."},{name:"light-box",description:"images that show a bigger view of themselves when clicked."},{name:"light-switch",description:"dark/light theme color switch button."},{name:"messages",description:"Messages shows popup messages."},{name:"module-list",description:"ModuleList shows the list of @magic-modules you are looking at."},{name:"no-spy",description:'Minimal interface for "we do not spy" modal.'},{name:"pre",description:"Pre allows you to display javascript code with syntax highlighting."},{name:"quote",description:"adds “” around the quote and sets font-style: italic."},{name:"sound-cloud",description:"embed soundcloud track, playlist and user widgets"},{name:"theme-list",description:"ThemeList shows a list of all @magic-themes."},{name:"theme-vars",description:"ThemeVars shows a preview of all colors used in a @magic-themes."},{name:"video-embed",description:"VideoEmbed embeds videos from any video hoster."},{name:"xkcd",description:"Xkcd embeds xkcd comics."}]}),Y=({nospy:e={},cookies:t=[]})=>{let{show:o,title:s="Privacy Notice",content:i="This app neither saves, collects, nor shares any data about you.",buttonText:a="Awesome!"}=e;return o?m({class:"NoSpy"},[m({class:"Background",onclick:et.nospy.toggle}),m({class:"Container"},[s&&h(s),i&&T(i),w({onclick:et.nospy.toggle,value:a,type:"button"})])]):m({class:"NoSpy"},P({class:"icon",onclick:et.nospy.toggle,width:"25",height:"25",viewBox:"0 0 512 512"},[d([M({d:`
M507,208c-1-7-7-12-14-13c-7-1-13,3-16,9
c-5,11-16,19-29,19c-14,0-26-10-30-23c-2-8-11-13-19-11
C393,191,389,192,384,192c-35-0-64-29-64-64c0-5,1-9,2-14
c2-8-3-16-11-19C297,90,288,78,288,64c-0-13,8-24,19-29
c6-3,10-9,9-16c-1-7-6-12-13-14C288,2,272,0,256,0
C115,0,0,115,0,256c0,141,115,256,256,256c141-0,256-115,256-256
C512,239,510,224,507,209z M414,414C374,455,318,480,256,480s-118-25-158-66
C57,374,32,318,32,256S57,138,98,98C138,57,194,32,256,32c3,0,6,0,9,0
C259,42,256,52,256,64c0,24,13,44,33,55C288,122,288,125,288,128
c0,53,43,96,96,96c3,0,6-0,8-0C403,242,424,256,448,256
c11-0,22-3,32-8c0,3,0,6,0,9C480,318,455,374,414,414z
`}),c({cx:"192",cy:"128",r:"32"}),c({cx:"128",cy:"256",r:"32"}),c({cx:"288",cy:"384",r:"32"}),c({cx:"272",cy:"272",r:"16"}),c({cx:"400",cy:"336",r:"16"}),c({cx:"176",cy:"368",r:"16"})])]))},X=({page:e,state:t},o)=>{let s={id:"Magic",class:t.pageClass};return j(s,m({class:{Wrapper:!0}},[z(t),m({class:"Page",id:"page"},e(t)),D(t),o]))},Q=(t,o)=>{"string"==typeof t?t={content:t}:o?t=e({content:o},t):Array.isArray(t)&&(t={content:t.join("")});let{content:s,lines:i=!0}=t;return m({class:{Pre:!0,lines:i&&"false"!==i}},[m({class:"menu"},[l({onclick:[et.pre.clip,e=>({e,content:s})]},"copy")]),C(s.trim().split("\n").map(Q.Line))])};Q.Comment=e=>E({class:"comment"},e),Q.Line=e=>n({class:"line"},Q.Words(e)),Q.Word=e=>{if(!e)return"";let t=e.includes("://"),o=e.startsWith("mailto:")||e.includes("@")&&e.includes(".");if(t||o)return W({to:e,text:e});let s="";return("state"===e?s="state":"actions"===e?s="actions":"effects"===e?s="effects":"subscriptions"===e?s="subscriptions":ee.pre.keywords.includes(e)?s="keyword":ee.pre.builtins.includes(e)?s="builtin":ee.pre.booleans.includes(e)&&(s="boolean"),s)?E({class:s},e):e},Q.Words=e=>{let[t,...o]=e.split(ee.pre.commentRegex),s=!t.endsWith(":")&&o.length;if(s)return[Q.Words(t),Q.Comment(o.join("").split(ee.pre.wordRegex).map(Q.Word))];let i=[],a=e;if(e.replace(ee.pre.stringRegex,e=>{if(a){let[t,o]=a.split(e);t&&i.push(t.split(ee.pre.wordRegex).map(Q.Word).filter(e=>e)),a=o}i.push(E({class:"string"},e))}),a!==e)return a&&i.push(a.split(ee.pre.wordRegex).map(Q.Word).filter(e=>e)),i;let r=e.split(ee.pre.wordRegex).filter(e=>e);return r.map(Q.Word)};let Z=()=>B({org:"magic-themes",header:[W({to:"https://magic-themes.github.io"},"@magic-themes")],desc:["below is a collection of the available @magic app themes."," all of the themes below are designed to be usable on their own,"," but they can also be combined if needed."],items:[{name:"docs",description:"the @magic documentation theme. used in all @magic docs."},{name:"example",description:"a minimal example theme."},{name:"project",description:"foundational @magic theme for project presentation."},{name:"slides",description:"theme that provides slides for presentations."},{name:"reader",description:"a theme designed to provide a reader mode."}]}),ee={exportDefault:e=>`${string} the argument it received was ${e}`,pre:{booleans:["true","false"],builtins:["Array","Object","String","Number","RegExp","Null","Symbol","Set","WeakSet","Map","WeakMap","setInterval","setTimeout","Promise","JSON","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],commentRegex:/(\/\/)/gim,keywords:["let","this","long","package","float","goto","private","class","if","short","while","protected","with","debugger","case","continue","volatile","interface","instanceof","super","synchronized","throw","extends","final","export","throws","try","import","double","enum","boolean","abstract","function","implements","typeof","transient","break","default","do","static","void","int","new","async","native","switch","else","delete","null","public","var","await","byte","finally","catch","in","return","for","get","const","char","module","exports","require","npm","install","=>"],stringRegex:/("|')(.*?)\1/gim,wordRegex:/( )/gim},preventDefault:e=>(e.preventDefault(),e)},et={changeTheme:o=>t(e({},o),{pageClass:t(e({},o.pageClass),{light:"dark"===o.theme}),theme:"dark"===o.theme?"light":"dark"}),go:(o,s)=>{let i=s.currentTarget.href.replace(window.location.origin,""),[a,r=""]=i.split("#");if(a===o.url&&r===o.hash)return r&&(window.location.hash=r),o;let l=o.pages&&o.pages[a]&&o.pages[a].title;l&&(document.title=o.title=l),a!==o.url?r||window.scrollTo({top:0}):window.location.hash=r;let{scrollY:c}=window;return window.history.pushState({url:a,hash:r,scrollY:c},o.title,i),t(e({},o),{url:a,hash:r,prev:o.url})},nospy:{toggle:t=>(t.nospy.show=!t.nospy.show,e({},t))},pop:(o,s)=>{let{pathname:i,hash:a}=window.location;a=a.substring(1);let r=0;return s.state&&(i=s.state.url,a=s.state.hash,r=s.state.scrollY||0),a?window.location.hash=a:window.scroll({top:r}),t(e({},o),{url:i,hash:a})},pre:{clip:(e,{content:t})=>{if("undefined"!=typeof document&&"function"==typeof document.execCommand){let e=document.createElement("textarea");e.id="copy",e.innerHTML=t,document.body.appendChild(e);let o=document.getElementById("copy");o.select(),document.execCommand("copy"),document.body.removeChild(o)}return e}}},eo={listenPopState:(e,t)=>{let o=o=>e(t,o);return addEventListener("popstate",o),()=>removeEventListener("popstate",o)}},es={"/core/":e=>[u({id:"magiccore-documentation"},"@magic/core documentation"),g({id:"welcome-to-the-magic-docs"},"welcome to the magic docs."),T("@magic/core documentation. tells you why, how and when to use @magic. also provides an overview of all @magic functionality this ecosystem provides."),T("the goal of this document is to give you a rough @magical overview."),R("@magic/core"),g({id:"philosophy"},"philosophy"),T(`@magic aims to make it easy to stitch together any kind of webapp.
by providing simple, well documented and self contained modules,
@magic makes it possible to create stunningly fast
webpages with minimal cognitive overhead.`),g({id:"privacy"},"privacy"),T("@magic does not spy."),T(`not only do we try to be legally compliant by default,
but we also aim to be ethical
which means prioritizing your rights over our needs,
but also means we prioritize the rights of your users over your needs.
we believe that this is the best compromise.`),g({id:"buzzwords"},"why should i use magic?"),h({id:"features"},"features"),O([v("static html pages with opengraph seo."),v("pages are hosted for free using gitlab, github or any other git-pages style hosting."),v("static css output with selector and rule deduplication."),v("no javascript required where possible."),v("minimal client boilerplate."),v("no spyware included."),v("WIP: lambda faas and graphql api generator."),v("WIP: server side rendering (if needed).")]),h({id:"magic-is-tiny"},"@magic is tiny"),T(`~4 kb javascript boilerplate.
usually, all the javascript in your homepage will be 30-60kb big (after unpacking),
10-30kb get transmitted from the server to the client.
this documentation page you are reading loads 20kb of gzipped javascript,
which, when parsing, turns into ~88kb of uncompressed javascript.
this includes all content of all subpages, no additional server requests needed for any navigations in the page.`),T("WIP: code splitting for bigger pages."),h({id:"magic-works-without-javascript"},"@magic works without javascript"),T(`most of the functionality works without javascript,
some buttons and realtime user interactions obviously won't,
but @magic always tries to provide a non-javascript fallback via css.`),h({id:"magic-generates-static-pages"},"@magic generates static pages"),T("this makes free hosting (using github or gitlab pages) possible. and it's easy."),T(["@magic publishes to ",W({to:"https://github.com",text:"github"}),", ",W({to:"https://about.gitlab.com/",text:"gitlab"}),`,
and any other git-pages enabled hosting service.`]),h({id:"serverless--faas"},"serverless / faas"),T([`automagically generates
serverless lambdas, derived from the
`,W({to:"https://github.com/magic-modules/",text:"@magic-modules"}),`
you use in your pages.`]),T(`this makes visitor statistics, user authentication and authorization,
chat, and all other server side services possible.`)],"/core/404/":()=>m("404 - not found."),"/core/build/":e=>m([h(e.title),T(e.description),T([x("state.data"),Q(JSON.stringify({data:e.data},null,2))])]),"/core/concepts/":e=>[u({id:"magiccore-concepts"},"@magic/core concepts"),T("magic concepts. these are the building blocks of every module in a magic app"),g({id:"modules"},"@magic-modules"),T("modules are the main building block of magic."),T(`a page is a module, a button is a module, a link is a module, an image is a module.
even a theme is a module.`),T(`a @magic app contains modules containing modules that contain modules.
this can lead to inception.`),g({id:"module-building-blocks"},"module building blocks"),h({id:"state"},"state"),T(`state is a javascript object.
state can be mutated by actions,
effects and subscriptions can call actions to change the state.
every rendering frame, the state determines the output of the html views.`),Q(`const state = {
  shown: false,
  count: 0,
}
`),g({id:"actions"},"actions"),T("actions are an object containing functions"),T("those functions get the state and their props and may return a new full, but changed, state."),Q(`const actions = {
  toggleModal: state => {
    return {
      ...state,
      shown: !state.shown,
    }
  },

  calculator: {
    plus: state => ({ ...state, count: state.count + 1 }),
    minus: state => ({ ...state, count: state.count - 1 }),
  },
}`),g({id:"effects"},"effects"),T("effects are an object containing functions, just like actions."),T("effects can only change the state by calling actions."),T("effects may also be impure and trigger side-effects outside of hyperapp."),Q(`const effects = {
  waitASec: [state, async state => {
    await new Promise((r) => setTimeout(r, 1000))

    return actions.plus(state)
  }],
}`),g({id:"subscriptions"},"subscriptions"),T("at the moment, subscriptions can be defined using strings as function names."),T("also, if a module exports a subscriptions array, those subscriptions will be added to the app."),Q(`// in a module:

export const lib = {
  subscribe: (dispatch, action) => {
    setInterval(() => {
      dispatch(action, { arg: Math.random() * 100 })
    })
  },
}

export const actions = {
  onSubscription: (state, e) => ({
    ...state,
    arg: e.arg,
  })
}

export const subscriptions = ['lib.subscribe', 'actions.onSubscription']`),g({id:"views"},"views"),T(`views render the state to html
whenever an action triggers a change in the state, this then triggers a view change.`),Q("export const View = state => div(JSON.stringify(state))"),g({id:"styles"},"styles"),T(`every module can export a style object.
magic will automagically merge all styles into one global css file.
in the future, it will also remove unused styles for you.`),T(`styles merge order, last overwrites first:
module.style < page.style < app.style < theme.style`),T("this allows css to be inherited in both directions."),T(`a module automatically creates it's own css namespace,
that same namespace can be used in page, app and theme css styles
to overwrite module specific styles.`),h({id:"styles-magiccss"},"@magic/css"),T("internally, magic uses it's own css-in-js library."),T([`to find out more, click the following link:
`,W({to:"https://magic.github.io/css/",text:"@magic/css"})]),g({id:"globals"},"globals"),T("every module can set a global object, containing state and action properties."),T("every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions, instead of into the module namespace."),Q(`// in module.mjs

export const state = {
  internal: 0,
  external: 0,
}

export const actions = {
  internal: state => ({
    ...state,
    module: {
      internal: state.module.interal + 1,
    },
  }),
  external: state => ({
    ...state,
    external: state.external + 1,
  }),
}

export const global = {
  state: {
    external: true
  },
  actions: {
    external: true,
  },
}

// in the view, we can use both the global and local actions and state variables

export const View = state => div([
  'view',
  p({ onclick: actions.module.internal }, ['internal:', state.module.internal]),
  p({ onclick: actions.external }, ['external:', state.external]),
])`),g({id:"lambdas"},"server lambdas"),T(`this is the serverside magic.
you can define functions that get transpiled into serverside lambdas.
server side lambdas will be available for GET and/or POST requests.`),T(`the server side function signature is (req, res) => {},
as it is in most nodejs http servers,
with the addition of req.body being async => awaited before execution of the lambda.`)],"/core/files/":e=>[u(e.title),T("There are multiple magic files and directories."),O([v("/pages - files in the page directory map to urls in your app."),v("/assets - custom components, @magic-modules get imported here"),v("/assets/static - static files"),v("/assets/themes - theme directory, @magic-themes get imported here"),v("/assets/lib.mjs - imports npm and local but external packages into your app"),v("/app.mjs - gets merged into the app, can set state, actions, style here"),v("/config.mjs - custom config for your app"),v("/assets/Menu.mjs - custom Menu for your app")]),g({id:"pages"},"/pages"),T("the pages dir contains the pages of your webapp."),T(["each page has it's own state and actions, ","but also inherits the global state and actions from the app and it's dependencies"]),h({id:"pages-dir-structure"},"pages directory to url map"),T("for the domain mag.ic:"),Q(`
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
`),u({id:"pages-example"},"example page"),T("Pages can use javascript, html or markdown"),g({id:"pages-example-js"},"javascript example"),T("A magic javascript page is a @magic-module. The only difference is that pages get exposed via http"),Q(`
export const View = state =>
  div({ class: 'cl' }, [
    'this is the page content.',
    state.variable,
  ])

export const state = {
  variable: 'test',
}

export const actions = {
  changeVar: state => ({ ...state, variable: 'changed' }),
}

export const style = {
  '.cl': {
    color: 'green',
  },
}
`),g({id:"pages-example-html"},"html example"),T("html pages can only export state and View."),Q(`
---
@state
{
  "title": "html file example",
    "description": "this module gets imported from a html file."
}
---

<h2>&#36;{ state.title }</h4>

<p>{{ state.description }}</p>
`),g({id:"pages-example-markdown"},"markdown example"),T("markdown pages can only export state and View."),Q(`
---
@state {
  "title": "markdown file example",
  "description": "markdown file description"
}
---

## &#36;{state.title}

&#36;{state.description}
`),g({id:"assets"},"assets"),T("the assets dir contains custom components of your app."),T("you can import additional @magic-modules here"),h({id:"assets-example"},"/assets/index.mjs"),Q(`
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}
`),g({id:"static"},"/assets/static"),T(["the static dir contains all of your static assets.","every file in this directory gets copied to the public dir.","image and svg files get minified using imagemin."]),T(["text and binary files get compressed using the optional ",W({to:"https://github.com/jaeh/node-zopfli-es",text:"node-zopfli-es"})," (if it is installed)"]),g({id:"themes"},"/assets/themes"),T("the themes directory contains...themes."),T(["a magic theme is an object of css rules, see ",W({text:"@magic/css",to:"https://github.com/magic/css/"})," for more examples and documentation."]),h({id:"themes-example"},"example theme"),Q(`
export default {
  'body': {
    color: 'blue',
  },
}
`),g({id:"app"},"/app.mjs"),T("the /app.mjs file allows you to set global state, actions, and styles"),h({id:"app-example"},"/example/app.mjs"),Q(`
export const state = {
  globalStateVar: 'globally available',
}

export const actions = {
  globalAction: () => ({ globalStateVar: 'overwritten.' }),
}

export const style = {
  'body': {
    color: 'green',
  },
}
`),g({id:"config"},"/config.mjs"),T("the /config.mjs file allows you to set various aspects of your app"),h({id:"config-example"},"/config.mjs example"),Q(`
export default {
  // the local root directory of the magic app
  ROOT: 'example',

  // gets suffixed to the url. in this case domain.com/core/ will be the page root.
  WEB_ROOT: '/core/',

  // the theme in use, lives in {ROOT}/assets/themes/{name} or can be installed as either '@magic-themes/{name}' or 'magic-theme-{name}'
  THEME: 'docs',

  // the full url of the page.
  URL: 'magic.github.io/core/',

  // the public dir the bundles get written to
  PUBLIC: 'docs',

  // the directory in the pages directory that holds the blog posts
  // if this is not set, no blog is created.
  BLOG_DIR: 'news',

  // append these modules after the app loaded and only if javascript is enabled.
  // can be used to add features that won't do anything without js anyways.
  HOIST: ['LightSwitch', 'NoSpy'],

  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files
  CLIENT_LIB_NAME: 'magic',

  // this is set to be able to test broken link behaviour.
  // DO NOT ENABLE IN YOUR APP (unless you need to because reasons...)
  NO_CHECK_LINKS_EXIT: true,

  // tags written to the html before the #magic container
  PREPEND_TAGS: [{ name: 'div', props: { id: 'PREPENDTag' } }],

  // tags written to the html after the #magic container
  APPEND_TAGS: [{ name: 'div', props: { id: 'APPENDTag' } }],

  // script files, embedded before the magic.js script
  PREPEND_SCRIPTS: ['/prependScript.js'],

  // script files, embedded after the magic.js script
  APPEND_SCRIPTS: ['/appendScript.js'],

  // js files that get written directly into the magic.js script, before the magic code.
  PREPEND_JS: ['/prependJs.js'],

  // js files that get written directly into the magic.js script, after the magic code.
  APPEND_JS: ['/appendJs.js'],

  // css written into the magic.css file, before the magic css
  // use this to set defaults that get overwritten by the generated app css
  PREPEND_CSS: ['/prependCss.css'],

  // css written into the magic.css file, after the magic css
  // use this to overwrite the generated app css
  APPEND_CSS: ['/appendCss.css'],

  // add additional static file directories that will get added to app.static[name]
  ADD_STATIC: ['node_modules/dir/name/'],

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,
}
`),T(W({text:"Menu.mjs on github",to:"https://github.com/magic/core/blob/master/src/modules/Menu.mjs"}))],"/core/libraries/":e=>[u({id:"magiccore-library-docs"},"@magic/core library docs"),T("@magic/core libraries allow you to include client side functionality in your app."),g({id:"abstract"},"libraries"),T(`what would javascript be without the millions of dependencies
that you can easily install and make the average webpage
slow[ly] (pun intended) grow towards a footprint of 5 megabytes.`),T("we think that all of that bloat is unneeded, unheeded and, frankly, not optimal."),T([`magic has one external client side dependency,
`,W({to:"https://github.com/jorgebucaran/hyperapp/",text:"hyperapp"}),`,
[~500 lines that provide our ui state machine]. thats it. and it won't change.`]),T([`we also have the tendency to write libraries specialized for our usecase, see
`,W({to:"https://github.com/magic/css",text:"@magic/css"}),`,
`,W({to:"https://github.com/magic/test",text:"@magic/test"}),`,
`,W({to:"https://github.com/magic/cli",text:"@magic/cli"}),`
and others.`]),T(`once there is a lib key in at least one component,
window.lib (browser) and global.lib (nodejs) will be set,
aliasing lib as a global variable in both environments`),h({id:"dir-or-file"},"lib dir or file"),T(`if you need libraries in multiple otherwise independent modules,
it might be easier to keep your library dependencies in a central place.`),T(`to achieve this, one can simply create /assets/lib.mjs and export an object from it.
this object will get merged into the globalThis.lib object,
making it available as "lib" throughout your app.`),Q("export default { name: () => {} }"),T("will turn into"),Q("lib.name = () => {}"),h({id:"npm"},"npm"),T("all @magic-libraries and all npm packages starting with magic-library-* will be loaded automatically"),x({id:"example"},"Example"),T("first, install a @magic-library"),Q(`
npm install --save --save-exact @magic-libraries/is
`),T("then, in javascript"),Q(`
export const View = props => div([
  'value is ',
  lib.is(props.value, 'string') ? '' : 'not',
  ' a string',
])
`),q()],"/core/modules/":e=>[u({id:"magic-modules"},"@magic-modules"),T("magic modules are predefined modules for webapps."),g({id:"definition"},"module definition"),T("the minimal module is a function that returns some html."),Q(`
// /assets/ModuleName.mjs

// simplest module
export const View = () => div('hello, world')

// complete signature
export const View = (props = {}, children = []) => div('hello, world')
`),g({id:"usage"},"usage"),T(`if the npm package name starts with @magic-modules/ or magic-module-, it will get imported automagically.
the name of the Module will be set to a PascalCased version of the remainder of the module name.
@magic-modules/git-badges, for example, turns into GitBadges.
the same is true for all uppercased files in your /assets/ directory and subdirectories.
in the rare case where you want to install a npm module that can not be found,
you can import it in /assets/index.mjs`),Q(`
// /assets/index.mjs
import NpmModule from 'non-standard-named-magic-module-from-npm'

export default {
  // ...otherModules

  // load module from node_modules
  NpmModule,
}
`),T("after this, the module will be a global in your app and can be used like any other component."),Q(`
// any page or module
export default state => div([
  // module without props
  Mod(),
  'modules that need props: ',
  Mod({ state, customProp: true }),
`),K()],"/core/modules/example/":e=>[u({id:"magic-modulesexample"},"@magic-modules/example"),g({id:"custom-module"},"custom module"),U({state:e}),I({title:"Mod Component Title, passed via props"}),h({id:"mod-sourcecode"},"Mod sourcecode:"),Q(`
export const View = state =>
  div({ class: 'Mod' }, [
    h3('Mod.Mod'),
    p([
      'this is Mod. it gets loaded from ',
      Link({ to: 'https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs' }, '/assets/modules/Mod.mjs'),
      ' automatically, no need to import it.',
    ]),
    p(['the state of this module: ', JSON.stringify(state.module)]),
  ])

export const state = {
  module: {
    test: 'testing',
  },
}

export const style = {
  margin: '0 0 1em',
  padding: '0.5em',
  border: '1px solid',
  borderColor: 'green',

  h3: {
    margin: 0,
  },
}

export const global = {
  state: {
    module: true,
  },
}
`),h({id:"component-sourcecode"},"Component sourcecode:"),Q(`
export const View = props => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, propTypes, 'Component')
  const header = props.header || props.title

  return div({ class: 'Component' }, \\[
    header && h5(header),
    p([
      'Component, a second component in ',
      Link(
        { to: 'https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs' },
        '/assets/modules/Component.mjs',
      ),
    ]),
  ])
}

export const style = {
  border: '1px solid orange',
}

export const propTypes = {
  Component: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],
}
`)],"/core/modules/html/":e=>[g("html file example"),T("this module gets imported from a html file."),T(["see ",W({to:"https://github.com/magic/core/blob/master/example/pages/modules/html.html"},"this html file")," for an example."]),T("all html valid in <body> can be used, excluding the <script> and <style> tags."),T("the state looks like the following, and any valid json is allowed"),Q(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/markdown/":e=>[g({id:"markdown-file-example"},"markdown file example"),T("markdown file description"),T("this module gets imported from a markdown file."),T(["see ",W({to:"https://github.com/magic/core/blob/master/example/pages/modules/markdown.md",text:"this file in the example dir"})," for an example."]),T(`any kind of markdown can be used here,
but if you use html natively,
only tags valid in a html5 body, excluding <script> and <style> tags, are accepted.`),h({id:"a-list"},"a list:"),O([v(W({to:"https://magic.github.io/",text:"@magic/core"})),v(W({to:"https://magic-libraries.github.io/",text:"@magic-libraries"})),v(W({to:"https://magic-modules.github.io/",text:"@magic-modules"})),v(W({to:"https://magic-themes.github.io/",text:"@magic-themes"}))]),h({id:"state"},"state"),T(`this markdown file also starts with a magic @state declaration.
it is used internally to, for example, add the title and meta rel="description" tags to the head of this html file.`),T("the state looks like the following, and any valid json is allowed"),Q(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/preinstalled/":e=>[u({id:"magic-modules"},"@magic-modules"),g({id:"preinstalled"},"preinstalled"),T("magic has some preinstalled modules that will be used in most pages."),g({id:"app"},"app"),T(`this is the main app module.
it has magically inherited properties and all of it is customizable.`),T([`to add actions/state/style to the app you can just create an /assets/app.mjs file.
the contents of this file get
`,W({to:"https://github.com/magic/deep",text:"deep .merged"}),`
into the app`]),Q(`
// /src/app.mjs
export const state = {
  merge: 'gets merged into state',
}
export const actions = {
  mergedActions: state => ({ ...state, merge: 'merged action executed' }),
}
`),g({id:"menu"},"menu"),T("the Menu module provides... menus."),Q(`
export const View = state => {
  const items = [
    { to: '/', text: 'example page' },
    { to: 'https://example.com', text: 'example.com' },
    { to: 'https://example.com', nofollow: true, noreferrer: true, target: 'utopia', text: 'nofollow and noref" },
  ]

  return Menu({ items, collapse: false })
}

// output:
<nav class="Menu">
  <ul>
    <li>
      <a onclick="actions.go" href="/">example page
    </li>
    <li>
      <a href="https://example.com" target="_blank" rel="noopener">example.com
    </li>
    <li>
      <a href="https://example.com" target="utopia" rel="noopener nofollow noreferrer">nofollow and noref
    </li>
  </ul>
</nav>
`),h({id:"menu-props"},"Menu props"),T("the Menu module allows multiple props to be passed when instantiating the Menu"),h({id:"menu-props-collapse"},"props.collapse"),T(`by default, the menu will only show submenu items if their parent link is active.
to force submenu items to show at all times, just pass a collapse: false prop`),Q(`
Menu({
  // if false, menu will always show all submenu items
  collapse: false, // (default: true)
})
`),h({id:"menu-item-props"},"Menu.Item props"),T(`every MenuItem accepts the same props as a link does.
additionally a MenuItem accepts an items prop with sub menu items.`),Q(`
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [MenuItems],
  noreferrer: true, // set rel='noreferrer'
  nofollow: true, // set rel='nofollow'
})
`),h({id:"menu-sub-menus"},"sub menus"),T("to define a submenu, simply define a .items array on the menu item"),Q(`
// assets/app.mjs
export default {
  state: {
    // ...state
    menuName: [
      {
        to: '/example-page',
        text: 'example page',
        items: [
          { to: '/example-page/#sub', text: 'example sub page' },
      ] },
    ],
  },
  // ... rest of app.mjs
}
`),g({id:"link"},"link"),T("the link module allows you to link to things."),Q(`
// in any page or module View
export default () => [
  Link({ to: '/', text: 'page' }),
  // output: <a href="/" onclick="actions.go">page
  Link({ to: 'https://example.com', text: 'page' }),
  // output: <a href="https://example.com" target="_blank" rel="noopener">page
  Link({ to: '/', text: 'page', nofollow: true, noreferrer: true }),
  // output: <a href="https://example.com" target="_blank" rel="nofollow noreferrer noopener">page

  // you can also use children syntax instead of the text prop:
  Link({ to: '/' }, 'home'),

  // Link also supports # hash links
  Link({ to: '/#hash' }, 'home with hash'),
]
`),g({id:"img"},"img"),T("the img module adds some sane default values to your images."),Q(`
// in any page or module View
export default () => [
  Img('/image.png'),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png' }),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png', alt: 'image description' }),
  // output: <img src="/image.png" alt="image description" />
  Img({ src: '/image.png', title: 'image title', }),
  // output: <img src="/image.png" title="image title" alt="image title"/>
  Img({ src: '/image.png', title: 'image title', alt: 'image alt' }),
  // output: <img src="/image.png" title="image title" alt="image alt"/>
]
`),g({id:"footer"},"footer"),T("the footer module contains a small info text and a link to the magic github repository."),T(`to overwrite this behaviour, just place a Footer.mjs file in your assets
and require it in /assets/index.mjs.`),Q(`
// /assets/Footer.mjs:
const Footer = () =>
footer({ class: 'main' }, [
  div({ class: 'wrapper' }, [
    'made with a few bits of ',
    Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
  ]),
])

Footer.style: {
  'footer.main': {
    position: 'relative',
    textAlign: 'center',
    padding: '5em 0 .5em',
  },
}

export default Footer
`)],"/core/modules/propTypes/":e=>[u({id:"magic-modulesprop-types"},"@magic-modules/prop-types"),g({id:"check-props"},"CHECK_PROPS"),T("@magic-modules can export a .propTypes object with an array of prop types."),x({id:"#example"},"example"),Q(`
export const View = (prop1, prop2, prop3) => [
  p(prop1),
  p(prop2),
  p(prop3),
]

export const propTypes = [
  { name: 'prop1', type: 'string' },
  { name: 'prop2', type: 'number' },
  { name: 'prop3', type: 'array', items: 'string' },
  {
    name: 'prop4',
    type: 'object',
    items: [
      { name: 'prop4prop1', type: 'string' },
      { name: 'prop4prop2', type: 'number' },
  ] },
]
`)],"/core/news/":e=>$(e),"/core/news/2019/":e=>N(e),"/core/news/2019/12/":e=>L(e),"/core/news/2019/12/22/blogging/":e=>S(e,[T("so i guess i should start using it..."),T(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),T(`to use the blog,
create an archive dir, for example`),Q(`
src/blog/2019/12/22/
`),T("then just add the blogposts in that directory structure."),T(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),T("more information following soon.")]),"/core/test/":e=>[g("Test page"),T("This page shows various features and tests of magic functionality"),h("Link Tests:"),O([v(W({to:"/core/modules/"})),v(W({to:"/core/modules/#gl-magic-modules"})),v(W({to:"https://magic.github.io"}))]),h("Broken link tests:"),T("the following links are broken, and it's intentional for magic to warn us on every rebuild."),O([v(W({text:"redirect link",to:"https://magic.github.io/core#expected-redirect"})),v(W({text:"broken link",to:"https://expect-error"})),v(W({text:"404 link",to:"https://en.wikipedia.org/hMdYfVaKY4btraQcgD0me6RRBDnugbpJ4FLpgJgeB7"})),v(V({alt:"Broken Image Link",src:"https://broken-image-link"}))]),h("Image test"),T("while at it, let's test an image, 2 times with a working src:"),O([v(V({alt:"Magic Logo",src:"/core/logo.png"})),v(V({alt:"Magic Logo",src:"/core/logo.png"}))]),T("and once with a broken src:"),V({alt:"Broken Magic Logo",src:"/core/logo23-broken.png"}),h("Links in modules"),T(W({to:"/core/",text:"Link in a paragraph"})),O([v(W({to:"/core/",text:"Link in a list"})),v(W({to:"/core/",text:"Second Link in a list"}))])],"/core/themes/":e=>[u({id:"magic-themes"},"@magic-themes"),T(`magic themes are themes for magic apps.
you decide which theme to load by specifying the theme name in config.THEME`),Q(`
// /config.mjs
export default {
  // ...rest of config,
  THEME: 'blue',
}
`),g({id:"theme-load-order"},"theme load order"),T("themes get loaded from multiple places. last in the list overwrites earlier entries."),Q(`
// ...default module styles get inserted here
/node_modules/@magic/core/src/themes/THEME/index.mjs
/node_modules/@magic-themes/THEME
/assets/themes/THEME/index.mjs
`),Z()]};i({init:t(e({},{blog:{2019:{12:{22:[{View:e=>S(e,[T("so i guess i should start using it..."),T(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),T(`to use the blog,
create an archive dir, for example`),Q(`
src/blog/2019/12/22/
`),T("then just add the blogposts in that directory structure."),T(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),T("more information following soon.")]),file:"/home/j/dev/magic/core/example/news/2019/12/22/blogging.mjs",name:"/core/news/2019/12/22/blogging/",originalState:{description:"@magic has a blog now.",title:"blogging..."},path:"/core/news/2019/12/22/blogging/index.html",state:{description:"@magic has a blog now.",title:"blogging..."}}]}}},data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/core/logo.png",logotext:"@magic",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],module:{test:"testing"},nospy:{show:!1},pageClass:{},pages:{"/core/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"}},"/core/404/":{description:"404 - not found.",title:"404 - not found"},"/core/build/":{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},"/core/concepts/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core conceptual information.","explains the main concepts that make the @magic work."],logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core concepts"},"/core/files/":{description:"@magic/core directory docs.",title:"@magic/core files"},"/core/libraries/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic/core libraries allow you to include client side functionality in your app.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core library docs"},"/core/modules/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/example/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules example module.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/example"},"/core/modules/html/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"this module gets imported from a html file.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"html file example"},"/core/modules/markdown/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"markdown file description",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"markdown file example"},"/core/modules/preinstalled/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/propTypes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules/prop-types documentation.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/prop-types"},"/core/news/2019/":{year:"2019"},"/core/news/2019/12/":{month:"12",year:"2019"},"/core/news/2019/12/22/blogging/":{description:"@magic has a blog now.",title:"blogging..."},"/core/themes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-theme docs.",logo:"/core/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-themes"}},root:"/core/",seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},theme:"dark",title:"@magic/core documentation",url:"/core/"}),{url:window.location.pathname,hash:window.location.hash.substr(1)}),subscriptions:e=>[[eo.listenPopState,et.pop]],view:e=>{let t=es[e.url]?e.url:"/404/",o=es[t],s=e.pages&&e.pages[t];return s&&Object.keys(s).forEach(t=>{e[t]=s[t]}),e.url=t,X({page:o,state:e},[J(e),Y(e)])},node:document.getElementById("Magic")})})();