import path from 'path'

import fs from '@magic/fs'

/** @import { Config } from '../types.mjs' */

/**
 * @param {[string, unknown]} params
 * @param {Config} config
 * @returns {Promise<void>}
 */
export const writeFile = async ([name, content], config) =>
  await fs.writeFile(path.join(config.DIR.PUBLIC, name), /** @type {string} */ (content))
