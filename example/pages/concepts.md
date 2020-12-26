---
@state {
  "title": "@magic/core concepts",
  "description": [
    "@magic/core conceptual information.",
    "explains the main concepts that make the @magic work."
  ]
}
---

# @magic/core concepts

magic concepts. These are the building blocks of every module in a magic app

<h2 id='modules'>@magic-modules</h2>

modules are the main building block of magic.

a page is a module, a button is a module, a link is a module, an image is a module.
even a theme is a module.

a @magic app contains modules containing modules that contain modules.
this can lead to inception.

## module building blocks

### state

state is a javascript object.
state can be mutated by actions, 
effects and subscriptions can call actions to change the state.
every rendering frame, the state determines the output of the html views.

```
const state = {
  shown: false,
  count: 0,
}

```

## actions

actions are an object containing functions

those functions get the state and their props and may return a new full, but changed, state.

```
const actions = {
  toggleModal: state => {
    return {
      ...state,
      shown: !state.shown,
    }
  },

  calculator: {
    plus: state => ({ ...state, count: state.count + 1 }),
    minus: state => ({ ...state, count: state.count - 1 }),
  },
}
```

## effects

effects are an object containing functions, just like actions.

effects can only change the state by calling actions.

effects may also be impure and trigger side-effects outside of hyperapp.

```
const effects = {
  waitASec: [state, async state => {
    await new Promise((r) => setTimeout(r, 1000))

    return actions.plus(state)
  }],
}
```

## subscriptions

at the moment, subscriptions can be defined using strings as function names.

if a module exports a subscriptions array, those subscriptions will be added to the app.

```
const subscriptions = [
  subscribe = (dispatch, action) => {
    setInterval(() => {
      dispatch(action, { arg: Math.random() * 100 })
    })
  }
]

const actions = {
  onSubscription: (state, e) => ({
    ...state,
    arg: e.arg,
  })
}

export const subscriptions = ['subscriptions.subscribe', 'actions.onSubscription']
```

## views

views render the state to html
whenever an action triggers a change in the state, this then triggers a view change.

```
export const View = state => div(JSON.stringify(state))
```

## styles

every module can export a style object.
magic will automagically merge all styles into one global css file.
in the future, it will also remove unused styles for you.

styles merge order, last overwrites first:
module.style < page.style < app.style < theme.style

this allows css to be inherited in both directions.

a module automatically creates it's own css namespace,
that same namespace can be used in page, app and theme css styles 
to overwrite module specific styles.


### #styles- @magic/css

internally, magic uses it's own css-in-js library.

to find out more, click the following link:
[@magic/css](https://magic.github.io/css/)


## globals

every module can set a global object, containing state and action properties.

every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions, instead of into the module namespace.

```
// in module.mjs

export const state = {
  internal: 0,
  external: 0,
}

export const actions = {
  internal: state => ({
    ...state,
    module: {
      internal: state.module.interal + 1,
    },
  }),
  external: state => ({
    ...state,
    external: state.external + 1,
  }),
}

export const global = {
  state: {
    external: true
  },
  actions: {
    external: true,
  },
}

// in the view, we can use both the global and local actions and state variables

export const View = state => div([
  'view',
  p({ onclick: actions.module.internal }, ['internal:', state.module.internal]),
  p({ onclick: actions.external }, ['external:', state.external]),
])
```

## #lambdas server lambdas

this is the serverside magic.
you can define functions that get transpiled into serverside lambdas.
server side lambdas will be available for GET and/or POST requests.

the server side function signature is (req, res) => {},
as it is in most nodejs http servers,
with the addition of req.body being async => awaited before execution of the lambda.