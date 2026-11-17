export function View(
  state: Record<string, unknown> & {
    day: string
    month: string
    year: string
    name: string
    title: string
    description: string
  },
): import('@magic/hyperapp').VNode
