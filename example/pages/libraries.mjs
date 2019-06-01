export const View = state => [
  h1(state.title),
  LibraryList(),
  LightSwitch(state)
]

export const state = {
  title: '@magic/core library docs',
  description: '@magic/core libraries allow you to include client side functionality in your app.',
}
