export function mapPageObject(
  o: Record<string, unknown>,
  key: string,
  c: {
    global?: Record<string, Record<string, unknown>>
  },
): (entry: [string, unknown]) => Record<string, unknown>
