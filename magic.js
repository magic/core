export default {
  ROOT: 'example',
  THEME: 'docs',
  WEB_ROOT: '/core/',
  URL: 'magic.github.io/core/',

  PUBLIC: 'docs',

  // the directory in the pages directory that holds the blog posts
  // if this is not set, no blog is created.
  BLOG_DIR: 'news',

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // when serving pages using grundstein.
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,

  HOIST: ['LightSwitch', 'NoSpy'],

  BABEL: {
    BABEL_DEBUG: true,
  },

  // this is set to be able to test broken link behaviour.
  // DO NOT ENABLE IN YOUR APP (unless you need to because reasons...)
  NO_CHECK_LINKS_EXIT: true,

  PREPEND_TAGS: [{ name: 'div', props: { id: 'PREPENDTag' } }],
  APPEND_TAGS: [{ name: 'div', props: { id: 'APPENDTag' } }],

  PREPEND_SCRIPTS: ['/prependScript.js'],
  APPEND_SCRIPTS: ['/appendScript.js'],

  PREPEND_JS: ['/prependJs.js'],
  APPEND_JS: ['/appendJs.js'],

  PREPEND_CSS: ['/prependCss.css'],
  APPEND_CSS: ['/appendCss.css'],
}
