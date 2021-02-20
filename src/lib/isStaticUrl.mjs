export const isStaticUrl = (list, link) => {
  if (link.startsWith(config.WEB_ROOT)) {
    link = link.replace(config.WEB_ROOT, '/')
  }

  return list.includes(link)
}
