export function build({
  commands,
  config,
}: {
  commands: {
    [key: string]: unknown
  }
  config: Config
}): Promise<void>
import type { Config } from '../types.mjs'
