export function findLibraries(
  app: AppObject,
  modules: Record<string, unknown>,
  {
    DIR,
  }: {
    DIR: ConfigDir
    ROOT?: string
  },
): Promise<
  {
    key: string
    lib: unknown
  }[]
>
import type { AppObject } from '../../../types.mjs'
import type { ConfigDir } from '../../../types.mjs'
