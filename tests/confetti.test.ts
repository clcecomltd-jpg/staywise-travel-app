import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  celebrate,
  microWin,
  epicCelebration,
  streakCelebration,
} from '@/lib/confetti'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Confetti utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMatchMedia(false) // User does not prefer reduced motion
  })

  describe('celebrate', () => {
    it('calls confetti when motion is allowed', () => {
      const confetti = require('canvas-confetti').default
      celebrate()
      expect(confetti).toHaveBeenCalled()
    })

    it('does not call confetti when reduced motion is preferred', () => {
      mockMatchMedia(true) // User prefers reduced motion
      const confetti = require('canvas-confetti').default
      celebrate()
      expect(confetti).not.toHaveBeenCalled()
    })
  })

  describe('microWin', () => {
    it('calls confetti with smaller particle count', () => {
      const confetti = require('canvas-confetti').default
      microWin()
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 30,
        })
      )
    })
  })

  describe('streakCelebration', () => {
    it('uses gold colors for 7+ day streaks', () => {
      const confetti = require('canvas-confetti').default
      streakCelebration(7)
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          colors: expect.arrayContaining(['#F59E0B']),
        })
      )
    })

    it('uses blue colors for < 7 day streaks', () => {
      const confetti = require('canvas-confetti').default
      streakCelebration(3)
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          colors: expect.arrayContaining(['#3B82F6']),
        })
      )
    })
  })
})
