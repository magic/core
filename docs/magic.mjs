// hyperapp

const { h, app } = (() => {
  var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3
var EMPTY_OBJ = {}
var EMPTY_ARR = []

var map = EMPTY_ARR.map
var isArray = Array.isArray
var defer = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout

var createClass = function(obj) {
  var out = ""

  if (typeof obj === "string") return obj

  if (isArray(obj) && obj.length > 0) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = createClass(obj[k])) !== "") {
        out += (out && " ") + tmp
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) {
        out += (out && " ") + k
      }
    }
  }

  return out
}

var merge = function(a, b) {
  var out = {}

  for (var k in a) out[k] = a[k]
  for (var k in b) out[k] = b[k]

  return out
}

var batch = function(list) {
  return list.reduce(function(out, item) {
    return out.concat(
      !item || item === true
        ? false
        : typeof item[0] === "function"
        ? [item]
        : batch(item)
    )
  }, EMPTY_ARR)
}

var isSameAction = function(a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function"
}

var shouldRestart = function(a, b) {
  for (var k in merge(a, b)) {
    if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true
    b[k] = a[k]
  }
}

var patchSubs = function(oldSubs, newSubs, dispatch) {
  for (
    var i = 0, oldSub, newSub, subs = [];
    i < oldSubs.length || i < newSubs.length;
    i++
  ) {
    oldSub = oldSubs[i]
    newSub = newSubs[i]
    subs.push(
      newSub
        ? !oldSub ||
          newSub[0] !== oldSub[0] ||
          shouldRestart(newSub[1], oldSub[1])
          ? [
              newSub[0],
              newSub[1],
              newSub[0](dispatch, newSub[1]),
              oldSub && oldSub[2]()
            ]
          : oldSub
        : oldSub && oldSub[2]()
    )
  }
  return subs
}

var patchProperty = function(node, key, oldValue, newValue, listener, isSvg) {
  if (key === "key") {
  } else if (key === "style") {
    for (var k in merge(oldValue, newValue)) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k]
      if (k[0] === "-") {
        node[key].setProperty(k, oldValue)
      } else {
        node[key][k] = oldValue
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (
      !((node.actions || (node.actions = {}))[
        (key = key.slice(2).toLowerCase())
      ] = newValue)
    ) {
      node.removeEventListener(key, listener)
    } else if (!oldValue) {
      node.addEventListener(key, listener)
    }
  } else if (!isSvg && key !== "list" && key in node) {
    node[key] = newValue == null ? "" : newValue
  } else if (
    newValue == null ||
    newValue === false ||
    (key === "class" && !(newValue = createClass(newValue)))
  ) {
    node.removeAttribute(key)
  } else {
    node.setAttribute(key, newValue)
  }
}

var createNode = function(vnode, listener, isSvg) {
  // if (!) {
    console.log(vnode)
  // }
  var node =
    vnode.type === TEXT_NODE
      ? document.createTextNode(vnode.name)
      : (isSvg = isSvg || vnode.name === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", vnode.name)
      : document.createElement(vnode.name)
  var props = vnode.props

  for (var k in props) {
    patchProperty(node, k, null, props[k], listener, isSvg)
  }

  if (vnode.children) {
    for (var i = 0, len = vnode.children.length; i < len; i++) {
      node.appendChild(
        createNode(
          (vnode.children[i] = getVNode(vnode.children[i])),
          listener,
          isSvg
        )
      )
    }
  }

  return (vnode.node = node)
}

var getKey = function(vnode) {
  return vnode == null ? null : vnode.key
}

var patch = function(parent, node, oldVNode, newVNode, listener, isSvg) {
  if (oldVNode === newVNode) {
  } else if (
    oldVNode != null &&
    oldVNode.type === TEXT_NODE &&
    newVNode.type === TEXT_NODE
  ) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
    node = parent.insertBefore(
      createNode((newVNode = getVNode(newVNode)), listener, isSvg),
      node
    )
    if (oldVNode != null) parent.removeChild(oldVNode.node)
  } else {
    var tmpVKid
    var oldVKid

    var oldKey
    var newKey

    var oldVProps = oldVNode.props
    var newVProps = newVNode.props

    var oldVKids = oldVNode.children
    var newVKids = newVNode.children

    var oldHead = 0
    var newHead = 0
    var oldTail = oldVKids.length - 1
    var newTail = newVKids.length - 1

    isSvg = isSvg || newVNode.name === "svg"

    for (var i in merge(oldVProps, newVProps)) {
      if (
        (i === "value" || i === "selected" || i === "checked"
          ? node[i]
          : oldVProps[i]) !== newVProps[i]
      ) {
        patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg)
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldHead])) == null ||
        oldKey !== getKey(newVKids[newHead])
      ) {
        break
      }

      patch(
        node,
        oldVKids[oldHead].node,
        oldVKids[oldHead],
        (newVKids[newHead] = getVNode(
          newVKids[newHead++],
          oldVKids[oldHead++]
        )),
        listener,
        isSvg
      )
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldTail])) == null ||
        oldKey !== getKey(newVKids[newTail])
      ) {
        break
      }

      patch(
        node,
        oldVKids[oldTail].node,
        oldVKids[oldTail],
        (newVKids[newTail] = getVNode(
          newVKids[newTail--],
          oldVKids[oldTail--]
        )),
        listener,
        isSvg
      )
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(
          createNode(
            (newVKids[newHead] = getVNode(newVKids[newHead++])),
            listener,
            isSvg
          ),
          (oldVKid = oldVKids[oldHead]) && oldVKid.node
        )
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node)
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i]
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey((oldVKid = oldVKids[oldHead]))
        newKey = getKey(
          (newVKids[newHead] = getVNode(newVKids[newHead], oldVKid))
        )

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
        ) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node)
          }
          oldHead++
          continue
        }

        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patch(
              node,
              oldVKid && oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            )
            newHead++
          }
          oldHead++
        } else {
          if (oldKey === newKey) {
            patch(
              node,
              oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            )
            newKeyed[newKey] = true
            oldHead++
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patch(
                node,
                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                tmpVKid,
                newVKids[newHead],
                listener,
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              patch(
                node,
                oldVKid && oldVKid.node,
                null,
                newVKids[newHead],
                listener,
                isSvg
              )
            }
          }
          newHead++
        }
      }

      while (oldHead <= oldTail) {
        if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
          node.removeChild(oldVKid.node)
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node)
        }
      }
    }
  }

  return (newVNode.node = node)
}

var propsChanged = function(a, b) {
  for (var k in a) if (a[k] !== b[k]) return true
  for (var k in b) if (a[k] !== b[k]) return true
}

var getVNode = function(newVNode, oldVNode) {
  return newVNode.type === LAZY_NODE
    ? ((!oldVNode || propsChanged(oldVNode.lazy, newVNode.lazy)) &&
        ((oldVNode = newVNode.lazy.view(newVNode.lazy)).lazy = newVNode.lazy),
      oldVNode)
    : newVNode
}

var createVNode = function(name, props, children, node, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    node: node,
    type: type,
    key: key
  }
}

var createTextVNode = function(value, node) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE)
}

var recycleNode = function(node) {
  return node.nodeType === TEXT_NODE
    ? createTextVNode(node.nodeValue, node)
    : createVNode(
        node.nodeName.toLowerCase(),
        EMPTY_OBJ,
        map.call(node.childNodes, recycleNode),
        node,
        null,
        RECYCLED_NODE
      )
}

var Lazy = function(props) {
  return {
    lazy: props,
    type: LAZY_NODE
  }
}

var h = function(name, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2; ) {
    rest.push(arguments[i])
  }

  while (rest.length > 0) {
    if (isArray((vnode = rest.pop()))) {
      for (var i = vnode.length; i-- > 0; ) {
        rest.push(vnode[i])
      }
    } else if (vnode === false || vnode === true || vnode == null) {
    } else {
      children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode))
    }
  }

  props = props || EMPTY_OBJ

  return typeof name === "function"
    ? name(props, children)
    : createVNode(name, props, children, null, props.key)
}

var app = function(props, enhance) {
  var state = {}
  var lock = false
  var view = props.view
  var node = props.node
  var vdom = node && recycleNode(node)
  var subscriptions = props.subscriptions
  var subs = []

  var listener = function(event) {
    dispatch(this.actions[event.type], event)
  }

  var setState = function(newState) {
    return (
      state === newState || lock || defer(render, (lock = true)),
      (state = newState)
    )
  }

  var dispatch = (enhance ||
    function(any) {
      return any
    })(function(action, props, obj) {
    return typeof action === "function"
      ? dispatch(action(state, props), obj || props)
      : isArray(action)
      ? typeof action[0] === "function"
        ? dispatch(
            action[0],
            typeof (action = action[1]) === "function" ? action(props) : action,
            props
          )
        : (batch(action.slice(1)).map(function(fx) {
            fx && fx[0](dispatch, fx[1], props)
          }, setState(action[0])),
          state)
      : setState(action)
  })

  var render = function() {
    lock = false
    if (subscriptions) {
      subs = patchSubs(subs, batch(subscriptions(state)), dispatch)
    }
    if (view) {
      node = patch(
        node.parentNode,
        node,
        vdom,
        typeof (vdom = view(state)) === "string" ? createTextVNode(vdom) : vdom,
        listener
      )
    }
  }

  dispatch(props.init)
}


  return {
    h,
    app,
  }
})()

// magic
const C = n => (props = {}, c = false) => {
  const is = (ele, ...types) => types.some(type => type === typeof ele)
  if (!c) {
    if (is(props, 'string', 'number', 'function') || Array.isArray(props)) {
      c = props
      props = {}
    } else if (is(props.View, 'function')) {
      c = props.View
      props = {}
    }
  }
  return h(n, props, c)
}
const Page = ({ page, state }) =>
  div(
    {
      class: 'Wrapper',
      oncreate: () => {
        if (typeof window !== 'undefined' && actions && actions.go) {
          window.addEventListener('popstate', actions.go)
        }
      },
    },
    [
      Header({ state }),
      div({ class: 'Page' }, page ? page({ state }) : '404 - not found'),
      Footer({ state }),
    ],
  )
const Menu = ({ items, hash, url, root, ...props }) => {
  let { class: cl = 'Menu', collapse = true } = props
  if (!items.length) {
    return
  }
  if (hash) {
    url += `#${hash}`
  }
  return nav({ class: cl }, ul(items.map(i => MenuItem({ ...i, url, root, collapse }))))
}
const MenuItem = ({
  url,
  text,
  items = [],
  parentTo = undefined,
  collapse,
  root,
  ...item
}) => {
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }
  const p = {
    class: 'MenuItem',
  }
  if (parentTo) {
    const isExternal = item.to.includes('://')
    const isAbsolute = item.to.startsWith('/')
    const startsLikeParent = !parentTo || item.to.startsWith(parentTo)
    if (!startsLikeParent && !isAbsolute && !isExternal) {
      if (!parentTo.endsWith('/') && !item.to.startsWith('-')) {
        parentTo = `${parentTo}/`
      }
      item.to = parentTo + item.to
    }
  }
  item.to = item.to.startsWith(root) ? item.to : `${root}${item.to.substr(1)}`
  const active = url.startsWith(item.to)
  if (url === item.to) {
    p.class += ' active'
  }
  let children = []
  if ((items.length && active) || !collapse) {
    children = ul(items.map(i => MenuItem({ parentTo: item.to, url, root, collapse, ...i })))
  }
  return li(p, [item.to ? Link(item, text) : span(item, text), children])
}
const Link = ({ to, ...p }, children) => {
  const { href, text, nofollow, noreferrer, onclick, ...props } = p
  to = to || href || ''
  props.href = to
  if (to && to.startsWith('/') && !to.startsWith(`//`)) {
    props.onclick = e => {
      if (onclick) {
        return [onclick, { e, to }]
      }
      return [actions.go, { e, to }]
    }
  } else {
    props.target = '_blank'
    props.rel = 'noopener'
    if (nofollow) {
      props.rel += ' nofollow'
    }
    if (noreferrer) {
      props.rel += ' noreferrer'
    }
  }
  return a(props, [text, children])
}
const Footer = () =>
  footer({ class: 'Footer' }, [
    div({ class: 'Container' }, [
      'made with a few bits of ',
      Link({ to: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
    ]),
  ])
const Magic = page => (state, actions) =>
  div(
    { id: 'magic' },
    div(
      {
        class: 'wrapper',
        oncreate: () => {
          if (typeof window !== 'undefined' && actions.go) {
            window.addEventListener('popstate', actions.go)
          }
        },
      },
      [
        Header,
        page
          ? div({ class: 'page' }, page(state, actions))
          : div({ class: 'page' }, '404 - not found'),
        Footer,
      ],
    ),
  )
const Header = ({ state }) =>
  (state.logo || state.menu || state.tagline) &&
  header({ class: 'Header' }, [
    (state.logo || state.logotext) &&
      Link({ to: '/', class: 'LogoWrapper' }, [
        state.logo && Img({ class: 'Logo', src: state.logo }),
        state.logotext && span({ class: 'LogoText' }, state.logotext),
      ]),
    state.menu && Menu({ ...state, items: state.menu }),
  ])
const Img = props => {
  if (typeof props === 'string') {
    props = {
      src: props,
    }
  }
  if (!props.src) {
    return
  }
  if (!props.alt) {
    if (props.title) {
      props.alt = props.title
    } else {
      props.role = 'presentation'
      props.alt = ''
    }
  }
  return img(props)
}
const a = C('a')
const abbr = C('abbr')
const address = C('address')
const area = C('area')
const article = C('article')
const aside = C('aside')
const audio = C('audio')
const b = C('b')
const bdi = C('bdi')
const bdo = C('bdo')
const blockquote = C('blockquote')
const br = C('br')
const button = C('button')
const canvas = C('canvas')
const caption = C('caption')
const cite = C('cite')
const code = C('code')
const col = C('col')
const colgroup = C('colgroup')
const data = C('data')
const datalist = C('datalist')
const dd = C('dd')
const del = C('del')
const details = C('details')
const dfn = C('dfn')
const dialog = C('dialog')
const div = C('div')
const dl = C('dl')
const dt = C('dt')
const em = C('em')
const embed = C('embed')
const fieldset = C('fieldset')
const figcaption = C('figcaption')
const figure = C('figure')
const footer = C('footer')
const form = C('form')
const h1 = C('h1')
const h2 = C('h2')
const h3 = C('h3')
const h4 = C('h4')
const h5 = C('h5')
const h6 = C('h6')
const header = C('header')
const hr = C('hr')
const i = C('i')
const iframe = C('iframe')
const img = C('img')
const input = C('input')
const ins = C('ins')
const kbd = C('kbd')
const label = C('label')
const legend = C('legend')
const li = C('li')
const main = C('main')
const map = C('map')
const mark = C('mark')
const menu = C('menu')
const menuitem = C('menuitem')
const meter = C('meter')
const nav = C('nav')
const object = C('object')
const ol = C('ol')
const optgroup = C('optgroup')
const option = C('option')
const output = C('output')
const p = C('p')
const param = C('param')
const picture = C('picture')
const pre = C('pre')
const progress = C('progress')
const q = C('q')
const rp = C('rp')
const rt = C('rt')
const rtc = C('rtc')
const ruby = C('ruby')
const s = C('s')
const samp = C('samp')
const section = C('section')
const select = C('select')
const small = C('small')
const source = C('source')
const span = C('span')
const strong = C('strong')
const sub = C('sub')
const summary = C('summary')
const sup = C('sup')
const table = C('table')
const tbody = C('tbody')
const td = C('td')
const textarea = C('textarea')
const tfoot = C('tfoot')
const th = C('th')
const thead = C('thead')
const time = C('time')
const tr = C('tr')
const track = C('track')
const u = C('u')
const ul = C('ul')
const video = C('video')
const wbr = C('wbr')
const svg = C('svg')
const g = C('g')
const circle = C('circle')
const ellipse = C('ellipse')
const rect = C('rect')
const polygon = C('polygon')
const path = C('path')
const defs = C('defs')
const linearGradient = C('linearGradient')
const stop = C('stop')
const text = C('text')
const html = C('html')
const head = C('head')
const title = C('title')
const meta = C('meta')
const link = C('link')
const body = C('body')
const script = C('script')
const description = C('description')
const Mod = state =>
  div({ class: 'Mod' }, [
    h3('Mod.Mod'),
    p([
      'this is Mod. it gets loaded from ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
    ]),
    p([
      'and imported in ',
      Link({ to: 'https://github.com/magic/core/example/assets/index.js' }, '/assets/index.js'),
    ]),
    p(['the state of this module: ', JSON.stringify(state.module)]),
  ])
const Component = props => () => {
  props = typeof props === 'string' ? { header: props } : props
    const header = props.header || props.title
  return div({ class: 'ModComponent' }, [
    header && h5(header),
    p([
      'Mod.Component, a second component in ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.mjs' }, '/assets/module.mjs'),
    ]),
  ])
}
const GitBadges = props => {
    if (typeof props === 'string') {
    props = {
      project: props,
    }
  } else if (!props.project) {
    return
  }
  const { project = false, branch = 'master', host = 'github' } = props
  // this pattern allows capture of props that are set to false and intended to hide badges.
  // it will also make every undefined prop[serviceName] default to project
  const urls = [
    [
      'npm',
      (v = project) =>
        v && {
          to: `https://www.npmjs.com/package/@${v}`,
          src: `https://img.shields.io/npm/v/@${v}.svg`,
        },
    ],
    [
      'travis',
      (v = project) =>
        v && {
          to: `https://travis-ci.com/${v}`,
          src: `https://travis-ci.com/${v}.svg?branch=${branch}`,
        },
    ],
    [
      'appveyor',
      (v = project) => {
        if (v) {
          let [org, repo] = v.split('/')
          org = org.replace(/-/g, '')
          return {
            to: `https://ci.appveyor.com/project/${org}/${repo}/branch/${branch}`,
            src: `https://img.shields.io/appveyor/ci/${org}/${repo}/${branch}.svg`,
          }
        }
      },
    ],
    [
      'coveralls',
      (v = project) => ({
        to: `https://coveralls.io/${host}/${v}`,
        src: `https://img.shields.io/coveralls/${host}/${v}/${branch}.svg`,
      })
    ],
    [
      'greenkeeper',
      (v = project) =>
        v && {
          to: `https://greenkeeper.io`,
          src: `https://badges.greenkeeper.io/${v}.svg`,
        },
    ],
    [
      'snyk',
      (v = project) =>
        v && {
          to: `https://snyk.io/test/${host}/${v}`,
          src: `https://img.shields.io/snyk/vulnerabilities/github/${v}.svg`,
          // src: `https://img.shields.io/snyk/vulnerabilities/npm/${v}.svg`,
        },
    ],
  ]
    .map(([name, fn]) => fn(props[name]))
    .filter(a => a.to && a.src)
  // no badges to show
  if (!urls.length) {
    return
  }
  return ul({ class: 'GitBadges' }, urls.map(({ to, src }) => li([Link({ to }, Img({ src }))])))
}
const GitList = props => {
  let { items = [], org, host = 'github', header, desc = props.description } = props
    const p = {}
  if (!props.class) {
    p.class = 'GitList'
  } else if (!props.class.includes('GitList')) {
    p.class = `GitList ${props.class}`
  }
  if (props.id) {
    p.id = props.id
  } else {
    p.id = org
  }
  if (!p.id.startsWith('gl')) {
    p.id = `gl-${p.id}`
  }
  return div(p, [
    header && h2(header),
    desc && div({ class: 'description' }, desc),
    ul({ id: `${p.id}-ul` }, [items.map(i => Item({ org, id: `${p.id}-li`, host, ...i }))]),
  ])
}
const Item = props => {
  const { name, org, id, host } = props
    const desc = props.desc || props.description
  return li({ id: `${id}-${name}`, class: 'GitListItem' }, [
    h3([Link({ to: `https://${host}.com/${org}/${name}` }, `@${org}/${name}`)]),
    desc && p(desc),
    GitBadges(`${org}/${name}`),
    Link({ to: `https://${org}.${host}.io/${name}` }, 'docs / demo'),
  ])
}
const ModuleList = (props = {}) =>
    GitList({
    class: 'ModuleList',
    org: 'magic-modules',
    header: [Link({ to: 'https://magic-modules/github.io' }, '@magic-modules')],
    description: [
      'modules are the grimoires of ',
      Link({ to: 'https://magic.github.io/core' }, '@magic'),
    ],
    items: [
      {
        name: 'language-switch',
        description:
          'LanguageSwitch provides file hierarchy based multilanguage support for magic.',
      },
      {
        name: 'video-embed',
        description: [
          'VideoEmbed embeds videos from any video hoster using iframes. ',
          ' comes with default support for vimeo and youtube.',
        ],
      },
      {
        name: 'sound-cloud',
        description: 'embed soundcloud track, playlist and user widgets',
      },
      {
        name: 'module-list',
        description: 'ModuleList shows the list of @magic-modules you are looking at.',
      },
      {
        name: 'theme-list',
        description: 'ThemeList shows a list of all @magic-themes.',
      },
      {
        name: 'library-list',
        description: 'LibraryList shows a list of all @magic-libraries libraries.',
      },
      {
        name: 'pre',
        description: 'Pre allows you to display javascript code with syntax highlighting.',
      },
      {
        name: 'git-badges',
        description: 'GitBadges shows a list of github repository status badges.',
      },
      {
        name: 'git-list',
        description: 'show a list of git repositories like the one you are looking at.',
      },
    ],
    // overload
    ...props,
  })
const LibraryList = (props = {}) =>
    GitList({
    org: 'magic-libraries',
    header: [Link({ to: 'https://magic-libraries.github.io' }, '@magic-libraries')],
    desc: ['below is a collection of the available @magic client libraries.'],
    items: [
      {
        name: 'json',
        description: [
          'the @magic-libraries/json module parses and stringifies json.',
          ' it also returns errors instead of throwing them.',
        ],
      },
      {
        name: 'is',
        description: 'the @magic-libraries/is module unifies the javascript type testing apis.',
      },
      {
        name: 'uri',
        description: [
          'the @magic-libraries/uri module ',
          ' encodes objects to uri strings and decodes uri strings to objects.',
        ],
      },
    ],
    ...props,
  })
const Pre = props => {
  if (typeof props === 'string') {
    props = {
      content: props,
      theme: 'light',
      fixed: !!props.theme,
    }
  }
    const { theme, content, fixed } = props
  return div({ class: `Pre ${theme}` }, [
    div({ class: 'menu' }, [
      !fixed &&
        button({ onclick: [actions.pre.changeTheme] }, theme === 'dark' ? 'light' : 'dark'),
      button({ onclick: [actions.pre.clip, content] }, 'copy'),
    ]),
    pre(LIB.Pre.format(content)),
  ])
}
const ThemeList = (props = {}) =>
    GitList({
    org: 'magic-themes',
    header: [Link({ to: 'https://magic-themes.github.io' }, '@magic-themes')],
    desc: ['below is a collection of the available @magic app themes.'],
    items: [
      {
        name: 'docs',
        description: 'the @magic documentation theme. used in all @magic docs.',
      },
    ],
    ...props,
  })
const initialState =   {
  'url': '/core/',
  'root': '/core/',
  'app':     {
    'title': 'Custom App Title',
    'description': 'Custom App Description'
    }
,
  'menu': [      {
      'to': '/concepts/',
      'text': 'concepts',
      'items': [          {
          'to': '/concepts/#modules',
          'text': 'modules'
          }
,          {
          'to': '#state',
          'text': 'state',
          'items': [              {
              'to': '-example',
              'text': 'example state'
              }
]
          }
,          {
          'to': '#actions',
          'text': 'actions',
          'items': [              {
              'to': '-example',
              'text': 'example actions'
              }
]
          }
,          {
          'to': '#views',
          'text': 'views',
          'items': [              {
              'to': '-example',
              'text': 'example view'
              }
]
          }
,          {
          'to': '#styles',
          'text': 'styles',
          'items': [              {
              'to': '-example',
              'text': 'example styles'
              }
,              {
              'to': '-magic-css',
              'text': '@magic/css'
              }
]
          }
,          {
          'to': '#globals',
          'text': 'global',
          'items': [              {
              'to': '-example',
              'text': 'example global'
              }
]
          }
,          {
          'to': '#lambdas',
          'text': 'server lambdas',
          'items': [              {
              'to': '-example',
              'text': 'single lambda'
              }
,              {
              'to': '-example-multi',
              'text': 'multiple lambdas'
              }
]
          }
,          {
          'to': '#libs',
          'text': 'external libs',
          'items': [              {
              'to': '-dir-or-file',
              'text': 'lib dir or file'
              }
,              {
              'to': '-example-file',
              'text': 'example lib file'
              }
,              {
              'to': '-app',
              'text': 'app.lib'
              }
,              {
              'to': '-module',
              'text': 'module.lib'
              }
]
          }
,          {
          'to': '/concepts/#full-example',
          'text': 'example'
          }
]
      }
,      {
      'to': '/files/',
      'text': 'files & directories',
      'items': [          {
          'to': '#pages',
          'text': '/pages',
          'items': [              {
              'to': '-dir-structure',
              'text': 'url mapping'
              }
,              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#assets',
          'text': '/assets',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '/files/#static',
          'text': '/assets/static'
          }
,          {
          'to': '#themes',
          'text': '/assets/themes',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#app',
          'text': '/assets/app.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#config',
          'text': '/config.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#menu',
          'text': '/assets/Menu.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
]
      }
,      {
      'to': '/modules/',
      'text': 'modules',
      'items': [          {
          'to': '#definition',
          'text': 'definition'
          }
,          {
          'to': '#usage',
          'text': 'usage'
          }
,          {
          'to': '#custom-module',
          'text': 'custom modules'
          }
,          {
          'to': '#preinstalled',
          'text': 'preinstalled'
          }
,          {
          'to': '#menu',
          'text': 'menu',
          'items': [              {
              'to': '-props',
              'text': 'props'
              }
,              {
              'to': '-sub-menus',
              'text': 'sub menus'
              }
]
          }
,          {
          'to': '#link',
          'text': 'link'
          }
,          {
          'to': '#footer',
          'text': 'footer'
          }
,          {
          'to': '#gl-magic-modules',
          'text': '@magic-modules'
          }
]
      }
,      {
      'to': '/themes/',
      'text': 'themes',
      'items': [          {
          'to': '#gl-magic-themes',
          'text': '@magic-themes'
          }
]
      }
,      {
      'to': '/libraries/',
      'text': 'libraries',
      'items': [          {
          'to': '#require',
          'text': 'require from'
          }
,          {
          'to': '#require-assets',
          'text': '/assets/lib.js'
          }
,          {
          'to': '#require-app',
          'text': '/app.js'
          }
,          {
          'to': '#require-page',
          'text': 'modules / pages'
          }
,          {
          'to': '#example',
          'text': 'example'
          }
,          {
          'to': '#caveat',
          'text': 'caveat'
          }
,          {
          'to': '#gl-magic-libraries',
          'text': '@magic-libraries'
          }
]
      }
],
  'logo': '/logo.png',
  'logotext': '@magic',
  'pages':     {
    '/core/concepts/':       {
      'title': '@magic/core concepts',
      'description': '@magic/core conceptual information.'
      }
,
    '/core/files/':       {
      'title': '@magic/core files',
      'description': '@magic/core directory docs.'
      }
,
    '/core/':       {
      'title': '@magic/core docs',
      'description': '@magic/core documentation directory.'
      }
,
    '/core/libraries/':       {
      'title': '@magic/core library docs',
      'description': '@magic/core libraries allow you to include client side functionality in your app.'
      }
,
    '/core/modules/':       {
      'title': '@magic-modules',
      'description': '@magic-modules documentation.'
      }
,
    '/core/themes/':       {
      'title': '@magic-themes',
      'description': '@magic-theme docs.'
      }
    }
,
  'module':     {
    'test': 'testing'
    }
,
  'pre':     {
    'theme': 'light'
    }
  }
const actions =   {
  'pages':     {
    '/core/concepts/': undefined,
    '/core/files/': undefined,
    '/core/': undefined,
    '/core/libraries/': undefined,
    '/core/modules/': undefined,
    '/core/themes/': undefined,
    '/core/404/': undefined
    }
,
  'go': props => state => {
    // trigger event if history api does not exist
    if (typeof window === 'undefined' || !window.history) {
      return true
    }
    const { to } = props
    const e = props.e ? props.e : props
    e.preventDefault()
    let url = state.url
    let [uri, hash = ''] = url.split('#')
    // if we have clicked a link, we have a to
    if (to) {
      url = to.replace(window.location.origin, '')
      const [u, h = ''] = url.split('#')
      uri = u
      hash = !h || h === '/' ? '' : h
      const stateHash = state.hash ? `#${state.hash}` : window.location.hash
      const stateUrl = state.url + stateHash
      if (url !== stateUrl || hash !== stateHash) {
        window.history && window.history.pushState({ uri }, '', url)
        if (!hash) {
          window.scrollTo(0, 0)
        }
      }
    } else {
      // in case of popstate events firing, we do not have props.to
      // but instead the e is a history event
      if (e.state) {
        uri = e.state.uri
      } else {
        uri = '/'
      }
    }
    // window exists for sure, but make sure window.location also does
    if (window.location && hash) {
      const target = document.getElementById(hash)
      if (target) {
        const top = target.offsetTop
        window.scrollTo(0, top)
        window.location.hash = hash
      }
    }
    return {
      url: uri,
      hash,
      prev: state.url,
    }
  },
  'pre':     {
    'pre':       {
      'changeTheme': state => ({
      ...state,
      theme: state.theme === 'dark' ? 'light' : 'dark',
    }),
      'clip': content => {
      if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
        const copy = document.createElement('textarea')
        copy.id = 'copy'
        copy.innerHTML = content
        document.body.appendChild(copy)
        const child = document.getElementById('copy')
        child.select()
        document.execCommand('copy')
        document.body.removeChild(child)
      }
    }
      }
    }
  }

const effects =   {
  'pages':     {
    '/core/concepts/': undefined,
    '/core/files/': undefined,
    '/core/': undefined,
    '/core/libraries/': undefined,
    '/core/modules/': undefined,
    '/core/themes/': undefined,
    '/core/404/': undefined
    }
  }

const subscriptions =   {
  'pages':     {
    '/core/concepts/': undefined,
    '/core/files/': undefined,
    '/core/': undefined,
    '/core/libraries/': undefined,
    '/core/modules/': undefined,
    '/core/themes/': undefined,
    '/core/404/': undefined
    }
  }
const pages = {
  '/core/': state => [
  h1(state.title),
  div([
    h2('welcome to the magic docs.'),
    p('the goal of this document is to give you a rough @magical overview.'),
    GitBadges('magic/core'),
    h2({ id: 'philosophy' }, 'philosophy'),
    p([
      '@magic aims to make it easy to stitch together any kind of webapp.',
      ' by providing simple, well documented and self contained modules,',
      ' @magic makes it possible to create stunningly fast webpages.',
    ]),
    h2({ id: 'privacy' }, 'privacy'),
    p([
      "@magic does not spy on it's users.",
      ' we not only try to be legally compliant,',
      ' but additionally to be ethical and do the right thing for your users.',
    ]),
    h2({ id: 'buzzwords' }, 'why should i use magic?'),
    h3('@magic is tiny'),
    p([
      '~4 kb javascript boilerplate.',
      ' usually, all the javascript in your homepage will be 30-60kb big (after unpacking),',
      ' 10-30kb get transmitted from the server to the client.',
      ' this complete documentation page you are reading with all sub pages loads about 50kb of unpacked,',
      ' 15kb of gzipped javascript. (values may be out of date and depend on cdn settings)',
    ]),
    h3('@magic works without javascript'),
    p([
      'most of the functionality works without javascript,',
      " buttons and realtime user interactions obviously won't.",
    ]),
    h3('@magic generates static pages'),
    p(['this makes free hosting (using github or gitlab pages) possible.', " and it's easy."]),
    p([
      '@magic publishes to ',
      Link({ to: 'https://github.com' }, 'github'),
      ', ',
      Link({ to: 'https://gitlab.com' }, 'gitlab'),
      ' and any other git-pages enabled hosting service.',
    ]),
    h3('serverless / faas'),
    p([
      'automagically generates ',
      ' serverless lambdas, derived from the ',
      Link({ to: 'https://github.com/magic-modules/' }, '@magic-modules'),
      ' you use in your pages.',
      ' this makes visitor statistics, user authentication and authorization, chat, and all other server side services possible.',
    ]),
  ]),
],
  '/core/404/': () => div('404 - not found'),
  '/core/concepts/': state => {
  const example = {
    state: `
// state variables can be anything you can JSON.stringify()
state: {
  variable: true,
  args: 'none',
}`,
    actions: `
// actions are an object containing functions.
// if an action returns an object, this object gets merged into the state
actions: {
  changeVariable: args => state => ({
    variable: !state.variable,
    args,
  }),
  callActionInAction: () => async (state, actions) => {
    // just await something inside an action to create an async action
    await new Promise(resolve => {
      setTimeout(resolve, 200)
    })
    // actions can call other actions
    actions.changeVariable('arg passed to function')
  },
}`,
    global: `
global: {
  state: {
    variable: true,
    args: true,
  },
  actions: {
    callActionInAction: true,
    changeVariable: true,
  },
}`,
    view: `
View: (state, actions) => (
  div({ onclick: actions.callActionInAction }, state.variable)
)`,
    style: `
style: {
  '.className': {
    color: 'green',
    // expands to .className:hover because of the &
    '&:hover': {
      color: 'orange',
    },
    // expands to .className .childClass
    '.childClass': {
      color: 'blue',
    },
  },
  // css ids
  '#id': {
    color: 'yellow',
  },
  // default html tag styles
  div: {
    color: 'black',
  },
}`,
    server: `
server: (req, res) => {
  const { name } = req.body
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end(\`hello, \${name}\`)
}`,
    complexServer: `
server: {
  index: (req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('index route')
  },
  route: (req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('api route')
  },
}`,
    lib: `
lib: {
  local: require.resolve('./lib/local.js'),
  npm: 'npm-lib',
}`,
  }
  const indent = str =>
    str
      .split('\n')
      .map(s => `  ${s}`)
      .join('\n')
  const combined = `
const exampleModule = {
  ${indent(example.state)},
  ${indent(example.actions)},
  ${indent(example.style)},
  ${indent(example.view)},
  ${indent(example.global)},
  ${indent(example.lib)},
  ${indent(example.server)},
}`
  return [
    h1(state.title),
    p('magic concepts. These are the building blocks of every module in a magic app'),
    div([
      h2({ id: 'modules' }, '@magic-modules'),
      p('modules are the main building block of magic.'),
      p([
        'a page is a module, a button is a module, a link is a module, an image is a module.',
        ' a @magic app contains modules containing modules that contain modules.',
        ' this can lead to inception.',
      ]),
    ]),
    div([
      h2({ id: 'state' }, 'state'),
      div([
        p('state is a javascript object.'),
        p('state can be mutated by actions.'),
        p('every rendering step, the state determines the output of the view'),
        h3({ id: 'state-example' }, 'state example'),
        Pre(example.state),
      ]),
    ]),
    div([
      h2({ id: 'actions' }, 'actions'),
      p('actions are an object containing functions'),
      p('those functions get the state and actions and may return a new partial state.'),
      p('alternatively, you can call any action from within any other action.'),
      h3({ id: 'actions-example' }, 'actions example'),
      Pre(example.actions),
    ]),
    div([
      h2({ id: 'views' }, 'views'),
      p('views render the state to html'),
      p('whenever an action triggers a statechange, this statechange then triggers a view change.'),
      h3({ id: 'views-example' }, 'views example'),
      Pre(example.view),
    ]),
    div([
      h2({ id: 'styles' }, 'styles'),
      p('every module can have a style object attached to it.'),
      p('magic will automagically merge all styles into one global css file.'),
      p('in the future, it will also remove unused styles for you.'),
      p('style merge order from lowest to highest:'),
      p('module.style < page.style < app.style < theme.style'),
      h3({ id: 'styles-example' }, 'example styles'),
      Pre(example.style),
      h3({ id: 'styles-magic-css' }, '@magic/css'),
      p("internally, magic uses it's own css-in-js library."),
      p('to find out more, click the following link:'),
      Link({ to: 'https://magic.github.io/css/' }, '@magic/css'),
    ]),
    div([
      h2({ id: 'globals' }, 'global'),
      p('every module can set a global object, containing state and action properties.'),
      p(
        'every key in the mod.global object that is set to true gets merged into the main app state/actions.',
      ),
      h3({ id: 'globals-example' }, 'global example'),
      Pre(example.global),
    ]),
    div([
      h2({ id: 'lambdas' }, 'server lambdas'),
      p('this is the serverside magic.'),
      p('you can define functions that get transpiled into serverside lambdas.'),
      p('server side lambdas will be available for GET and POST requests.'),
      p([
        'the server side function signature is (req, res) => {},',
        ' as in any nodejs http server, with the addition of req.body being awaited before execution of the lambda.',
      ]),
      h3({ id: 'lambdas-example' }, 'single lambda'),
      Pre(example.server),
      h3({ id: 'lambdas-example-multi' }, 'multiple lambdas'),
      Pre(example.complexServer),
    ]),
    div([
      h2({ id: 'libs' }, 'external libs'),
      p([
        'what would javascript be without the millions of dependencies',
        ' that you can easily install and make the average webpage ',
        ' slow[ly] (pun intended) grow towards a footprint of 5 megabytes.',
      ]),
      p(
        'as the sarcastic remark might demonstrate, we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.',
      ),
      p([
        'magic has one external client side dependency, ',
        Link({ to: 'https://github.com/jorgebucharan/hyperapp' }, 'hyperapp'),
        ", [~400 lines that provide our ui state machine]. thats it. and it won't change.",
      ]),
      p('anyways, rant over. if you really need to use external packages, there is a way.'),
      p([
        'once there is a lib key in at least one component,',
        ' window.LIB (browser) and global.LIB (nodejs) will be set,',
        ' aliasing LIB as a global variable in both environments',
      ]),
      h3({ id: 'libs-dir-or-file' }, 'lib dir or file'),
      p([
        'if you need libraries in internally developed modules,',
        ' it might be easier to keep your library dependencies in a central place.',
        ' to achieve this, one can simply create /assets/lib.js and export an object from it.',
        ' the keys of the object are the function name, the values are the paths to the lib.js file.',
        ' to make sure resolution works, require.resolve has to be used for local libs.',
      ]),
      Pre(`
/assets/lib.js or /assets/lib/index.js
export default {
  local: require.resolve('./local.js'),
  npm: 'npm-lib',
}`),
      h3({ id: 'libs-example-file' }, 'example lib file'),
      Pre(`
// /assets/lib/local.js
export default name => \`hello, \${name}\``),
      h3({ id: 'libs-app' }, 'app.lib'),
      Pre(`
// /assets/app.js
export default {
  // ... other app props
    lib: {
    local: require.resolve('./lib'),
    npm: 'npm-lib',
  },
}`),
      h3({ id: 'libs-module' }, 'module.lib'),
      p('any page or module can export a lib key'),
      Pre(`
// /pages/page.js
// /assets/Module.js
export default {
  // ... other component / page properties and views\
  ${indent(example.lib)}
},
View: () => div(LIB.local('name')),
      }
      // renders
      <div>hello, name</div>`),
    ]),
    div([
      h2({ id: 'full-example' }, 'Full example'),
      p('If we assemble those pieces, we get the following:'),
      Pre(combined),
    ]),
  ]
},
  '/core/files/': state => {
  const examples = {
    page: `
export default {
  state: {
    variable: 'test',
  },
  actions: {
    changeVar: () => ({ variable: 'changed' }),
  },
  style: {
    '.cl': {
      color: 'green',
    },
  },
  View: state => div({ class: 'cl' }, [
    'this is the page content.',
    state.variable,
  ]),
}`,
    assets: `
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}`,
    app: `
export default {
  state: {
    globalStateVar: 'globally available',
  },
  actions: {
    globalAction: () => ({ globalStateVar: 'overwritten.' }),
  },
  style: {
    'body': {
      color: 'green',
    },
  },
}`,
    config: `
export default {
  ROOT: 'example',
  THEME: 'blue',
  WEB_ROOT: '/core/',
  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,
  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files
  CLIENT_LIB_NAME: 'magic',
}`,
    theme: `
export default {
  'body': {
    color: 'blue',
  },
}`,
  }
  return [
    h1(state.title),
    p('There are multiple magic files and directories.'),
    ul([
      li('/pages - files in the page directory map to urls in your app.'),
      li('/assets - custom components, @magic-modules get imported here'),
      li('/assets/static - static files'),
      li('/assets/themes - theme directory, @magic-themes get imported here'),
      li('/assets/lib.js - imports npm and local but external packages into your app'),
      li('/app.js - gets merged into the app, can set state, actions, style here'),
      li('/config.js - custom config for your app'),
      li('/assets/Menu.js - custom Menu for your app'),
    ]),
    h2({ id: 'pages' }, '/pages'),
    p('the pages dir contains the pages of your webapp.'),
    p([
      "each page has it's own state and actions, ",
      "but also inherits the global state and actions from the app and it's dependencies",
    ]),
    h3({ id: 'pages-dir-structure' }, 'pages directory to url map, for the domain mag.ic:'),
    Pre(`
/pages/index.js === http://mag.ic/
/pages/pageName.js === http://mag.ic/pageName/
/pages/page-name.js === http://mag.ic/page-name/
/pages/page_name.js === http://mag.ic/page_name/
/pages/dir/index.js === http://mag.ic/dir/
/pages/dir/name.js === http://mag.ic/dir/name/
`),
    h3({ id: 'pages-example' }, 'example page:'),
    Pre(examples.page),
    h2({ id: 'assets' }, '/assets'),
    p('the assets dir contains custom components of your app.'),
    p('you can additionally import @magic-modules here'),
    h3({ id: 'assets-example' }, 'example /assets/index.js'),
    Pre(examples.assets),
    h2({ id: 'static' }, '/assets/static'),
    p('the static dir contains all of your static assets.'),
    p('every file in this directory gets copied to the public dir.'),
    p('image and svg files get minified using imagemin'),
    p([
      'text and binary files get compressed using the optional ',
      Link({ to: 'https://github.com/jaeh/node-zopfli-es' }, 'node-zopfli-es'),
      ' (if it is installed)',
    ]),
    h2({ id: 'themes' }, '/assets/themes'),
    p('the themes directory contains... themes.'),
    p('at the moment this is file based, which means you have to manually import themes there.'),
    h3({ id: 'themes-example' }, 'example theme'),
    Pre(examples.theme),
    h2({ id: 'app' }, '/assets/app.js'),
    p('the /app.js file allows you to set global state, actions, and styles'),
    h3({ id: 'app-example' }, 'example /app.js'),
    Pre(examples.app),
    h2({ id: 'config' }, '/config.js'),
    p('the /config.js file allows you to set various aspects of your app'),
    h3({ id: 'config-example' }, 'example /config.js'),
    Pre(examples.config),
    h2({ id: 'menu' }, '/assets/Menu.js'),
    p('the /assets/Menu.js file allows you to replace the default Menu component'),
    h3({ id: 'menu-example' }, 'example /assets/Menu.js'),
    Link(
      { to: 'https://github.com/magic/core/blob/master/src/modules/Menu.js' },
      'Menu.js on github',
    ),
  ]
},
  '/core/libraries/': state => [
  h1(state.title),
  h3({ id: 'require' }, 'require'),
  h4({ id: 'require-assets' }, 'require in /assets/lib/index.js'),
  p(
    'if /assets/lib/index.js or /assets/lib.js exist, whatever those files export will be merged into LIB.',
  ),
  Pre(`
// /assets/lib/index.js or /assets/lib.js
export default {
  JSON: '@magic-libraries/json',
  // ./localLib resolves to /assets/lib/localLib.js
  localLib: require.resolve('./localLib'),
}`),
  h4({ id: 'require-app' }, 'require in /app.js'),
  p('if /assets/app.js exports a lib key, app.lib will be merged into LIB'),
  Pre(`
// /app.js
export default {
  // ... other app variables (state, actions, View etc)
  lib: {
    JSON: '@magic-modules/json',
    localLib: require.resolve('./assets/lib/localLib'),
  },
}`),
  h4({ id: 'require-page' }, 'require in pages or Modules'),
  p('if a page or Module exports a lib key, it will be merged into LIB'),
  Pre(`
// /pages/index.js
export default {
  // ... other page variables (state, actions, View etc)
  lib: {
    JSON: '@magic-modules/json',
    localLib: require.resolve('./assets/lib/localLib'),
  },
}`),
  h3({ id: 'example' }, 'example'),
  p(['first import the library, see ', Link({ to: '/libraries/#require' }, 'require')]),
  Pre("div(['LIB.test output: ', LIB.test('magic')])"),
  p('renders'),
  div([h4('LIB.test output: '), LIB.test('magic')]),
  div([h4('LIB.exportsTesting.testing output: '), LIB.exportsTesting.testing()]),
  h4({ id: 'caveat' }, 'caveat'),
  p([
    'all libs must either export a single object using module.exports ',
    ' OR using exports.key mappings. one OR the other.',
    ' when using exports.key to export, you will always get an object of your exports in LIB.',
    ' when using module.exports, structuring the LIB[name] object is up to you.',
  ]),
  LibraryList(),
],
  '/core/modules/': state => [
  h1(state.title),
  p('magic modules are predefined modules for webapps.'),
  h2({ id: 'definition' }, 'module definition:'),
  p('the minimal module is a function that returns some html.'),
  Pre(`
// /assets/ModuleName.js
// simplest module
export default () => div('hello, world')
// complete signature
export default (props, children) => (state, actions) => div('hello, world')
`),
  h2({ id: 'usage' }, 'usage'),
  p([
    'if the npm package name starts with @magic-modules/ or magic-module, it will get imported automagically.',
    ' the same is true for all uppercased files in your /assets directory.',
    ' in the rare case where you want to install a npm module that can not be found, you can import it in /assets/index.js',
  ]),
  Pre(`
// /assets/index.js
export default {
  // ...otherModules
  // load module from node_modules
  NpmModule: require('not-standard-named-magic-module-from-npm'),
}`),
  p(
    'after this, the module will be a global in your app and can be used like any other component.',
  ),
  Pre(`
// any page or module
export default () => div([
  'modules that do not need props can be used without calling them as a function ',
  Mod,
  'modules that need props: ',
  Mod(propObject),
`),
  h2({ id: 'custom-module' }, 'Mod and Mod.Component:'),
  Mod,
  Mod.Component({ title: 'Mod Component Title, passed via props' }),
  h3('Mod sourcecode:'),
  Pre(`const Mod = {
  View: state =>
    div({ class: 'Mod View' }, [
      h3('Mod.View'),
      p([
        'this is Mod.View. it gets loaded from ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/Mod.js' }, '/assets/Mod.js'),
      ]),
      p([
        'and imported in ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/index.js' }, '/assets/index.js'),
      ]),
      p(['the state of this module: ', JSON.stringify(state.module)]),
    ]),
  Component: () =>
    div({ class: 'Mod Component' }, [
      h3('Mod.Component'),
      p([
        'Mod.Component, a second component in ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/Mod.js' }, '/assets/Mod.js'),
      ]),
    ]),
  state: {
    module: {
      test: 'testing',
    },
  },
  style: {
    '.Mod': {
      margin: '0 0 1em',
      padding: '0.5em',
      border: '1px solid',
      h3: {
        margin: 0,
      },
      '&.View': {
        borderColor: 'green',
      },
      '&.Component': {
        borderColor: 'red',
      },
    },
  },
  global: {
    state: {
      module: true,
    },
  },
}
export default Mod`),
  h2({ id: 'check-props' }, 'check props'),
  p('@magic-modules can export a .props key with an array of prop types.'),
  p('more docs coming soon'),
  h2({ id: 'preinstalled' }, 'preinstalled magic modules'),
  p('magic has some preinstalled modules that will be used in most pages.'),
  h2({ id: 'app' }, 'app'),
  p(
    'this is the main app module. it has magically inherited properties and all of it is customizable.',
  ),
  p([
    'to add actions/state/style to the app you can just create an /assets/app.js file.',
    'the contents of this file get ',
    Link({ to: 'https://github.com/magic/deep', text: 'deep .merged' }),
    ' into the app',
  ]),
  Pre(`
// /assets/app.js
export default {
  state: {
    merge: 'gets merged into state',
  },
  actions: {
    mergedActions: () => ({ merge: 'merged action executed' }),
  },
  style: {
    body: {
      backgroundColor: 'white',
    },
  },
}
`),
  h2({ id: 'menu' }, 'menu'),
  p('the Menu module provides... menus.'),
  p([
    'just pass it a string which is the state key of the menu,',
    ' then add that menu to the /assets/app.js file.',
  ]),
  p([
    'by default, the menu will only show submenu items if their parent link is active.',
    ' to force submenu items to show at all times, just pass a collapse: false prop',
  ]),
  Pre(`
// assets/app.js
export default {
  state: {
    // ...state
    menuName: [
      { to: '/example-page', text: 'example page' },
      { to: 'https://example.com', text: 'example.com' },
      { to: 'https://example.com', nofollow: true, noreferrer: true, target: 'utopia', text: 'nofollow and noref" },
    ],
  },
  // ... rest of app.js
}`),
  p('then, in a page or module'),
  Pre(`
export default () => Menu({ name: 'menuName', collapse: false })
// output:
<nav class="Menu">
  <ul>
    <li>
      <a onclick="actions.go" href="{{ WEB_ROOT }}example-page">example page</a>
    </li>
    <li>
      <a href="https://example.com" target="_blank" rel="noopener">example.com</a>
    </li>
    <li>
      <a href="https://example.com" target="utopia" rel="noopener nofollow noreferrer">nofollow and noref</a>
    </li>
  </ul>
</nav>
}`),
  h3({ id: 'menu-props' }, 'Menu props'),
  p('the Menu module allows multiple props to be passed when instantiating the Menu'),
  Pre(`
Menu({
  collapse: false, // (default: true) menu will always show all submenu items
})`),
  h3({ id: 'menu-item-props' }, 'Menu.Item props'),
  p([
    'every MenuItem accepts props the same props as a link does.',
    ' additionally a MenuItem accepts a items prop with sub menu items.',
  ]),
  Pre(`
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [SubMenuItems],
  noreferrer: true, // set rel='noreferer'
  nofollow: true, // set rel='nofollow'
})`),
  h3({ id: 'menu-sub-menus' }, 'sub menus'),
  p('to define a submenu, simply define a .items array on the menu item'),
  Pre(`
// assets/app.js
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
  // ... rest of app.js
}`),
  h2({ id: 'link' }, 'link'),
  p('the link module allows you to link to things.'),
  Pre(`
// in any page or module View
export default () => [
  Link({ to: '/page', text: 'page' }),
  // output: <a href="/page" onclick="actions.go">page</a>
  Link({ to: 'https://example.com', text: 'page' }),
  // output: <a href="https://example.com" target="_blank" rel="noopener">page</a>
  Link({ to: '/page', text: 'page', nofollow: true, noreferrer: true }),
  // output: <a href="https://example.com" target="_blank" rel="nofollow noreferrer noopener">page</a>
  // you can also use children syntax instead of the text prop:
  Link({ to: '/' }, 'home'),
  // Link also supports # hash links
  Link({ to: '/#hash' }, 'home with hash'),
]`),
  h2({ id: 'img' }, 'img'),
  p('the img module adds some sane default values to your images.'),
  Pre(`
// in any page or module View
export default () => [
  Img('/image.png'),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png }),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png', alt: 'image description' }),
  // output: <img src="/image.png alt="image description" />
  Img({ src: '/image.png', title: 'image title', }),
  // output: <img src="/image.png" title="image title" alt="image title"/>
  Img({ src: '/image.png', title: 'image title', alt: 'image alt' }),
  // output: <img src="/image.png" title="image title" alt="image alt"/>
]`),
  h2({ id: 'footer' }, 'footer'),
  p('the footer module contains a small info text and a link to the magic github repository.'),
  p(
    'to overwrite this behaviour, just place a Footer.js file in your assets and require it in /assets/index.js.',
  ),
  Pre(`
// /assets/Footer.js:
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
`),
  ModuleList(),
],
  '/core/themes/': state => [
  h1(state.title),
  p(
    'magic themes are themes for magic apps. you decide which theme to load by specifying the theme name in config.THEME',
  ),
  Pre(`
// /config.js
export default {
  // ...rest of config,
  THEME: 'blue',
}
`),
  h2('theme load order'),
  p('themes get loaded from multiple places. last in the list overwrites earlier entries.'),
  Pre(`
/node_modules/@magic/core/src/themes/THEME/index.js
/node_modules/@magic-themes/THEME
// ...default module styles get inserted here
/assets/themes/THEME/index.js
`),
  h2({ id: 'magic-themes' }, 'list of magic themes'),
  ThemeList(),
],
}

const view = (state) => {
  const url = pages[state.url] ? state.url : '/404/'
  // used below, is kind of a global!
  const page = pages[url]
  // map pageState into state
  if (state.pages) {
    const pageState = state.pages[url]
    for (let key in pageState) {
      state[key] = pageState[key]
    }
  }
  return Page({ page, state })
}

app({
  init: () => (  {
  'url': '/core/',
  'root': '/core/',
  'app':     {
    'title': 'Custom App Title',
    'description': 'Custom App Description'
    }
,
  'menu': [      {
      'to': '/concepts/',
      'text': 'concepts',
      'items': [          {
          'to': '/concepts/#modules',
          'text': 'modules'
          }
,          {
          'to': '#state',
          'text': 'state',
          'items': [              {
              'to': '-example',
              'text': 'example state'
              }
]
          }
,          {
          'to': '#actions',
          'text': 'actions',
          'items': [              {
              'to': '-example',
              'text': 'example actions'
              }
]
          }
,          {
          'to': '#views',
          'text': 'views',
          'items': [              {
              'to': '-example',
              'text': 'example view'
              }
]
          }
,          {
          'to': '#styles',
          'text': 'styles',
          'items': [              {
              'to': '-example',
              'text': 'example styles'
              }
,              {
              'to': '-magic-css',
              'text': '@magic/css'
              }
]
          }
,          {
          'to': '#globals',
          'text': 'global',
          'items': [              {
              'to': '-example',
              'text': 'example global'
              }
]
          }
,          {
          'to': '#lambdas',
          'text': 'server lambdas',
          'items': [              {
              'to': '-example',
              'text': 'single lambda'
              }
,              {
              'to': '-example-multi',
              'text': 'multiple lambdas'
              }
]
          }
,          {
          'to': '#libs',
          'text': 'external libs',
          'items': [              {
              'to': '-dir-or-file',
              'text': 'lib dir or file'
              }
,              {
              'to': '-example-file',
              'text': 'example lib file'
              }
,              {
              'to': '-app',
              'text': 'app.lib'
              }
,              {
              'to': '-module',
              'text': 'module.lib'
              }
]
          }
,          {
          'to': '/concepts/#full-example',
          'text': 'example'
          }
]
      }
,      {
      'to': '/files/',
      'text': 'files & directories',
      'items': [          {
          'to': '#pages',
          'text': '/pages',
          'items': [              {
              'to': '-dir-structure',
              'text': 'url mapping'
              }
,              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#assets',
          'text': '/assets',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '/files/#static',
          'text': '/assets/static'
          }
,          {
          'to': '#themes',
          'text': '/assets/themes',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#app',
          'text': '/assets/app.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#config',
          'text': '/config.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
,          {
          'to': '#menu',
          'text': '/assets/Menu.js',
          'items': [              {
              'to': '-example',
              'text': 'example'
              }
]
          }
]
      }
,      {
      'to': '/modules/',
      'text': 'modules',
      'items': [          {
          'to': '#definition',
          'text': 'definition'
          }
,          {
          'to': '#usage',
          'text': 'usage'
          }
,          {
          'to': '#custom-module',
          'text': 'custom modules'
          }
,          {
          'to': '#preinstalled',
          'text': 'preinstalled'
          }
,          {
          'to': '#menu',
          'text': 'menu',
          'items': [              {
              'to': '-props',
              'text': 'props'
              }
,              {
              'to': '-sub-menus',
              'text': 'sub menus'
              }
]
          }
,          {
          'to': '#link',
          'text': 'link'
          }
,          {
          'to': '#footer',
          'text': 'footer'
          }
,          {
          'to': '#gl-magic-modules',
          'text': '@magic-modules'
          }
]
      }
,      {
      'to': '/themes/',
      'text': 'themes',
      'items': [          {
          'to': '#gl-magic-themes',
          'text': '@magic-themes'
          }
]
      }
,      {
      'to': '/libraries/',
      'text': 'libraries',
      'items': [          {
          'to': '#require',
          'text': 'require from'
          }
,          {
          'to': '#require-assets',
          'text': '/assets/lib.js'
          }
,          {
          'to': '#require-app',
          'text': '/app.js'
          }
,          {
          'to': '#require-page',
          'text': 'modules / pages'
          }
,          {
          'to': '#example',
          'text': 'example'
          }
,          {
          'to': '#caveat',
          'text': 'caveat'
          }
,          {
          'to': '#gl-magic-libraries',
          'text': '@magic-libraries'
          }
]
      }
],
  'logo': '/logo.png',
  'logotext': '@magic',
  'pages':     {
    '/core/concepts/':       {
      'title': '@magic/core concepts',
      'description': '@magic/core conceptual information.'
      }
,
    '/core/files/':       {
      'title': '@magic/core files',
      'description': '@magic/core directory docs.'
      }
,
    '/core/':       {
      'title': '@magic/core docs',
      'description': '@magic/core documentation directory.'
      }
,
    '/core/libraries/':       {
      'title': '@magic/core library docs',
      'description': '@magic/core libraries allow you to include client side functionality in your app.'
      }
,
    '/core/modules/':       {
      'title': '@magic-modules',
      'description': '@magic-modules documentation.'
      }
,
    '/core/themes/':       {
      'title': '@magic-themes',
      'description': '@magic-theme docs.'
      }
    }
,
  'module':     {
    'test': 'testing'
    }
,
  'pre':     {
    'theme': 'light'
    }
  }
),
  view,
  node: document.getElementById("Magic")
})