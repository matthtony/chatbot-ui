export interface RateLimitOptions {
  windowMs?: number
  limit?: number
}

const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minute
const DEFAULT_LIMIT = 30

interface Entry {
  count: number
  start: number
}

const requests = new Map<string, Entry>()

export function checkRateLimit(
  key: string,
  { windowMs = DEFAULT_WINDOW_MS, limit = DEFAULT_LIMIT }: RateLimitOptions = {}
): boolean {
  const now = Date.now()
  const entry = requests.get(key)
  if (!entry || now - entry.start > windowMs) {
    requests.set(key, { count: 1, start: now })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count += 1
  return true
}
