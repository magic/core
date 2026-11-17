export { component } from './component.mjs'
export { tags } from './tags.mjs'
export namespace builtins {
  export { BlogArchive }
  export { BlogMonth }
  export { BlogPost }
  export { BlogTeaser }
  export { BlogYear }
  export { Credits }
  export { Footer }
  export { Header }
  export { Img }
  export { Link }
  export { Logo }
  export { Menu }
  export { MenuItem }
  export { Page }
  export { Seo }
  export { SkipLink }
}
import * as BlogArchive from './BlogArchive.mjs'
import * as BlogMonth from './BlogMonth.mjs'
import * as BlogPost from './BlogPost.mjs'
import * as BlogTeaser from './BlogTeaser.mjs'
import * as BlogYear from './BlogYear.mjs'
import * as Credits from './Credits.mjs'
import * as Footer from './Footer.mjs'
import * as Header from './Header.mjs'
import * as Img from './Img.mjs'
declare const Link: (
  {
    to,
    action,
    text,
    ...p
  }: {
    to?: string
    action?: unknown
    text?: unknown
    href?: string
  } & Record<string, unknown>,
  children?: unknown,
) => unknown
import * as Logo from './Logo.mjs'
import * as Menu from './Menu.mjs'
import * as MenuItem from './MenuItem.mjs'
declare const Page: {
  View: (
    {
      page,
      state,
    }: {
      page: (state: unknown) => import('../types.mjs').ViewResult
      state: Record<string, unknown>
    },
    children?: unknown,
  ) => unknown
  state: {
    pageClass: {}
  }
  actions: {
    pop: (
      state: Record<string, unknown>,
      e?:
        | {
            state?: {
              url: string
              hash: string
              scrollY?: number
            }
          }
        | null
        | undefined,
    ) => Record<string, unknown>
    go: (
      state: Record<string, unknown>,
      e?:
        | {
            currentTarget?: {
              href: string
            }
          }
        | null
        | undefined,
    ) => Record<string, unknown>
  }
  effects: {
    listenPopState: (dispatch: (action: string, e: unknown) => void, action: string) => () => void
  }
  subscriptions: string[][]
  global: {
    actions: {
      go: boolean
      pop: boolean
    }
    effects: {
      listenPopState: boolean
    }
    state: {
      pageClass: boolean
    }
  }
}
import * as Seo from './Seo.mjs'
import * as SkipLink from './SkipLink.mjs'
