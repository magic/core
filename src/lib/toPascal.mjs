export const snakeRegex = /[-_]/gi
export const toPascal = s =>
  s
    .split(snakeRegex)
    .map(s => `${s[0].toUpperCase()}${s.substr(1)}`)
    .join('')
