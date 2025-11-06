import type { QuickAddParsedTask, Priority } from '../types'

export function parseQuickAdd(input: string): QuickAddParsedTask {
  let title = input
  let due: Date | undefined
  let priority: Priority | undefined
  let tags: string[] = []
  let project: string | undefined

  // Extract priority (!high, !medium, !low)
  const priorityMatch = input.match(/!(high|medium|low)/i)
  if (priorityMatch) {
    priority = priorityMatch[1].toLowerCase() as Priority
    title = title.replace(priorityMatch[0], '').trim()
  }

  // Extract tags (#tag)
  const tagMatches = input.matchAll(/#(\w+)/g)
  for (const match of tagMatches) {
    tags.push(match[1])
    title = title.replace(match[0], '').trim()
  }

  // Extract project (@project)
  const projectMatch = input.match(/@(\w+)/)
  if (projectMatch) {
    project = projectMatch[1]
    title = title.replace(projectMatch[0], '').trim()
  }

  // Extract due date
  const now = new Date()

  // Today
  if (/\btoday\b/i.test(input)) {
    due = new Date(now)
    title = title.replace(/\btoday\b/i, '').trim()

    // Check for time
    const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
      const meridiem = timeMatch[3]?.toLowerCase()

      if (meridiem === 'pm' && hours !== 12) hours += 12
      if (meridiem === 'am' && hours === 12) hours = 0

      due.setHours(hours, minutes, 0, 0)
      title = title.replace(timeMatch[0], '').trim()
    } else {
      due.setHours(17, 0, 0, 0) // Default to 5 PM
    }
  }

  // Tomorrow
  if (/\btomorrow\b/i.test(input)) {
    due = new Date(now)
    due.setDate(due.getDate() + 1)
    title = title.replace(/\btomorrow\b/i, '').trim()

    // Check for time
    const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
      const meridiem = timeMatch[3]?.toLowerCase()

      if (meridiem === 'pm' && hours !== 12) hours += 12
      if (meridiem === 'am' && hours === 12) hours = 0

      due.setHours(hours, minutes, 0, 0)
      title = title.replace(timeMatch[0], '').trim()
    } else {
      due.setHours(17, 0, 0, 0) // Default to 5 PM
    }
  }

  // Next week
  if (/\bnext week\b/i.test(input)) {
    due = new Date(now)
    due.setDate(due.getDate() + 7)
    due.setHours(17, 0, 0, 0)
    title = title.replace(/\bnext week\b/i, '').trim()
  }

  // Specific date (MM/DD or MM-DD)
  const dateMatch = input.match(/(\d{1,2})[/-](\d{1,2})/)
  if (dateMatch) {
    const month = parseInt(dateMatch[1]) - 1 // 0-indexed
    const day = parseInt(dateMatch[2])
    due = new Date(now.getFullYear(), month, day, 17, 0, 0, 0)
    title = title.replace(dateMatch[0], '').trim()
  }

  // Clean up extra whitespace
  title = title.replace(/\s+/g, ' ').trim()

  return {
    title,
    due,
    priority,
    tags,
    project,
  }
}
