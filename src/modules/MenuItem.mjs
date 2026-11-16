/**
 * @param {Record<string, unknown> & { collapse?: boolean, items?: { [key: string]: unknown }[], text?: unknown, url: string, to?: string }} props
 */
export const View = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem', true)

  const { collapse, items = [], text, url, ...item } = props

  /** @type {{ class: Record<string, unknown> }} */
  const p = {
    class: {},
  }

  const { to } = item

  if (to === url) {
    p.class.active = true
  }

  /** @type {unknown} */
  let children = []
  const active = !collapse || url.includes(to ?? 'undefined')

  if (active && items.length) {
    children = ul(items.map(i => MenuItem({ url, collapse, ...i })))
  }

  return li(p, [to ? Link(item, text) : span(item, text), children])
}

export const propTypes = {
  MenuItem: [
    { key: 'url', type: 'string' },
    { key: 'text', type: ['string', 'array'] },
    {
      key: 'items',
      type: 'array',
      item: {
        type: 'object',
        keys: [
          { key: 'to', type: 'string' },
          { key: 'text', type: 'string' },
        ],
      },
    },
    { key: 'collapse', type: 'boolean' },
    { key: 'to', type: 'string' },
  ],
}
