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
