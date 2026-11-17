export function primary({
  args,
  cluster,
  commands,
  DIR,
  GIT,
  URL,
  URL_WARNING,
  WEB_ROOT,
}: {
  args: Record<string, unknown>
  cluster: import('node:cluster').Cluster
  commands: Record<string, unknown>
  DIR: ConfigDir
  GIT: unknown
  URL: string | false | undefined
  URL_WARNING: number | undefined
  WEB_ROOT: string | undefined
}): Promise<void>
import type { ConfigDir } from '../types.mjs'
