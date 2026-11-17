export function View(): import('@magic/hyperapp').VNode
export function style(vars: ThemeVars): {
  clear: string
  display: string
  margin: string
  a: {
    color: {}
    textDecoration: string
    '&:hover': {
      color:
        | string
        | {
            [key: string]: unknown
          }
    }
  }
}
import type { ThemeVars } from '../types.mjs'
