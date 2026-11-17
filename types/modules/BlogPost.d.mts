export function View(
  state: Record<string, unknown> & {
    url: string
    title: string
    description: string
  },
  children?: unknown,
): unknown[]
