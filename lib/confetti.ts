import confetti from 'canvas-confetti'

/**
 * Celebration confetti animation
 * Respects prefers-reduced-motion
 */
export function celebrate() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) {
    // Skip animation for users who prefer reduced motion
    return
  }

  // Standard celebration
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  })
}

/**
 * Small burst animation for micro-wins
 */
export function microWin() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) return

  confetti({
    particleCount: 30,
    spread: 40,
    origin: { y: 0.7 },
    colors: ['#10B981', '#34D399', '#6EE7B7'],
    scalar: 0.8,
  })
}

/**
 * Epic celebration for major milestones
 */
export function epicCelebration() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) return

  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
    })

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

/**
 * Streak celebration (cascading effect)
 */
export function streakCelebration(days: number) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) return

  const colors =
    days >= 7
      ? ['#F59E0B', '#FBBF24', '#FCD34D'] // Gold for week+
      : ['#3B82F6', '#60A5FA', '#93C5FD'] // Blue for <week

  confetti({
    particleCount: days * 10,
    spread: 100,
    origin: { y: 0.5 },
    colors,
    shapes: ['circle', 'square'],
  })
}
