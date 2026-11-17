export function View(
  props: string | Record<string, unknown>,
): import('@magic/hyperapp').VNode | undefined
export namespace propTypes {
  let Img: (
    | {
        type: string
        key?: undefined
        required?: undefined
      }
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
