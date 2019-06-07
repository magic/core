export const View = ({ gdpr, cookies }) => {
  if (!gdpr.show) {
    return
  }

  cookies = Object.entries(cookies)

  return div({ class: { Gdpr: true, show: gdpr.show } }, [
    input({ type: 'checkbox', name: 'show-hide', id: 'show-hide', checked: !gdpr.show }),
    div({ class: 'Container' }, [
      gdpr.title && h3(gdpr.title),
      gdpr.content && p(gdpr.content),
      !!cookies.length
        ? [
            gdpr.cookieText && p(gdpr.cookieText),
            ul(
              cookies
                .sort(([_, { required }]) => (required ? 0 : 1))
                .map(([name, { info, allowed = false }]) =>
                  li([
                    input({
                      type: 'checkbox',
                      title: 'allow',
                      checked: allowed,
                      onchange: [actions.gdpr.allow, { name }],
                    }),
                    label([name, info && [' - ', info]]),
                  ]),
                ),
            ),
          ]
        : p(gdpr.noCookieText),

      cookies.length
        ? [
            label(
              {
                class: 'button',
                for: 'show-hide',
                onclick: [actions.gdpr.close, { allowed: true }],
              },
              gdpr.allowAllCookiesButtonText,
            ),
            label(
              {
                class: 'button',
                for: 'show-hide',
                onclick: actions.gdpr.close,
              },
              gdpr.allowCookieButtonText,
            ),
            label(
              {
                class: 'button',
                for: 'show-hide',
                onclick: [actions.gdpr.close, { allowed: false }],
              },
              gdpr.denyCookieButtonText,
            ),
          ]
        : label(
            { class: 'button', for: 'show-hide', onclick: actions.gdpr.close },
            gdpr.noCookieButtonText,
          ),
    ]),
  ])
}

export const state = {
  show: true,
  cookies: {},
  title: 'Magic Privacy Information',
  noCookieText: 'This page does neither save, collect, nor share any personal data about you.',
  noCookieButtonText: 'Awesome.',
  cookieButtonText: 'Awesome.',
  allowAllCookiesButtonText: 'Allow all',
  allowCookieButtonText: 'Allow selected',
  denyCookieButtonText: 'Deny all',
  cookieText: 'We are using the following cookies on this page',
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

    close: (state, { allowed }) => {
      const { cookies } = state
      if (typeof allowed === 'boolean') {
        Object.entries(state.cookies).forEach(([name, cookie]) => {
          cookies[name] = {
            ...cookie,
            allowed,
          }
        })
      }

      return [
        {
          ...state,
          gdpr: {
            ...state.gdpr,
            show: false,
          },
          cookies,
        },
        [
          effects.gdpr.writeLocalStorage,
          { key: 'gdpr', value: { cookies: state.cookies || [], show: false } },
        ],
      ]
    },
    allow: (state, props) => {
      state.cookies[props.name].allowed = true
      return {
        ...state,
      }
    },
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

  ul: {
    display: 'block',
  },

  '.Container': {
    backgroundColor: vars.colors.gray[900],
    border: '1px solid',
    borderRadius: '.5em',
    display: 'inline-block',
    margin: '0 auto',
    padding: '1em',
    position: 'relative',
    textAlign: 'left',

    '.light&&': {
      backgroundColor: vars.colors.gray[50],
    },
  },

  'input[type=checkbox]': {
    '&#show-hide': {
      display: 'none',
    },

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

export const global = {
  state: {
    cookies: true,
  },
}

// export const cookies = {
//   'test-cookie-name-required': {
//     info: 'required test cookie info',
//     required: true,
//     value: 'test-cookie-value',
//   },
//   'test-cookie-name': { info: 'test cookie info', value: 'test-cookie-value' },
// }
