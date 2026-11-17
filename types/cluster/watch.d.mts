export function watch({
  args,
  ROOT,
  CONFIG_FILE_PATH,
  STATIC,
}: {
  args: Record<string, unknown>
  ROOT: string
  CONFIG_FILE_PATH: string
  STATIC: string | string[]
}): void
