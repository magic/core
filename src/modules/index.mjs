import { Page } from './Page.mjs'
import * as Menu from './Menu.mjs'
import * as Link from './Link.mjs'
import * as Footer from './Footer.mjs'
import * as Magic from './admin/index.mjs'
import { Header } from './Header.mjs'
import { Img } from './Img.mjs'

import { tags } from './tags.mjs'

export { component } from './component.mjs'

export const builtins = {
  Page,
  Menu,
  Link,
  Footer,
  Magic,
  Header,
  Img,
  ...tags,
}

export default {
  tags,
  builtins,
}
