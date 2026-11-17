export function View(
  state: Record<string, unknown> & {
    seo?: {
      name?: string
      image?: string
      type?: string
      context?: string
      custom?: {
        [key: string]: unknown
      }[]
      author?: {
        name?: string
        givenName?: string
        additionalName?: string
        lastName?: string
      }
      [key: string]: unknown
    }
    title?: string
    description?: unknown
    keywords?: unknown
    favicon?: string
    root?: string
    image?: string
    logo?: string
  },
): import('@magic/hyperapp').VNode[]
