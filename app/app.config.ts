export default defineAppConfig({
  title: 'Avanta Link Manager',
  email: 'hello@avantadesign.com',
  github: 'https://github.com/AvantaDesign/avanta-sink',
  twitter: 'https://avantadesign.com',
  telegram: '',
  mastodon: '',
  blog: 'https://avantadesign.com',
  description: 'Internal URL shortener and link management system for Avanta Design.',
  image: 'https://avanta.design/newicons/Isotipo Avanta PP_2.jpg',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'admin',
    'dashboard',
  ],
})
