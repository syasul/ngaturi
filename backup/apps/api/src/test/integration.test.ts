import { describe, test, expect } from 'bun:test'
import { app } from '../index'

describe('Hono API Integration Tests', () => {
  test('should return secure headers on all responses', async () => {
    const res = await app.request('/themes')
    
    expect(res.status).toBe(200)
    // Check for Helmet/secure headers
    expect(res.headers.get('x-frame-options')).toBe('SAMEORIGIN')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
  })

  test('should block unauthorized requests to protected routes', async () => {
    const res = await app.request('/orders/history')
    expect(res.status).toBe(401)
  })

  test('should return list of themes', async () => {
    const res = await app.request('/themes')
    const json = await res.json()
    expect(json.status).toBe('success')
    expect(Array.isArray(json.themes)).toBe(true)
  })

  test('should generate a valid sitemap.xml response', async () => {
    const res = await app.request('/sitemap.xml')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('xml')
    const text = await res.text()
    expect(text).toContain('<?xml')
    expect(text).toContain('<urlset')
    expect(text).toContain('https://ngaturi.id')
  })
})
