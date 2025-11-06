'use client'

import { useEffect, createContext, useContext, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface KeyboardShortcutsContextType {
  openQuickAdd: () => void
  closeQuickAdd: () => void
  isQuickAddOpen: boolean
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  openQuickAdd: () => {},
  closeQuickAdd: () => {},
  isQuickAddOpen: false,
})

export function useKeyboardShortcuts() {
  return useContext(KeyboardShortcutsContext)
}

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to work even in inputs
        if (e.key !== 'Escape') return
      }

      // Quick Add (q)
      if (e.key === 'q' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsQuickAddOpen(true)
      }

      // Today (t)
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push('/today')
      }

      // Focus (f)
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push('/focus')
      }

      // Routines (r)
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push('/routines')
      }

      // Progress (p)
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push('/progress')
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setIsQuickAddOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, pathname])

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        openQuickAdd: () => setIsQuickAddOpen(true),
        closeQuickAdd: () => setIsQuickAddOpen(false),
        isQuickAddOpen,
      }}
    >
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}
