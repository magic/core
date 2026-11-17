export function prepareServiceWorker(
  app: AppObject,
  {
    CLIENT_LIB_NAME,
    WEB_ROOT,
  }: {
    CLIENT_LIB_NAME: string
    WEB_ROOT?: string
  },
): Promise<string>
import type { AppObject } from '../../types.mjs'
