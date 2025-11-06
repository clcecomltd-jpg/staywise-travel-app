import { describe, it, expect } from 'vitest'
import { parseQuickAdd } from '@/lib/nlp/parser'

describe('parseQuickAdd', () => {
  it('parses basic task title', () => {
    const result = parseQuickAdd('Buy groceries')
    expect(result.title).toBe('Buy groceries')
    expect(result.priority).toBeUndefined()
    expect(result.tags).toEqual([])
  })

  it('parses priority', () => {
    const result = parseQuickAdd('Important task !high')
    expect(result.title).toBe('Important task')
    expect(result.priority).toBe('high')
  })

  it('parses tags', () => {
    const result = parseQuickAdd('Buy milk #groceries #shopping')
    expect(result.title).toBe('Buy milk')
    expect(result.tags).toEqual(['groceries', 'shopping'])
  })

  it('parses project', () => {
    const result = parseQuickAdd('Finish report @work')
    expect(result.title).toBe('Finish report')
    expect(result.project).toBe('work')
  })

  it('parses complex task', () => {
    const result = parseQuickAdd('Pay bill tomorrow 4pm #finance !high @personal')
    expect(result.title).toBe('Pay bill')
    expect(result.priority).toBe('high')
    expect(result.tags).toEqual(['finance'])
    expect(result.project).toBe('personal')
    expect(result.due).toBeDefined()
  })

  it('handles "today" keyword', () => {
    const result = parseQuickAdd('Call mom today')
    expect(result.title).toBe('Call mom')
    expect(result.due).toBeDefined()
  })

  it('handles "tomorrow" keyword', () => {
    const result = parseQuickAdd('Meeting tomorrow')
    expect(result.title).toBe('Meeting')
    expect(result.due).toBeDefined()
  })
})
