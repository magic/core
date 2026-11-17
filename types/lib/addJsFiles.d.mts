export function addJsFiles({
  js,
  WEB_ROOT,
}: {
  js:
    | {
        src: string
      }
    | {
        src: string
      }[]
  WEB_ROOT: string | undefined
}): Record<string, string> | undefined
