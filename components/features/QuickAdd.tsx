'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useKeyboardShortcuts } from './KeyboardShortcuts'
import { useTasksStore } from '@/lib/store/tasks'
import { parseQuickAdd } from '@/lib/nlp/parser'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'

export function QuickAdd() {
  const { isQuickAddOpen, closeQuickAdd } = useKeyboardShortcuts()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const addTask = useTasksStore((state) => state.addTask)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isQuickAddOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isQuickAddOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    setLoading(true)

    try {
      const parsed = parseQuickAdd(input)

      await addTask({
        title: parsed.title,
        due: parsed.due?.toISOString(),
        priority: parsed.priority,
        tags: parsed.tags,
        project: parsed.project,
        status: 'later',
      })

      toast.success('Task added!', {
        description: `"${parsed.title}" has been added to your list.`,
      })

      setInput('')
      closeQuickAdd()
    } catch (error) {
      toast.error('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isQuickAddOpen} onOpenChange={(open) => !open && closeQuickAdd()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Add Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pay bill tomorrow 4pm #finance !high"
              className="text-lg h-12"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use #tags, !priority (high/medium/low), @project, and natural dates
              (today, tomorrow, next week, MM/DD)
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !input.trim()} className="flex-1">
              {loading ? 'Adding...' : 'Add Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeQuickAdd}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
          <p className="font-semibold">Keyboard shortcuts:</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded">q</kbd> anywhere to open Quick Add</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
