import util from 'util'

import { exec } from 'child_process'
export const xc = util.promisify(exec)
