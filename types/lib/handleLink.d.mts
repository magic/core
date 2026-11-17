export function handleLink({
  app,
  href,
  parent,
  WEB_ROOT,
}: {
  app?: {
    [key: string]: unknown
  }
  href: string
  parent?: Record<string, unknown>
  WEB_ROOT?: string
}): string
