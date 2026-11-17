export function getGitConfig(GIT?: {
  ORIGIN?: string
  BRANCH?: string
  [key: string]: unknown
}): Promise<
  | {
      ORIGIN?: string
      BRANCH?: string
    }
  | undefined
>
