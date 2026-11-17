import { is } from '@magic/test'

import { component } from '../../src/modules/component.mjs'

const C = component('TestComponent')

export default [
  {
    fn: () => is.function(C),
    expect: true,
    info: 'component returns a render function',
  },
  {
    fn: () => {
      const vnode = C('some text')
      return vnode.tag === 'TestComponent' && vnode.children[0] === 'some text'
    },
    expect: true,
    info: 'component uses bare string as children',
  },
  {
    fn: () => {
      const vnode = C(42)
      return vnode.children[0] === 42
    },
    expect: true,
    info: 'component uses number as children',
  },
  {
    fn: () => {
      const vnode = C(['a', 'b'])
      return vnode.children[0] === 'a' && vnode.children[1] === 'b'
    },
    expect: true,
    info: 'component uses array as children',
  },
  {
    fn: () => {
      const View = () => 'view'
      const vnode = C({ View })
      return vnode.children[0] === View
    },
    expect: true,
    info: 'component uses props.View function as children',
  },
  {
    fn: () => {
      const vnode = C({ to: '/target' })
      return vnode.props.to === '/target' && vnode.children.length === 0
    },
    expect: true,
    info: 'component passes object props through',
  },
  {
    fn: () => {
      const vnode = C({ props: { to: '/wrapped' } })
      return Array.isArray(vnode.children) && vnode.children[0].props.to === '/wrapped'
    },
    expect: true,
    info: 'component wraps props.props as children',
  },
  {
    fn: () => {
      const vnode = C({ to: '/x' }, 'kid')
      return vnode.props.to === '/x' && vnode.children[0] === 'kid'
    },
    expect: true,
    info: 'component keeps explicit children',
  },
]
