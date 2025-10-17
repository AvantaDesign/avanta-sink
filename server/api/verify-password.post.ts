export default eventHandler(async (event) => {
  const { slug, password } = await readBody(event)

  if (!slug || !password) {
    throw createError({
      status: 400,
      statusText: 'Missing slug or password',
    })
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  const { caseSensitive } = useRuntimeConfig(event)

  // Get the link from KV
  const lowerCaseSlug = slug.toLowerCase()
  let link = await KV.get(`link:${caseSensitive ? slug : lowerCaseSlug}`, { type: 'json' })

  // fallback to original slug if caseSensitive is false and the slug is not found
  if (!caseSensitive && !link && lowerCaseSlug !== slug) {
    link = await KV.get(`link:${slug}`, { type: 'json' })
  }

  if (!link) {
    throw createError({
      status: 404,
      statusText: 'Link not found',
    })
  }

  // Check if password matches
  if (link.password !== password) {
    throw createError({
      status: 401,
      statusText: 'Incorrect password',
    })
  }

  // Return the destination URL
  return {
    url: link.url,
  }
})
