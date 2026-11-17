export function publish({
  DIR,
  FORCE,
  GIT,
}: {
  DIR: {
    PUBLIC: string
  }
  FORCE?: boolean
  GIT?: {
    ORIGIN?: string
    BRANCH?: string
    [key: string]: unknown
  }
}): Promise<void>
export default publish
