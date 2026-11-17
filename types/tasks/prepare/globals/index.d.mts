export function prepareGlobals(
  app: AppObject,
  config: Config,
): Promise<{
  modules: Record<string, unknown>
  libs: {
    key: string
    lib: unknown
  }[]
}>
import type { AppObject } from '../../../types.mjs'
import type { Config } from '../../../types.mjs'
