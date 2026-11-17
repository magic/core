/** @type {{ modules: Set<string>, moduleNames?: Set<string> }} */
export const used: {
  modules: Set<string>
  moduleNames?: Set<string>
}
export function visit({
  app,
  config,
  parent,
}: {
  app: AppObject
  config: Config
  parent: SwcNode | (SwcNode | undefined)[] | undefined
  par?: SwcNode | (SwcNode | undefined)[]
}): SwcNode | undefined
import type { AppObject } from '../../types.mjs'
import type { Config } from '../../types.mjs'
import type { SwcNode } from '../../types.mjs'
