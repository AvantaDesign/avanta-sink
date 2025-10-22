import { provider } from 'std-env'
import { currentLocales } from './i18n/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'shadcn-nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  devtools: { enabled: true },

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    siteToken: process.env.NUXT_SITE_TOKEN || '1S#dDta2Cr%O7H',
    redirectStatusCode: process.env.NUXT_REDIRECT_STATUS_CODE || '301',
    linkCacheTtl: Number.parseInt(process.env.NUXT_LINK_CACHE_TTL || '60'),
    redirectWithQuery: process.env.NUXT_REDIRECT_WITH_QUERY === 'true',
    homeURL: process.env.NUXT_HOME_URL || '',
    cfAccountId: process.env.NUXT_CF_ACCOUNT_ID || '',
    cfApiToken: process.env.NUXT_CF_API_TOKEN || '',
    dataset: process.env.NUXT_DATASET || 'sink',
    aiModel: process.env.NUXT_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct',
    aiPrompt: process.env.NUXT_AI_PROMPT || `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    devMode: process.env.NODE_ENV === 'development',
    public: {
      previewMode: process.env.NUXT_PUBLIC_PREVIEW_MODE || '',
      slugDefaultLength: process.env.NUXT_PUBLIC_SLUG_DEFAULT_LENGTH || '6',
    },
  },

  routeRules: {
    '/': {
      redirect: {
        to: 'https://avantadesign.com',
        statusCode: 301,
      },
    },
    '/admin/**': {
      prerender: true,
      ssr: false,
    },
    '/admin': {
      redirect: '/admin/links',
    },
    '/dashboard/**': {
      redirect: '/admin/**',
    },
    '/dashboard': {
      redirect: '/admin',
    },
    '/api/**': {
      cors: process.env.NUXT_API_CORS === 'true',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    enforceModuleCompatibility: true,
  },

  nitro: {
    preset: 'cloudflare_module',
    experimental: {
      openAPI: true,
    },
    timing: true,
    openAPI: {
      production: 'runtime',
      meta: {
        title: 'Sink API',
        description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
      },
      route: '/_docs/openapi.json',
      ui: {
        scalar: {
          route: '/_docs/scalar',
        },
        swagger: {
          route: '/_docs/swagger',
        },
      },
    },
  },

  hub: {
    ai: true,
    analytics: true,
    blob: false,
    cache: false,
    database: false,
    kv: true,
    workers: provider !== 'cloudflare_pages',
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sink_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'en-US',
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
})
