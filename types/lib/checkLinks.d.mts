export function checkLinks({
  staticUrls,
  links,
  pages,
  ignoredLinks,
  noRemote,
  root,
  dev,
}: {
  staticUrls: string[]
  links: string[]
  pages: PageObject[]
  ignoredLinks?: string[]
  noRemote?: boolean
  root: string | undefined
  dev?: boolean
}): Promise<string[]>
import type { PageObject } from '../types.mjs'
