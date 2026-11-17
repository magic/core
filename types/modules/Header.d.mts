export function View(
  props?: Record<string, unknown> & {
    logo?: string
    menu?: unknown[]
    logotext?: string
    root?: string
    theme?: string
    hash?: string
    url?: string
  },
  children?: unknown[],
): import('@magic/hyperapp').VNode | undefined
export namespace propTypes {
  let Header: {
    key: string
    type: string
  }[]
}
