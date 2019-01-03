const theme = {
  'header.main': {
    display: 'inline-block',
    width: '90%',

    '.logo': {
      float: 'left',
    },
    '.Menu': {
      float: 'right',
      margin: '2em 0 0',

      li: {
        float: 'left',
        margin: '0 0.5em 0 0',
      },
    },
  },
  'h1,h2,h3': {
    margin: '0.5em 0',
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
  a: {
    textDecoration: 'none',
    color: 'blue',
    outline: 'none',

    '&:hover': {
      color: 'orange',
    },
  },
  '.Menu': {
    '.active': {
      textDecoration: 'underline',
    },
  },
}

module.exports = theme
