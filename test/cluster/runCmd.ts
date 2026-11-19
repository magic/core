import { is } from '@magic/test'

import { runCmd } from '../../src/cluster/runCmd.mjs'

export default [
  {
    fn: async () => {
      // an unknown command is deliberately not a valid task key
      const result = await runCmd('nonexistent-command' as never)
      // unknown tasks reject, the error is returned instead of thrown
      return is.error(result)
    },
    expect: true,
    info: 'runCmd returns the error for unknown commands',
  },
  {
    fn: async () => {
      const result = await runCmd('clean', undefined)
      // clean with no dir is a no-op
      return result === undefined
    },
    expect: true,
    info: 'runCmd resolves clean without a dir',
  },
]
