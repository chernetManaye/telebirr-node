export function createTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString(); // seconds
}
