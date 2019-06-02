const all = `h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
img, picture, source,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video,
div, body`

const html5Reset = `article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section`

const buttons = `button,
input[type="reset"],
input[type="button"],
input[type="submit"],
input[type="file"] > input[type="button"]`

// define the original style as a Map to keep key inheritance working.
// all other styles will be added as keys onto this map,
// which means that order should be preserved
export const reset = {
  [all]: {
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: '100%',
    font: 'inherit',
    verticalAlign: 'baseline',
    boxSizing: 'border-box',
  },
  /* HTML5 display-role reset for older browsers */
  [html5Reset]: {
    display: 'block',
  },

  body: {
    lineHeight: 1.5,
    margin: 0,
    padding: 0,
    // always show scrollbar to prevent layout glitch if page resizes
    overflowY: 'scroll',
  },
  'ol, ul': {
    listStyle: 'none',
    display: 'inline-block',
  },
  'blockquote, q': {
    quotes: 'none',
  },
  'blockquote:before, blockquote:after, q:before, q:after': {
    content: '',
    content: 'none',
  },
  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },

  // remove outlines from links
  a: {
    outline: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  [buttons]: {
    cursor: 'pointer',
    '&::-moz-focus-inner': {
      padding: '0',
      border: '0 none',
    },
  },

  '#Magic': {
    height: '100%',
    minHeight: '100vh',
    width: '100%',
  },

  '.Wrapper': {
    width: '90%',
    margin: '0 auto',
    maxWidth: '1300px',
  },

  // header and menu in header
  '.Header': {
    display: 'inline-block',
    width: '90%',

    '.Logo': {
      float: 'left',
    },

    '.LogoText': {
      float: 'left',
      fontSize: '1.5em',
      margin: '.7em .2em',
    },

    '.LogoWrapper': {
      display: 'inline-block',
    },
  },

  '.Page': {
    '.Header': {
      margin: '0 0 .5em',
    },

    h1: {
      padding: '1em 0 .2em',
    },
  },

  '.Footer': {
    width: '100%',
  },

  // html header tags
  'h1, h2, h3, h4, h5': {
    padding: '1em 0 .2em',
  },

  h1: {
    fontSize: '1.3em',
  },

  h2: {
    fontSize: '1.2em',
  },

  h3: {
    fontSize: '1.1em',
  },
}
