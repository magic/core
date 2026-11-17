declare function _default({ app, config }: { app: AppObject; config: Config }): Promise<
  | {
      code: string
      serviceWorker?: string
    }
  | undefined
>
export default _default
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
