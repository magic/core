import { Page } from './Page.mjs'
import { Menu } from './Menu.mjs'
import { Link } from './Link.mjs'
import { Footer } from './Footer.mjs'
import { Magic } from './admin/index.mjs'
import { Header } from './Header.mjs'
import { Img } from './Img.mjs'

import { tags } from './tags.mjs'

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
