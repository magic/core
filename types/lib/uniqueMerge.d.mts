export function uniqueMerge(
  a:
    | {
        [key: string]: unknown
      }
    | null
    | undefined,
  b:
    | {
        [key: string]: unknown
      }
    | null
    | undefined,
):
  | {
      [key: string]: unknown
    }
  | null
  | undefined
