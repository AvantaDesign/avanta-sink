import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'
import { parsePath, withQuery } from 'ufo'

export default eventHandler(async (event) => {
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, '')) // remove leading and trailing slashes
  const { slugRegex, reserveSlug } = useAppConfig(event)
  const { homeURL, linkCacheTtl, redirectWithQuery, caseSensitive } = useRuntimeConfig(event)
  const { cloudflare } = event.context

  if (event.path === '/' && homeURL)
    return sendRedirect(event, homeURL)

  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug) && cloudflare) {
    const { KV } = cloudflare.env

    let link: z.infer<typeof LinkSchema> | null = null

    const getLink = async (key: string) =>
      await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

    const lowerCaseSlug = slug.toLowerCase()
    link = await getLink(caseSensitive ? slug : lowerCaseSlug)

    // fallback to original slug if caseSensitive is false and the slug is not found
    if (!caseSensitive && !link && lowerCaseSlug !== slug) {
      console.log('original slug fallback:', `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`)
      link = await getLink(slug)
    }

    if (link) {
      // Check if link has expired
      if (link.expiration && link.expiration < Math.floor(Date.now() / 1000)) {
        // Link has expired, redirect to expired page
        return sendRedirect(event, '/expired', 302)
      }

      // Check if link is password protected
      if (link.password) {
        // Redirect to password entry page
        return sendRedirect(event, `/protected/${slug}`, 302)
      }

      event.context.link = link
      try {
        await useAccessLog(event)
      }
      catch (error) {
        console.error('Failed write access log:', error)
      }

      // Build target URL with UTM parameters if they exist
      let target = link.url
      const utmParams: Record<string, string> = {}

      if (link.utm_source)
        utmParams.utm_source = link.utm_source
      if (link.utm_medium)
        utmParams.utm_medium = link.utm_medium
      if (link.utm_campaign)
        utmParams.utm_campaign = link.utm_campaign
      if (link.utm_term)
        utmParams.utm_term = link.utm_term
      if (link.utm_content)
        utmParams.utm_content = link.utm_content

      // Add UTM parameters to the target URL
      if (Object.keys(utmParams).length > 0) {
        target = withQuery(target, utmParams)
      }

      // Also append query parameters from the short link if configured
      if (redirectWithQuery) {
        target = withQuery(target, getQuery(event))
      }

      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode)
    }
  }
})
