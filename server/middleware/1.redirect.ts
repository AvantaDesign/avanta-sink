import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'
import { parsePath, withQuery } from 'ufo'
import { getDevLink } from './utils/dev-link-store'

const { select } = SqlBricks

export default eventHandler(async (event) => {
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, '')) // remove leading and trailing slashes
  const { slugRegex, reserveSlug } = useAppConfig(event)
  const { homeURL, linkCacheTtl, redirectWithQuery, caseSensitive, devMode } = useRuntimeConfig(event)
  const { cloudflare } = event.context

  if (event.path === '/' && homeURL)
    return sendRedirect(event, homeURL)

  // Development mode fallback - skip KV lookup if cloudflare context is not available
  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug)) {
    let link: z.infer<typeof LinkSchema> | null = null

    // In development mode without Cloudflare KV, use in-memory store
    if (!cloudflare || devMode) {
      console.log('Development mode: Using in-memory link store for:', slug)
      link = getDevLink(slug)
    } else {
      const { KV } = cloudflare.env

      const getLink = async (key: string) =>
        await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

      const lowerCaseSlug = slug.toLowerCase()
      link = await getLink(caseSensitive ? slug : lowerCaseSlug)

      // fallback to original slug if caseSensitive is false and the slug is not found
      if (!caseSensitive && !link && lowerCaseSlug !== slug) {
        console.log('original slug fallback:', `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`)
        link = await getLink(slug)
      }
    }

    if (link) {
      // Check if link has expired by date
      if (link.expiration && link.expiration < Math.floor(Date.now() / 1000)) {
        // Link has expired, redirect to expired page
        return sendRedirect(event, '/expired', 302)
      }

      // Check if link has expired by click count
      if (link.expirationClicks) {
        try {
          const { dataset } = useRuntimeConfig(event)
          const sql = select('SUM(_sample_interval) as count')
            .from(dataset)
            .where('index1', link.id)
            .toString()
          const result = await useWAE(event, sql)
          const clickCount = result?.[0]?.count || 0

          if (clickCount >= link.expirationClicks) {
            // Link has exceeded click limit, redirect to expired page
            return sendRedirect(event, '/expired', 302)
          }
        }
        catch (error) {
          console.error('Failed to check click count:', error)
          // Continue with redirect even if click count check fails
        }
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

      // Check if link has custom Open Graph tags
      if (link.og_title || link.og_description || link.og_image) {
        // Return HTML with OG tags and JavaScript redirect
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${link.og_title || link.title || 'Redirecting...'}</title>
  ${link.og_title ? `<meta property="og:title" content="${link.og_title}" />` : ''}
  ${link.og_description ? `<meta property="og:description" content="${link.og_description}" />` : ''}
  ${link.og_image ? `<meta property="og:image" content="${link.og_image}" />` : ''}
  <meta property="og:url" content="${target}" />
  <meta property="og:type" content="website" />
  ${link.og_title ? `<meta name="twitter:card" content="summary_large_image" />` : ''}
  ${link.og_title ? `<meta name="twitter:title" content="${link.og_title}" />` : ''}
  ${link.og_description ? `<meta name="twitter:description" content="${link.og_description}" />` : ''}
  ${link.og_image ? `<meta name="twitter:image" content="${link.og_image}" />` : ''}
  <meta http-equiv="refresh" content="0;url=${target}">
  <script>window.location.href = ${JSON.stringify(target)};</script>
</head>
<body>
  <p>Redirecting to <a href="${target}">${target}</a>...</p>
</body>
</html>`
        setHeader(event, 'Content-Type', 'text/html')
        return html
      }

      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode)
    }
  }
})
