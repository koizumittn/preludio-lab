import { describe, it, expect } from 'vitest'
import { SITE_NAME, LOCALES } from './constants'

describe('Constants', () => {
    it('should have the correct site name', () => {
        expect(SITE_NAME).toBe('PreludioLab')
    })

    it('should contain required locales', () => {
        expect(LOCALES).toContain('ja')
        expect(LOCALES).toContain('en')
        expect(LOCALES).toHaveLength(7)
    })
})
