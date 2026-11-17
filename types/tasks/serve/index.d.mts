export function startServer(
  server: import('http').Server,
  options: {
    port: number
    host?: string
  },
  attempts?: number,
): Promise<{
  port: number
  host?: string
}>
export function serve(app: AppObject, config: Config): Promise<import('http').Server>
export default serve
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
