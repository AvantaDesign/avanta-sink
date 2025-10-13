// Rate limiting middleware to prevent API abuse
// This is a simple in-memory rate limiter for Cloudflare Workers

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (will be per worker instance)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

export default eventHandler((event) => {
  // Only apply rate limiting to API endpoints
  if (!event.path.startsWith('/api/')) {
    return
  }

  // Get client identifier (IP address or token)
  const clientIp = getRequestHeader(event, 'cf-connecting-ip')
    || getRequestHeader(event, 'x-forwarded-for')
    || 'unknown'

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  const identifier = token ? `token:${token.substring(0, 10)}` : `ip:${clientIp}`

  // Rate limit configuration
  const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
  const MAX_REQUESTS = 60 // 60 requests per minute per client

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  if (!entry || entry.resetTime < now) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
  }
  else {
    // Existing window
    if (entry.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      setResponseHeader(event, 'Retry-After', retryAfter.toString())
      setResponseHeader(event, 'X-RateLimit-Limit', MAX_REQUESTS.toString())
      setResponseHeader(event, 'X-RateLimit-Remaining', '0')
      setResponseHeader(event, 'X-RateLimit-Reset', entry.resetTime.toString())

      throw createError({
        status: 429,
        statusText: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
      })
    }

    entry.count++
    rateLimitStore.set(identifier, entry)
  }

  // Set rate limit headers
  const remaining = Math.max(0, MAX_REQUESTS - (entry?.count || 1))
  setResponseHeader(event, 'X-RateLimit-Limit', MAX_REQUESTS.toString())
  setResponseHeader(event, 'X-RateLimit-Remaining', remaining.toString())
  setResponseHeader(event, 'X-RateLimit-Reset', (entry?.resetTime || now + RATE_LIMIT_WINDOW).toString())
})
