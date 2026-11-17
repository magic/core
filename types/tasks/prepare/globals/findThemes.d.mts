export function findThemes(
  modules: Record<string, unknown>,
  {
    DIR,
    NODE_MODULES,
    THEME,
  }: {
    DIR: ConfigDir
    NODE_MODULES: string
    THEME?: string | string[]
  },
): Promise<Record<string, unknown> | undefined>
import type { ConfigDir } from '../../../types.mjs'
