export function View(
  state: Record<string, unknown> & {
    blog: BlogData
    url: string
  },
): unknown[]
import type { BlogData } from '../types.mjs'
