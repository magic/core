import { component } from './component.mjs'

export const htmlTags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meter',
  'nav',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'track',
  'u',
  'ul',
  'video',
  'wbr',

  // svg tags
  'svg',
  'g',
  'circle',
  'ellipse',
  'rect',
  'polygon',
  'path',
  'defs',
  'linearGradient',
  'stop',
  'text',
]

export const headTags = ['html', 'head', 'title', 'meta', 'link', 'body', 'script']

const exp = {
  component,
  tags: {
    body: {},
    head: {},
  },
}

htmlTags.forEach(name => {
  const prepared = component(name)
  exp[name] = prepared
  exp.tags.body[name] = prepared
})

headTags.forEach(name => {
  const prepared = component(name)
  exp[name] = prepared
  exp.tags.head[name] = prepared
})

const description = attrs => {
  exp.meta({ name: 'description', property: 'og:description', content: attrs })
}

exp.tags.head.description = description
exp.description = description

export const tags = exp

export default tags
