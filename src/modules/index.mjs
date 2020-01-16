import * as Footer from './Footer.mjs'
import * as Header from './Header.mjs'
import * as Img from './Img.mjs'
import * as Menu from './Menu.mjs'
import * as MenuItem from './MenuItem.mjs'
import * as MenuLink from './MenuLink.mjs'
import * as Route from './Route.mjs'
import * as Router from './Router.mjs'
import * as Seo from './Seo.mjs'
import * as SkipLink from './SkipLink.mjs'

import * as BlogArchive from './BlogArchive.mjs'
import * as BlogMonth from './BlogMonth.mjs'
import * as BlogPost from './BlogPost.mjs'
import * as BlogTeaser from './BlogTeaser.mjs'
import * as BlogYear from './BlogYear.mjs'

export { component } from './component.mjs'
export { tags } from './tags.mjs'

const { Link, ...Page } = Router

export const builtins = {
  BlogArchive,
  BlogMonth,
  BlogPost,
  BlogTeaser,
  BlogYear,
  Footer,
  Header,
  Img,
  Link,
  Menu,
  MenuItem,
  MenuLink,
  Page,
  Route,
  Seo,
  SkipLink,
}
