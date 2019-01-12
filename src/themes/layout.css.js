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
    display: 'inline-block',
    width: '90%',

    '&.main': {
      '.logo': {
        float: 'left',
      },
      '.Menu': {
        float: 'right',
        margin: '2em 0 0',
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
    fontWeight: 'bold',
  },
  h3: {
    fontSize: '1.2em',
  },
  h4: {
    fontWeight: 600,
  },
  h5: {
    fontWeight: 600,
  },
}
