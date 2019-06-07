export const View = gdpr => [
  gdpr.show && div({ class: { Gdpr: true, show: gdpr.show } }, [
    input({ type: 'checkbox', name: 'show-hide', id: 'show-hide', checked: !gdpr.show }),
    div({ class: 'Container' }, [
      gdpr.title && h3(gdpr.title),
      gdpr.content && div(gdpr.content),
      !!gdpr.cookies.length && ul(gdpr.cookies.map(({ name, info }) => li([name, info]))),
      label({ class: 'button', for: 'show-hide', onclick: actions.gdpr.close }, gdpr.buttonText),
    ]),
  ]),
]

export const state = {
  show: true,
  cookies: false,
  title: 'Magic Privacy Information',
  content: 'This page does neither save, collect, nor share any personal data about you.',
  buttonText: 'Awesome.',
}

export const actions = {
  gdpr: {
    show: (state, p) => ({
        ...state,
        gdpr: {
          ...state.gdpr,
          ...p.value,
        },
    }),

    load: state => [
      state,
      [effects.gdpr.readLocalStorage, { key: 'gdpr', action: actions.gdpr.show }],
    ],

    close: state => [
      {
        ...state,
        gdpr: {
          ...state.gdpr,
          cookies: [],
          show: false,
        },
      },
      [effects.gdpr.writeLocalStorage, { key: 'gdpr', value: { cookies: state.gdpr.cookies || [], show: false } }],
    ],
  },
}

export const effects = {
  gdpr: {
    writeLocalStorage: (_, { key, value }) => {
      window.localStorage = window.localStorage || {}
      window.localStorage[key] = JSON.stringify(value)
    },

    readLocalStorage: (dispatch, { key, action }) => {
      window.localStorage = window.localStorage || {}

      let value = window.localStorage[key]
      if (typeof value !== 'undefined') {
        value = JSON.parse(value)
      }

      dispatch(action, { key, value })
    },
  },
}

export const style = (vars = {}) => ({
  bottom: '0.5em',
  position: 'fixed',
  width: '100%',
  opacity: 0,
  animation: 'showGdpr 1s 1s forwards',
  left: 0,
  textAlign: 'center',

  '.Container': {
    backgroundColor: vars.colors.gray[900],
    border: '1px solid',
    display: 'inline-block',
    margin: '0 auto',
    padding: '1em',
    position: 'relative',

    '.light&&': {
      backgroundColor: vars.colors.gray[50],
    },
  },

  'input[type=checkbox]': {
    display: 'none',

    '&:checked ~ .Container': {
      opacity: 0,
      height: 0,
      width: 0,
      overflow: 'hidden',
    },
  },

  h3: {
    padding: 0,
  },

  '.button': {
    display: 'inline-block',
    margin: '1em 0 0',
  },

  '@keyframes showGdpr': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
})
