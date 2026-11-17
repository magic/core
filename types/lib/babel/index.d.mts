export function getBabelConf(app: AppObject, config: Config): Record<string, unknown>
/**
 * The `BABEL` section of a magic config.
 */
export type BabelConfig = {
  CLIENT_LIB_NAME?: string
  BABEL_DEBUG?: boolean
  REMOVE_CHECK_PROPS?: boolean
  MINIFY?: boolean
  USE_PRESETS?: boolean
  KEEP_COMMENTS?: boolean
}
/**
 * A babel preset or plugin entry.
 */
export type BabelEntry =
  | string
  | [
      string,
      {
        [key: string]: unknown
      },
    ]
/**
 * A babel plugin function, as returned by `./dead_code.mjs`.
 */
export type BabelPluginFn = (opts: {
  types: {
    [key: string]: (node: unknown) => boolean
  }
}) => {
  visitor: unknown
}
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
