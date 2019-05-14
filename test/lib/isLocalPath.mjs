import path from 'path'
import { is, tryCatch } from '@magic/test'

import { isLocalPath } from '../../src/lib/index.mjs'

const notLocalPath = path.join(process.cwd(), '..', '..', 'maybe', 'root')
const localPath = path.join(process.cwd(), 'is', 'local', 'path')

export default [
  { fn: () => isLocalPath, expect: is.fn, info: 'isLocalPath is a function' },
  { fn: isLocalPath(notLocalPath), expect: false, info: 'false for non local path' },
  { fn: isLocalPath(localPath), expect: true, info: 'true for local path' },
  { fn: isLocalPath(process.cwd()), expect: false, info: 'false for cwd itself' },
]
