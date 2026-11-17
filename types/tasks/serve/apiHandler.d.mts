export function apiHandler(
  req: import('http').IncomingMessage & {
    body?: unknown
  },
  res: import('http').ServerResponse,
  {
    lambdas,
    rawUrl,
  }: {
    lambdas: Record<string, unknown>
    rawUrl: string
  },
): Promise<boolean | undefined>
