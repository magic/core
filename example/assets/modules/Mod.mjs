export const View = state =>
  div({ class: 'Mod' }, [
    h3('Mod.Mod'),
    p([
      'this is Mod. it gets loaded from ',
      Link(
        { to: 'https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs' },
        '/assets/modules/Mod.mjs',
      ),
    ]),
    p(['the state of this module: ', JSON.stringify(state.module)]),
  ])

export const state = {
  module: {
    test: 'testing',
  },
}

export const style = vars => ({
  margin: '0 0 1em',
  padding: '0.5em',
  border: '1px solid',
  borderColor: 'green',

  h3: {
    margin: 0,
    color: vars.text.dark,
  },
})

export const global = {
  state: {
    module: true,
  },
}

// export const server = (req, res) => {
//   const random = Math.floor(Math.random() * 1000)
//   const body = `hello, world. here is some pseudorandom: ${random}`

//   return {
//     code: 200,
//     body,
//   }
// }
