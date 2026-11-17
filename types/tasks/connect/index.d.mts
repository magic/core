export function connect({
  DIR,
  GIT,
}: {
  DIR: {
    PUBLIC: string
  }
  GIT?: {
    ORIGIN?: string
    BRANCH?: string
    [key: string]: unknown
  }
}): Promise<void>
export default connect
