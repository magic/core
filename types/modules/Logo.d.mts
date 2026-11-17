export function View({
  logo,
  logotext,
  root,
}: {
  logo?: string
  logotext?: string
  root?: string
}): unknown
export namespace propTypes {
  let Logo: (
    | {
        key: string
        type: string
        reqired?: undefined
      }
    | {
        key: string
        type: string
        reqired: boolean
      }
  )[]
}
