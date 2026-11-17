export function getBlog({
  BLOG_DIR,
  ROOT,
}: {
  BLOG_DIR?: string
  ROOT?: string
}): Promise<string[] | undefined>
