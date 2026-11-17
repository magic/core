export function View(
  state: Record<string, unknown> & {
    blog: BlogData
    url: string
    year: string
    link?: string
  },
): import('@magic/hyperapp').VNode
import type { BlogData } from '../types.mjs'
