import * as Router from './Router.mjs'
import * as Menu from './Menu.mjs'
import * as MenuItem from './MenuItem.mjs'
import * as Footer from './Footer.mjs'
import * as Header from './Header.mjs'
import * as Img from './Img.mjs'
import * as Route from './Route.mjs'
import * as Seo from './Seo.mjs'

export { component } from './component.mjs'

export { tags } from './tags.mjs'

const { Link, ...Page } = Router

export const builtins = {
  MenuItem,
  Menu,
  Footer,
  Header,
  Img,
  Page,
  Link,
  Route,
  Seo,
}
