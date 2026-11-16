const __MAGIC__=()=>{var e,t,o,s,i,a,r,l,c,n,m,p,d,u,g,h,x,f,b,y;let{h:w,app:v}=(e={},o=(t=[]).map,s=Array.isArray,i="u">typeof requestAnimationFrame?requestAnimationFrame:setTimeout,a=function(e){var t="";if("string"==typeof e)return e;if(s(e)&&e.length>0)for(var o,i=0;i<e.length;i++)""!==(o=a(e[i]))&&(t+=(t&&" ")+o);else for(var i in e)e[i]&&(t+=(t&&" ")+i);return t},r=function(e,t){var o={};for(var s in e)o[s]=e[s];for(var s in t)o[s]=t[s];return o},l=function(e){return e.reduce(function(e,t){return e.concat(t&&!0!==t?"function"==typeof t[0]?[t]:l(t):0)},t)},c=function(e,t){if(e!==t)for(var o in r(e,t)){var i,a;if(e[o]!==t[o]&&(i=e[o],a=t[o],!(s(i)&&s(a))||i[0]!==a[0]||"function"!=typeof i[0]))return!0;t[o]=e[o]}},n=function(e,t,o){for(var s,i,a=0,r=[];a<e.length||a<t.length;a++)s=e[a],r.push((i=t[a])?!s||i[0]!==s[0]||c(i[1],s[1])?[i[0],i[1],i[0](o,i[1]),s&&s[2]()]:s:s&&s[2]());return r},m=function(e,t,o,s,i,l){if("key"===t);else if("style"===t)for(var c in r(o,s))o=null==s||null==s[c]?"":s[c],"-"===c[0]?e[t].setProperty(c,o):e[t][c]=o;else"o"===t[0]&&"n"===t[1]?((e.actions||(e.actions={}))[t=t.slice(2)]=s)?o||e.addEventListener(t,i):e.removeEventListener(t,i):!l&&"list"!==t&&"children"!==t&&t in e?e[t]=null==s?"":s:null!=s&&!1!==s&&("class"!==t||(s=a(s)))?"children"!==t&&e.setAttribute(t,s):e.removeAttribute(t)},p=function(e,t,o){var s=e.props,i=3===e.type?document.createTextNode(e.name):(o=o||"svg"===e.name)?document.createElementNS("http://www.w3.org/2000/svg",e.name,{is:s.is}):document.createElement(e.name,{is:s.is});for(var a in s)m(i,a,null,s[a],t,o);for(var r=0,l=e.children.length;r<l;r++)i.appendChild(p(e.children[r]=x(e.children[r]),t,o));return e.node=i},d=function(e){return null==e?null:e.key},u=function(e,t,o,s,i,a){if(o===s);else if(null!=o&&3===o.type&&3===s.type)o.name!==s.name&&(t.nodeValue=s.name);else if(null==o||o.name!==s.name)t=e.insertBefore(p(s=x(s),i,a),t),null!=o&&e.removeChild(o.node);else{var l,c,n,g,h=o.props,f=s.props,b=o.children,y=s.children,w=0,v=0,k=b.length-1,j=y.length-1;for(var T in a=a||"svg"===s.name,r(h,f))("value"===T||"selected"===T||"checked"===T?t[T]:h[T])!==f[T]&&m(t,T,h[T],f[T],i,a);for(;v<=j&&w<=k&&null!=(n=d(b[w]))&&n===d(y[v]);)u(t,b[w].node,b[w],y[v]=x(y[v++],b[w++]),i,a);for(;v<=j&&w<=k&&null!=(n=d(b[k]))&&n===d(y[j]);)u(t,b[k].node,b[k],y[j]=x(y[j--],b[k--]),i,a);if(w>k)for(;v<=j;)t.insertBefore(p(y[v]=x(y[v++]),i,a),(c=b[w])&&c.node);else if(v>j)for(;w<=k;)t.removeChild(b[w++].node);else{for(var T=w,M={},C={};T<=k;T++)null!=(n=b[T].key)&&(M[n]=b[T]);for(;v<=j;){if(n=d(c=b[w]),g=d(y[v]=x(y[v],c)),C[n]||null!=g&&g===d(b[w+1])){null==n&&t.removeChild(c.node),w++;continue}null==g||1===o.type?(null==n&&(u(t,c&&c.node,c,y[v],i,a),v++),w++):(n===g?(u(t,c.node,c,y[v],i,a),C[g]=!0,w++):null!=(l=M[g])?(u(t,t.insertBefore(l.node,c&&c.node),l,y[v],i,a),C[g]=!0):u(t,c&&c.node,null,y[v],i,a),v++)}for(;w<=k;)null==d(c=b[w++])&&t.removeChild(c.node);for(var T in M)null==C[T]&&t.removeChild(M[T].node)}}return s.node=t},g=function(e,t){for(var o in e)if(e[o]!==t[o])return!0;for(var o in t)if(e[o]!==t[o])return!0},h=function(e){return"object"==typeof e?e:b(e)},x=function(e,t){return 2===e.type?((!t||!t.lazy||g(t.lazy,e.lazy))&&((t=h(e.lazy.view(e.lazy))).lazy=e.lazy),t):e},f=function(e,t,o,s,i,a){return{name:e,props:t,children:o,node:s,type:a,key:i}},b=function(o,s){return f(o,e,t,s,void 0,3)},y=function(t){return 3===t.nodeType?b(t.nodeValue,t):f(t.nodeName.toLowerCase(),e,o.call(t.childNodes,y),t,void 0,1)},{h:function(t,o){for(var i,a=[],r=[],l=arguments.length;l-- >2;)a.push(arguments[l]);for(;a.length>0;)if(s(i=a.pop()))for(var l=i.length;l-- >0;)a.push(i[l]);else!1===i||!0===i||null==i||r.push(h(i));return o=o||e,"function"==typeof t?t(o,r):f(t,o,r,void 0,o.key)},app:function(e){var t={},o=!1,a=e.view,r=e.node,c=r&&y(r),m=e.subscriptions,p=[],d=function(e){f(this.actions[e.type],e)},g=function(e){return t!==e&&(t=e,m&&(p=n(p,l([m(t)]),f)),a&&!o&&i(b,o=!0)),t};let{middleware:x=e=>e}=e,f=x((e,o)=>"function"==typeof e?f(e(t,o)):s(e)?"function"==typeof e[0]||s(e[0])?f(e[0],"function"==typeof e[1]?e[1](o):e[1]):(l(e.slice(1)).map(function(e){e&&e[0](f,e[1])},g(e[0])),t):g(e));var b=function(){o=!1,r=u(r.parentNode,r,c,c=h(a(t)),d)};f(e.init)}}),k=e=>(t={},o)=>{let s=(e,...t)=>t.some(t=>t===typeof e);if(s(o,"undefined")){if(t.props)return w(e,{},[t]);s(t,"string","number","function")||Array.isArray(t)?(o=t,t={}):s(t.View,"function")&&(o=t.View,t={})}return w(e,t,o)},j=k("a");k("abbr"),k("address"),k("animate"),k("animateMotion"),k("animateTransform"),k("area"),k("article"),k("aside"),k("audio"),k("b"),k("base"),k("bdi"),k("bdo"),k("blockquote"),k("body"),k("br");let T=k("button");k("canvas"),k("caption");let M=k("circle");k("cite"),k("clipPath");let C=k("code");k("col"),k("colgroup"),k("color-profile"),k("data"),k("datalist"),k("dd"),k("defs"),k("del"),k("desc"),k("description"),k("details"),k("dfn"),k("dialog"),k("discard");let E=k("div");k("dl"),k("dt"),k("ellipse"),k("em"),k("embed"),k("feBlend"),k("feColorMatrix"),k("feComponentTransfer"),k("feComposite"),k("feConvolveMatrix"),k("feDiffuseLighting"),k("feDisplacementMap"),k("feDistantLight"),k("feDropShadow"),k("feFlood"),k("feFuncA"),k("feFuncB"),k("feFuncG"),k("feFuncR"),k("feGaussianBlur"),k("feImage"),k("feMerge"),k("feMergeNode"),k("feMorphology"),k("feOffset"),k("fePointLight"),k("feSpecularLighting"),k("feSpotLight"),k("feTile"),k("feTurbulence"),k("fencedframe"),k("fieldset"),k("figcaption"),k("figure"),k("filter");let L=k("footer");k("foreignObject"),k("form");let $=k("g"),A=k("h1"),P=k("h2"),S=k("h3"),_=k("h4"),N=k("h5");k("h6"),k("hatch"),k("hatchpath"),k("head");let I=k("header");k("hgroup"),k("hr"),k("html"),k("i"),k("iframe"),k("image");let O=k("img"),R=k("input");k("ins"),k("kbd"),k("label"),k("legend");let B=k("li");k("line"),k("linearGradient"),k("link");let z=k("main");k("map"),k("mark"),k("marker"),k("mask"),k("math"),k("menu"),k("mesh"),k("meshgradient"),k("meshpatch"),k("meshrow"),k("meta"),k("metadata"),k("meter"),k("mpath");let D=k("nav");k("noscript"),k("object"),k("ol"),k("optgroup"),k("option"),k("output");let V=k("p");k("param");let q=k("path");k("pattern"),k("picture"),k("polygon"),k("polyline");let J=k("pre");k("progress"),k("q"),k("radialGradient"),k("rb"),k("rect"),k("rp"),k("rt"),k("rtc"),k("ruby"),k("s"),k("samp"),k("script"),k("search"),k("section"),k("select"),k("selectedcontent"),k("set"),k("slot"),k("small"),k("solidcolor"),k("source");let G=k("span");k("stop"),k("strong"),k("style"),k("sub"),k("summary"),k("sup");let W=k("svg");k("switch"),k("symbol"),k("table"),k("tbody"),k("td"),k("template"),k("text"),k("textPath"),k("textarea"),k("tfoot"),k("th"),k("thead"),k("time"),k("title"),k("tr"),k("track"),k("tspan"),k("u");let F=k("ul");k("unknown"),k("url"),k("use"),k("var"),k("video"),k("view"),k("wbr");let H={blog:{2019:{12:{22:[{View:e=>K(e,[V("so i guess i should start using it..."),V(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),V(`to use the blog,
create an archive dir, for example`),es(`
src/blog/2019/12/22/
`),V("then just add the blogposts in that directory structure."),V(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),V("more information following soon.")]),file:"/home/j/dev/magic/core/example/news/2019/12/22/blogging.mjs",name:"/core/news/2019/12/22/blogging/",originalState:{description:"@magic has a blog now.",title:"blogging..."},path:"/core/news/2019/12/22/blogging/index.html",state:{description:"@magic has a blog now.",title:"blogging..."}}]}}},data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/core/logo.png",logotext:"@magic",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],module:{test:"testing"},nospy:{show:!1},pageClass:{},pages:{"/core/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"}},"/core/404/":{description:"404 - not found.",title:"404 - not found"},"/core/build/":{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},"/core/concepts/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core conceptual information.","explains the main concepts that make the @magic work."],logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core concepts"},"/core/files/":{description:"@magic/core directory docs.",title:"@magic/core files"},"/core/libraries/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic/core libraries allow you to include client side functionality in your app.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core library docs"},"/core/modules/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/example/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules example module.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/example"},"/core/modules/html/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"this module gets imported from a html file.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"html file example"},"/core/modules/markdown/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"markdown file description",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"markdown file example"},"/core/modules/preinstalled/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/propTypes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules/prop-types documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/prop-types"},"/core/news/2019/":{year:"2019"},"/core/news/2019/12/":{month:"12",year:"2019"},"/core/news/2019/12/22/blogging/":{description:"@magic has a blog now.",title:"blogging..."},"/core/themes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-theme docs.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-themes"}},root:"/core/",seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},theme:"dark",title:"@magic/core documentation",url:"/core/"},U=e=>{let t,{blog:o,link:s,month:i,url:a,year:r}=e,l=Object.entries(o[r][i]),c=[i];return s?t=`${s}${i}/`:c.push(" - ",r),[S(t?et({to:t},c):c),l.map(([o,s])=>s.map(s=>Y({...e,...s.state,name:s.name,link:t,day:o})))]},K=(e,t)=>{let{url:o,title:s,description:i}=e,[a,r,l,c,n,m,p]=o.split("/");return[P(s),V(i),t,_("Blog Archives:"),V(et({to:`/${r}/${l}/${c}/`},`year: ${c}`)),V(et({to:`/${r}/${l}/${c}/${n}/`},`month: ${n} ${c}`))]},Y=e=>E([_([e.day,"-",e.month,"-",e.year," - ",et({to:e.name},e.title)]),V(e.description)]),X=e=>{let t,{link:o,year:s,blog:i,url:a}=e;return o?t=`${o}${s}/`:a.endsWith(`${s}/`)&&(t=a),E([P(o?et({to:t},s):s),Object.entries(i[s]).map(([o,s])=>U({...e,month:o,days:s,link:t}))])},Q=e=>{if("string"==typeof e)e={project:e};else if(!e.project)return;let{branch:t="master",host:o="github"}=e,{project:s=!1}=e,i="",a=s;s.startsWith("@")?(i="@",s=s.substr(1)):a=s.split("/")[1];let r=[["npm",(e=s)=>e&&{to:`https://www.npmjs.com/package/${a}`,src:`https://img.shields.io/npm/v/${i}${e}?color=blue`}],["node",(e=s)=>e&&{src:`https://img.shields.io/node/v/${i}${e}?color=blue`}],["license",(e=s)=>e&&{src:`https://img.shields.io/npm/l/${i}${e}?color=blue`}],["travis",(e=s)=>e&&{to:`https://travis-ci.com/${e}`,src:`https://img.shields.io/travis/com/${e}/${t}`}],["appveyor",(e=s)=>{if(e){let[o,s]=e.split("/");return o=o.replace(/-/g,""),{to:`https://ci.appveyor.com/project/${o}/${s}/branch/${t}`,src:`https://img.shields.io/appveyor/ci/${o}/${s}/${t}.svg`}}}],["coveralls",(e=s)=>({to:`https://coveralls.io/${o}/${e}`,src:`https://img.shields.io/coveralls/${o}/${e}/${t}.svg`})],["snyk",(e=s)=>e&&{to:`https://snyk.io/test/${o}/${e}`,src:`https://img.shields.io/snyk/vulnerabilities/github/${e}.svg`}]].map(([t,o])=>o(e[t]));if(r.length)return F({class:"GitBadges"},r.map(({to:e,src:t})=>{if(!t)return;let o=ee({src:t,height:"23"});return e?B(et({to:e},o)):B(o)}))},Z=e=>{let{badges:t=!0,items:o=[],org:s,host:i="github",header:a,desc:r=e.description}=e,l={};return e.class?e.class.includes("GitList")||(l.class=`GitList ${e.class}`):l.class="GitList",e.id?l.id=e.id:l.id=s,l.id.startsWith("gl")||(l.id=`gl-${l.id}`),E(l,[a&&P(a),r&&E({class:"description"},r),F({id:`${l.id}-ul`},[o.map(e=>Z.Item({badges:t,org:s,id:`${l.id}-li`,host:i,...e}))])])};Z.Item=e=>{let{name:t,org:o,id:s,host:i,badges:a=!0}=e,r=e.desc||e.description;return B({id:`${s}-${t}`,class:"GitListItem"},[S([et({to:`https://${o}.${i}.io/${t}`},`@${o}/${t} demo`)]),r&&V(r),V(et({to:`https://${i}.com/${o}/${t}`},"git repository")),a&&Q(`@${o}/${t}`)])};let ee=e=>{"string"==typeof e&&(e={src:e});let{loading:t="lazy"}=e;if(e.src)return e.hasOwnProperty("alt")||(e.title?e.alt=e.title:e.alt=""),e.loading=t,O(e)},et=({to:e,action:t=ea.go,text:o,...s},i)=>{let{href:a,nofollow:r,noreferrer:l,...c}=s;return c.href=e=e||a||"",o&&i?o=[o,i]:o||(o=i||e),"/"===e[0]||"#"===e[0]?c.onclick=[t,ei.preventDefault]:(c.target="_blank",c.rel="noopener",r&&(c.rel+=" nofollow"),l&&(c.rel+=" noreferrer")),j(c,o)},eo=e=>{let{collapse:t,items:o=[],text:s,url:i,...a}=e,r={class:{}},{to:l}=a;l===i&&(r.class.active=!0);let c=[];return(!t||i.includes(l))&&o.length&&(c=F(o.map(e=>eo({url:i,collapse:t,...e})))),B(r,[l?et(a,s):G(a,s),c])},es=(e,t)=>{"string"==typeof e?e={content:e}:t?e={content:t,...e}:Array.isArray(e)&&(e={content:e.join("")});let{content:o,lines:s=!0}=e;return E({class:{Pre:!0,lines:s&&"false"!==s}},[E({class:"menu"},[T({onclick:[ea.pre.clip,e=>({e,content:o})]},"copy")]),J(o.trim().split("\n").map(es.Line))])};es.Comment=e=>G({class:"comment"},e),es.Line=e=>C({class:"line"},es.Words(e)),es.Word=e=>{if(!e)return"";let t=e.includes("://"),o=e.startsWith("mailto:")||e.includes("@")&&e.includes(".");if(t||o)return et({to:e,text:e});let s="";return("state"===e?s="state":"actions"===e?s="actions":"effects"===e?s="effects":"subscriptions"===e?s="subscriptions":ei.pre.keywords.includes(e)?s="keyword":ei.pre.builtins.includes(e)?s="builtin":ei.pre.booleans.includes(e)&&(s="boolean"),s)?G({class:s},e):e},es.Words=e=>{let[t,...o]=e.split(ei.pre.commentRegex);if(!t.endsWith(":")&&o.length)return[es.Words(t),es.Comment(o.join("").split(ei.pre.wordRegex).map(es.Word))];let s=[],i=e;return(e.replace(ei.pre.stringRegex,e=>{if(i){let[t,o]=i.split(e);t&&s.push(t.split(ei.pre.wordRegex).map(es.Word).filter(e=>e)),i=o}s.push(G({class:"string"},e))}),i!==e)?(i&&s.push(i.split(ei.pre.wordRegex).map(es.Word).filter(e=>e)),s):e.split(ei.pre.wordRegex).filter(e=>e).map(es.Word)};let ei={pre:{booleans:["true","false"],builtins:["Array","Object","String","Number","RegExp","Null","Symbol","Set","WeakSet","Map","WeakMap","setInterval","setTimeout","Promise","JSON","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],commentRegex:/(\/\/)/gim,keywords:["let","this","long","package","float","goto","private","class","if","short","while","protected","with","debugger","case","continue","volatile","interface","instanceof","super","synchronized","throw","extends","final","export","throws","try","import","double","enum","boolean","abstract","function","implements","typeof","transient","break","default","do","static","void","int","new","async","native","switch","else","delete","null","public","var","await","byte","finally","catch","in","return","for","get","const","char","module","exports","require","npm","install","=>"],stringRegex:/("|')(.*?)\1/gim,wordRegex:/( )/gim},preventDefault:e=>(e.preventDefault(),e)},ea={changeTheme:e=>({...e,pageClass:{...e.pageClass,light:"dark"===e.theme},theme:"dark"===e.theme?"light":"dark"}),go:(e,t)=>{if(!t||!t.currentTarget)return e;let o=t.currentTarget.href.replace(window.location.origin,""),[s,i=""]=o.split("#");if(s===e.url&&i===e.hash)return i&&(window.location.hash=i),e;let a=e.pages&&e.pages[s]&&e.pages[s].title;a&&(document.title=e.title=a),s!==e.url?i||window.scrollTo({top:0}):window.location.hash=i;let{scrollY:r}=window;return window.history.pushState({url:s,hash:i,scrollY:r},e.title,o),{...e,url:s,hash:i,prev:e.url}},nospy:{toggle:e=>(e.nospy.show=!e.nospy.show,{...e})},pop:(e,t)=>{let{pathname:o,hash:s}=window.location;s=s.substring(1);let i=0;return t.state&&(o=t.state.url,s=t.state.hash,i=t.state.scrollY||0),s?window.location.hash=s:window.scroll({top:i}),{...e,url:o,hash:s}},pre:{clip:(e,{content:t})=>{if("u">typeof document&&"function"==typeof document.execCommand){let e=document.createElement("textarea");e.id="copy",e.innerHTML=t,document.body.appendChild(e);let o=document.getElementById("copy");o.select(),document.execCommand("copy"),document.body.removeChild(o)}return e}}},er=(e,t)=>{let o=o=>e(t,o);return addEventListener("popstate",o),()=>removeEventListener("popstate",o)},el={"/core/":e=>[A({id:"magiccore-documentation"},"@magic/core documentation"),P({id:"welcome-to-the-magic-docs"},"welcome to the magic docs."),V("@magic/core documentation. tells you why, how and when to use @magic. also provides an overview of all @magic functionality this ecosystem provides."),V("the goal of this document is to give you a rough @magical overview."),Q("@magic/core"),P({id:"philosophy"},"philosophy"),V(`@magic aims to make it easy to stitch together any kind of webapp.
by providing simple, well documented and self contained modules,
@magic makes it possible to create stunningly fast
webpages with minimal cognitive overhead.`),P({id:"privacy"},"privacy"),V("@magic does not spy."),V(`not only do we try to be legally compliant by default,
but we also aim to be ethical
which means prioritizing your rights over our needs,
but also means we prioritize the rights of your users over your needs.
we believe that this is the best compromise.`),P({id:"buzzwords"},"why should i use magic?"),S({id:"features"},"features"),F([B("static html pages with opengraph seo."),B("pages are hosted for free using gitlab, github or any other git-pages style hosting."),B("static css output with selector and rule deduplication."),B("no javascript required where possible."),B("minimal client boilerplate."),B("no spyware included."),B("WIP: lambda faas and graphql api generator."),B("WIP: server side rendering (if needed).")]),S({id:"magic-is-tiny"},"@magic is tiny"),V(`~4 kb javascript boilerplate.
usually, all the javascript in your homepage will be 30-60kb big (after unpacking),
10-30kb get transmitted from the server to the client.
this documentation page you are reading loads 20kb of gzipped javascript,
which, when parsing, turns into ~88kb of uncompressed javascript.
this includes all content of all subpages, no additional server requests needed for any navigations in the page.`),V("WIP: code splitting for bigger pages."),S({id:"magic-works-without-javascript"},"@magic works without javascript"),V(`most of the functionality works without javascript,
some buttons and realtime user interactions obviously won't,
but @magic always tries to provide a non-javascript fallback via css.`),S({id:"magic-generates-static-pages"},"@magic generates static pages"),V("this makes free hosting (using github or gitlab pages) possible. and it's easy."),V(["@magic publishes to ",et({to:"https://github.com",text:"github"}),", ",et({to:"https://about.gitlab.com/",text:"gitlab"}),`,
and any other git-pages enabled hosting service.`]),S({id:"serverless-faas"},"serverless / faas"),V([`automagically generates
serverless lambdas, derived from the
`,et({to:"https://github.com/magic-modules/",text:"@magic-modules"}),`
you use in your pages.`]),V(`this makes visitor statistics, user authentication and authorization,
chat, and all other server side services possible.`)],"/core/404/":()=>E("404 - not found."),"/core/build/":e=>E([S(e.title),V(e.description),V([_("state.data"),es(JSON.stringify({data:e.data},null,2))])]),"/core/concepts/":e=>[A({id:"magiccore-concepts"},"@magic/core concepts"),V("magic concepts. these are the building blocks of every module in a magic app"),P({id:"modules"},"@magic-modules"),V("modules are the main building block of magic."),V(`a page is a module, a button is a module, a link is a module, an image is a module.
even a theme is a module.`),V(`a @magic app contains modules containing modules that contain modules.
this can lead to inception.`),P({id:"module-building-blocks"},"module building blocks"),S({id:"state"},"state"),V(`state is a javascript object.
state can be mutated by actions,
effects and subscriptions can call actions to change the state.
every rendering frame, the state determines the output of the html views.`),es(`const state = {
  shown: false,
  count: 0,
}
`),P({id:"actions"},"actions"),V("actions are an object containing functions"),V("those functions get the state and their props and may return a new full, but changed, state."),es(`const actions = {
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
}`),P({id:"effects"},"effects"),V("effects are an object containing functions, just like actions."),V("effects can only change the state by calling actions."),V("effects may also be impure and trigger side-effects outside of hyperapp."),es(`const effects = {
  waitASec: [state, async state => {
    await new Promise((r) => setTimeout(r, 1000))

    return actions.plus(state)
  }],
}`),P({id:"subscriptions"},"subscriptions"),V("at the moment, subscriptions can be defined using strings as function names."),V("also, if a module exports a subscriptions array, those subscriptions will be added to the app."),es(`// in a module:

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

export const subscriptions = ['lib.subscribe', 'actions.onSubscription']`),P({id:"views"},"views"),V(`views render the state to html
whenever an action triggers a change in the state, this then triggers a view change.`),es("export const View = state => div(JSON.stringify(state))"),P({id:"styles"},"styles"),V(`every module can export a style object.
magic will automagically merge all styles into one global css file.
in the future, it will also remove unused styles for you.`),V(`styles merge order, last overwrites first:
module.style < page.style < app.style < theme.style`),V("this allows css to be inherited in both directions."),V(`a module automatically creates it's own css namespace,
that same namespace can be used in page, app and theme css styles
to overwrite module specific styles.`),S({id:"styles-magiccss"},"@magic/css"),V("internally, magic uses it's own css-in-js library."),V([`to find out more, click the following link:
`,et({to:"https://magic.github.io/css/",text:"@magic/css"})]),P({id:"globals"},"globals"),V("every module can set a global object, containing state and action properties."),V("every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions, instead of into the module namespace."),es(`// in module.mjs

export const state = {
  internal: 0,
  external: 0,
}

export const actions = {
  internal: state => ({
    ...state,
    module: {
      internal: state.module.internal + 1,
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
])`),P({id:"lambdas"},"server lambdas"),V(`this is the serverside magic.
you can define functions that get transpiled into serverside lambdas.
server side lambdas will be available for GET and/or POST requests.`),V(`the server side function signature is (req, res) => {},
as it is in most nodejs http servers,
with the addition of req.body being async => awaited before execution of the lambda.`)],"/core/files/":e=>[A(e.title),V("There are multiple magic files and directories."),F([B("/pages - files in the page directory map to urls in your app."),B("/assets - custom components, @magic-modules get imported here"),B("/assets/static - static files"),B("/assets/themes - theme directory, @magic-themes get imported here"),B("/assets/lib.mjs - imports npm and local but external packages into your app"),B("/app.mjs - gets merged into the app, can set state, actions, style here"),B("/config.mjs - custom config for your app"),B("/assets/Menu.mjs - custom Menu for your app")]),P({id:"pages"},"/pages"),V("the pages dir contains the pages of your webapp."),V(["each page has it's own state and actions, ","but also inherits the global state and actions from the app and it's dependencies"]),S({id:"pages-dir-structure"},"pages directory to url map"),V("for the domain mag.ic:"),es(`
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
`),A({id:"pages-example"},"example page"),V("Pages can use javascript, html or markdown"),P({id:"pages-example-js"},"javascript example"),V("A magic javascript page is a @magic-module. The only difference is that pages get exposed via http"),es(`
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
`),P({id:"pages-example-html"},"html example"),V("html pages can only export state and View."),es(`
---
@state
{
  "title": "html file example",
    "description": "this module gets imported from a html file."
}
---

<h2>&#36;{ state.title }</h4>

<p>{{ state.description }}</p>
`),P({id:"pages-example-markdown"},"markdown example"),V("markdown pages can only export state and View."),es(`
---
@state {
  "title": "markdown file example",
  "description": "markdown file description"
}
---

## &#36;{state.title}

&#36;{state.description}
`),P({id:"assets"},"assets"),V("the assets dir contains custom components of your app."),V("you can import additional @magic-modules here"),S({id:"assets-example"},"/assets/index.mjs"),es(`
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}
`),P({id:"static"},"/assets/static"),V(["the static dir contains all of your static assets.","every file in this directory gets copied to the public dir.","image and svg files get minified using imagemin."]),V(["text and binary files get compressed using the optional ",et({to:"https://github.com/jaeh/node-zopfli-es",text:"node-zopfli-es"})," (if it is installed)"]),P({id:"themes"},"/assets/themes"),V("the themes directory contains...themes."),V(["a magic theme is an object of css rules, see ",et({text:"@magic/css",to:"https://github.com/magic/css/"})," for more examples and documentation."]),S({id:"themes-example"},"example theme"),es(`
export default {
  'body': {
    color: 'blue',
  },
}
`),P({id:"app"},"/app.mjs"),V("the /app.mjs file allows you to set global state, actions, and styles"),S({id:"app-example"},"/example/app.mjs"),es(`
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
`),P({id:"config"},"/config.mjs"),V("the /config.mjs file allows you to set various aspects of your app"),S({id:"config-example"},"/config.mjs example"),es(`
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
`),V(et({text:"Menu.mjs on github",to:"https://github.com/magic/core/blob/master/src/modules/Menu.mjs"}))],"/core/libraries/":e=>[A({id:"magiccore-library-docs"},"@magic/core library docs"),V("@magic/core libraries allow you to include client side functionality in your app."),P({id:"abstract"},"libraries"),V(`what would javascript be without the millions of dependencies
that you can easily install and make the average webpage
slow[ly] (pun intended) grow towards a footprint of 5 megabytes.`),V("we think that all of that bloat is unneeded, unheeded and, frankly, not optimal."),V([`magic has one external client side dependency,
`,et({to:"https://github.com/jorgebucaran/hyperapp/",text:"hyperapp"}),`,
[~500 lines that provide our ui state machine]. thats it. and it won't change.`]),V([`we also have the tendency to write libraries specialized for our usecase, see
`,et({to:"https://github.com/magic/css",text:"@magic/css"}),`,
`,et({to:"https://github.com/magic/test",text:"@magic/test"}),`,
`,et({to:"https://github.com/magic/cli",text:"@magic/cli"}),`
and others.`]),V(`once there is a lib key in at least one component,
window.lib (browser) and global.lib (nodejs) will be set,
aliasing lib as a global variable in both environments`),S({id:"dir-or-file"},"lib dir or file"),V(`if you need libraries in multiple otherwise independent modules,
it might be easier to keep your library dependencies in a central place.`),V(`to achieve this, one can simply create /assets/lib.mjs and export an object from it.
this object will get merged into the globalThis.lib object,
making it available as "lib" throughout your app.`),es("export default { name: () => {} }"),V("will turn into"),es("lib.name = () => {}"),S({id:"npm"},"npm"),V("all @magic-libraries and all npm packages starting with magic-library-* will be loaded automatically"),_({id:"example"},"Example"),V("first, install a @magic-library"),es(`
npm install --save --save-exact @magic-libraries/is
`),V("then, in javascript"),es(`
export const View = props => div([
  'value is ',
  lib.is(props.value, 'string') ? '' : 'not',
  ' a string',
])
`),Z({org:"magic-libraries",header:[et({to:"https://magic-libraries.github.io"},"@magic-libraries")],desc:["@magic libraries are pieces of client side functionality."," they are not intended to be used in markdown,"," instead, a developer will use them when creating @magic-modules,"," which can then be used from markdown pages."],items:[{name:"db",description:"key => value store using localstorage"},{name:"gql",description:["the @magic-libraries/gql module"," encodes template strings to graphql queries ready to be sent to a server."]},{name:"http",description:"http request effect for @magic."},{name:"is",description:"the @magic-libraries/is module unifies the javascript type testing apis."},{name:"json",description:["the @magic-libraries/json module parses and stringifies json."," it also returns errors instead of throwing them."]},{name:"prevent-default",description:["the @magic-libraries/prevent-default module"," invokes event.preventDefault as a hyperapp effect."]},{name:"slugify",description:"makes strings url safe. opinionated."},{name:"try-catch",description:["the @magic-libraries/try-catch module"," returns errors instead of throwing them."]},{name:"uri",description:["the @magic-libraries/uri module"," encodes objects to uri strings and decodes uri strings to objects."]}]})],"/core/modules/":e=>[A({id:"magic-modules"},"@magic-modules"),V("magic modules are predefined modules for webapps."),P({id:"definition"},"module definition"),V("the minimal module is a function that returns some html."),es(`
// /assets/ModuleName.mjs

// simplest module
export const View = () => div('hello, world')

// complete signature
export const View = (props = {}, children = []) => div('hello, world')
`),P({id:"usage"},"usage"),V(`if the npm package name starts with @magic-modules/ or magic-module-, it will get imported automagically.
the name of the Module will be set to a PascalCased version of the remainder of the module name.
@magic-modules/git-badges, for example, turns into GitBadges.
the same is true for all uppercased files in your /assets/ directory and subdirectories.
in the rare case where you want to install a npm module that can not be found,
you can import it in /assets/index.mjs`),es(`
// /assets/index.mjs
import NpmModule from 'non-standard-named-magic-module-from-npm'

export default {
  // ...otherModules

  // load module from node_modules
  NpmModule,
}
`),V("after this, the module will be a global in your app and can be used like any other component."),es(`
// any page or module
export default state => div([
  // module without props
  Mod(),
  'modules that need props: ',
  Mod({ state, customProp: true }),
`),Z({class:"ModuleList",org:"magic-modules",header:[et({to:"https://magic-modules.github.io/"},"@magic-modules")],description:["modules are the building blocks of ",et({to:"https://magic.github.io/core/"},"@magic"),". modules can be used to add both client and server functionality to your @magic app."],items:[{name:"about-magic",description:"AboutMagic shows some information about @magic."},{name:"accordion",description:"Accordion shows a list of items that horizontally open/close."},{name:"cite",description:"Makes Citations easy. Adds Quote around quotes and a minimally styled paragraph around the author."},{name:"example-list",description:"ExampleList shows a list of @magic-examples pages."},{name:"gdpr",description:"Gdpr compliant popup that allows users to allow or deny cookies."},{name:"git-badges",description:"GitBadges shows a list of github repository status badges."},{name:"git-list",description:"show a list of git repositories like the one you are looking at."},{name:"hero",description:"Hero modules are full screen top of page content."},{name:"language-switch",description:"LanguageSwitch provides simple multilanguage support for magic."},{name:"library-list",description:"LibraryList shows a list of all @magic-libraries libraries."},{name:"light-box",description:"images that show a bigger view of themselves when clicked."},{name:"light-switch",description:"dark/light theme color switch button."},{name:"messages",description:"Messages shows popup messages."},{name:"module-list",description:"ModuleList shows the list of @magic-modules you are looking at."},{name:"no-spy",description:'Minimal interface for "we do not spy" modal.'},{name:"pre",description:"Pre allows you to display javascript code with syntax highlighting."},{name:"quote",description:"adds “” around the quote and sets font-style: italic."},{name:"sound-cloud",description:"embed soundcloud track, playlist and user widgets"},{name:"theme-list",description:"ThemeList shows a list of all @magic-themes."},{name:"theme-vars",description:"ThemeVars shows a preview of all colors used in a @magic-themes."},{name:"video-embed",description:"VideoEmbed embeds videos from any video hoster."},{name:"xkcd",description:"Xkcd embeds xkcd comics."}]})],"/core/modules/example/":e=>{var t;let o,s;return[A({id:"magic-modulesexample"},"@magic-modules/example"),P({id:"custom-module"},"custom module"),(o={state:e},E({class:"Mod"},[S("Mod.Mod"),V(["this is Mod. it gets loaded from ",et({to:"https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs"},"/assets/modules/Mod.mjs")]),V(["the state of this module: ",JSON.stringify(o.module)])])),E({class:"Component"},[(s=(t="string"==typeof(t={title:"Mod Component Title, passed via props"})?{header:t}:t).header||t.title)&&N(s),V(["Component, a second component in ",et({to:"https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs"},"/assets/modules/Component.mjs")])]),S({id:"mod-sourcecode"},"Mod sourcecode:"),es(`
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
`),S({id:"component-sourcecode"},"Component sourcecode:"),es(`
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
`)]},"/core/modules/html/":e=>[P("html file example"),V("this module gets imported from a html file."),V(["see ",et({to:"https://github.com/magic/core/blob/master/example/pages/modules/html.html"},"this html file")," for an example."]),V("all html valid in <body> can be used, excluding the <script> and <style> tags."),V("the state looks like the following, and any valid json is allowed"),es(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/markdown/":e=>[P({id:"markdown-file-example"},"markdown file example"),V("markdown file description"),V("this module gets imported from a markdown file."),V(["see ",et({to:"https://github.com/magic/core/blob/master/example/pages/modules/markdown.md",text:"this file in the example dir"})," for an example."]),V(`any kind of markdown can be used here,
but if you use html natively,
only tags valid in a html5 body, excluding <script> and <style> tags, are accepted.`),S({id:"a-list"},"a list:"),F([B(et({to:"https://magic.github.io/",text:"@magic/core"})),B(et({to:"https://magic-libraries.github.io/",text:"@magic-libraries"})),B(et({to:"https://magic-modules.github.io/",text:"@magic-modules"})),B(et({to:"https://magic-themes.github.io/",text:"@magic-themes"}))]),S({id:"state"},"state"),V(`this markdown file also starts with a magic @state declaration.
it is used internally to, for example, add the title and meta rel="description" tags to the head of this html file.`),V("the state looks like the following, and any valid json is allowed"),es(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/preinstalled/":e=>[A({id:"magic-modules"},"@magic-modules"),P({id:"preinstalled"},"preinstalled"),V("magic has some preinstalled modules that will be used in most pages."),P({id:"app"},"app"),V(`this is the main app module.
it has magically inherited properties and all of it is customizable.`),V([`to add actions/state/style to the app you can just create an /assets/app.mjs file.
the contents of this file get
`,et({to:"https://github.com/magic/deep",text:"deep .merged"}),`
into the app`]),es(`
// /src/app.mjs
export const state = {
  merge: 'gets merged into state',
}
export const actions = {
  mergedActions: state => ({ ...state, merge: 'merged action executed' }),
}
`),P({id:"menu"},"menu"),V("the Menu module provides... menus."),es(`
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
`),S({id:"menu-props"},"Menu props"),V("the Menu module allows multiple props to be passed when instantiating the Menu"),S({id:"menu-props-collapse"},"props.collapse"),V(`by default, the menu will only show submenu items if their parent link is active.
to force submenu items to show at all times, just pass a collapse: false prop`),es(`
Menu({
  // if false, menu will always show all submenu items
  collapse: false, // (default: true)
})
`),S({id:"menu-item-props"},"Menu.Item props"),V(`every MenuItem accepts the same props as a link does.
additionally a MenuItem accepts an items prop with sub menu items.`),es(`
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [MenuItems],
  noreferrer: true, // set rel='noreferrer'
  nofollow: true, // set rel='nofollow'
})
`),S({id:"menu-sub-menus"},"sub menus"),V("to define a submenu, simply define a .items array on the menu item"),es(`
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
`),P({id:"link"},"link"),V("the link module allows you to link to things."),es(`
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
`),P({id:"img"},"img"),V("the img module adds some sane default values to your images."),es(`
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
`),P({id:"footer"},"footer"),V("the footer module contains a small info text and a link to the magic github repository."),V(`to overwrite this behaviour, just place a Footer.mjs file in your assets
and require it in /assets/index.mjs.`),es(`
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
`)],"/core/modules/propTypes/":e=>[A({id:"magic-modulesprop-types"},"@magic-modules/prop-types"),P({id:"check-props"},"CHECK_PROPS"),V("@magic-modules can export a .propTypes object with an array of prop types."),_({id:"#example"},"example"),es(`
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
`)],"/core/news/":e=>Object.entries(e.blog).map(([t])=>X({...e,year:t,link:e.url})),"/core/news/2019/":e=>X(e),"/core/news/2019/12/":e=>U(e),"/core/news/2019/12/22/blogging/":e=>K(e,[V("so i guess i should start using it..."),V(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),V(`to use the blog,
create an archive dir, for example`),es(`
src/blog/2019/12/22/
`),V("then just add the blogposts in that directory structure."),V(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),V("more information following soon.")]),"/core/test/":e=>[P("Test page"),V("This page shows various features and tests of magic functionality"),S("Link Tests:"),F([B(et({to:"/modules/"})),B(et({to:"/modules/#gl-magic-modules"})),B(et({to:"https://magic.github.io"}))]),S("Broken link tests:"),V("the following links are broken, and it's intentional for magic to warn us on every rebuild."),F([B(et({text:"redirect link",to:"https://magic.github.io/core#expected-redirect"})),B(et({text:"broken link",to:"https://expect-error"})),B(et({text:"404 link",to:"https://en.wikipedia.org/hMdYfVaKY4btraQcgD0me6RRBDnugbpJ4FLpgJgeB7"})),B(ee({alt:"Broken Image Link",src:"https://broken-image-link"}))]),S("Image test"),V("while at it, let's test an image, 2 times with a working src:"),F([B(ee({alt:"Magic Logo",src:"/logo.png"})),B(ee({alt:"Magic Logo",src:"/core/logo.png"}))]),V("and once with a broken src:"),ee({alt:"Broken Magic Logo",src:"/logo23-broken.png"}),S("Links in modules"),V(et({to:"/",text:"Link in a paragraph"})),F([B(et({to:"/",text:"Link in a list"})),B(et({to:"/",text:"Second Link in a list"}))])],"/core/themes/":e=>[A({id:"magic-themes"},"@magic-themes"),V(`magic themes are themes for magic apps.
you decide which theme to load by specifying the theme name in config.THEME`),es(`
// /config.mjs
export default {
  // ...rest of config,
  THEME: 'blue',
}
`),P({id:"theme-load-order"},"theme load order"),V("themes get loaded from multiple places. last in the list overwrites earlier entries."),es(`
// ...default module styles get inserted here
/node_modules/@magic/core/src/themes/THEME/index.mjs
/node_modules/@magic-themes/THEME
/assets/themes/THEME/index.mjs
`),Z({org:"magic-themes",header:[et({to:"https://magic-themes.github.io"},"@magic-themes")],desc:["below is a collection of the available @magic app themes."," all of the themes below are designed to be usable on their own,"," but they can also be combined if needed."],items:[{name:"docs",description:"the @magic documentation theme. used in all @magic docs."},{name:"example",description:"a minimal example theme."},{name:"project",description:"foundational @magic theme for project presentation."},{name:"slides",description:"theme that provides slides for presentations."},{name:"reader",description:"a theme designed to provide a reader mode."}]})]};v({init:{...H,url:window.location.pathname,hash:window.location.hash.substr(1)},subscriptions:e=>[[er,ea.pop]],view:e=>{let t=el[e.url]?e.url:"/404/",o=el[t],s=e.pages&&e.pages[t];return s&&Object.keys(s).forEach(t=>{e[t]=s[t]}),e.url=t,(({page:e,state:t},o)=>z({id:"Magic",class:t.pageClass},E({class:{Wrapper:!0}},[((e={},t=[])=>{let{logo:o,menu:s,logotext:i,hash:a,url:r}=e;if(o||s||i)return I({class:"Header"},[et({to:"/",class:"Logo"},[W({viewBox:"0 0 512 444"},[q({d:"M512 444L256 0 0 444z",fill:"#663695"}),M({cx:"256",cy:"294",r:"130",fill:"#fff"}),M({cx:"256",cy:"281",r:"40",fill:"#663695"}),q({d:"M256 350v44m24-44l1 13c1 27 29 27 29-7m-160-72s46-47 106-47c59 0 106 47 106 47s-47 43-106 43c-60 0-106-43-106-43zm65-75a134 134 0 0189 2",class:"stroke"}),q({d:"M256 81v53m184 270l-43-29M72 404l43-29",class:"stroke white"})])]),i&&V(i),s&&((e={})=>{let{collapse:t=!0,menu:o,hash:s}=e,{class:i="",url:a}=e;return i.includes("Menu")||(i=`Menu ${i}`.trim()),s&&!a.endsWith(s)&&(a+=`#${s}`),D({className:i},F(o.map(e=>eo({...e,url:a,collapse:t}))))})({url:r,hash:a,menu:s}),t])})(t),E({class:"Page",id:"page"},e(t)),((e=[])=>L({class:"Footer"},[E({class:"Container"},[E({class:"Credits"},["made with a few bits of ",et({to:"https://magic.github.io/",target:"_blank",rel:"noopener"},"magic")]),e])]))(),o])))({page:o,state:e},[((e={})=>W({class:"LightSwitch icon",onclick:ea.changeTheme,height:25,width:25,viewBox:"0 0 352 460"},[q({d:"M149 48C96 48 48 95 47 143c-1 13 19 17 20 0-1-35 48-75 83-75 15 0 12-22-1-20z"}),q({d:"M176 0C74 0 0 83 0 176c9 91 84 118 100 204h20c-16-92-97-138-100-204C22 70 105 21 176 20zM95 400c2 68 20 48 40 60h82c20-12 38 8 40-60z"}),q({d:"M175 0c102 0 177 83 177 176-9 91-86 118-102 204h-20c16-92 99-138 102-204-2-106-86-155-157-156z"})]))(e),(({nospy:e={},cookies:t=[]})=>{let{show:o,title:s="Privacy Notice",content:i="This app neither saves, collects, nor shares any data about you.",buttonText:a="Awesome!"}=e;return o?E({class:"NoSpy"},[E({class:"Background",onclick:ea.nospy.toggle}),E({class:"Container"},[s&&S(s),i&&V(i),R({onclick:ea.nospy.toggle,value:a,type:"button"})])]):E({class:"NoSpy"},W({class:"icon",onclick:ea.nospy.toggle,width:"25",height:"25",viewBox:"0 0 512 512"},[$([q({d:`
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
`}),M({cx:"192",cy:"128",r:"32"}),M({cx:"128",cy:"256",r:"32"}),M({cx:"288",cy:"384",r:"32"}),M({cx:"272",cy:"272",r:"16"}),M({cx:"400",cy:"336",r:"16"}),M({cx:"176",cy:"368",r:"16"})])]))})(e)])},node:document.getElementById("Magic")})};__MAGIC__();