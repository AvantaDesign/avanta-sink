# Avanta Design URL Shortener

A self-hosted URL shortener powered by [Sink](https://github.com/denolehov/sink) and deployed on Cloudflare Pages.

## 🚀 Features

- **Custom Domain**: `avanta.design` 
- **84 Migrated Links**: Successfully migrated from T2M URL shortener
- **Admin Dashboard**: Full management interface
- **Analytics**: Click tracking and performance metrics
- **Real-time Stats**: Live visitor tracking
- **Secure Authentication**: Token-based login system

## 🔧 Technical Stack

- **Framework**: Nuxt 3 with Nitro
- **Deployment**: Cloudflare Pages
- **Database**: Cloudflare KV
- **Analytics**: Cloudflare Analytics Engine
- **Authentication**: Custom token-based system

## 📁 Project Structure

```
avanta-sink/
├── Sink/                    # Main Sink application
│   ├── server/             # Server-side code
│   ├── app/                # Vue.js frontend
│   ├── nuxt.config.ts      # Nuxt configuration
│   └── .env                # Environment variables
├── T2M-URLs-2025-10-11-033321.csv  # Original T2M links
├── migrate_links.py        # Migration script
└── SINK_IMPLEMENTATION_PLAN.md     # Implementation plan
```

## 🌐 URLs

- **Production**: `https://avanta.design`
- **Dashboard**: `https://avanta.design/dashboard`
- **Login**: `https://avanta.design/dashboard/login`

## 🔐 Authentication

- **Token**: `1S#dDta2Cr%O7H`
- **Access**: Admin dashboard at `/dashboard/login`

## 📊 Migration Summary

- **Total Links**: 87 from T2M CSV
- **Successfully Migrated**: 84 links
- **Skipped**: 3 invalid URLs
- **Status**: ✅ Complete

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm/pnpm
- Cloudflare account
- Wrangler CLI

### Local Development

```bash
cd Sink
npm install
npm run dev
```

### Deployment

```bash
cd Sink
npm run build
npx wrangler pages deploy dist --project-name avanta-shortener
```

## 🔧 Configuration

### Environment Variables

- `NUXT_SITE_TOKEN`: Authentication token
- `NUXT_REDIRECT_STATUS_CODE`: HTTP redirect code (default: 302)
- `NUXT_LINK_CACHE_TTL`: Cache TTL in seconds
- `NUXT_HOME_URL`: Homepage URL
- `NUXT_CF_ACCOUNT_ID`: Cloudflare account ID
- `NUXT_CF_API_TOKEN`: Cloudflare API token
- `NUXT_DATASET`: Analytics dataset name

### Cloudflare Setup

1. **KV Namespace**: `avanta_shortener`
2. **Analytics Engine**: `avanta_shortener` dataset
3. **Pages Project**: `avanta-shortener`
4. **Custom Domain**: `avanta.design`

## 📈 Analytics

- **Click Tracking**: All link clicks are tracked
- **Geographic Data**: Visitor location tracking
- **Real-time Stats**: Live dashboard updates
- **Performance Metrics**: Response times and success rates

## 🔗 Link Management

### Creating Links

```bash
# Via API
curl -X POST https://avanta.design/api/link/create \
  -H "Authorization: Bearer 1S#dDta2Cr%O7H" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "slug": "example"}'
```

### Managing Links

- **Dashboard**: `https://avanta.design/dashboard/links`
- **Search**: Find links by URL or slug
- **Edit**: Update destination URLs
- **Delete**: Remove unwanted links
- **Analytics**: View click statistics

## 🚀 Deployment History

- **Initial Setup**: October 11, 2025
- **T2M Migration**: 84 links migrated successfully
- **Custom Domain**: `avanta.design` configured
- **Production**: Live on Cloudflare Pages

## 📝 Notes

- All original T2M links preserved in CSV format
- Migration script available for reference
- Token-based authentication for security
- Full analytics and management capabilities

## 🤝 Support

For issues or questions about this URL shortener setup, refer to:
- [Sink Documentation](https://github.com/denolehov/sink)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Nuxt Documentation](https://nuxt.com/)

---

**Last Updated**: October 11, 2025  
**Status**: ✅ Production Ready
