module.exports = {
  body: {
    minHeight: '100vh',
  },

  '#magic': {
    margin: '0 auto',
    width: '90%',
  },

  // header and menu in header
  header: {
    '&.main': {
      display: 'inline-block',
      width: '90%',

      '.logo': {
        float: 'left',
      },
      '.logo-text': {
        float: 'left',
        fontSize: '1.5em',
        margin: '.7em .2em',
      },
      '.Menu': {
        float: 'right',
        margin: '1.5em 0 0',
      },
    },
  },

  '.page': {
    header: {
      margin: '0 0 .5em',
    },

    h1: {
      margin: '1em 0 .2em',
    },
  },

  footer: {
    width: '100%',
  },

  // html header tags
  'h1, h2, h3, h4, h5': {
    margin: '1em 0 .2em',
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
