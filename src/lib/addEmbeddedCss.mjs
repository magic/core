import is from '@magic/types'
import error from '@magic/error'

export const addEmbeddedCss = file => {
  const contents = app.static[file]

  if (is.empty(contents) || !is.function(contents.toString)) {
    throw error(`Empty css file: ${file}`, 'E_PREPEND_CSS_EMPTY')
  }

  return contents.toString()
}
