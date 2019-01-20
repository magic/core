const applyWebRoot = str => {
  if (!config.WEB_ROOT || config.WEB_ROOT === '/' || process.env.NODE_ENV !== 'production') {
    return str
  }

  return str
    .replace(/href="\//gm, `href="${config.WEB_ROOT}`)
    .replace(/href='\//gm, `href='${config.WEB_ROOT}`)
    .replace(/src="\//gm, `src="${config.WEB_ROOT}`)
    .replace(/src='\//gm, `src='${config.WEB_ROOT}`)
}

module.exports = applyWebRoot
