export function View(
  {
    page,
    state,
  }: {
    page: (state: unknown) => ViewResult
    state: Record<string, unknown>
  },
  children?: unknown,
): unknown
export function Link(
  {
    to,
    action,
    text,
    ...p
  }: {
    to?: string
    action?: unknown
    text?: unknown
    href?: string
  } & Record<string, unknown>,
  children?: unknown,
): unknown
export namespace state {
  let pageClass: {}
}
export namespace actions {
  function pop(
    state: Record<string, unknown>,
    e?:
      | {
          state?: {
            url: string
            hash: string
            scrollY?: number
          }
        }
      | null
      | undefined,
  ): Record<string, unknown>
  function go(
    state: Record<string, unknown>,
    e?:
      | {
          currentTarget?: {
            href: string
          }
        }
      | null
      | undefined,
  ): Record<string, unknown>
}
export namespace effects {
  function listenPopState(
    dispatch: (action: string, e: unknown) => void,
    action: string,
  ): () => void
}
export const subscriptions: string[][]
export namespace global {
  namespace actions {
    let go_1: boolean
    export { go_1 as go }
    let pop_1: boolean
    export { pop_1 as pop }
  }
  namespace effects {
    let listenPopState_1: boolean
    export { listenPopState_1 as listenPopState }
  }
  namespace state {
    let pageClass_1: boolean
    export { pageClass_1 as pageClass }
  }
}
import type { ViewResult } from '../types.mjs'
