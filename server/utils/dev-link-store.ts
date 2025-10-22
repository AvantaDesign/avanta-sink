// Development mode link store - simple in-memory storage
// This replaces Cloudflare KV for development purposes

interface DevLink {
  id: string
  url: string
  slug: string
  comment?: string
  createdAt: number
  updatedAt: number
  expiration?: number
  expirationClicks?: number
  title?: string
  description?: string
  image?: string
  password?: string
  og_title?: string
  og_description?: string
  og_image?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

// Simple in-memory store for development
const devLinkStore = new Map<string, DevLink>()

export function getDevLink(slug: string): DevLink | null {
  return devLinkStore.get(slug) || null
}

export function setDevLink(slug: string, link: DevLink): void {
  devLinkStore.set(slug, link)
}

export function deleteDevLink(slug: string): boolean {
  return devLinkStore.delete(slug)
}

export function getAllDevLinks(): DevLink[] {
  return Array.from(devLinkStore.values())
}

// Add some sample links for development
if (process.env.NODE_ENV === 'development') {
  // Sample link for testing
  setDevLink('test', {
    id: 'test123',
    url: 'https://example.com',
    slug: 'test',
    title: 'Test Link',
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  })
  
  setDevLink('quantum-ai', {
    id: 'quantum123',
    url: 'https://openai.com',
    slug: 'quantum-ai',
    title: 'Quantum AI',
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  })
}
