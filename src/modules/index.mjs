import * as Route from './Router.mjs'
import { Menu } from './Menu.mjs'
import * as Footer from './Footer.mjs'
import * as Header from './Header.mjs'
import * as Img from './Img.mjs'

export { component } from './component.mjs'

export { Lazy } from './Lazy.mjs'

export { tags } from './tags.mjs'

const { Link, Page, ...Router } = Route

export const builtins = {
  Menu,
  Footer,
  Header,
  Img,
  Page,
  Link,
  Router,
}
