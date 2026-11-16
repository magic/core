const __MAGIC__=()=>{var e,t,o,s,i,a,r,l,c,n,m,p,d,u,g,h,x,f,b,y;let w,{h:v,app:k}=(e={},o=(t=[]).map,s=Array.isArray,i="u">typeof requestAnimationFrame?requestAnimationFrame:setTimeout,a=function(e){var t="";if("string"==typeof e)return e;if(s(e)&&e.length>0)for(var o,i=0;i<e.length;i++)""!==(o=a(e[i]))&&(t+=(t&&" ")+o);else for(var i in e)e[i]&&(t+=(t&&" ")+i);return t},r=function(e,t){var o={};for(var s in e)o[s]=e[s];for(var s in t)o[s]=t[s];return o},l=function(e){return e.reduce(function(e,t){return e.concat(t&&!0!==t?"function"==typeof t[0]?[t]:l(t):0)},t)},c=function(e,t){if(e!==t)for(var o in r(e,t)){var i,a;if(e[o]!==t[o]&&(i=e[o],a=t[o],!(s(i)&&s(a))||i[0]!==a[0]||"function"!=typeof i[0]))return!0;t[o]=e[o]}},n=function(e,t,o){for(var s,i,a=0,r=[];a<e.length||a<t.length;a++)s=e[a],r.push((i=t[a])?!s||i[0]!==s[0]||c(i[1],s[1])?[i[0],i[1],i[0](o,i[1]),s&&s[2]()]:s:s&&s[2]());return r},m=function(e,t,o,s,i,l){if("key"===t);else if("style"===t)for(var c in r(o,s))o=null==s||null==s[c]?"":s[c],"-"===c[0]?e[t].setProperty(c,o):e[t][c]=o;else"o"===t[0]&&"n"===t[1]?((e.actions||(e.actions={}))[t=t.slice(2)]=s)?o||e.addEventListener(t,i):e.removeEventListener(t,i):!l&&"list"!==t&&"children"!==t&&t in e?e[t]=null==s?"":s:null!=s&&!1!==s&&("class"!==t||(s=a(s)))?"children"!==t&&e.setAttribute(t,s):e.removeAttribute(t)},p=function(e,t,o){var s=e.props,i=3===e.type?document.createTextNode(e.name):(o=o||"svg"===e.name)?document.createElementNS("http://www.w3.org/2000/svg",e.name,{is:s.is}):document.createElement(e.name,{is:s.is});for(var a in s)m(i,a,null,s[a],t,o);for(var r=0,l=e.children.length;r<l;r++)i.appendChild(p(e.children[r]=x(e.children[r]),t,o));return e.node=i},d=function(e){return null==e?null:e.key},u=function(e,t,o,s,i,a){if(o===s);else if(null!=o&&3===o.type&&3===s.type)o.name!==s.name&&(t.nodeValue=s.name);else if(null==o||o.name!==s.name)t=e.insertBefore(p(s=x(s),i,a),t),null!=o&&e.removeChild(o.node);else{var l,c,n,g,h=o.props,f=s.props,b=o.children,y=s.children,w=0,v=0,k=b.length-1,j=y.length-1;for(var T in a=a||"svg"===s.name,r(h,f))("value"===T||"selected"===T||"checked"===T?t[T]:h[T])!==f[T]&&m(t,T,h[T],f[T],i,a);for(;v<=j&&w<=k&&null!=(n=d(b[w]))&&n===d(y[v]);)u(t,b[w].node,b[w],y[v]=x(y[v++],b[w++]),i,a);for(;v<=j&&w<=k&&null!=(n=d(b[k]))&&n===d(y[j]);)u(t,b[k].node,b[k],y[j]=x(y[j--],b[k--]),i,a);if(w>k)for(;v<=j;)t.insertBefore(p(y[v]=x(y[v++]),i,a),(c=b[w])&&c.node);else if(v>j)for(;w<=k;)t.removeChild(b[w++].node);else{for(var T=w,M={},C={};T<=k;T++)null!=(n=b[T].key)&&(M[n]=b[T]);for(;v<=j;){if(n=d(c=b[w]),g=d(y[v]=x(y[v],c)),C[n]||null!=g&&g===d(b[w+1])){null==n&&t.removeChild(c.node),w++;continue}null==g||1===o.type?(null==n&&(u(t,c&&c.node,c,y[v],i,a),v++),w++):(n===g?(u(t,c.node,c,y[v],i,a),C[g]=!0,w++):null!=(l=M[g])?(u(t,t.insertBefore(l.node,c&&c.node),l,y[v],i,a),C[g]=!0):u(t,c&&c.node,null,y[v],i,a),v++)}for(;w<=k;)null==d(c=b[w++])&&t.removeChild(c.node);for(var T in M)null==C[T]&&t.removeChild(M[T].node)}}return s.node=t},g=function(e,t){for(var o in e)if(e[o]!==t[o])return!0;for(var o in t)if(e[o]!==t[o])return!0},h=function(e){return"object"==typeof e?e:b(e)},x=function(e,t){return 2===e.type?((!t||!t.lazy||g(t.lazy,e.lazy))&&((t=h(e.lazy.view(e.lazy))).lazy=e.lazy),t):e},f=function(e,t,o,s,i,a){return{name:e,props:t,children:o,node:s,type:a,key:i}},b=function(o,s){return f(o,e,t,s,void 0,3)},y=function(t){return 3===t.nodeType?b(t.nodeValue,t):f(t.nodeName.toLowerCase(),e,o.call(t.childNodes,y),t,void 0,1)},{h:function(t,o){for(var i,a=[],r=[],l=arguments.length;l-- >2;)a.push(arguments[l]);for(;a.length>0;)if(s(i=a.pop()))for(var l=i.length;l-- >0;)a.push(i[l]);else!1===i||!0===i||null==i||r.push(h(i));return o=o||e,"function"==typeof t?t(o,r):f(t,o,r,void 0,o.key)},app:function(e){var t={},o=!1,a=e.view,r=e.node,c=r&&y(r),m=e.subscriptions,p=[],d=function(e){f(this.actions[e.type],e)},g=function(e){return t!==e&&(t=e,m&&(p=n(p,l([m(t)]),f)),a&&!o&&i(b,o=!0)),t};let{middleware:x=e=>e}=e,f=x((e,o)=>"function"==typeof e?f(e(t,o)):s(e)?"function"==typeof e[0]||s(e[0])?f(e[0],"function"==typeof e[1]?e[1](o):e[1]):(l(e.slice(1)).map(function(e){e&&e[0](f,e[1])},g(e[0])),t):g(e));var b=function(){o=!1,r=u(r.parentNode,r,c,c=h(a(t)),d)};f(e.init)}}),j=e=>(t={},o)=>{if(ea.is(o,"undefined")){if(t.props)return v(e,{},[t]);ea.is(t,"string")||ea.is.number(t)||ea.is(t,"function")||ea.is.array(t)?(o=t,t={}):ea.is(t.View,"function")&&(o=t.View,t={})}return v(e,t,o)},T=j("a");j("abbr"),j("address"),j("animate"),j("animateMotion"),j("animateTransform"),j("area"),j("article"),j("aside"),j("audio"),j("b"),j("base"),j("bdi"),j("bdo"),j("blockquote"),j("body"),j("br");let M=j("button");j("canvas"),j("caption");let C=j("circle");j("cite"),j("clipPath");let E=j("code");j("col"),j("colgroup"),j("color-profile"),j("data"),j("datalist"),j("dd"),j("defs"),j("del"),j("desc"),j("description"),j("details"),j("dfn"),j("dialog"),j("discard");let $=j("div");j("dl"),j("dt"),j("ellipse"),j("em"),j("embed"),j("feBlend"),j("feColorMatrix"),j("feComponentTransfer"),j("feComposite"),j("feConvolveMatrix"),j("feDiffuseLighting"),j("feDisplacementMap"),j("feDistantLight"),j("feDropShadow"),j("feFlood"),j("feFuncA"),j("feFuncB"),j("feFuncG"),j("feFuncR"),j("feGaussianBlur"),j("feImage"),j("feMerge"),j("feMergeNode"),j("feMorphology"),j("feOffset"),j("fePointLight"),j("feSpecularLighting"),j("feSpotLight"),j("feTile"),j("feTurbulence"),j("fencedframe"),j("fieldset"),j("figcaption"),j("figure"),j("filter");let L=j("footer");j("foreignObject"),j("form");let S=j("g"),A=j("h1"),P=j("h2"),_=j("h3"),N=j("h4"),I=j("h5");j("h6"),j("hatch"),j("hatchpath"),j("head");let O=j("header");j("hgroup"),j("hr"),j("html"),j("i"),j("iframe"),j("image");let R=j("img"),B=j("input");j("ins"),j("kbd"),j("label"),j("legend");let D=j("li");j("line"),j("linearGradient"),j("link");let z=j("main");j("map"),j("mark"),j("marker"),j("mask"),j("math"),j("menu"),j("mesh"),j("meshgradient"),j("meshpatch"),j("meshrow"),j("meta"),j("metadata"),j("meter"),j("mpath");let V=j("nav");j("noscript"),j("object"),j("ol"),j("optgroup"),j("option"),j("output");let q=j("p");j("param");let J=j("path");j("pattern"),j("picture"),j("polygon"),j("polyline");let G=j("pre");j("progress"),j("q"),j("radialGradient"),j("rb"),j("rect"),j("rp"),j("rt"),j("rtc"),j("ruby"),j("s"),j("samp"),j("script"),j("search"),j("section"),j("select"),j("selectedcontent"),j("set"),j("slot"),j("small"),j("solidcolor"),j("source");let W=j("span");j("stop"),j("strong"),j("style"),j("sub"),j("summary"),j("sup");let F=j("svg");j("switch"),j("symbol"),j("table"),j("tbody"),j("td"),j("template"),j("text"),j("textPath"),j("textarea"),j("tfoot"),j("th"),j("thead"),j("time"),j("title"),j("tr"),j("track"),j("tspan"),j("u");let H=j("ul");j("unknown"),j("use"),j("var"),j("video"),j("view"),j("wbr");let U={blog:{2019:{12:{22:[{View:e=>Y(e,[q("so i guess i should start using it..."),q(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),q(`to use the blog,
create an archive dir, for example`),ei(`
src/blog/2019/12/22/
`),q("then just add the blogposts in that directory structure."),q(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),q("more information following soon.")]),file:"/home/j/dev/magic/core/example/news/2019/12/22/blogging.mjs",name:"/core/news/2019/12/22/blogging/",originalState:{description:"@magic has a blog now.",title:"blogging..."},path:"/core/news/2019/12/22/blogging/index.html",state:{description:"@magic has a blog now.",title:"blogging..."}}]}}},data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/core/logo.png",logotext:"@magic",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],module:{test:"testing"},nospy:{show:!1},pageClass:{},pages:{"/core/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core documentation.","tells you why, how and when to use @magic.","also provides an overview of all @magic functionality this ecosystem provides."],logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"}},"/core/404/":{description:"404 - not found.",title:"404 - not found"},"/core/build/":{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},"/core/concepts/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:["@magic/core conceptual information.","explains the main concepts that make the @magic work."],logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core concepts"},"/core/files/":{description:"@magic/core directory docs.",title:"@magic/core files"},"/core/libraries/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic/core libraries allow you to include client side functionality in your app.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic/core library docs"},"/core/modules/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/example/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules example module.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/example"},"/core/modules/html/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"this module gets imported from a html file.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"html file example"},"/core/modules/markdown/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"markdown file description",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"markdown file example"},"/core/modules/preinstalled/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules"},"/core/modules/propTypes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-modules/prop-types documentation.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-modules/prop-types"},"/core/news/2019/":{year:"2019"},"/core/news/2019/12/":{month:"12",year:"2019"},"/core/news/2019/12/22/blogging/":{description:"@magic has a blog now.",title:"blogging..."},"/core/themes/":{data:{description:"This is some static data, loaded via example/app.mjs#build and from example/assets/data/index.json.",title:"external data"},description:"@magic-theme docs.",logo:"/logo.png",menu:[{items:[{text:"modules",to:"/core/concepts/#modules"},{text:"state",to:"/core/concepts/#state"},{text:"actions",to:"/core/concepts/#actions"},{text:"effects",to:"/core/concepts/#effects"},{text:"subscriptions",to:"/core/concepts/#subscriptions"},{text:"views",to:"/core/concepts/#views"},{text:"styles",to:"/core/concepts/#styles"},{text:"global",to:"/core/concepts/#globals"},{text:"server lambdas",to:"/core/concepts/#lambdas"}],text:"concepts",to:"/core/concepts/"},{items:[{items:[{text:"url mapping",to:"/core/files/#pages-dir-structure"},{text:"example",to:"/core/files/#pages-example"}],text:"/pages",to:"/core/files/#pages"},{items:[{text:"example",to:"/core/files/#assets-example"}],text:"/assets",to:"/core/files/#assets"},{text:"/assets/static",to:"/core/files/#static"},{items:[{text:"example",to:"/core/files/#themes-example"}],text:"/assets/themes",to:"/core/files/#themes"},{items:[{text:"example",to:"/core/files/#app-example"}],text:"app.mjs",to:"/core/files/#app"},{items:[{text:"example",to:"/core/files/#config-example"}],text:"/config.mjs",to:"/core/files/#config"}],text:"files & directories",to:"/core/files/"},{items:[{text:"definition",to:"/core/modules/#definition"},{text:"usage",to:"/core/modules/#usage"},{text:"@magic-modules",to:"/core/modules/#gl-magic-modules"},{text:"custom modules",to:"/core/modules/example/"},{items:[{items:[{text:"props",to:"/core/modules/preinstalled/#menu-props"},{text:"sub menus",to:"/core/modules/preinstalled/#menu-sub-menus"}],text:"menu",to:"/core/modules/preinstalled/#menu"},{text:"link",to:"/core/modules/preinstalled/#link"},{text:"img",to:"/core/modules/preinstalled/#img"},{text:"footer",to:"/core/modules/preinstalled/#footer"}],text:"preinstalled",to:"/core/modules/preinstalled/"},{text:"markdown",to:"/core/modules/markdown/"},{text:"html",to:"/core/modules/html/"}],text:"modules",to:"/core/modules/"},{items:[{text:"@magic-themes",to:"/core/themes/#gl-magic-themes"}],text:"themes",to:"/core/themes/"},{items:[{text:"summary",to:"/core/libraries/#abstract"},{text:"local file",to:"/core/libraries/#dir-or-file"},{text:"libs from npm",to:"/core/libraries/#npm"},{text:"example",to:"/core/libraries/#example"},{text:"@magic-libraries",to:"/core/libraries/#gl-magic-libraries"}],text:"libraries",to:"/core/libraries/"},{text:"news",to:"/core/news/"},{text:"test",to:"/core/test/"}],seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},title:"@magic-themes"}},root:"/core/",seo:{about:"@magic framework core.",author:{"@type":"person",image:"https:/jaeh.at/img/jascha.ehrenreich.jpg",jobTitle:"Technomancer",name:"Jascha Ehrenreich",url:"https://jaeh.at"},image:"https://magic.github.io/core/logo.png",name:"@magic/core documentation",url:"https://magic.github.io/core/"},theme:"dark",title:"@magic/core documentation",url:"/core/"},K=e=>{let t,{blog:o,link:s,month:i,year:a}=e,r=Object.entries(o[a][i]),l=[i];return s?t=`${s}${i}/`:l.push(" - ",a),[_(t?eo({to:t},l):l),r.map(([o,s])=>s.map(s=>X({...e,...s.state,name:s.name,link:t,day:o})))]},Y=(e,t)=>{let{url:o,title:s,description:i}=e,[a,r,l,c,n]=o.split("/");return[P(s),q(i),t,N("Blog Archives:"),q(eo({to:`/${r}/${l}/${c}/`},`year: ${c}`)),q(eo({to:`/${r}/${l}/${c}/${n}/`},`month: ${n} ${c}`))]},X=e=>$([N([e.day,"-",e.month,"-",e.year," - ",eo({to:e.name},e.title)]),q(e.description)]),Q=e=>{let t,{link:o,year:s,blog:i,url:a}=e;return o?t=`${o}${s}/`:a.endsWith(`${s}/`)&&(t=a),$([P(o?eo({to:t},s):s),Object.entries(i[s]).map(([o,s])=>K({...e,month:o,days:s,link:t}))])},Z=e=>{if("string"==typeof e)e={project:e};else if(!e.project)return;let{branch:t="master",host:o="github"}=e,{project:s=!1}=e,i="",a=s;s.startsWith("@")?(i="@",s=s.substr(1)):a=s.split("/")[1];let r=[["npm",(e=s)=>e&&{to:`https://www.npmjs.com/package/${a}`,src:`https://img.shields.io/npm/v/${i}${e}?color=blue`}],["node",(e=s)=>e&&{src:`https://img.shields.io/node/v/${i}${e}?color=blue`}],["license",(e=s)=>e&&{src:`https://img.shields.io/npm/l/${i}${e}?color=blue`}],["travis",(e=s)=>e&&{to:`https://travis-ci.com/${e}`,src:`https://img.shields.io/travis/com/${e}/${t}`}],["appveyor",(e=s)=>{if(e){let[o,s]=e.split("/");return o=o.replace(/-/g,""),{to:`https://ci.appveyor.com/project/${o}/${s}/branch/${t}`,src:`https://img.shields.io/appveyor/ci/${o}/${s}/${t}.svg`}}}],["coveralls",(e=s)=>({to:`https://coveralls.io/${o}/${e}`,src:`https://img.shields.io/coveralls/${o}/${e}/${t}.svg`})],["snyk",(e=s)=>e&&{to:`https://snyk.io/test/${o}/${e}`,src:`https://img.shields.io/snyk/vulnerabilities/github/${e}.svg`}]].map(([t,o])=>o(e[t]));if(r.length)return H({class:"GitBadges"},r.map(({to:e,src:t})=>{if(!t)return;let o=et({src:t,height:"23"});return e?D(eo({to:e},o)):D(o)}))},ee=e=>{let{badges:t=!0,items:o=[],org:s,host:i="github",header:a,desc:r=e.description}=e,l={};return e.class?e.class.includes("GitList")||(l.class=`GitList ${e.class}`):l.class="GitList",e.id?l.id=e.id:l.id=s,l.id.startsWith("gl")||(l.id=`gl-${l.id}`),$(l,[a&&P(a),r&&$({class:"description"},r),H({id:`${l.id}-ul`},[o.map(e=>ee.Item({badges:t,org:s,id:`${l.id}-li`,host:i,...e}))])])};ee.Item=e=>{let{name:t,org:o,id:s,host:i,badges:a=!0}=e,r=e.desc||e.description;return D({id:`${s}-${t}`,class:"GitListItem"},[_([eo({to:`https://${o}.${i}.io/${t}`},`@${o}/${t} demo`)]),r&&q(r),q(eo({to:`https://${i}.com/${o}/${t}`},"git repository")),a&&Z(`@${o}/${t}`)])};let et=e=>{"string"==typeof e&&(e={src:e});let{loading:t="lazy"}=e;if(e.src)return Object.hasOwn(e,"alt")||(e.title?e.alt=e.title:e.alt=""),e.loading=t,R(e)},eo=({to:e,action:t=er.go,text:o,...s},i)=>{let{href:a,nofollow:r,noreferrer:l,...c}=s;return c.href=e=e||a||"",o&&i?o=[o,i]:o||(o=i||e),"/"===e[0]||"#"===e[0]?c.onclick=[t,ea.preventDefault]:(c.target="_blank",c.rel="noopener",r&&(c.rel+=" nofollow"),l&&(c.rel=`${c.rel} noreferrer`)),T(c,o)},es=e=>{let{collapse:t,items:o=[],text:s,url:i,...a}=e,r={class:{}},{to:l}=a;l===i&&(r.class.active=!0);let c=[];return(!t||i.includes(l??"undefined"))&&o.length&&(c=H(o.map(e=>es({url:i,collapse:t,...e})))),D(r,[l?eo(a,s):W(a,s),c])},ei=(e,t)=>{"string"==typeof e?e={content:e}:t?e={content:t,...e}:Array.isArray(e)&&(e={content:e.join("")});let{content:o,lines:s=!0}=e;return $({class:{Pre:!0,lines:s&&"false"!==s}},[$({class:"menu"},[M({onclick:[er.pre.clip,e=>({e,content:o})]},"copy")]),G(o.trim().split("\n").map(ei.Line))])};ei.Comment=e=>W({class:"comment"},e),ei.Line=e=>E({class:"line"},ei.Words(e)),ei.Word=e=>{if(!e)return"";let t=e.includes("://"),o=e.startsWith("mailto:")||e.includes("@")&&e.includes(".");if(t||o)return eo({to:e,text:e});let s="";return("state"===e?s="state":"actions"===e?s="actions":"effects"===e?s="effects":"subscriptions"===e?s="subscriptions":ea.pre.keywords.includes(e)?s="keyword":ea.pre.builtins.includes(e)?s="builtin":ea.pre.booleans.includes(e)&&(s="boolean"),s)?W({class:s},e):e},ei.Words=e=>{let[t,...o]=e.split(ea.pre.commentRegex);if(!t.endsWith(":")&&o.length)return[ei.Words(t),ei.Comment(o.join("").split(ea.pre.wordRegex).map(ei.Word))];let s=[],i=e;return(e.replace(ea.pre.stringRegex,e=>{if(i){let[t,o]=i.split(e);t&&s.push(t.split(ea.pre.wordRegex).map(ei.Word).filter(e=>e)),i=o}s.push(W({class:"string"},e))}),i!==e)?(i&&s.push(i.split(ea.pre.wordRegex).map(ei.Word).filter(e=>e)),s):e.split(ea.pre.wordRegex).filter(e=>e).map(ei.Word)};let ea={exportDefault:e=>`${string} the argument it received was ${e}`,is:((w=(e,t)=>"function"==typeof w[t]?w[t](e):typeof e===t).number=e=>e===+e,w.integer=e=>e===+e&&e===(0|e),w.float=e=>e===+e,w.array=e=>Array.isArray(e),w.regexp=e=>e instanceof RegExp,w.date=e=>e instanceof Date,w.error=e=>e instanceof Error,w.nil=e=>null===e,w.null=e=>null===e,w.promise=e=>e instanceof Promise,w.objectNative=e=>"[object Object]"===Object.prototype.toString.call(e),w),pre:{booleans:["true","false"],builtins:["Array","Object","String","Number","RegExp","Null","Symbol","Set","WeakSet","Map","WeakMap","setInterval","setTimeout","Promise","JSON","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],commentRegex:/(\/\/)/gim,keywords:["let","this","long","package","float","goto","private","class","if","short","while","protected","with","debugger","case","continue","volatile","interface","instanceof","super","synchronized","throw","extends","final","export","throws","try","import","double","enum","boolean","abstract","function","implements","typeof","transient","break","default","do","static","void","int","new","async","native","switch","else","delete","null","public","var","await","byte","finally","catch","in","return","for","get","const","char","module","exports","require","npm","install","=>"],stringRegex:/("|')(.*?)\1/gim,wordRegex:/( )/gim},preventDefault:e=>(e.preventDefault(),e)},er={changeTheme:e=>({...e,pageClass:{...e.pageClass,light:"dark"===e.theme},theme:"dark"===e.theme?"light":"dark"}),go:(e,t)=>{if(!t||!t.currentTarget)return e;let o=t.currentTarget.href.replace(window.location.origin,""),[s,i=""]=o.split("#");if(s===e.url&&i===e.hash)return i&&(window.location.hash=i),e;let a=e.pages,r=a&&a[s]&&a[s].title;r&&(document.title=e.title=r),s!==e.url?i||window.scrollTo({top:0}):window.location.hash=i;let{scrollY:l}=window;return window.history.pushState({url:s,hash:i,scrollY:l},String(e.title),o),{...e,url:s,hash:i,prev:e.url}},nospy:{toggle:e=>(e.nospy.show=!e.nospy.show,{...e})},pop:(e,t)=>{let{pathname:o,hash:s}=window.location;s=s.substring(1);let i=0;return t&&t.state&&(o=t.state.url,s=t.state.hash,i=t.state.scrollY||0),s?window.location.hash=s:window.scroll({top:i}),{...e,url:o,hash:s}},pre:{clip:(e,{content:t})=>{if("u">typeof document&&"function"==typeof document.execCommand){let e=document.createElement("textarea");e.id="copy",e.innerHTML=t,document.body.appendChild(e);let o=document.getElementById("copy");o.select(),document.execCommand("copy"),document.body.removeChild(o)}return e}}},el=(e,t)=>{let o=o=>e(t,o);return addEventListener("popstate",o),()=>removeEventListener("popstate",o)},ec={"/core/":e=>[A({id:"magiccore-documentation"},"@magic/core documentation"),P({id:"welcome-to-the-magic-docs"},"welcome to the magic docs."),q("@magic/core documentation. tells you why, how and when to use @magic. also provides an overview of all @magic functionality this ecosystem provides."),q("the goal of this document is to give you a rough @magical overview."),Z("@magic/core"),P({id:"philosophy"},"philosophy"),q(`@magic aims to make it easy to stitch together any kind of webapp.
by providing simple, well documented and self contained modules,
@magic makes it possible to create stunningly fast
webpages with minimal cognitive overhead.`),P({id:"privacy"},"privacy"),q("@magic does not spy."),q(`not only do we try to be legally compliant by default,
but we also aim to be ethical
which means prioritizing your rights over our needs,
but also means we prioritize the rights of your users over your needs.
we believe that this is the best compromise.`),P({id:"buzzwords"},"why should i use magic?"),_({id:"features"},"features"),H([D("static html pages with opengraph seo."),D("pages are hosted for free using gitlab, github or any other git-pages style hosting."),D("static css output with selector and rule deduplication."),D("no javascript required where possible."),D("minimal client boilerplate."),D("no spyware included."),D("WIP: lambda faas and graphql api generator."),D("WIP: server side rendering (if needed).")]),_({id:"magic-is-tiny"},"@magic is tiny"),q(`~4 kb javascript boilerplate.
usually, all the javascript in your homepage will be 30-60kb big (after unpacking),
10-30kb get transmitted from the server to the client.
this documentation page you are reading loads 20kb of gzipped javascript,
which, when parsing, turns into ~88kb of uncompressed javascript.
this includes all content of all subpages, no additional server requests needed for any navigations in the page.`),q("WIP: code splitting for bigger pages."),_({id:"magic-works-without-javascript"},"@magic works without javascript"),q(`most of the functionality works without javascript,
some buttons and realtime user interactions obviously won't,
but @magic always tries to provide a non-javascript fallback via css.`),_({id:"magic-generates-static-pages"},"@magic generates static pages"),q("this makes free hosting (using github or gitlab pages) possible. and it's easy."),q(["@magic publishes to ",eo({to:"https://github.com",text:"github"}),", ",eo({to:"https://about.gitlab.com/",text:"gitlab"}),`,
and any other git-pages enabled hosting service.`]),_({id:"serverless-faas"},"serverless / faas"),q([`automagically generates
serverless lambdas, derived from the
`,eo({to:"https://github.com/magic-modules/",text:"@magic-modules"}),`
you use in your pages.`]),q(`this makes visitor statistics, user authentication and authorization,
chat, and all other server side services possible.`)],"/core/404/":()=>$("404 - not found."),"/core/build/":e=>$([_(e.title),q(e.description),q([N("state.data"),ei(JSON.stringify({data:e.data},null,2))])]),"/core/concepts/":e=>[A({id:"magiccore-concepts"},"@magic/core concepts"),q("magic concepts. these are the building blocks of every module in a magic app"),P({id:"modules"},"@magic-modules"),q("modules are the main building block of magic."),q(`a page is a module, a button is a module, a link is a module, an image is a module.
even a theme is a module.`),q(`a @magic app contains modules containing modules that contain modules.
this can lead to inception.`),P({id:"module-building-blocks"},"module building blocks"),_({id:"state"},"state"),q(`state is a javascript object.
state can be mutated by actions,
effects and subscriptions can call actions to change the state.
every rendering frame, the state determines the output of the html views.`),ei(`const state = {
  shown: false,
  count: 0,
}
`),P({id:"actions"},"actions"),q("actions are an object containing functions"),q("those functions get the state and their props and may return a new full, but changed, state."),ei(`const actions = {
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
}`),P({id:"effects"},"effects"),q("effects are an object containing functions, just like actions."),q("effects can only change the state by calling actions."),q("effects may also be impure and trigger side-effects outside of hyperapp."),ei(`const effects = {
  waitASec: [state, async state => {
    await new Promise((r) => setTimeout(r, 1000))

    return actions.plus(state)
  }],
}`),P({id:"subscriptions"},"subscriptions"),q("at the moment, subscriptions can be defined using strings as function names."),q("also, if a module exports a subscriptions array, those subscriptions will be added to the app."),ei(`// in a module:

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

export const subscriptions = ['lib.subscribe', 'actions.onSubscription']`),P({id:"views"},"views"),q(`views render the state to html
whenever an action triggers a change in the state, this then triggers a view change.`),ei("export const View = state => div(JSON.stringify(state))"),P({id:"styles"},"styles"),q(`every module can export a style object.
magic will automagically merge all styles into one global css file.
in the future, it will also remove unused styles for you.`),q(`styles merge order, last overwrites first:
module.style < page.style < app.style < theme.style`),q("this allows css to be inherited in both directions."),q(`a module automatically creates it's own css namespace,
that same namespace can be used in page, app and theme css styles
to overwrite module specific styles.`),_({id:"styles-magiccss"},"@magic/css"),q("internally, magic uses it's own css-in-js library."),q([`to find out more, click the following link:
`,eo({to:"https://magic.github.io/css/",text:"@magic/css"})]),P({id:"globals"},"globals"),q("every module can set a global object, containing state and action properties."),q("every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions, instead of into the module namespace."),ei(`// in module.mjs

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
])`),P({id:"lambdas"},"server lambdas"),q(`this is the serverside magic.
you can define functions that get transpiled into serverside lambdas.
server side lambdas will be available for GET and/or POST requests.`),q(`the server side function signature is (req, res) => {},
as it is in most nodejs http servers,
with the addition of req.body being async => awaited before execution of the lambda.`)],"/core/files/":e=>[A(e.title),q("There are multiple magic files and directories."),H([D("/pages - files in the page directory map to urls in your app."),D("/assets - custom components, @magic-modules get imported here"),D("/assets/static - static files"),D("/assets/themes - theme directory, @magic-themes get imported here"),D("/assets/lib.mjs - imports npm and local but external packages into your app"),D("/app.mjs - gets merged into the app, can set state, actions, style here"),D("/config.mjs - custom config for your app"),D("/assets/Menu.mjs - custom Menu for your app")]),P({id:"pages"},"/pages"),q("the pages dir contains the pages of your webapp."),q(["each page has it's own state and actions, ","but also inherits the global state and actions from the app and it's dependencies"]),_({id:"pages-dir-structure"},"pages directory to url map"),q("for the domain mag.ic:"),ei(`
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
`),A({id:"pages-example"},"example page"),q("Pages can use javascript, html or markdown"),P({id:"pages-example-js"},"javascript example"),q("A magic javascript page is a @magic-module. The only difference is that pages get exposed via http"),ei(`
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
`),P({id:"pages-example-html"},"html example"),q("html pages can only export state and View."),ei(`
---
@state
{
  "title": "html file example",
    "description": "this module gets imported from a html file."
}
---

<h2>&#36;{ state.title }</h4>

<p>{{ state.description }}</p>
`),P({id:"pages-example-markdown"},"markdown example"),q("markdown pages can only export state and View."),ei(`
---
@state {
  "title": "markdown file example",
  "description": "markdown file description"
}
---

## &#36;{state.title}

&#36;{state.description}
`),P({id:"assets"},"assets"),q("the assets dir contains custom components of your app."),q("you can import additional @magic-modules here"),_({id:"assets-example"},"/assets/index.mjs"),ei(`
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}
`),P({id:"static"},"/assets/static"),q(["the static dir contains all of your static assets.","every file in this directory gets copied to the public dir.","image and svg files get minified using imagemin."]),q(["text and binary files get compressed using the optional ",eo({to:"https://github.com/jaeh/node-zopfli-es",text:"node-zopfli-es"})," (if it is installed)"]),P({id:"themes"},"/assets/themes"),q("the themes directory contains...themes."),q(["a magic theme is an object of css rules, see ",eo({text:"@magic/css",to:"https://github.com/magic/css/"})," for more examples and documentation."]),_({id:"themes-example"},"example theme"),ei(`
export default {
  'body': {
    color: 'blue',
  },
}
`),P({id:"app"},"/app.mjs"),q("the /app.mjs file allows you to set global state, actions, and styles"),_({id:"app-example"},"/example/app.mjs"),ei(`
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
`),P({id:"config"},"/config.mjs"),q("the /config.mjs file allows you to set various aspects of your app"),_({id:"config-example"},"/config.mjs example"),ei(`
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
`),q(eo({text:"Menu.mjs on github",to:"https://github.com/magic/core/blob/master/src/modules/Menu.mjs"}))],"/core/libraries/":e=>[A({id:"magiccore-library-docs"},"@magic/core library docs"),q("@magic/core libraries allow you to include client side functionality in your app."),P({id:"abstract"},"libraries"),q(`what would javascript be without the millions of dependencies
that you can easily install and make the average webpage
slow[ly] (pun intended) grow towards a footprint of 5 megabytes.`),q("we think that all of that bloat is unneeded, unheeded and, frankly, not optimal."),q([`magic has one external client side dependency,
`,eo({to:"https://github.com/jorgebucaran/hyperapp/",text:"hyperapp"}),`,
[~500 lines that provide our ui state machine]. thats it. and it won't change.`]),q([`we also have the tendency to write libraries specialized for our usecase, see
`,eo({to:"https://github.com/magic/css",text:"@magic/css"}),`,
`,eo({to:"https://github.com/magic/test",text:"@magic/test"}),`,
`,eo({to:"https://github.com/magic/cli",text:"@magic/cli"}),`
and others.`]),q(`once there is a lib key in at least one component,
window.lib (browser) and global.lib (nodejs) will be set,
aliasing lib as a global variable in both environments`),_({id:"dir-or-file"},"lib dir or file"),q(`if you need libraries in multiple otherwise independent modules,
it might be easier to keep your library dependencies in a central place.`),q(`to achieve this, one can simply create /assets/lib.mjs and export an object from it.
this object will get merged into the globalThis.lib object,
making it available as "lib" throughout your app.`),ei("export default { name: () => {} }"),q("will turn into"),ei("lib.name = () => {}"),_({id:"npm"},"npm"),q("all @magic-libraries and all npm packages starting with magic-library-* will be loaded automatically"),N({id:"example"},"Example"),q("first, install a @magic-library"),ei(`
npm install --save --save-exact @magic-libraries/is
`),q("then, in javascript"),ei(`
export const View = props => div([
  'value is ',
  lib.is(props.value, 'string') ? '' : 'not',
  ' a string',
])
`),ee({org:"magic-libraries",header:[eo({to:"https://magic-libraries.github.io"},"@magic-libraries")],desc:["@magic libraries are pieces of client side functionality."," they are not intended to be used in markdown,"," instead, a developer will use them when creating @magic-modules,"," which can then be used from markdown pages."],items:[{name:"db",description:"key => value store using localstorage"},{name:"gql",description:["the @magic-libraries/gql module"," encodes template strings to graphql queries ready to be sent to a server."]},{name:"http",description:"http request effect for @magic."},{name:"is",description:"the @magic-libraries/is module unifies the javascript type testing apis."},{name:"json",description:["the @magic-libraries/json module parses and stringifies json."," it also returns errors instead of throwing them."]},{name:"prevent-default",description:["the @magic-libraries/prevent-default module"," invokes event.preventDefault as a hyperapp effect."]},{name:"slugify",description:"makes strings url safe. opinionated."},{name:"try-catch",description:["the @magic-libraries/try-catch module"," returns errors instead of throwing them."]},{name:"uri",description:["the @magic-libraries/uri module"," encodes objects to uri strings and decodes uri strings to objects."]}]})],"/core/modules/":e=>[A({id:"magic-modules"},"@magic-modules"),q("magic modules are predefined modules for webapps."),P({id:"definition"},"module definition"),q("the minimal module is a function that returns some html."),ei(`
// /assets/ModuleName.mjs

// simplest module
export const View = () => div('hello, world')

// complete signature
export const View = (props = {}, children = []) => div('hello, world')
`),P({id:"usage"},"usage"),q(`if the npm package name starts with @magic-modules/ or magic-module-, it will get imported automagically.
the name of the Module will be set to a PascalCased version of the remainder of the module name.
@magic-modules/git-badges, for example, turns into GitBadges.
the same is true for all uppercased files in your /assets/ directory and subdirectories.
in the rare case where you want to install a npm module that can not be found,
you can import it in /assets/index.mjs`),ei(`
// /assets/index.mjs
import NpmModule from 'non-standard-named-magic-module-from-npm'

export default {
  // ...otherModules

  // load module from node_modules
  NpmModule,
}
`),q("after this, the module will be a global in your app and can be used like any other component."),ei(`
// any page or module
export default state => div([
  // module without props
  Mod(),
  'modules that need props: ',
  Mod({ state, customProp: true }),
`),ee({class:"ModuleList",org:"magic-modules",header:[eo({to:"https://magic-modules.github.io/"},"@magic-modules")],description:["modules are the building blocks of ",eo({to:"https://magic.github.io/core/"},"@magic"),". modules can be used to add both client and server functionality to your @magic app."],items:[{name:"about-magic",description:"AboutMagic shows some information about @magic."},{name:"accordion",description:"Accordion shows a list of items that horizontally open/close."},{name:"cite",description:"Makes Citations easy. Adds Quote around quotes and a minimally styled paragraph around the author."},{name:"example-list",description:"ExampleList shows a list of @magic-examples pages."},{name:"gdpr",description:"Gdpr compliant popup that allows users to allow or deny cookies."},{name:"git-badges",description:"GitBadges shows a list of github repository status badges."},{name:"git-list",description:"show a list of git repositories like the one you are looking at."},{name:"hero",description:"Hero modules are full screen top of page content."},{name:"language-switch",description:"LanguageSwitch provides simple multilanguage support for magic."},{name:"library-list",description:"LibraryList shows a list of all @magic-libraries libraries."},{name:"light-box",description:"images that show a bigger view of themselves when clicked."},{name:"light-switch",description:"dark/light theme color switch button."},{name:"messages",description:"Messages shows popup messages."},{name:"module-list",description:"ModuleList shows the list of @magic-modules you are looking at."},{name:"no-spy",description:'Minimal interface for "we do not spy" modal.'},{name:"pre",description:"Pre allows you to display javascript code with syntax highlighting."},{name:"quote",description:"adds “” around the quote and sets font-style: italic."},{name:"sound-cloud",description:"embed soundcloud track, playlist and user widgets"},{name:"theme-list",description:"ThemeList shows a list of all @magic-themes."},{name:"theme-vars",description:"ThemeVars shows a preview of all colors used in a @magic-themes."},{name:"video-embed",description:"VideoEmbed embeds videos from any video hoster."},{name:"xkcd",description:"Xkcd embeds xkcd comics."}]})],"/core/modules/example/":e=>{var t;let o,s;return[A({id:"magic-modulesexample"},"@magic-modules/example"),P({id:"custom-module"},"custom module"),(o={state:e},$({class:"Mod"},[_("Mod.Mod"),q(["this is Mod. it gets loaded from ",eo({to:"https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs"},"/assets/modules/Mod.mjs")]),q(["the state of this module: ",JSON.stringify(o.module)])])),$({class:"Component"},[(s=(t="string"==typeof(t={title:"Mod Component Title, passed via props"})?{header:t}:t).header||t.title)&&I(s),q(["Component, a second component in ",eo({to:"https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs"},"/assets/modules/Component.mjs")])]),_({id:"mod-sourcecode"},"Mod sourcecode:"),ei(`
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
`),_({id:"component-sourcecode"},"Component sourcecode:"),ei(`
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
`)]},"/core/modules/html/":e=>[P("html file example"),q("this module gets imported from a html file."),q([`
  see
  `,eo({to:"https://github.com/magic/core/blob/master/example/pages/modules/html.html"},`
    this html file
  `),`
  for an example.
`]),q(`
  all html valid in <body> can be used, excluding the <script> and <style> tags.
`),q("the state looks like the following, and any valid json is allowed"),ei(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/markdown/":e=>[P({id:"markdown-file-example"},"markdown file example"),q("markdown file description"),q("this module gets imported from a markdown file."),q(["see ",eo({to:"https://github.com/magic/core/blob/master/example/pages/modules/markdown.md",text:"this file in the example dir"})," for an example."]),q(`any kind of markdown can be used here,
but if you use html natively,
only tags valid in a html5 body, excluding <script> and <style> tags, are accepted.`),_({id:"a-list"},"a list:"),H([D(eo({to:"https://magic.github.io/",text:"@magic/core"})),D(eo({to:"https://magic-libraries.github.io/",text:"@magic-libraries"})),D(eo({to:"https://magic-modules.github.io/",text:"@magic-modules"})),D(eo({to:"https://magic-themes.github.io/",text:"@magic-themes"}))]),_({id:"state"},"state"),q(`this markdown file also starts with a magic @state declaration.
it is used internally to, for example, add the title and meta rel="description" tags to the head of this html file.`),q("the state looks like the following, and any valid json is allowed"),ei(`
---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---
`)],"/core/modules/preinstalled/":e=>[A({id:"magic-modules"},"@magic-modules"),P({id:"preinstalled"},"preinstalled"),q("magic has some preinstalled modules that will be used in most pages."),P({id:"app"},"app"),q(`this is the main app module.
it has magically inherited properties and all of it is customizable.`),q([`to add actions/state/style to the app you can just create an /assets/app.mjs file.
the contents of this file get
`,eo({to:"https://github.com/magic/deep",text:"deep .merged"}),`
into the app`]),ei(`
// /src/app.mjs
export const state = {
  merge: 'gets merged into state',
}
export const actions = {
  mergedActions: state => ({ ...state, merge: 'merged action executed' }),
}
`),P({id:"menu"},"menu"),q("the Menu module provides... menus."),ei(`
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
`),_({id:"menu-props"},"Menu props"),q("the Menu module allows multiple props to be passed when instantiating the Menu"),_({id:"menu-props-collapse"},"props.collapse"),q(`by default, the menu will only show submenu items if their parent link is active.
to force submenu items to show at all times, just pass a collapse: false prop`),ei(`
Menu({
  // if false, menu will always show all submenu items
  collapse: false, // (default: true)
})
`),_({id:"menu-item-props"},"Menu.Item props"),q(`every MenuItem accepts the same props as a link does.
additionally a MenuItem accepts an items prop with sub menu items.`),ei(`
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [MenuItems],
  noreferrer: true, // set rel='noreferrer'
  nofollow: true, // set rel='nofollow'
})
`),_({id:"menu-sub-menus"},"sub menus"),q("to define a submenu, simply define a .items array on the menu item"),ei(`
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
`),P({id:"link"},"link"),q("the link module allows you to link to things."),ei(`
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
`),P({id:"img"},"img"),q("the img module adds some sane default values to your images."),ei(`
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
`),P({id:"footer"},"footer"),q("the footer module contains a small info text and a link to the magic github repository."),q(`to overwrite this behaviour, just place a Footer.mjs file in your assets
and require it in /assets/index.mjs.`),ei(`
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
`)],"/core/modules/propTypes/":e=>[A({id:"magic-modulesprop-types"},"@magic-modules/prop-types"),P({id:"check-props"},"CHECK_PROPS"),q("@magic-modules can export a .propTypes object with an array of prop types."),N({id:"#example"},"example"),ei(`
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
`)],"/core/news/":e=>Object.entries(e.blog).map(([t])=>Q({...e,year:t,link:e.url})),"/core/news/2019/":e=>Q(e),"/core/news/2019/12/":e=>K(e),"/core/news/2019/12/22/blogging/":e=>Y(e,[q("so i guess i should start using it..."),q(`it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.`),q(`to use the blog,
create an archive dir, for example`),ei(`
src/blog/2019/12/22/
`),q("then just add the blogposts in that directory structure."),q(`@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.`),q("more information following soon.")]),"/core/test/":e=>[P("Test page"),q("This page shows various features and tests of magic functionality"),_("Link Tests:"),H([D(eo({to:"/modules/"})),D(eo({to:"/modules/#gl-magic-modules"})),D(eo({to:"https://magic.github.io"}))]),_("Broken link tests:"),q("the following links are broken, and it's intentional for magic to warn us on every rebuild."),H([D(eo({text:"redirect link",to:"https://magic.github.io/core#expected-redirect"})),D(eo({text:"broken link",to:"https://expect-error"})),D(eo({text:"404 link",to:"https://en.wikipedia.org/hMdYfVaKY4btraQcgD0me6RRBDnugbpJ4FLpgJgeB7"})),D(et({alt:"Broken Image Link",src:"https://broken-image-link"}))]),_("Image test"),q("while at it, let's test an image, 2 times with a working src:"),H([D(et({alt:"Magic Logo",src:"/logo.png"})),D(et({alt:"Magic Logo",src:"/core/logo.png"}))]),q("and once with a broken src:"),et({alt:"Broken Magic Logo",src:"/logo23-broken.png"}),_("Links in modules"),q(eo({to:"/",text:"Link in a paragraph"})),H([D(eo({to:"/",text:"Link in a list"})),D(eo({to:"/",text:"Second Link in a list"}))])],"/core/themes/":e=>[A({id:"magic-themes"},"@magic-themes"),q(`magic themes are themes for magic apps.
you decide which theme to load by specifying the theme name in config.THEME`),ei(`
// /config.mjs
export default {
  // ...rest of config,
  THEME: 'blue',
}
`),P({id:"theme-load-order"},"theme load order"),q("themes get loaded from multiple places. last in the list overwrites earlier entries."),ei(`
// ...default module styles get inserted here
/node_modules/@magic/core/src/themes/THEME/index.mjs
/node_modules/@magic-themes/THEME
/assets/themes/THEME/index.mjs
`),ee({org:"magic-themes",header:[eo({to:"https://magic-themes.github.io"},"@magic-themes")],desc:["below is a collection of the available @magic app themes."," all of the themes below are designed to be usable on their own,"," but they can also be combined if needed."],items:[{name:"docs",description:"the @magic documentation theme. used in all @magic docs."},{name:"example",description:"a minimal example theme."},{name:"project",description:"foundational @magic theme for project presentation."},{name:"slides",description:"theme that provides slides for presentations."},{name:"reader",description:"a theme designed to provide a reader mode."}]})]};k({init:{...U,url:window.location.pathname,hash:window.location.hash.substr(1)},subscriptions:e=>[[el,er.pop]],view:e=>{let t=ec[e.url]?e.url:"/404/",o=ec[t],s=e.pages&&e.pages[t];return s&&Object.keys(s).forEach(t=>{e[t]=s[t]}),e.url=t,(({page:e,state:t},o)=>z({id:"Magic",class:t.pageClass},$({class:{Wrapper:!0}},[((e={},t=[])=>{let{logo:o,menu:s,logotext:i,hash:a,url:r}=e;if(o||s||i)return O({class:"Header"},[eo({to:"/",class:"Logo"},[F({viewBox:"0 0 512 444"},[J({d:"M512 444L256 0 0 444z",fill:"#663695"}),C({cx:"256",cy:"294",r:"130",fill:"#fff"}),C({cx:"256",cy:"281",r:"40",fill:"#663695"}),J({d:"M256 350v44m24-44l1 13c1 27 29 27 29-7m-160-72s46-47 106-47c59 0 106 47 106 47s-47 43-106 43c-60 0-106-43-106-43zm65-75a134 134 0 0189 2",class:"stroke"}),J({d:"M256 81v53m184 270l-43-29M72 404l43-29",class:"stroke white"})])]),i&&q(i),s&&((e={})=>{let{collapse:t=!0,menu:o,hash:s}=e,{class:i="",url:a}=e;return i.includes("Menu")||(i=`Menu ${i}`.trim()),s&&a&&!a.endsWith(s)&&(a+=`#${s}`),V({className:i},H((o??[]).map(e=>es({...e,url:a,collapse:t}))))})({url:r,hash:a,menu:s}),t])})(t),$({class:"Page",id:"page"},e(t)),((e=[])=>L({class:"Footer"},[$({class:"Container"},[$({class:"Credits"},["made with a few bits of ",eo({to:"https://magic.github.io/",target:"_blank",rel:"noopener"},"magic")]),e])]))(),o])))({page:o,state:e},[((e={})=>F({class:"LightSwitch icon",onclick:er.changeTheme,height:25,width:25,viewBox:"0 0 352 460"},[J({d:"M149 48C96 48 48 95 47 143c-1 13 19 17 20 0-1-35 48-75 83-75 15 0 12-22-1-20z"}),J({d:"M176 0C74 0 0 83 0 176c9 91 84 118 100 204h20c-16-92-97-138-100-204C22 70 105 21 176 20zM95 400c2 68 20 48 40 60h82c20-12 38 8 40-60z"}),J({d:"M175 0c102 0 177 83 177 176-9 91-86 118-102 204h-20c16-92 99-138 102-204-2-106-86-155-157-156z"})]))(e),(({nospy:e={},cookies:t=[]})=>{let{show:o,title:s="Privacy Notice",content:i="This app neither saves, collects, nor shares any data about you.",buttonText:a="Awesome!"}=e;return o?$({class:"NoSpy"},[$({class:"Background",onclick:er.nospy.toggle}),$({class:"Container"},[s&&_(s),i&&q(i),B({onclick:er.nospy.toggle,value:a,type:"button"})])]):$({class:"NoSpy"},F({class:"icon",onclick:er.nospy.toggle,width:"25",height:"25",viewBox:"0 0 512 512"},[S([J({d:`
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
`}),C({cx:"192",cy:"128",r:"32"}),C({cx:"128",cy:"256",r:"32"}),C({cx:"288",cy:"384",r:"32"}),C({cx:"272",cy:"272",r:"16"}),C({cx:"400",cy:"336",r:"16"}),C({cx:"176",cy:"368",r:"16"})])]))})(e)])},node:document.getElementById("Magic")})};__MAGIC__();