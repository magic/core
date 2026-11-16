import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Import a module from a file path.
 * Returns the module namespace, or the Error, if importing failed.
 *
 * @param {string | URL} p
 * @returns {Promise<{ [key: string]: unknown } | Error>}
 */
export const saveImport = async p => {
  try {
    let spec = p
    if (typeof p === 'string' && path.isAbsolute(p)) {
      spec = pathToFileURL(p)
    }

    return await import(spec instanceof URL ? spec.href : spec)
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e))
  }
}
