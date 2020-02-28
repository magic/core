export const View = props => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, propTypes, 'Component')
  const header = props.header || props.title

  return div({ class: 'Component' }, [
    header && h5(header),
    p([
      'Component, a second component in ',
      Link(
        { to: 'https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs' },
        '/assets/modules/Component.mjs',
      ),
    ]),
  ])
}

export const style = {
  border: '1px solid orange',
}

export const propTypes = {
  Component: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],
}
