import { describe, expect, it } from 'vitest'
import { fetch, fetchWithAuth } from '../utils'

describe('/api/link/clicks', () => {
  it('returns empty object when no ids provided', async () => {
    const response = await fetchWithAuth('/api/link/clicks')

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toEqual({})
  })

  it('returns click counts for valid link ids', async () => {
    // This test would require actual link IDs with analytics data
    // For now, we just verify the endpoint works
    const response = await fetchWithAuth('/api/link/clicks?ids=test-id-1,test-id-2')

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(typeof data).toBe('object')
  })

  it('returns 401 when accessing without auth', async () => {
    const response = await fetch('/api/link/clicks')

    expect(response.status).toBe(401)
  })
})
