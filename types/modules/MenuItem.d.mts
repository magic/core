export function View(
  props: Record<string, unknown> & {
    collapse?: boolean
    items?: {
      [key: string]: unknown
    }[]
    text?: unknown
    url: string
    to?: string
  },
): import('@magic/hyperapp').VNode
export namespace propTypes {
  let MenuItem: (
    | {
        key: string
        type: string
        item?: undefined
      }
    | {
        key: string
        type: string[]
        item?: undefined
      }
    | {
        key: string
        type: string
        item: {
          type: string
          keys: {
            key: string
            type: string
          }[]
        }
      }
  )[]
}
