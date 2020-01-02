"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _ref = function () {
  var RECYCLED_NODE = 1;
  var LAZY_NODE = 2;
  var TEXT_NODE = 3;
  var EMPTY_OBJ = {};
  var EMPTY_ARR = [];
  var map = EMPTY_ARR.map;
  var isArray = Array.isArray;
  var defer = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout;

  var createClass = function createClass(obj) {
    var out = "";
    if (typeof obj === "string") return obj;

    if (isArray(obj) && obj.length > 0) {
      for (var k = 0, tmp; k < obj.length; k++) {
        if ((tmp = createClass(obj[k])) !== "") {
          out += (out && " ") + tmp;
        }
      }
    } else {
      for (var k in obj) {
        if (obj[k]) {
          out += (out && " ") + k;
        }
      }
    }

    return out;
  };

  var merge = function merge(a, b) {
    var out = {};

    for (var k in a) {
      out[k] = a[k];
    }

    for (var k in b) {
      out[k] = b[k];
    }

    return out;
  };

  var batch = function batch(list) {
    return list.reduce(function (out, item) {
      return out.concat(!item || item === true ? 0 : typeof item[0] === "function" ? [item] : batch(item));
    }, EMPTY_ARR);
  };

  var isSameAction = function isSameAction(a, b) {
    return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function";
  };

  var shouldRestart = function shouldRestart(a, b) {
    if (a !== b) {
      for (var k in merge(a, b)) {
        if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true;
        b[k] = a[k];
      }
    }
  };

  var patchSubs = function patchSubs(oldSubs, newSubs, dispatch) {
    for (var i = 0, oldSub, newSub, subs = []; i < oldSubs.length || i < newSubs.length; i++) {
      oldSub = oldSubs[i];
      newSub = newSubs[i];
      subs.push(newSub ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1]) ? [newSub[0], newSub[1], newSub[0](dispatch, newSub[1]), oldSub && oldSub[2]()] : oldSub : oldSub && oldSub[2]());
    }

    return subs;
  };

  var patchProperty = function patchProperty(node, key, oldValue, newValue, listener, isSvg) {
    if (key === "key") {} else if (key === "style") {
      for (var k in merge(oldValue, newValue)) {
        oldValue = newValue == null || newValue[k] == null ? "" : newValue[k];

        if (k[0] === "-") {
          node[key].setProperty(k, oldValue);
        } else {
          node[key][k] = oldValue;
        }
      }
    } else if (key[0] === "o" && key[1] === "n") {
      if (!((node.actions || (node.actions = {}))[key = key.slice(2).toLowerCase()] = newValue)) {
        node.removeEventListener(key, listener);
      } else if (!oldValue) {
        node.addEventListener(key, listener);
      }
    } else if (!isSvg && key !== "list" && key in node) {
      node[key] = newValue == null ? "" : newValue;
    } else if (newValue == null || newValue === false || key === "class" && !(newValue = createClass(newValue))) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, newValue);
    }
  };

  var createNode = function createNode(vdom, listener, isSvg) {
    var ns = "http://www.w3.org/2000/svg";
    var props = vdom.props;
    var node = vdom.type === TEXT_NODE ? document.createTextNode(vdom.name) : (isSvg = isSvg || vdom.name === "svg") ? document.createElementNS(ns, vdom.name, {
      is: props.is
    }) : document.createElement(vdom.name, {
      is: props.is
    });

    for (var k in props) {
      patchProperty(node, k, null, props[k], listener, isSvg);
    }

    for (var i = 0, len = vdom.children.length; i < len; i++) {
      node.appendChild(createNode(vdom.children[i] = getVNode(vdom.children[i]), listener, isSvg));
    }

    return vdom.node = node;
  };

  var getKey = function getKey(vdom) {
    return vdom == null ? null : vdom.key;
  };

  var patch = function patch(parent, node, oldVNode, newVNode, listener, isSvg) {
    if (oldVNode === newVNode) {} else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
      if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
    } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
      node = parent.insertBefore(createNode(newVNode = getVNode(newVNode), listener, isSvg), node);

      if (oldVNode != null) {
        parent.removeChild(oldVNode.node);
      }
    } else {
      var tmpVKid;
      var oldVKid;
      var oldKey;
      var newKey;
      var oldVProps = oldVNode.props;
      var newVProps = newVNode.props;
      var oldVKids = oldVNode.children;
      var newVKids = newVNode.children;
      var oldHead = 0;
      var newHead = 0;
      var oldTail = oldVKids.length - 1;
      var newTail = newVKids.length - 1;
      isSvg = isSvg || newVNode.name === "svg";

      for (var i in merge(oldVProps, newVProps)) {
        if ((i === "value" || i === "selected" || i === "checked" ? node[i] : oldVProps[i]) !== newVProps[i]) {
          patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg);
        }
      }

      while (newHead <= newTail && oldHead <= oldTail) {
        if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
          break;
        }

        patch(node, oldVKids[oldHead].node, oldVKids[oldHead], newVKids[newHead] = getVNode(newVKids[newHead++], oldVKids[oldHead++]), listener, isSvg);
      }

      while (newHead <= newTail && oldHead <= oldTail) {
        if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
          break;
        }

        patch(node, oldVKids[oldTail].node, oldVKids[oldTail], newVKids[newTail] = getVNode(newVKids[newTail--], oldVKids[oldTail--]), listener, isSvg);
      }

      if (oldHead > oldTail) {
        while (newHead <= newTail) {
          node.insertBefore(createNode(newVKids[newHead] = getVNode(newVKids[newHead++]), listener, isSvg), (oldVKid = oldVKids[oldHead]) && oldVKid.node);
        }
      } else if (newHead > newTail) {
        while (oldHead <= oldTail) {
          node.removeChild(oldVKids[oldHead++].node);
        }
      } else {
        for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
          if ((oldKey = oldVKids[i].key) != null) {
            keyed[oldKey] = oldVKids[i];
          }
        }

        while (newHead <= newTail) {
          oldKey = getKey(oldVKid = oldVKids[oldHead]);
          newKey = getKey(newVKids[newHead] = getVNode(newVKids[newHead], oldVKid));

          if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
            if (oldKey == null) {
              node.removeChild(oldVKid.node);
            }

            oldHead++;
            continue;
          }

          if (newKey == null || oldVNode.type === RECYCLED_NODE) {
            if (oldKey == null) {
              patch(node, oldVKid && oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
              newHead++;
            }

            oldHead++;
          } else {
            if (oldKey === newKey) {
              patch(node, oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
              newKeyed[newKey] = true;
              oldHead++;
            } else {
              if ((tmpVKid = keyed[newKey]) != null) {
                patch(node, node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node), tmpVKid, newVKids[newHead], listener, isSvg);
                newKeyed[newKey] = true;
              } else {
                patch(node, oldVKid && oldVKid.node, null, newVKids[newHead], listener, isSvg);
              }
            }

            newHead++;
          }
        }

        while (oldHead <= oldTail) {
          if (getKey(oldVKid = oldVKids[oldHead++]) == null) {
            node.removeChild(oldVKid.node);
          }
        }

        for (var i in keyed) {
          if (newKeyed[i] == null) {
            node.removeChild(keyed[i].node);
          }
        }
      }
    }

    return newVNode.node = node;
  };

  var propsChanged = function propsChanged(a, b) {
    for (var k in a) {
      if (a[k] !== b[k]) return true;
    }

    for (var k in b) {
      if (a[k] !== b[k]) return true;
    }
  };

  var getTextVNode = function getTextVNode(node) {
    return _typeof(node) === "object" ? node : createTextVNode(node);
  };

  var getVNode = function getVNode(newVNode, oldVNode) {
    return newVNode.type === LAZY_NODE ? ((!oldVNode || oldVNode.type !== LAZY_NODE || propsChanged(oldVNode.lazy, newVNode.lazy)) && ((oldVNode = getTextVNode(newVNode.lazy.view(newVNode.lazy))).lazy = newVNode.lazy), oldVNode) : newVNode;
  };

  var createVNode = function createVNode(name, props, children, node, key, type) {
    return {
      name: name,
      props: props,
      children: children,
      node: node,
      type: type,
      key: key
    };
  };

  var createTextVNode = function createTextVNode(value, node) {
    return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, undefined, TEXT_NODE);
  };

  var recycleNode = function recycleNode(node) {
    return node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(node.nodeName.toLowerCase(), EMPTY_OBJ, map.call(node.childNodes, recycleNode), node, undefined, RECYCLED_NODE);
  };

  var Lazy = function Lazy(props) {
    return {
      lazy: props,
      type: LAZY_NODE
    };
  };

  var h = function h(name, props) {
    for (var vdom, rest = [], children = [], i = arguments.length; i-- > 2;) {
      rest.push(arguments[i]);
    }

    while (rest.length > 0) {
      if (isArray(vdom = rest.pop())) {
        for (var i = vdom.length; i-- > 0;) {
          rest.push(vdom[i]);
        }
      } else if (vdom === false || vdom === true || vdom == null) {} else {
        children.push(getTextVNode(vdom));
      }
    }

    props = props || EMPTY_OBJ;
    return typeof name === "function" ? name(props, children) : createVNode(name, props, children, undefined, props.key);
  };

  var app = function app(props) {
    var state = {};
    var lock = false;
    var view = props.view;
    var node = props.node;
    var vdom = node && recycleNode(node);
    var subscriptions = props.subscriptions;
    var subs = [];

    var listener = function listener(event) {
      dispatch(this.actions[event.type], event);
    };

    var setState = function setState(newState) {
      if (state !== newState) {
        state = newState;

        if (subscriptions) {
          subs = patchSubs(subs, batch([subscriptions(state)]), dispatch);
        }

        if (view && !lock) defer(render, lock = true);
      }

      return state;
    };

    var dispatch = (props.middleware || function (obj) {
      return obj;
    })(function (action, props) {
      return typeof action === "function" ? dispatch(action(state, props)) : isArray(action) ? typeof action[0] === "function" || isArray(action[0]) ? dispatch(action[0], typeof action[1] === "function" ? action[1](props) : action[1]) : (batch(action.slice(1)).map(function (fx) {
        fx && fx[0](dispatch, fx[1]);
      }, setState(action[0])), state) : setState(action);
    });

    var render = function render() {
      lock = false;
      node = patch(node.parentNode, node, vdom, vdom = getTextVNode(view(state)), listener);
    };

    dispatch(props.init);
  };

  return {
    h: h,
    app: app
  };
}(),
    h = _ref.h,
    app = _ref.app;

var C = function C(n) {
  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var is = function is(ele) {
      for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        types[_key - 1] = arguments[_key];
      }

      return types.some(function (type) {
        return type === _typeof(ele);
      });
    };

    if (!c) {
      if (is(props, 'string', 'number', 'function') || Array.isArray(props)) {
        c = props;
        props = {};
      } else if (is(props.View, 'function')) {
        c = props.View;
        props = {};
      } else if (props.props || props.c) {
        return h(n, {}, props);
      }
    }

    return h(n, props, c);
  };
};

var a = C('a');
var button = C('button');
var circle = C('circle');
var code = C('code');
var div = C('div');
var footer = C('footer');
var g = C('g');
var h1 = C('h1');
var h2 = C('h2');
var h3 = C('h3');
var h4 = C('h4');
var h5 = C('h5');
var header = C('header');
var img = C('img');
var input = C('input');
var label = C('label');
var li = C('li');
var link = C('link');
var main = C('main');
var meta = C('meta');
var nav = C('nav');
var p = C('p');
var path = C('path');
var pre = C('pre');
var script = C('script');
var span = C('span');
var svg = C('svg');
var title = C('title');
var ul = C('ul');
var view = C('view');
var initialState = {
  'blog': {
    '2019': {
      '12': {
        '22': [{
          'View': function View(state) {
            return BlogPost(state, [p('so i guess i should start using it...'), p(["it's pretty rough,\nthe index pages for yearly and monthly archives are not polished,\nbut can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app."]), p(["to use the blog,\ncreate an archive dir, for example"]), pre(code('src/blog/2019/12/22/')), p('then just add the blogposts in that directory structure.'), p(["@magic will automagically build a blog directory for you,\nincluding the archives for yearly, monthly and overall blog posts."]), p('more information following soon.')]);
          },
          'file': '/media/j/data/dev/magic/core/example/news/2019/12/22/blogging.mjs',
          'name': '/core/news/2019/12/22/blogging/',
          'path': '/core/news/2019/12/22/blogging/index.html',
          'state': {
            'description': '@magic has a blog now.',
            'title': 'blogging...'
          }
        }]
      }
    }
  },
  'gdpr': {
    'allowed': [],
    'show': true
  },
  'logo': "/core/logo.png",
  'logotext': '@magic',
  'menu': [{
    'items': [{
      'text': 'modules',
      'to': '#modules'
    }, {
      'text': 'state',
      'to': '#state'
    }, {
      'text': 'actions',
      'to': '#actions'
    }, {
      'text': 'views',
      'to': '#views'
    }, {
      'text': 'styles',
      'to': '#styles'
    }, {
      'text': 'global',
      'to': '#globals'
    }, {
      'text': 'server lambdas',
      'to': '#lambdas'
    }],
    'text': 'concepts',
    'to': '/concepts/'
  }, {
    'items': [{
      'items': [{
        'text': 'url mapping',
        'to': '-dir-structure'
      }, {
        'text': 'example',
        'to': '-example'
      }],
      'text': '/pages',
      'to': '#pages'
    }, {
      'items': [{
        'text': 'example',
        'to': '-example'
      }],
      'text': '/assets',
      'to': '#assets'
    }, {
      'text': '/assets/static',
      'to': '/files/#static'
    }, {
      'items': [{
        'text': 'example',
        'to': '-example'
      }],
      'text': '/assets/themes',
      'to': '#themes'
    }, {
      'items': [{
        'text': 'example',
        'to': '-example'
      }],
      'text': '/assets/app.mjs',
      'to': '#app'
    }, {
      'items': [{
        'text': 'example',
        'to': '-example'
      }],
      'text': '/config.mjs',
      'to': '#config'
    }],
    'text': 'files & directories',
    'to': '/files/'
  }, {
    'items': [{
      'text': 'definition',
      'to': '#definition'
    }, {
      'text': 'usage',
      'to': '#usage'
    }, {
      'text': '@magic-modules',
      'to': '#gl-magic-modules'
    }, {
      'text': 'custom modules',
      'to': '/example/'
    }, {
      'items': [{
        'items': [{
          'text': 'props',
          'to': '-props'
        }, {
          'text': 'sub menus',
          'to': '-sub-menus'
        }],
        'text': 'menu',
        'to': '#menu'
      }, {
        'text': 'link',
        'to': '#link'
      }, {
        'text': 'img',
        'to': '#img'
      }, {
        'text': 'footer',
        'to': '#footer'
      }, {
        'text': 'gdpr',
        'to': '#gdpr'
      }],
      'text': 'preinstalled',
      'to': '/preinstalled/'
    }, {
      'text': 'markdown',
      'to': '/markdown/'
    }, {
      'text': 'html',
      'to': '/html/'
    }],
    'text': 'modules',
    'to': '/modules/'
  }, {
    'items': [{
      'text': '@magic-themes',
      'to': '#gl-magic-themes'
    }],
    'text': 'themes',
    'to': '/themes/'
  }, {
    'items': [{
      'text': 'summary',
      'to': '#abstract'
    }, {
      'text': 'local file',
      'to': '#dir-or-file'
    }, {
      'text': 'libs from npm',
      'to': '#npm'
    }, {
      'text': 'example',
      'to': '#example'
    }, {
      'text': '@magic-libraries',
      'to': '#gl-magic-libraries'
    }],
    'text': 'libraries',
    'to': '/libraries/'
  }, {
    'text': 'news',
    'to': '/news/'
  }],
  'module': {
    'test': 'testing'
  },
  'pageClass': {},
  'pages': {
    '/core/': {
      'description': ['@magic/core documentation.', 'tells you why, how and when to use @magic.', 'also provides an overview of all @magic functionality this ecosystem provides.'],
      'title': '@magic/core docs'
    },
    '/core/concepts/': {
      'description': ['@magic/core conceptual information.', 'explains the main concepts that make the @magic work.'],
      'title': '@magic/core concepts'
    },
    '/core/files/': {
      'description': '@magic/core directory docs.',
      'title': '@magic/core files'
    },
    '/core/libraries/': {
      'description': '@magic/core libraries allow you to include client side functionality in your app.',
      'title': '@magic/core library docs'
    },
    '/core/modules/': {
      'description': '@magic-modules documentation.',
      'title': '@magic-modules'
    },
    '/core/modules/example/': {
      'description': '@magic-modules example module.',
      'title': '@magic-modules/example'
    },
    '/core/modules/html/': {
      'description': 'this module gets imported from a html file.',
      'title': 'html file example'
    },
    '/core/modules/markdown/': {
      'description': 'markdown file description',
      'title': 'markdown file example'
    },
    '/core/modules/preinstalled/': {
      'description': '@magic-modules documentation.',
      'title': '@magic-modules'
    },
    '/core/modules/propTypes/': {
      'description': '@magic-modules/propTypes documentation.',
      'title': '@magic-modules/propTypes'
    },
    '/core/news/2019/': {
      'year': '2019'
    },
    '/core/news/2019/12/': {
      'month': '12',
      'year': '2019'
    },
    '/core/news/2019/12/22/blogging/': {
      'description': '@magic has a blog now.',
      'title': 'blogging...'
    },
    '/core/themes/': {
      'description': '@magic-theme docs.',
      'title': '@magic-themes'
    }
  },
  'root': '/core/',
  'theme': 'dark',
  'url': '/core/'
};
var helpers = {
  'listenPopState': function listenPopState(dispatch, action) {
    var listener = function listener(e) {
      return dispatch(action, e);
    };

    addEventListener('popstate', listener);
    return function () {
      return removeEventListener('popstate', listener);
    };
  }
};

var BlogArchive = function BlogArchive(state) {
  return Object.entries(state.blog).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        year = _ref3[0];

    return BlogYear(_objectSpread({}, state, {
      year: year,
      link: state.url
    }));
  });
};

var BlogMonth = function BlogMonth(state) {
  var blog = state.blog,
      link = state.link,
      month = state.month,
      url = state.url,
      year = state.year;
  var months = Object.entries(blog[year][month]);
  var to;
  var title = [month];

  if (link) {
    to = "".concat(link).concat(month, "/");
  } else {
    title.push(' - ', year);
  }

  return [h3(to ? Link({
    to: to
  }, title) : title), months.map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        day = _ref5[0],
        posts = _ref5[1];

    return posts.map(function (post) {
      return BlogTeaser(_objectSpread({}, state, {}, post.state, {
        name: post.name,
        link: to,
        day: day
      }));
    });
  })];
};

var BlogPost = function BlogPost(state, children) {
  var url = state.url,
      title = state.title,
      description = state.description;

  var _url$split = url.split('/'),
      _url$split2 = _slicedToArray(_url$split, 7),
      _ = _url$split2[0],
      root = _url$split2[1],
      prefix = _url$split2[2],
      year = _url$split2[3],
      month = _url$split2[4],
      day = _url$split2[5],
      name = _url$split2[6];

  return [h2(title), p(description), children, h4('Blog Archives:'), p(Link({
    to: "/".concat(root, "/").concat(prefix, "/").concat(year, "/")
  }, "year: ".concat(year))), p(Link({
    to: "/".concat(root, "/").concat(prefix, "/").concat(year, "/").concat(month, "/")
  }, "month: ".concat(month, " ").concat(year)))];
};

var BlogTeaser = function BlogTeaser(state) {
  return div([h4([state.day, '-', state.month, '-', state.year, ' - ', Link({
    to: state.name
  }, state.title)]), p(state.description)]);
};

var BlogYear = function BlogYear(state) {
  var link = state.link,
      year = state.year,
      blog = state.blog,
      url = state.url;
  var to;

  if (link) {
    to = "".concat(link).concat(year, "/");
  } else if (url.endsWith("".concat(year, "/"))) {
    to = url;
  }

  return div([h2(link ? Link({
    to: to
  }, year) : year), Object.entries(blog[year]).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        month = _ref7[0],
        days = _ref7[1];

    return BlogMonth(_objectSpread({}, state, {
      month: month,
      days: days,
      link: to
    }));
  })]);
};

var Footer = function Footer(state) {
  var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return footer({
    "class": 'Footer'
  }, [div({
    "class": 'Container'
  }, [children, div({
    "class": 'Credits'
  }, ['made with a few bits of ', Link({
    to: 'https://github.com/magic/core',
    target: '_blank',
    rel: 'noopener'
  }, 'magic')])])]);
};

var Gdpr = function Gdpr(_ref8) {
  var _ref8$gdpr = _ref8.gdpr,
      gdpr = _ref8$gdpr === void 0 ? {} : _ref8$gdpr,
      _ref8$cookies = _ref8.cookies,
      cookies = _ref8$cookies === void 0 ? [] : _ref8$cookies;
  var show = gdpr.show,
      _gdpr$title = gdpr.title,
      title = _gdpr$title === void 0 ? 'Privacy Information' : _gdpr$title,
      _gdpr$content = gdpr.content,
      content = _gdpr$content === void 0 ? 'This app neither saves, collects, nor shares any data about you.' : _gdpr$content,
      _gdpr$noDataText = gdpr.noDataText,
      noDataText = _gdpr$noDataText === void 0 ? 'Awesome.' : _gdpr$noDataText,
      _gdpr$allowTitle = gdpr.allowTitle,
      allowTitle = _gdpr$allowTitle === void 0 ? 'Allow:' : _gdpr$allowTitle,
      _gdpr$allowAllText = gdpr.allowAllText,
      allowAllText = _gdpr$allowAllText === void 0 ? 'All' : _gdpr$allowAllText,
      _gdpr$allowText = gdpr.allowText,
      allowText = _gdpr$allowText === void 0 ? 'Selected' : _gdpr$allowText,
      _gdpr$denyText = gdpr.denyText,
      denyText = _gdpr$denyText === void 0 ? 'None' : _gdpr$denyText;

  if (!show) {
    return div({
      "class": 'Gdpr'
    }, svg({
      "class": 'ShowHide',
      onclick: [actions.gdpr.show, {
        show: true
      }],
      viewBox: '0 0 512 512'
    }, [g([path({
      d: "\nM507,208c-1-7-7-12-14-13c-7-1-13,3-16,9\nc-5,11-16,19-29,19c-14,0-26-10-30-23c-2-8-11-13-19-11\nC393,191,389,192,384,192c-35-0-64-29-64-64c0-5,1-9,2-14\nc2-8-3-16-11-19C297,90,288,78,288,64c-0-13,8-24,19-29\nc6-3,10-9,9-16c-1-7-6-12-13-14C288,2,272,0,256,0\nC115,0,0,115,0,256c0,141,115,256,256,256c141-0,256-115,256-256\nC512,239,510,224,507,209z M414,414C374,455,318,480,256,480s-118-25-158-66\nC57,374,32,318,32,256S57,138,98,98C138,57,194,32,256,32c3,0,6,0,9,0\nC259,42,256,52,256,64c0,24,13,44,33,55C288,122,288,125,288,128\nc0,53,43,96,96,96c3,0,6-0,8-0C403,242,424,256,448,256\nc11-0,22-3,32-8c0,3,0,6,0,9C480,318,455,374,414,414z\n"
    }), circle({
      cx: '192',
      cy: '128',
      r: '32'
    }), circle({
      cx: '128',
      cy: '256',
      r: '32'
    }), circle({
      cx: '288',
      cy: '384',
      r: '32'
    }), circle({
      cx: '272',
      cy: '272',
      r: '16'
    }), circle({
      cx: '400',
      cy: '336',
      r: '16'
    }), circle({
      cx: '176',
      cy: '368',
      r: '16'
    })])]));
  }

  var hasCookies = !!cookies.length;
  return div({
    "class": 'Gdpr'
  }, [input({
    type: 'checkbox',
    name: 'show-hide',
    id: 'show-hide',
    checked: !show
  }), div({
    "class": 'Container'
  }, [title && h3(title), content && p(content), hasCookies && [ul(cookies.map(function (_ref9) {
    var name = _ref9.name,
        title = _ref9.title,
        content = _ref9.content,
        _ref9$allowed = _ref9.allowed,
        allowed = _ref9$allowed === void 0 ? false : _ref9$allowed;
    return li({
      "class": 'Cookie'
    }, [input({
      type: 'checkbox',
      title: "allow ".concat(name, " data"),
      id: name,
      checked: gdpr.allowed.includes(name),
      onchange: [actions.gdpr.toggleAllow, {
        name: name
      }]
    }), (title || content) && label({
      "for": name
    }, [title && h4(title), content && p(content)])]);
  }))], hasCookies ? [h5(allowTitle), label({
    "class": 'button allow all',
    "for": 'show-hide',
    onclick: actions.gdpr.allow
  }, allowAllText), label({
    "class": 'button allow',
    "for": 'show-hide',
    onclick: actions.gdpr.close
  }, allowText), label({
    "class": 'button allow none',
    "for": 'show-hide',
    onclick: actions.gdpr.deny
  }, denyText)] : label({
    "class": 'button',
    "for": 'show-hide',
    onclick: actions.gdpr.close
  }, noDataText)])]);
};

var GitBadges = function GitBadges(props) {
  if (typeof props === 'string') {
    props = {
      project: props
    };
  } else if (!props.project) {
    return;
  }

  var _props = props,
      _props$project = _props.project,
      project = _props$project === void 0 ? false : _props$project,
      _props$branch = _props.branch,
      branch = _props$branch === void 0 ? 'master' : _props$branch,
      _props$host = _props.host,
      host = _props$host === void 0 ? 'github' : _props$host;
  var urls = [['npm', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;
    return v && {
      to: "https://www.npmjs.com/package/@".concat(v),
      src: "https://img.shields.io/npm/v/@".concat(v, ".svg")
    };
  }], ['travis', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;
    return v && {
      to: "https://travis-ci.com/".concat(v),
      src: "https://img.shields.io/travis/com/".concat(v, "/").concat(branch)
    };
  }], ['appveyor', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;

    if (v) {
      var _v$split = v.split('/'),
          _v$split2 = _slicedToArray(_v$split, 2),
          org = _v$split2[0],
          repo = _v$split2[1];

      org = org.replace(/-/g, '');
      return {
        to: "https://ci.appveyor.com/project/".concat(org, "/").concat(repo, "/branch/").concat(branch),
        src: "https://img.shields.io/appveyor/ci/".concat(org, "/").concat(repo, "/").concat(branch, ".svg")
      };
    }
  }], ['coveralls', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;
    return {
      to: "https://coveralls.io/".concat(host, "/").concat(v),
      src: "https://img.shields.io/coveralls/".concat(host, "/").concat(v, "/").concat(branch, ".svg")
    };
  }], ['greenkeeper', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;
    return v && {
      to: "https://greenkeeper.io",
      src: "https://badges.greenkeeper.io/".concat(v, ".svg")
    };
  }], ['snyk', function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : project;
    return v && {
      to: "https://snyk.io/test/".concat(host, "/").concat(v),
      src: "https://img.shields.io/snyk/vulnerabilities/github/".concat(v, ".svg")
    };
  }]].map(function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 2),
        name = _ref11[0],
        fn = _ref11[1];

    return fn(props[name]);
  }).filter(function (a) {
    return a.to && a.src;
  });

  if (!urls.length) {
    return;
  }

  return ul({
    "class": 'GitBadges'
  }, urls.map(function (_ref12) {
    var to = _ref12.to,
        src = _ref12.src;
    return li([Link({
      to: to
    }, Img({
      src: src
    }))]);
  }));
};

var GitList = function GitList(props) {
  var _props$items = props.items,
      items = _props$items === void 0 ? [] : _props$items,
      org = props.org,
      _props$host2 = props.host,
      host = _props$host2 === void 0 ? 'github' : _props$host2,
      header = props.header,
      _props$desc = props.desc,
      desc = _props$desc === void 0 ? props.description : _props$desc;
  var p = {};

  if (!props["class"]) {
    p["class"] = 'GitList';
  } else if (!props["class"].includes('GitList')) {
    p["class"] = "GitList ".concat(props["class"]);
  }

  if (props.id) {
    p.id = props.id;
  } else {
    p.id = org;
  }

  if (!p.id.startsWith('gl')) {
    p.id = "gl-".concat(p.id);
  }

  return div(p, [header && h2(header), desc && div({
    "class": 'description'
  }, desc), ul({
    id: "".concat(p.id, "-ul")
  }, [items.map(function (i) {
    return GitList.Item(_objectSpread({
      org: org,
      id: "".concat(p.id, "-li"),
      host: host
    }, i));
  })])]);
};

GitList.Item = function (props) {
  var name = props.name,
      org = props.org,
      id = props.id,
      host = props.host;
  var desc = props.desc || props.description;
  return li({
    id: "".concat(id, "-").concat(name),
    "class": 'GitListItem'
  }, [h3([Link({
    to: "https://".concat(host, ".com/").concat(org, "/").concat(name)
  }, "@".concat(org, "/").concat(name))]), desc && p(desc), GitBadges("".concat(org, "/").concat(name)), Link({
    to: "https://".concat(org, ".").concat(host, ".io/").concat(name)
  }, 'docs / demo')]);
};

var Header = function Header() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var logo = props.logo,
      menu = props.menu,
      logotext = props.logotext,
      state = _objectWithoutProperties(props, ["logo", "menu", "logotext"]);

  if (!logo && !menu && !logotext) {
    return;
  }

  return header({
    "class": 'Header'
  }, [(logo || logotext) && Link({
    to: state.root,
    "class": 'Logo'
  }, [logo && Img(logo), logotext && span(logotext)]), menu && Menu({
    state: state,
    items: menu
  }), children]);
};

var Img = function Img(props) {
  if (typeof props === 'string') {
    props = {
      src: props
    };
  }

  if (!props.src) {
    return;
  }

  if (!props.alt) {
    if (props.title) {
      props.alt = props.title;
    } else {
      props.role = 'presentation';
      props.alt = '';
    }
  }

  return img(props);
};

var LibraryList = function LibraryList() {
  return GitList({
    org: 'magic-libraries',
    header: [Link({
      to: 'https://magic-libraries.github.io'
    }, '@magic-libraries')],
    desc: ['below is a collection of the available @magic client libraries.'],
    items: [{
      name: 'db',
      description: 'key => value store using localstorage'
    }, {
      name: 'gql',
      description: ['the @magic-libraries/gql module', ' encodes template strings to graphql queries ready to be sent to a server.']
    }, {
      name: 'is',
      description: 'the @magic-libraries/is module unifies the javascript type testing apis.'
    }, {
      name: 'json',
      description: ['the @magic-libraries/json module parses and stringifies json.', ' it also returns errors instead of throwing them.']
    }, {
      name: 'uri',
      description: ['the @magic-libraries/uri module', ' encodes objects to uri strings and decodes uri strings to objects.']
    }]
  });
};

var LightSwitch = function LightSwitch() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return button({
    "class": 'LightSwitch',
    onclick: actions.changeTheme
  });
};

var Link = function Link(_ref13, children) {
  var to = _ref13.to,
      p = _objectWithoutProperties(_ref13, ["to"]);

  var href = p.href,
      text = p.text,
      nofollow = p.nofollow,
      noreferrer = p.noreferrer,
      props = _objectWithoutProperties(p, ["href", "text", "nofollow", "noreferrer"]);

  to = to || href || '';
  props.href = to;
  var isLocal = to[0] === '/' || to[0] === '#';

  if (isLocal) {
    props.onclick = [actions.go, lib.preventDefault];
  } else {
    props.target = '_blank';
    props.rel = 'noopener';

    if (nofollow) {
      props.rel += ' nofollow';
    }

    if (noreferrer) {
      props.rel += ' noreferrer';
    }
  }

  return a(props, [text, children]);
};

var Menu = function Menu() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$class = props["class"],
      className = _props$class === void 0 ? 'Menu' : _props$class,
      _props$collapse = props.collapse,
      collapse = _props$collapse === void 0 ? true : _props$collapse,
      items = props.items,
      state = props.state;
  var url = state.url,
      hash = state.hash,
      root = state.root;

  if (hash && !url.endsWith(hash)) {
    url += "#".concat(hash);
  }

  return nav({
    className: className
  }, ul(items.map(function (item) {
    return MenuItem(_objectSpread({}, item, {
      url: url,
      root: root,
      collapse: collapse
    }));
  })));
};

var MenuItem = function MenuItem(props) {
  var text = props.text,
      _props$items2 = props.items,
      items = _props$items2 === void 0 ? [] : _props$items2,
      url = props.url,
      root = props.root,
      _props$parentTo = props.parentTo,
      parentTo = _props$parentTo === void 0 ? undefined : _props$parentTo,
      collapse = props.collapse,
      item = _objectWithoutProperties(props, ["text", "items", "url", "root", "parentTo", "collapse"]);

  var p = {
    "class": {}
  };
  var to = item.to;

  if (to.startsWith('/#')) {
    to = to.substr(1);
  }

  var first = item.to[0];
  var isLocal = first === '/' || first === '-' || first === '#';

  if (parentTo && isLocal) {
    if (first === '-' || first === '#') {
      to = parentTo + to;
    } else {
      var start = to.split('/')[1];

      if (start) {
        var startsLikeParentEnds = parentTo.endsWith("/".concat(start, "/"));

        if (!startsLikeParentEnds && isLocal) {
          to = parentTo + to;
        }
      }
    }
  }

  var isRooted = to.startsWith(root);

  if (root && isLocal && !isRooted) {
    to = root + to;
  }

  item.to = to.replace(/\/\//g, '/');

  if (item.to === url) {
    p["class"].active = true;
  }

  var children = [];
  var active = url.startsWith(item.to) || !collapse;

  if (active) {
    children = ul(items.map(function (i) {
      return MenuItem(_objectSpread({
        parentTo: item.to,
        url: url,
        root: root,
        collapse: collapse
      }, i));
    }));
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children]);
};

var Mod = function Mod(state) {
  return div({
    "class": 'Mod'
  }, [h3('Mod.Mod'), p(['this is Mod. it gets loaded from ', Link({
    to: 'https://github.com/magic/core/blob/master/example/assets/module.mjs'
  }, '/assets/module.mjs')]), p(['the state of this module: ', JSON.stringify(state.module)])]);
};

Mod.Component = function (props) {
  props = typeof props === 'string' ? {
    header: props
  } : props;
  var header = props.header || props.title;
  return div({
    "class": 'ModComponent'
  }, [header && h5(header), p(['Mod.Component, a second component in ', Link({
    to: 'https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs'
  }, '/assets/modules/Mod.mjs')])]);
};

var ModuleList = function ModuleList() {
  return GitList({
    "class": 'ModuleList',
    org: 'magic-modules',
    header: [Link({
      to: 'https://magic-modules/github.io'
    }, '@magic-modules')],
    description: ['modules are the grimoires of ', Link({
      to: 'https://magic.github.io/core'
    }, '@magic'), '. modules add both client and server functionality to your @magic app.'],
    items: [{
      name: 'accordion',
      description: 'Accordion shows a list of items that horizontally open/close.'
    }, {
      name: 'gdpr',
      description: 'Gdpr compliant popup that allows users to allow or deny cookies.'
    }, {
      name: 'git-badges',
      description: 'GitBadges shows a list of github repository status badges.'
    }, {
      name: 'git-list',
      description: 'show a list of git repositories like the one you are looking at.'
    }, {
      name: 'hero',
      description: 'Hero modules are full screen top of page content.'
    }, {
      name: 'language-switch',
      description: ['LanguageSwitch provides', ' file hierarchy based multilanguage support for magic.']
    }, {
      name: 'light-switch',
      description: 'dark/light theme color switch button.'
    }, {
      name: 'library-list',
      description: 'LibraryList shows a list of all @magic-libraries libraries.'
    }, {
      name: 'messages',
      description: 'Messages shows popup messages.'
    }, {
      name: 'module-list',
      description: 'ModuleList shows the list of @magic-modules you are looking at.'
    }, {
      name: 'pre',
      description: 'Pre allows you to display javascript code with syntax highlighting.'
    }, {
      name: 'sound-cloud',
      description: 'embed soundcloud track, playlist and user widgets'
    }, {
      name: 'theme-list',
      description: 'ThemeList shows a list of all @magic-themes.'
    }, {
      name: 'video-embed',
      description: ['VideoEmbed embeds videos from any video hoster using iframes. ', ' comes with default support for vimeo and youtube.']
    }]
  });
};

var Page = function Page(_ref14, children) {
  var page = _ref14.page,
      state = _ref14.state;
  page = page ? page(state) : '404 - not found';
  var magicProps = {
    id: 'Magic',
    "class": state.pageClass
  };
  var wrapperProps = {
    "class": {
      Wrapper: true
    }
  };
  return main(magicProps, div(wrapperProps, [Route({
    state: state,
    page: page
  }), children]));
};

var Pre = function Pre(props, str) {
  if (typeof props === 'string') {
    props = {
      content: props
    };
  } else if (str) {
    props = _objectSpread({
      content: str
    }, props);
  }

  var _props2 = props,
      content = _props2.content,
      _props2$lines = _props2.lines,
      lines = _props2$lines === void 0 ? true : _props2$lines;
  var classes = {
    Pre: true,
    lines: lines
  };
  return div({
    "class": classes
  }, [div({
    "class": 'menu'
  }, [button({
    onclick: [actions.pre.clip, function (e) {
      return {
        e: e,
        content: content
      };
    }]
  }, 'copy')]), pre(lib.pre.format(content))]);
};

var Route = function Route(_ref15) {
  var page = _ref15.page,
      state = _ref15.state;
  return [Header(state), div({
    "class": 'Page',
    id: 'page'
  }, page), Footer(state)];
};

var ThemeList = function ThemeList() {
  return GitList({
    org: 'magic-themes',
    header: [Link({
      to: 'https://magic-themes.github.io'
    }, '@magic-themes')],
    desc: ['below is a collection of the available @magic app themes.'],
    items: [{
      name: 'docs',
      description: 'the @magic documentation theme. used in all @magic docs.'
    }]
  });
};

var lib = {
  db: function () {
    var init = function init() {
      return typeof window !== 'undefined' && window.localStorage || {};
    };

    var set = function set(dispatch, _ref16) {
      var action = _ref16.action,
          key = _ref16.key,
          value = _ref16.value;
      var store = lib.db.init();
      var res = lib.json.stringify(value);

      if (typeof res === 'Error') {
        dispatch(action, new Error("db:write ".concat(key)));
        return;
      }

      store[key] = res;
      dispatch(action, {
        key: key,
        value: value
      });
    };

    var get = function get(dispatch, _ref17) {
      var action = _ref17.action,
          key = _ref17.key;
      var store = lib.db.init();
      var value = undefined;

      if (key && store[key]) {
        value = lib.json.parse(store[key]);

        if (typeof res === 'Error') {
          dispatch(action, new Error("db:read ".concat(key)));
          return;
        }
      }

      dispatch(action, {
        key: key,
        value: value
      });
    };

    var del = function del(dispatch, _ref18) {
      var action = _ref18.action,
          key = _ref18.key;
      var store = lib.db.init();

      if (key && store[key]) {
        store.removeItem(key);
      }

      dispatch(action, {
        key: key,
        value: undefined
      });
    };

    return {
      set: set,
      get: get,
      del: del,
      init: init
    };
  }(),
  json: function () {
    var tryCatch = function tryCatch(fn) {
      return function () {
        try {
          return fn.apply(void 0, arguments);
        } catch (e) {
          return e;
        }
      };
    };

    var parse = tryCatch(JSON.parse);
    var stringify = tryCatch(JSON.stringify);
    return {
      parse: parse,
      stringify: stringify
    };
  }(),
  pre: function () {
    var keywords = "\nlet this long package float\ngoto private class if short\nwhile protected with debugger case\ncontinue volatile interface\n\ninstanceof super synchronized throw\nextends final throws\ntry import double enum\n\nboolean abstract function\nimplements typeof transient break\ndefault do static void\n\nint new async native switch\nelse delete null public var\nawait byte finally catch\nin return for get const char\nmodule exports require\n".trim().split(/\b/g).map(function (w) {
      return w.trim();
    });
    var builtins = "\nArray Object String Number RegExp Null Symbol\nSet WeakSet Map WeakMap\nsetInterval setTimeout\nPromise\nJSON\nInt8Array Uint8Array Uint8ClampedArray\nInt16Array Uint16Array\nInt32Array Uint32Array\nFloat32Array Float64Array\n".trim().split(/\b/g).map(function (w) {
      return w.trim();
    });
    var booleans = ['true', 'false'];

    var wrapWords = function wrapWords(string) {
      if (typeof string !== 'string') {
        return string;
      }

      var matched = string.split(/\b/);
      string = matched.map(function (word, i) {
        if (word === '') {
          return;
        }

        var cl = '';

        if (word === 'state') {
          cl = 'state';
        } else if (word === 'actions') {
          cl = 'actions';
        } else if (matched[i + 1] && matched[i + 1].includes(':')) {
          cl = 'colon';
        } else if (keywords.includes(word)) {
          cl = 'keyword';
        } else if (builtins.includes(word)) {
          cl = 'builtin';
        } else if (booleans.includes(word)) {
          cl = 'boolean';
        } else if (matched[i - 1] === '.') {
          cl = 'property';
        } else if (matched[i + 1] === '.') {
          cl = 'object';
        }

        if (cl) {
          word = span({
            "class": cl
          }, word);
        }

        return word;
      });
      return string;
    };

    var mailRegex = /([a-zA-Z0-9:+._-]+@[a-zA-Z0-9._-]+)/g;

    var wrapEmails = function wrapEmails(line) {
      return line.split(mailRegex).map(function (part) {
        if (mailRegex.test(part)) {
          var to = part.startsWith('mailto:') ? part : "mailto:".concat(part);

          var _text = part.replace('mailto:', '');

          return Link({
            "class": 'email',
            to: to
          }, _text);
        }

        return wrapWords(part);
      });
    };

    var wrapComments = function wrapComments(line, i) {
      return [wordsByLine(line.substring(0, i)), wordsByLine(line.substring(i))];
    };

    var wrapLinks = function wrapLinks(line) {
      return line.split(/(?= )/).map(function (word) {
        if (!word.includes('://')) {
          return wordsByLine(word);
        }

        var _word$split = word.split('://'),
            _word$split2 = _slicedToArray(_word$split, 2),
            protocol = _word$split2[0],
            url = _word$split2[1];

        if (protocol.match(/[a-z]/g)) {
          return word;
        }

        return Link({
          to: word
        }, word);
      });
    };

    var wrapUrls = function wrapUrls(line) {
      if (line.includes('://') && !line.includes('@')) {
        return wrapLinks(line);
      } else {
        return wrapEmails(line);
      }
    };

    var wrapStrings = function wrapStrings(line) {
      var cleaned = line.replace(/"/g, "'");

      var _cleaned$split = cleaned.split("'"),
          _cleaned$split2 = _toArray(_cleaned$split),
          start = _cleaned$split2[0],
          str = _cleaned$split2[1],
          rest = _cleaned$split2.slice(2);

      var end = rest;

      if (end.length === 1) {
        end = wordsByLine(end[0]);
      } else if (end.length > 1) {
        end = wordsByLine(end.join("'"));
      }

      var words = [];

      if (typeof str !== 'undefined') {
        words = [wrapWords(start), span({
          "class": 'string'
        }, ["'", wrapUrls(str), "'"]), end];
      } else {
        words = wrapWords(line);
      }

      return words;
    };

    var wordsByLine = function wordsByLine(line) {
      var idx = line.indexOf('//');
      var trimmed = line.trim();

      if (trimmed.startsWith('//')) {
        var indentIdx = line.search(/\S|$/);
        var indent = '';

        for (var _i2 = 0; _i2 < indentIdx; _i2++) {
          indent += ' ';
        }

        if (!trimmed.startsWith('// ')) {
          line = "".concat(indent, "// ").concat(trimmed.substr(2));
        }

        return span({
          "class": 'comment'
        }, [indent, '// ', wordsByLine(trimmed.substring(3))]);
      } else if (idx > -1 && line[idx - 1] !== ':') {
        return wrapComments(line, idx);
      } else if (line.indexOf('://') > 2) {
        return wrapLinks(line);
      } else if (line.indexOf('@') && line.includes('.') && !line.trim().includes(' ')) {
        return wrapEmails(line);
      }

      return wrapStrings(line);
    };

    var wrapLine = function wrapLine(line) {
      return code({
        "class": 'line'
      }, wordsByLine(line));
    };

    var format = function format(content) {
      return content.trim().split('\n').map(wrapLine);
    };

    return {
      format: format
    };
  }(),
  preventDefault: function () {
    var preventDefault = function preventDefault(e) {
      e.preventDefault();
      return e;
    };

    return preventDefault;
  }()
};
var actions = {
  'changeTheme': function changeTheme(state) {
    return _objectSpread({}, state, {
      pageClass: _objectSpread({}, state.pageClass, {
        light: state.theme === 'dark'
      }),
      theme: state.theme === 'dark' ? 'light' : 'dark'
    });
  },
  'gdpr': {
    'allow': function allow(state) {
      return [_objectSpread({}, state, {
        gdpr: _objectSpread({}, state.gdpr, {
          allowed: state.cookies.map(function (c) {
            return c.name;
          }),
          show: false
        })
      }), [lib.db.set, {
        key: 'magic-gdpr',
        value: {
          allowed: state.cookies.map(function (c) {
            return c.name;
          }),
          show: false
        },
        action: [actions.gdpr.show, {
          show: false
        }]
      }]];
    },
    'close': function close(state) {
      return [_objectSpread({}, state, {
        gdpr: _objectSpread({}, state.gdpr, {
          show: false
        })
      }), [lib.db.set, {
        key: 'magic-gdpr',
        value: {
          allowed: state.gdpr.allowed,
          show: false
        },
        action: [actions.gdpr.show, {
          show: false
        }]
      }]];
    },
    'deny': function deny(state) {
      return [_objectSpread({}, state, {
        gdpr: _objectSpread({}, state.gdpr, {
          allowed: []
        })
      }), [lib.db.set, {
        key: 'magic-gdpr',
        value: {
          allowed: [],
          show: false
        },
        action: [actions.gdpr.show, {
          show: false
        }]
      }]];
    },
    'show': function show(state, props) {
      var show = props.show;

      if (props.value) {
        show = props.value.show;
      }

      if (typeof show === 'boolean') {
        state.gdpr.show = show;
        return _objectSpread({}, state);
      }

      return state;
    },
    'toggleAllow': function toggleAllow(state, _ref19) {
      var name = _ref19.name;
      var gdpr = state.gdpr;
      var active = gdpr.allowed.includes(name);

      if (!active) {
        gdpr.allowed.push(name);
      } else {
        gdpr.allowed = gdpr.allowed.filter(function (c) {
          return c !== name;
        });
      }

      return _objectSpread({}, state, {
        gdpr: gdpr
      });
    }
  },
  'go': function go(state, e) {
    var to = e.currentTarget.href.replace(window.location.origin, '');

    var _to$split = to.split('#'),
        _to$split2 = _slicedToArray(_to$split, 2),
        url = _to$split2[0],
        _to$split2$ = _to$split2[1],
        hash = _to$split2$ === void 0 ? '' : _to$split2$;

    if (url === state.url && hash === state.hash) {
      return state;
    }

    window.history.pushState({
      url: url,
      hash: hash
    }, '', to);

    if (!hash) {
      window.scroll(0, 0);
    } else {
      window.location.hash = hash;
    }

    return _objectSpread({}, state, {
      url: url,
      hash: hash,
      prev: state.url
    });
  },
  'pop': function pop(state, e) {
    var _window$location = window.location,
        url = _window$location.pathname,
        hash = _window$location.hash;
    hash = hash.substring(1);

    if (e.state) {
      url = e.state.url;
      hash = e.state.hash;
    }

    if (hash) {
      window.location.hash = hash;
    } else {
      window.scroll(0, 0);
    }

    return _objectSpread({}, state, {
      url: url,
      hash: hash
    });
  },
  'pre': {
    'clip': function clip(state, _ref20) {
      var content = _ref20.content;

      if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
        var copy = document.createElement('textarea');
        copy.id = 'copy';
        copy.innerHTML = content;
        document.body.appendChild(copy);
        var child = document.getElementById('copy');
        child.select();
        document.execCommand('copy');
        document.body.removeChild(child);
      }

      return state;
    }
  }
};
var pages = {
  '/core/': function core(state) {
    return [h1(state.title), div([h2('welcome to the magic docs.'), p('the goal of this document is to give you a rough @magical overview.'), GitBadges('magic/core'), h2({
      id: 'philosophy'
    }, 'philosophy'), p(['@magic aims to make it easy to stitch together any kind of webapp.', ' by providing simple, well documented and self contained modules,', ' @magic makes it possible to create stunningly fast', ' webpages with minimal cognitive overhead.']), h2({
      id: 'privacy'
    }, 'privacy'), p('@magic does not spy.'), p(['not only do we try to be legally compliant by default,', ' but we also aim to be ethical', ' which means prioritizing your rights over our needs,', ' but also means we prioritize the rights of your users over your needs.', ' we believe that this is the best compromise.']), h2({
      id: 'buzzwords'
    }, 'why should i use magic?'), h3('features'), ul([li('static html pages with opengraph seo.'), li('pages are hosted for free using gitlab, github or any other git-pages style hosting.'), li('static css output with selector and rule deduplication.'), li('no javascript required where possible.'), li('minimal client boilerplate.'), li('no spyware included.'), li('WIP: lambda faas and graphql api generator.'), li('WIP: server side rendering (if needed).')]), h3('@magic is tiny'), p(['~4 kb javascript boilerplate.', ' usually, all the javascript in your homepage will be 30-60kb big (after unpacking),', ' 10-30kb get transmitted from the server to the client.', ' this documentation page you are reading loads about 15kb of javascript,', ' which, when parsing, turns into 40kb of uncompressed javascript.']), h3('@magic works without javascript'), p(['most of the functionality works without javascript,', " some buttons and realtime user interactions obviously won't,", ' but @magic always tries to provide a non-javascript fallback via css.']), h3('@magic generates static pages'), p(['this makes free hosting (using github or gitlab pages) possible.', " and it's easy."]), p(['@magic publishes to ', Link({
      to: 'https://github.com'
    }, 'github'), ', ', Link({
      to: 'https://gitlab.com'
    }, 'gitlab'), ' and any other git-pages enabled hosting service.']), h3('serverless / faas'), p(['automagically generates ', ' serverless lambdas, derived from the ', Link({
      to: 'https://github.com/magic-modules/'
    }, '@magic-modules'), ' you use in your pages.', ' this makes visitor statistics, user authentication and authorization,', ' chat, and all other server side services possible.'])])];
  },
  '/core/404/': function core404() {
    return div('404 - not found');
  },
  '/core/concepts/': function coreConcepts(state) {
    return [h1(state.title), p('magic concepts. These are the building blocks of every module in a magic app'), div([h2({
      id: 'modules'
    }, '@magic-modules'), p('modules are the main building block of magic.'), p(['a page is a module, a button is a module, a link is a module, an image is a module.', ' a @magic app contains modules containing modules that contain modules.', ' this can lead to inception.'])]), h2('module building blocks'), div([h2({
      id: 'state'
    }, 'state'), div([p('state is a javascript object.'), p('state can be mutated by actions or effects.'), p('every rendering step, the state determines the output of the views')])]), div([h2({
      id: 'actions'
    }, 'actions'), p('actions are an object containing functions'), p('those functions get the state and their props and may return a new full, but changed, state.')]), div([h2({
      id: 'effects'
    }, 'effects'), p('effects are an object containing functions, just like actions.'), p('they behave like actions, get a state and props and may return a new full, but changed, state.'), p(['the big difference? ', 'effects may be impure and trigger sideeffects outside of hyperapp.'])]), div([h2({
      id: 'views'
    }, 'views'), p('views render the state to html'), p('whenever an action triggers a change in the state, this then triggers a view change.')]), div([h2({
      id: 'styles'
    }, 'styles'), p('every module can have a style object attached to it.'), p('magic will automagically merge all styles into one global css file.'), p('in the future, it will also remove unused styles for you.'), p('style merge order from lowest to highest, last overwrites first:'), p('module.style < page.style < app.style < theme.style'), h3({
      id: 'styles-magic-css'
    }, '@magic/css'), p("internally, magic uses it's own css-in-js library."), p('to find out more, click the following link:'), Link({
      to: 'https://magic.github.io/css/'
    }, '@magic/css')]), div([h2({
      id: 'globals'
    }, 'global'), p('every module can set a global object, containing state and action properties.'), p('every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions.')]), div([h2({
      id: 'lambdas'
    }, 'server lambdas'), p('this is the serverside magic.'), p('you can define functions that get transpiled into serverside lambdas.'), p('server side lambdas will be available for GET and/or POST requests.'), p(['the server side function signature is (req, res) => {},', ' as in any nodejs http server, with the addition of req.body being async => awaited before execution of the lambda.'])])];
  },
  '/core/files/': function coreFiles(state) {
    var examples = {
      page: "\nexport default {\n  state: {\n    variable: 'test',\n  },\n  actions: {\n    changeVar: () => ({ variable: 'changed' }),\n  },\n  style: {\n    '.cl': {\n      color: 'green',\n    },\n  },\n  View: state => div({ class: 'cl' }, [\n    'this is the page content.',\n    state.variable,\n  ]),\n}",
      assets: "\nexport default {\n  Custom: () => div('custom component'),\n  Pre: require('@magic-modules/pre),\n}",
      app: "\nexport default {\n  state: {\n    globalStateVar: 'globally available',\n  },\n  actions: {\n    globalAction: () => ({ globalStateVar: 'overwritten.' }),\n  },\n  style: {\n    'body': {\n      color: 'green',\n    },\n  },\n}",
      config: "\nexport default {\n  ROOT: 'example',\n  THEME: 'blue',\n  WEB_ROOT: '/core/',\n\n  // this option adds the\n  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'\n  // http header\n  // see http://www.gnuterrypratchett.com/\n  FOR_DEATH_CAN_NOT_HAVE_HIM: true,\n\n  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files\n  CLIENT_LIB_NAME: 'magic',\n}",
      theme: "\nexport default {\n  'body': {\n    color: 'blue',\n  },\n}"
    };
    return [h1(state.title), p('There are multiple magic files and directories.'), ul([li('/pages - files in the page directory map to urls in your app.'), li('/assets - custom components, @magic-modules get imported here'), li('/assets/static - static files'), li('/assets/themes - theme directory, @magic-themes get imported here'), li('/assets/lib.mjs - imports npm and local but external packages into your app'), li('/app.mjs - gets merged into the app, can set state, actions, style here'), li('/config.mjs - custom config for your app'), li('/assets/Menu.mjs - custom Menu for your app')]), h2({
      id: 'pages'
    }, '/pages'), p('the pages dir contains the pages of your webapp.'), p(["each page has it's own state and actions, ", "but also inherits the global state and actions from the app and it's dependencies"]), h3({
      id: 'pages-dir-structure'
    }, 'pages directory to url map, for the domain mag.ic:'), Pre("\n/pages/index.mjs === http://mag.ic/\n/pages/pageName.mjs === http://mag.ic/pageName/\n/pages/page-name.mjs === http://mag.ic/page-name/\n/pages/page_name.mjs === http://mag.ic/page_name/\n/pages/dir/index.mjs === http://mag.ic/dir/\n/pages/dir/name.mjs === http://mag.ic/dir/name/\n"), h3({
      id: 'pages-example'
    }, 'example page:'), Pre(examples.page), h2({
      id: 'assets'
    }, '/assets'), p('the assets dir contains custom components of your app.'), p('you can additionally import @magic-modules here'), h3({
      id: 'assets-example'
    }, 'example /assets/index.mjs'), Pre(examples.assets), h2({
      id: 'static'
    }, '/assets/static'), p('the static dir contains all of your static assets.'), p('every file in this directory gets copied to the public dir.'), p('image and svg files get minified using imagemin'), p(['text and binary files get compressed using the optional ', Link({
      to: 'https://github.com/jaeh/node-zopfli-es'
    }, 'node-zopfli-es'), ' (if it is installed)']), h2({
      id: 'themes'
    }, '/assets/themes'), p('the themes directory contains... themes.'), p(['a magic theme is an object of css rules, see ', Link({
      to: 'https://github.com/magic/css/'
    }, '@magic/css'), ' for more examples and documentation.']), h3({
      id: 'themes-example'
    }, 'example theme'), Pre(examples.theme), h2({
      id: 'app'
    }, '/assets/app.mjs'), p('the /app.mjs file allows you to set global state, actions, and styles'), h3({
      id: 'app-example'
    }, 'example /app.mjs'), Pre(examples.app), h2({
      id: 'config'
    }, '/config.mjs'), p('the /config.mjs file allows you to set various aspects of your app'), h3({
      id: 'config-example'
    }, 'example /config.mjs'), Pre(examples.config), Link({
      to: 'https://github.com/magic/core/blob/master/src/modules/Menu.mjs'
    }, 'Menu.mjs on github')];
  },
  '/core/libraries/': function coreLibraries(state) {
    return [div([h1(state.title), p(state.description), h2({
      id: 'abstract'
    }, 'libraries'), p(['what would javascript be without the millions of dependencies', ' that you can easily install and make the average webpage ', ' slow[ly] (pun intended) grow towards a footprint of 5 megabytes.']), p('we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.'), p(['magic has one external client side dependency, ', Link({
      to: 'https://github.com/jorgebucharan/hyperapp'
    }, 'hyperapp'), ", [~400 lines that provide our ui state machine]. thats it. and it won't change."]), p(['we also have the tendency to write libraries specialized for our usecase, see ', Link({
      href: 'https://github.com/magic/css'
    }, '@magic/css'), ' ', Link({
      href: 'https://github.com/magic/test'
    }, '@magic/test'), ' ', Link({
      href: 'https://github.com/magic/cli'
    }, '@magic/cli'), ' and others.']), p(['once there is a lib key in at least one component,', ' window.lib (browser) and global.lib (nodejs) will be set,', ' aliasing lib as a global variable in both environments']), h3({
      id: 'dir-or-file'
    }, 'lib dir or file'), p(['if you need libraries in multiple otherwise independent modules,', ' it might be easier to keep your library dependencies in a central place.', ' to achieve this, one can simply create /assets/lib.mjs and export an object from it.', ' this object will get merged into the globalThis.lib object making it available as "lib" throughout your app.']), p(['alternatively, you can create a /assets/modules directory and place UpperCaseNamed.mjs files in there.', ' their names will be deferred from the filename and they will be available in your app without importing them.', ' if you do not use one of the modules, dead code elimination will simply remove it in production.']), Pre('export default { name: () => {} }'), 'will turn into', Pre('lib.name = () => {}'), h3({
      id: 'npm'
    }, '@magic-libraries from npm'), p('all @magic-libraries/* and all npm packages starting with magic-library-* will be loaded automatically. '), h4({
      id: 'example'
    }, 'Example'), p('first, install a @magic-library'), Pre("\nnpm install --save --save-exact @magic-libraries/is\n"), p('then, in javascript'), Pre("\nexport const View = props => div([\n  'value is ',\n  lib.is(props.value, 'string') ? '' : 'not',\n  ' a string'\n])\n      "), LibraryList()])];
  },
  '/core/modules/': function coreModules(state) {
    return [h1(state.title), p('magic modules are predefined modules for webapps.'), h2({
      id: 'definition'
    }, 'module definition:'), p('the minimal module is a function that returns some html.'), Pre("\n// /assets/ModuleName.mjs\n\n// simplest module\nexport const View = () => div('hello, world')\n\n// complete signature\nexport const View = (props = {}, children = []) => div('hello, world')\n"), h2({
      id: 'usage'
    }, 'usage'), p(['if the npm package name starts with @magic-modules/ or magic-module-, it will get imported automagically.', ' the name of the Module will be set to a PascalCased version of the remainder of the module name.', ' @magic-modules/git-badges, for example, turns into GitBadges.', ' the same is true for all uppercased files in your /assets/ directory and subdirectories.', ' in the rare case where you want to install a npm module that can not be found, you can import it in /assets/index.mjs']), Pre("\n// /assets/index.mjs\nexport default {\n  // ...otherModules\n\n  // load module from node_modules\n  NpmModule: require('not-standard-named-magic-module-from-npm'),\n}"), p('after this, the module will be a global in your app and can be used like any other component.'), Pre("\n// any page or module\nexport default state => div([\n  // module without props\n  Mod(),\n  'modules that need props: ',\n  Mod({ state, customProp: true }),\n"), ModuleList()];
  },
  '/core/modules/example/': function coreModulesExample(state) {
    return [h1('example module'), h2({
      id: 'custom-module'
    }, 'Mod and Mod.Component:'), Mod(state), Mod.Component({
      title: 'Mod Component Title, passed via props'
    }), h3('Mod sourcecode:'), Pre("\n  export const View = state =>\n  div({ class: 'Mod' }, [\n    h3('Mod.Mod'),\n    p([\n      'this is Mod. it gets loaded from ',\n      Link({ to: 'https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs' }, '/assets/modules/Mod.mjs'),\n      ' automatically, no need to import it.',\n    ]),\n    p(['the state of this module: ', JSON.stringify(state.module)]),\n  ])\n\nexport const state = {\n  module: {\n    test: 'testing',\n  },\n}\n\nexport const style = {\n  margin: '0 0 1em',\n  padding: '0.5em',\n  border: '1px solid',\n  borderColor: 'green',\n\n  h3: {\n    margin: 0,\n  },\n}\n\nexport const global = {\n  state: {\n    module: true,\n  },\n}\n\nexport const Component = props => {\n  props = typeof props === 'string' ? { header: props } : props\n  CHECK_PROPS(props, propTypes, 'ModComponent')\n  const header = props.header || props.title\n\n  return div({ class: 'ModComponent' }, [\n    header && h5(header),\n    p([\n      'Mod.Component, a second component in ',\n      Link({ to: 'https://github.com/magic/core/example/assets/module.mjs' }, '/assets/module.mjs'),\n    ]),\n  ])\n}\n\nComponent.style = {\n  border: '1px solid orange',\n}\n\nexport const propTypes = {\n  ModComponent: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],\n}\n")];
  },
  '/core/modules/html/': function coreModulesHtml() {
    return [h2('html file example'), p('this module gets imported from a html file.'), p(['see ', Link({
      to: 'https://github.com/magic/core/blob/master/example/pages/modules/html.html'
    }, 'this html file'), ' for an example.']), p('all html valid in <body> can be used, excluding the <script> and <style> tags.'), p('the state looks like the following, and any valid json is allowed'), pre(["---\n@state\n{\n  \"title\": \"markdown file example\",\n  \"description\": \"markdown file description\"\n}\n---\n"])];
  },
  '/core/modules/markdown/': function coreModulesMarkdown() {
    return [h2({
      id: 'markdown-file-example'
    }, 'markdown file example'), p('markdown file description'), p('this module gets imported from a markdown file.'), p(['see ', Link({
      to: 'https://github.com/magic/core/blob/master/example/pages/modules/markdown.md'
    }, 'this file in the example dir'), ' for an example.']), p(["any kind of markdown can be used here,\nbut if you use html natively,\nonly tags valid in a html5 body, excluding <script> and <style> tags, are accepted."]), p("this markdown file also starts with a magic @state declaration.\nit is used internally to, for example, add the title and meta rel=\"description\" tags to the head of this html file."), ul([li(Link({
      to: 'https://magic.github.io'
    }, '@magic/core')), li(Link({
      to: 'https://magic-libraries.github.io'
    }, '@magic-libraries')), li(Link({
      to: 'https://magic-modules.github.io'
    }, '@magic-modules')), li(Link({
      to: 'https://magic-themes.github.io'
    }, '@magic-themes'))]), p('the state looks like the following, and any valid json is allowed'), pre([code(["---\n@state\n{\n  \"title\": \"markdown file example\",\n  \"description\": \"markdown file description\"\n}\n---"])])];
  },
  '/core/modules/preinstalled/': function coreModulesPreinstalled(state) {
    return [h1('@magic modules'), h2({
      id: 'preinstalled'
    }, 'preinstalled'), p('magic has some preinstalled modules that will be used in most pages.'), h2({
      id: 'app'
    }, 'app'), p(['this is the main app module.', ' it has magically inherited properties and all of it is customizable.']), p(['to add actions/state/style to the app you can just create an /assets/app.mjs file.', 'the contents of this file get ', Link({
      to: 'https://github.com/magic/deep',
      text: 'deep .merged'
    }), ' into the app']), Pre("\n// /assets/app.mjs\nexport const state = {\n  merge: 'gets merged into state',\n}\nexport const actions = {\n  mergedActions: state => ({ ...state, merge: 'merged action executed' }),\n}\n"), h2({
      id: 'menu'
    }, 'menu'), p('the Menu module provides... menus.'), Pre("\nexport const View = state => {\n  const items = [\n    { to: '/example-page', text: 'example page' },\n    { to: 'https://example.com', text: 'example.com' },\n    { to: 'https://example.com', nofollow: true, noreferrer: true, target: 'utopia', text: 'nofollow and noref\" },\n  ]\n\n  return Menu({ items, collapse: false })\n}\n// output:\n<nav class=\"Menu\">\n  <ul>\n    <li>\n      <a onclick=\"actions.go\" href=\"{{ WEB_ROOT }}example-page\">example page</a>\n    </li>\n    <li>\n      <a href=\"https://example.com\" target=\"_blank\" rel=\"noopener\">example.com</a>\n    </li>\n    <li>\n      <a href=\"https://example.com\" target=\"utopia\" rel=\"noopener nofollow noreferrer\">nofollow and noref</a>\n    </li>\n  </ul>\n</nav>\n}"), h3({
      id: 'menu-props'
    }, 'Menu props'), p('the Menu module allows multiple props to be passed when instantiating the Menu'), h3({
      id: 'menu-props-collapse'
    }, 'props.collapse'), p(['by default, the menu will only show submenu items if their parent link is active.', ' to force submenu items to show at all times, just pass a collapse: false prop']), Pre("\nMenu({\n  // if false, menu will always show all submenu items\n  collapse: false, // (default: true)\n})"), h3({
      id: 'menu-item-props'
    }, 'Menu.Item props'), p(['every MenuItem accepts props the same props as a link does.', ' additionally a MenuItem accepts a items prop with sub menu items.']), Pre("\nconst menuItem = ({\n  to: '/url',\n  text: 'link text',\n  items: [MenuItems],\n  noreferrer: true, // set rel='noreferrer'\n  nofollow: true, // set rel='nofollow'\n})"), h3({
      id: 'menu-sub-menus'
    }, 'sub menus'), p('to define a submenu, simply define a .items array on the menu item'), Pre("\n// assets/app.mjs\nexport default {\n  state: {\n    // ...state\n    menuName: [\n      {\n        to: '/example-page',\n        text: 'example page',\n        items: [\n          { to: '/example-page/#sub', text: 'example sub page' },\n      ] },\n    ],\n  },\n  // ... rest of app.mjs\n}"), h2({
      id: 'link'
    }, 'link'), p('the link module allows you to link to things.'), Pre("\n// in any page or module View\nexport default () => [\n  Link({ to: '/page', text: 'page' }),\n  // output: <a href=\"/page\" onclick=\"actions.go\">page</a>\n  Link({ to: 'https://example.com', text: 'page' }),\n  // output: <a href=\"https://example.com\" target=\"_blank\" rel=\"noopener\">page</a>\n  Link({ to: '/page', text: 'page', nofollow: true, noreferrer: true }),\n  // output: <a href=\"https://example.com\" target=\"_blank\" rel=\"nofollow noreferrer noopener\">page</a>\n\n  // you can also use children syntax instead of the text prop:\n  Link({ to: '/' }, 'home'),\n\n  // Link also supports # hash links\n  Link({ to: '/#hash' }, 'home with hash'),\n]"), h2({
      id: 'img'
    }, 'img'), p('the img module adds some sane default values to your images.'), Pre("\n// in any page or module View\nexport default () => [\n  Img('/image.png'),\n  // output: <img src=\"/image.png\" alt=\"\" role=\"presentation\"/>\n  Img({ src: '/image.png }),\n  // output: <img src=\"/image.png\" alt=\"\" role=\"presentation\"/>\n  Img({ src: '/image.png', alt: 'image description' }),\n  // output: <img src=\"/image.png alt=\"image description\" />\n  Img({ src: '/image.png', title: 'image title', }),\n  // output: <img src=\"/image.png\" title=\"image title\" alt=\"image title\"/>\n  Img({ src: '/image.png', title: 'image title', alt: 'image alt' }),\n  // output: <img src=\"/image.png\" title=\"image title\" alt=\"image alt\"/>\n]"), h2({
      id: 'footer'
    }, 'footer'), p('the footer module contains a small info text and a link to the magic github repository.'), p('to overwrite this behaviour, just place a Footer.mjs file in your assets and require it in /assets/index.mjs.'), Pre("\n// /assets/Footer.mjs:\nconst Footer = () =>\nfooter({ class: 'main' }, [\n  div({ class: 'wrapper' }, [\n    'made with a few bits of ',\n    Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),\n  ]),\n])\n\nFooter.style: {\n  'footer.main': {\n    position: 'relative',\n    textAlign: 'center',\n    padding: '5em 0 .5em',\n  },\n}\n\nexport default Footer\n  ")];
  },
  '/core/modules/propTypes/': function coreModulesPropTypes(state) {
    return [h1(state.title), h2({
      id: 'check-props'
    }, 'CHECK_PROPS'), p('@magic-modules can export a .propTypes object with an array of prop types.'), h4({
      to: '#example'
    }, 'example'), Pre("\nexport const View = (prop1, prop2, prop3) => [\n  p(prop1),\n  p(prop2),\n  p(prop3),\n]\n\nexport const propTypes = [\n  { name: 'prop1', type: 'string' },\n  { name: 'prop2', type: 'number' },\n  { name: 'prop3', type: 'array', items: 'string' },\n  {\n    name: 'prop4',\n    type: 'object',\n    items: [\n      { name: 'prop4prop1', type: 'string' },\n      { name: 'prop4prop2', type: 'number' },\n  ] },\n]\n")];
  },
  '/core/news/': function coreNews(state) {
    return BlogArchive(state);
  },
  '/core/news/2019/': function coreNews2019(state) {
    return BlogYear(state);
  },
  '/core/news/2019/12/': function coreNews201912(state) {
    return BlogMonth(state);
  },
  '/core/news/2019/12/22/blogging/': function coreNews20191222Blogging(state) {
    return BlogPost(state, [p('so i guess i should start using it...'), p(["it's pretty rough,\nthe index pages for yearly and monthly archives are not polished,\nbut can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app."]), p(["to use the blog,\ncreate an archive dir, for example"]), pre(code('src/blog/2019/12/22/')), p('then just add the blogposts in that directory structure.'), p(["@magic will automagically build a blog directory for you,\nincluding the archives for yearly, monthly and overall blog posts."]), p('more information following soon.')]);
  },
  '/core/themes/': function coreThemes(state) {
    return [h1(state.title), p('magic themes are themes for magic apps. you decide which theme to load by specifying the theme name in config.THEME'), Pre("\n// /config.mjs\nexport default {\n  // ...rest of config,\n  THEME: 'blue',\n}\n"), h2('theme load order'), p('themes get loaded from multiple places. last in the list overwrites earlier entries.'), Pre("\n// ...default module styles get inserted here\n/node_modules/@magic/core/src/themes/THEME/index.mjs\n/node_modules/@magic-themes/THEME\n/assets/themes/THEME/index.mjs\n"), ThemeList()];
  }
};
app({
  init: [_objectSpread({}, initialState, {
    url: window.location.pathname,
    hash: window.location.hash.substr(1)
  }), [[lib.db.get, {
    key: 'magic-gdpr',
    action: actions.gdpr.show
  }]]],
  subscriptions: function subscriptions(state) {
    return [[helpers.listenPopState, actions.pop]];
  },
  view: function view(state) {
    var url = pages[state.url] ? state.url : '/404/';
    var page = pages[url];
    var s = state.pages && state.pages[url];

    if (s) {
      Object.keys(s).forEach(function (key) {
        state[key] = s[key];
      });
    }

    return Page({
      page: page,
      state: state
    }, [Gdpr(state), LightSwitch(state)]);
  },
  node: document.getElementById('Magic')
});