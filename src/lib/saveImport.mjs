import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const saveImport = async p => {
  try {
    if (path.isAbsolute(p)) {
      p = pathToFileURL(p)
    }

    return await import(p)
  } catch (e) {
    return e
  }
}
