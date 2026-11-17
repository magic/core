export function mergeSubModules({
  used,
  name,
  dependencies,
}: {
  used?: Record<string, unknown>
  name: string
  dependencies?: Record<string, unknown>
}): Record<string, unknown>
