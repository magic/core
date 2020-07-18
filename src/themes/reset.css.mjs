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
.button,
input[type="reset"],
input[type="button"],
input[type="submit"],
input[type="file"] > input[type="button"]`

// define the original style as a Map to keep key inheritance working.
// all other styles will be added as keys onto this map,
// which means that order should be preserved
export const reset = (vars = {}) => ({
  html: {
    scrollBehavior: 'smooth',
    // always show scrollbar to prevent layout glitch if page resizes
    overflowY: 'scroll',
  },

  [all]: {
    border: 0,
    boxSizing: 'border-box',
    font: 'inherit',
    fontSize: '100%',
    margin: 0,
    padding: 0,
    verticalAlign: 'baseline',
  },
  /* HTML5 display-role reset for older browsers */
  [html5Reset]: {
    display: 'block',
  },

  body: {
    lineHeight: 1.5,
    margin: 0,
    maxWidth: '100vw',
    overflowX: 'hidden',
    padding: 0,
  },
  ul: {
    display: 'inline-block',
    listStyle: 'none',
  },

  ol: {
    display: 'inline-block',
    listStyle: 'inside decimal',
  },

  'blockquote, q': {
    quotes: 'none',
  },
  'blockquote:before, blockquote:after, q:before, q:after': {
    content: 'none',
  },
  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },

  // remove outlines from links
  a: {
    cursor: 'pointer',
    outline: 'none',
    whiteSpace: 'nowrap',
  },

  'b, strong': {
    fontWeight: 700,
  },

  'i, em': {
    fontStyle: 'italic',
  },

  [buttons]: {
    backgroundColor: vars.buttonBackgroundColor || vars.colors.gray[500],
    color: vars.buttonColor || vars.colors.gray[900],
    cursor: 'pointer',
    padding: '0.5em',

    '&:hover': {
      backgroundColor: vars.buttonBackgroundColorHover || vars.colors.gray[700],
      color: vars.buttonColorHover || vars.colors.gray[100],
    },

    '&::-moz-focus-inner': {
      border: '0 none',
      padding: '0',
    },
  },

  '#Magic': {
    height: '100%',
    minHeight: '100vh',
    width: '100%',

    '.icon': {
      width: '1.5em',
      height: 'auto',
      animation: 'showHoisted 500ms 0s forwards',
      opacity: 0,
    },
  },

  '.Wrapper': {
    margin: '0 auto',
    maxWidth: '1300px',
    width: '90%',
  },

  // header and menu in header
  '.Header': {
    display: 'inline-block',
    width: '90%',

    '.Logo': {
      display: 'inline-block',
      img: {
        float: 'left',
      },

      span: {
        float: 'left',
        fontSize: '1.5em',
        margin: '.7em .2em',
      },
    },
  },

  '.Page': {
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

  '@keyframes showHoisted': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
})
