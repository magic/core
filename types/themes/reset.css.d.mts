export function reset(vars?: ThemeVars): {
  'h1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\nimg, picture, source,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video,\ndiv, body': {
    border: number
    boxSizing: string
    font: string
    fontSize: string
    margin: number
    padding: number
    verticalAlign: string
  }
  'article, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section': {
    display: string
  }
  body: {
    lineHeight: number
    margin: number
    maxWidth: string
    overflowX: string
    overflowY: string
    padding: number
    scrollBehavior: string
  }
  ul: {
    display: string
    listStyle: string
  }
  ol: {
    display: string
    listStyle: string
  }
  'blockquote, q': {
    quotes: string
  }
  'blockquote:before, blockquote:after, q:before, q:after': {
    content: string
  }
  table: {
    borderCollapse: string
    borderSpacing: number
  }
  a: {
    cursor: string
    outline: string
    whiteSpace: string
  }
  'b, strong': {
    fontWeight: number
  }
  'i, em': {
    fontStyle: string
  }
  'button,\n.button,\ninput[type="reset"],\ninput[type="button"],\ninput[type="submit"],\ninput[type="file"] > input[type="button"]': {
    backgroundColor: unknown
    color: unknown
    cursor: string
    padding: string
    '&:hover': {
      backgroundColor: unknown
      color: unknown
    }
    '&::-moz-focus-inner': {
      border: string
      padding: string
    }
  }
  '#Magic': {
    height: string
    minHeight: string
    width: string
    '.icon': {
      width: string
      height: string
      animation: string
      opacity: number
    }
  }
  '.Wrapper': {
    margin: string
    maxWidth: string
    width: string
  }
  '.Header': {
    display: string
    width: string
    '.Logo': {
      display: string
      img: {
        float: string
      }
      span: {
        float: string
        fontSize: string
        margin: string
      }
    }
  }
  '.Page': {
    h1: {
      padding: string
    }
  }
  '.Footer': {
    width: string
  }
  'h1, h2, h3, h4, h5': {
    padding: string
  }
  h1: {
    fontSize: string
  }
  h2: {
    fontSize: string
  }
  h3: {
    fontSize: string
  }
  '@keyframes showHoisted': {
    '0%': {
      opacity: number
    }
    '100%': {
      opacity: number
    }
  }
}
import type { ThemeVars } from '../types.mjs'
