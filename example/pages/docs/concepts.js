module.exports = {
  Body: (state, actions) => [
    h1('concepts'),
    div([
      div([
        h3('state'),
        div([p('state is a javascript object.'), p('state can only be mutated by actions.')]),
      ]),
      div([h3('actions')]),
      div([h3('views')]),
    ]),
  ],
}
