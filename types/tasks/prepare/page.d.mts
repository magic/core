export function preparePage({
  WEB_ROOT,
  pageDir,
  state,
  config,
}: {
  WEB_ROOT?: string
  pageDir: string
  state?: Record<string, unknown>
  config: Config
}): (file: string) => Promise<PageObject | undefined>
import type { Config } from '../../types.mjs'
import type { PageObject } from '../../types.mjs'
