import { is } from '@magic/test'

import { component } from '../../src/modules/component.mjs'

/** the shape of the node component() returns, as used by these tests */
type CNode = {
  tag?: unknown
  props: Record<string, unknown>
  children?: unknown[]
}

const C = component('TestComponent') as unknown as (props?: unknown, children?: unknown) => CNode

export default [
  {
    fn: () => is.function(C),
    expect: true,
    info: 'component returns a render function',
  },
  {
    fn: () => {
      const vnode = C('some text')
      const child = vnode.children?.[0] as { tag?: unknown } | undefined
      return vnode.tag === 'TestComponent' && child?.tag === 'some text'
    },
    expect: true,
    info: 'component uses bare string as children',
  },
  {
    fn: () => {
      const vnode = C(42)
      const child = vnode.children?.[0] as { tag?: unknown } | undefined
      return child?.tag === 42
    },
    expect: true,
    info: 'component uses number as children',
  },
  {
    fn: () => {
      const vnode = C(['a', 'b'])
      const first = vnode.children?.[0] as { tag?: unknown } | undefined
      const second = vnode.children?.[1] as { tag?: unknown } | undefined
      return first?.tag === 'a' && second?.tag === 'b'
    },
    expect: true,
    info: 'component uses array as children',
  },
  {
    fn: () => {
      const View = () => 'view'
      const vnode = C({ View })
      return (vnode.children?.[0] as unknown) === View
    },
    expect: true,
    info: 'component uses props.View function as children',
  },
  {
    fn: () => {
      const vnode = C({ to: '/target' })
      return vnode.props.to === '/target' && (vnode.children?.length ?? 0) === 0
    },
    expect: true,
    info: 'component passes object props through',
  },
  {
    fn: () => {
      const vnode = C({ props: { to: '/wrapped' } })
      const child = vnode.children?.[0] as { props?: Record<string, unknown> } | undefined
      return Array.isArray(vnode.children) && child?.props?.to === '/wrapped'
    },
    expect: true,
    info: 'component wraps props.props as children',
  },
  {
    fn: () => {
      const vnode = C({ to: '/x' }, 'kid')
      const child = vnode.children?.[0] as { tag?: unknown } | undefined
      return vnode.props.to === '/x' && child?.tag === 'kid'
    },
    expect: true,
    info: 'component keeps explicit children',
  },
]
