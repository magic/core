export const isHashedUrl = (list, link) => {
  if (!link.includes('#')) {
    return false
  }

  const [url, hash] = link.split('#')
  const page = list.find(page => page.name === url)
  if (!page) {
    return false
  }

  return page.rendered.includes(`id="${hash}"`)
}
