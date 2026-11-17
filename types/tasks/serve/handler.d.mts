export function handler(
  app: AppObject,
  config: Config,
): Promise<
  (req: import('http').IncomingMessage, res: import('http').ServerResponse) => Promise<void>
>
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
