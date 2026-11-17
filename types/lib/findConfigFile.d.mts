export function findConfigFile(
  ROOT: string,
  magicConfigNames: string[],
  oldConfigName: string,
  silent?: boolean,
): Promise<string | undefined>
