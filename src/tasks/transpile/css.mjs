import css from '@magic/css'

export default async (style, vars) => {
  // reset = await css(reset, config.THEME_VARS)
  style = await css(style, vars)

  return style
}
