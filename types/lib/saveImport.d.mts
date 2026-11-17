export function saveImport(p: string | URL): Promise<
  | {
      [key: string]: unknown
    }
  | Error
>
