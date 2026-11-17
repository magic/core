export function prepareBlogPost({
  pageDir,
  state,
  config,
}: {
  root?: string
  pageDir: string
  state?: Record<string, unknown>
  config: Config
}): (file: string) => Promise<PageObject | undefined>
import type { Config } from '../../types.mjs'
import type { PageObject } from '../../types.mjs'
