export function httpGet(url: string): Promise<{
  statusCode?: number
  headers?: import('http').IncomingHttpHeaders
  data?: Buffer[]
  error?: Error
}>
