import deep from '@magic/deep'
import is from '@magic/types'

export const prepareModule = app => ([name, component]) => {
  const lowerName = name.toLowerCase()

  const glob = component.global || {}

  let tempState = {}

  if (!is.empty(component.state)) {
    Object.entries(component.state).forEach(([key, val]) => {
      if (glob.state && glob.state[key] === true) {
        tempState[key] = val
      } else {
        tempState[lowerName] = app.state[lowerName] || {}
        tempState[lowerName][key] = val
      }
    })
  }

  app.state = {
    ...tempState,
    ...app.state,
  }

  const actionTypes = ['actions', 'effects']

  actionTypes
    // if component has no actions or effects, do nothing
    .filter(type => !is.empty(component[type]))
    .forEach(type => {
      Object.entries(component[type]).forEach(([key, val]) => {
        if (glob[type] && glob[type][key] === true) {
          app[type][key] = val
        } else {
          app[type][lowerName] = app[type][lowerName] || {}
          if (lowerName === key) {
            app[type][lowerName] = val
          } else {
            app[type][lowerName][key] = val
          }
        }
      })
    })

  if (!is.empty(component.helpers)) {
    app.helpers = deep.merge(app.helpers, component.helpers)
  }

  if (!is.empty(component.subscriptions)) {
    component.subscriptions.forEach(sub => {
      app.subscriptions.push(sub)
    })
  }

  if (!is.empty(component.cookies)) {
    app.cookies = deep.merge(app.cookies, component.cookies)
  }

  if (!is.empty(component.init)) {
    app.init = deep.merge(app.init, component.init)
  }
}

export const prepareModules = (app, modules) => {
  // merge component states into app.state[componentName].
  // this makes all identical components share their state.
  Object.entries(modules)
    .filter(([name]) => is.case.upper(name[0]))
    .forEach(prepareModule(app))
}
