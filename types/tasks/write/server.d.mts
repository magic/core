export function writeLambda([name, content]: [string, string]): Promise<void>
export function writeServer(app: AppObject, config: Config): Promise<void>
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
