import path from 'path'

export const isLocalPath = p => {
  const cwd = process.cwd()
  return p.startsWith(cwd + path.sep)
}
