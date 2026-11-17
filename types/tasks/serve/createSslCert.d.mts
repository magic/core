export default ssl
/** @import { NodeError } from '../../types.mjs' */
/**
 * @returns {Promise<{ key: Buffer, cert: Buffer } | undefined>}
 */
declare function ssl(): Promise<
  | {
      key: Buffer
      cert: Buffer
    }
  | undefined
>
