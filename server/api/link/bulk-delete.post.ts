export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: 'Preview mode cannot delete links.',
    })
  }

  const { slugs } = await readBody(event)

  if (slugs && Array.isArray(slugs)) {
    const { cloudflare } = event.context
    const { KV } = cloudflare.env

    const promises = slugs.map(slug => KV.delete(`link:${slug}`))
    await Promise.all(promises)

    return { success: true }
  }

  throw createError({
    status: 400,
    statusText: 'Invalid request body. Expected an array of slugs.',
  })
})
