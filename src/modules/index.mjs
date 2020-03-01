import * as Footer from './Footer.mjs'
import * as Header from './Header.mjs'
import * as Img from './Img.mjs'
import * as Logo from './Logo.mjs'
import * as Menu from './Menu.mjs'
import * as MenuItem from './MenuItem.mjs'
import * as MenuLink from './MenuLink.mjs'
import * as Router from './Router.mjs'
import * as Seo from './Seo.mjs'
import * as SkipLink from './SkipLink.mjs'
import * as Credits from './Credits.mjs'

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
  Credits,
  Footer,
  Header,
  Img,
  Link,
  Logo,
  Menu,
  MenuItem,
  MenuLink,
  Page,
  Seo,
  SkipLink,
}
