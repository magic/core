export function View(
  state: Record<string, unknown> & {
    blog: BlogData
    month: string
    url: string
    year: string
    link?: string
  },
): (import('@magic/hyperapp').VNode | unknown[][])[]
import type { BlogData } from '../types.mjs'
