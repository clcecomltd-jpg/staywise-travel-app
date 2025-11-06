import { describe, it, expect } from 'vitest'
import { formatDuration, isToday, isTomorrow } from '@/lib/utils'

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(59)).toBe('0:59')
    expect(formatDuration(60)).toBe('1:00')
    expect(formatDuration(125)).toBe('2:05')
    expect(formatDuration(3599)).toBe('59:59')
  })
})

describe('isToday', () => {
  it('returns true for today\'s date', () => {
    const today = new Date()
    expect(isToday(today)).toBe(true)
  })

  it('returns false for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(isToday(yesterday)).toBe(false)
  })

  it('returns false for tomorrow', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(isToday(tomorrow)).toBe(false)
  })
})

describe('isTomorrow', () => {
  it('returns true for tomorrow\'s date', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(isTomorrow(tomorrow)).toBe(true)
  })

  it('returns false for today', () => {
    const today = new Date()
    expect(isTomorrow(today)).toBe(false)
  })
})
