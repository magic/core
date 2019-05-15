export const isLocalPath = p => {
  const cwd = process.cwd()
  return p.startsWith(cwd) && p !== cwd
}
