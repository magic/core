export function runCmd(cmd: keyof typeof tasks, ...args: unknown[]): Promise<unknown>
export default runCmd
import * as tasks from '../tasks/index.mjs'
