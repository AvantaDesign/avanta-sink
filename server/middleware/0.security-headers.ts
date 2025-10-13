// Security headers middleware
// Adds security-related HTTP headers to all responses

export default eventHandler((event) => {
  // Content Security Policy - adjust based on your needs
  setResponseHeader(
    event,
    'Content-Security-Policy',
    'default-src \'self\'; '
    + 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://cdn.jsdelivr.net https://unpkg.com; '
    + 'style-src \'self\' \'unsafe-inline\'; '
    + 'img-src \'self\' data: https: blob:; '
    + 'font-src \'self\' data:; '
    + 'connect-src \'self\' https://api.cloudflare.com; '
    + 'frame-ancestors \'none\'; '
    + 'base-uri \'self\'; '
    + 'form-action \'self\'',
  )

  // Prevent clickjacking
  setResponseHeader(event, 'X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')

  // Enable XSS protection (legacy browsers)
  setResponseHeader(event, 'X-XSS-Protection', '1; mode=block')

  // Referrer policy
  setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy (formerly Feature Policy)
  setResponseHeader(
    event,
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )

  // Strict Transport Security (HTTPS only) - Cloudflare handles this but adding for completeness
  // Note: Only set this if you're sure your site is served over HTTPS
  if (getRequestProtocol(event) === 'https') {
    setResponseHeader(
      event,
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    )
  }

  // Remove Server header to avoid information disclosure
  // Cloudflare will handle most of this, but we set our own
  setResponseHeader(event, 'X-Powered-By', '') // Remove X-Powered-By header
})
