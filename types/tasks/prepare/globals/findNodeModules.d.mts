export function findNodeModules(_modules?: Record<string, unknown>): Promise<{
  [key: string]: FoundModule
}>
export type FoundModule = {
  [key: string]: unknown
  lib?: string
}
