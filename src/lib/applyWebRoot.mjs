export const applyWebRoot = ({ ENV, WEB_ROOT }, str) => {
  if (!WEB_ROOT || WEB_ROOT === '/') {
    return str
  }

  if (!WEB_ROOT.startsWith('/')) {
    WEB_ROOT = `/${WEB_ROOT}`
  }
  if (!WEB_ROOT.endsWith('/')) {
    WEB_ROOT = `${WEB_ROOT}/`
  }

  return str
    .replace(/href="\//gm, `href="${WEB_ROOT}`)
    .replace(/href='\//gm, `href='${WEB_ROOT}`)
    .replace(/src="\//gm, `src="${WEB_ROOT}`)
    .replace(/src='\//gm, `src='${WEB_ROOT}`)
}
