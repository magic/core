export function transformClient(
  code: string | undefined,
  app: AppObject,
  config: Config,
): Promise<string>
/**
 * A loose SWC BlockStatement-like node, for the dead-code removal helpers.
 */
export type SwcBlock = {
  type: string
  stmts: {
    type: string
    declarations: {
      id?: {
        type: string
        value: string
      }
      [key: string]: unknown
    }[]
    [key: string]: unknown
  }[]
}
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
