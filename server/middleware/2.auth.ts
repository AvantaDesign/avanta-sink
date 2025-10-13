export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  const siteToken = useRuntimeConfig(event).siteToken

  // Validate token for API endpoints
  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_')) {
    // Ensure site token is configured
    if (!siteToken || siteToken.length < 16) {
      throw createError({
        status: 500,
        statusText: 'Server configuration error: NUXT_SITE_TOKEN must be set and at least 16 characters long',
      })
    }

    // Check if request has valid token
    if (token !== siteToken) {
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
      })
    }
  }

  // Additional validation for provided tokens
  if (token && token.length < 16) {
    throw createError({
      status: 401,
      statusText: 'Token must be at least 16 characters long',
    })
  }
})
