import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Vitest Setup', () => {
    it('should pass', () => {
        expect(true).toBe(true)
    })

    it('renders a heading', () => {
        render(<h1>Hello Vitest</h1>)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('Hello Vitest')
    })
})
