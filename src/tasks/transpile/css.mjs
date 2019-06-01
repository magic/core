import css from '@magic/css'

export default async style => {
  // reset = await css(reset, config.THEME_VARS)
  style = await css(style, config.THEME_VARS)

  return style
}
