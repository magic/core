export function prepareBlog(
  app: AppObject,
  config: Config,
): Promise<{
  posts: PageObject[]
  index: BlogData
}>
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
import type { PageObject } from '../../types.mjs'
import type { BlogData } from '../../types.mjs'
