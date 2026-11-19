import { is, tryCatch } from '@magic/test'

import { xc } from '../../src/lib/xc.mjs'

export default [
  {
    fn: xc('echo hello'),
    expect: { stdout: 'hello\n', stderr: '' },
    info: 'xc runs command and returns stdout/stderr',
  },
  {
    fn: xc('echo "hello world"'),
    expect: { stdout: 'hello world\n', stderr: '' },
    info: 'xc handles quoted arguments',
  },
  {
    fn: tryCatch(xc as unknown as (...args: unknown[]) => unknown, 'exit 1'),
    expect: is.error,
    info: 'xc throws for failed command',
  },
]
