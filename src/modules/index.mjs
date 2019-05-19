import * as Route from './Router.mjs'
import { Menu } from './Menu.mjs'
import * as Footer from './Footer.mjs'
import { Header } from './Header.mjs'
import { Img } from './Img.mjs'

import { tags } from './tags.mjs'

export { component } from './component.mjs'

const { Link, Page, ...Router } = Route

export const builtins = {
  Menu,
  Footer,
  Header,
  Img,
  Page,
  Link,
  Router,
  ...tags,
}

export default {
  tags,
  builtins,
}
