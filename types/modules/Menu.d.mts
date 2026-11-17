export function View(
  props?: Record<string, unknown> & {
    menu?: {
      [key: string]: unknown
    }[]
    hash?: string
    url?: string
    class?: string
    collapse?: boolean
  },
): import('@magic/hyperapp').VNode
export namespace style {
  let float: string
  let margin: string
  let position: string
  let li: {
    float: string
    margin: string
    '&.active': {
      '> a': {
        textDecoration: string
      }
    }
    a: {
      display: string
    }
  }
  namespace ul {
    export namespace ul_1 {
      let position_1: string
      export { position_1 as position }
      export let left: number
    }
    export { ul_1 as ul }
  }
}
export namespace propTypes {
  let Menu: (
    | {
        key: string
        type: string
        required: boolean
      }
    | {
        key: string
        type: string
        required?: undefined
      }
  )[]
}
