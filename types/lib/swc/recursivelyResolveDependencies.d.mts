export function recursivelyResolveDependencies({
  app,
  config: _config,
}: {
  app: AppObject
  config: Config
}): Promise<Record<string, unknown>>
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
