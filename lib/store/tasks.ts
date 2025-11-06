import { create } from 'zustand'
import type { Task, FocusSession } from '../types'
import { createClient } from '../supabase/client'
import { db } from '../offline/db'
import { syncService } from '../offline/sync'

interface TasksState {
  tasks: Task[]
  loading: boolean
  currentSession: FocusSession | null
  setTasks: (tasks: Task[]) => void
  addTask: (task: Partial<Task>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTasks: (userId: string) => Promise<void>
  startSession: (taskId?: string) => Promise<void>
  endSession: (completed: boolean) => Promise<void>
  addInterruption: () => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  currentSession: null,

  setTasks: (tasks) => set({ tasks }),

  addTask: async (task) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const newTask: Partial<Task> = {
      ...task,
      user_id: user.id,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: task.tags || [],
      priority: task.priority || 'medium',
      status: task.status || 'later',
    }

    // Optimistic update
    set((state) => ({
      tasks: [...state.tasks, newTask as Task],
    }))

    // Save to IndexedDB
    await db.tasks.add(newTask as Task)

    // Queue for sync
    await syncService.queueOperation('create', 'tasks', newTask)
  },

  updateTask: async (id, updates) => {
    const currentTasks = get().tasks
    const task = currentTasks.find((t) => t.id === id)

    if (!task) return

    const updatedTask = {
      ...task,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }))

    // Update IndexedDB
    await db.tasks.put(updatedTask)

    // Queue for sync
    await syncService.queueOperation('update', 'tasks', updatedTask)
  },

  deleteTask: async (id) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }))

    // Delete from IndexedDB
    await db.tasks.delete(id)

    // Queue for sync
    await syncService.queueOperation('delete', 'tasks', { id })
  },

  fetchTasks: async (userId) => {
    set({ loading: true })

    try {
      // Try to load from cache first
      const cachedTasks = await db.tasks
        .where('user_id')
        .equals(userId)
        .toArray()

      if (cachedTasks.length > 0) {
        set({ tasks: cachedTasks, loading: false })
      }

      // Then fetch from server if online
      if (syncService.getOnlineStatus()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          set({ tasks: data })
          // Update cache
          await db.tasks.bulkPut(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      set({ loading: false })
    }
  },

  startSession: async (taskId) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      user_id: user.id,
      task_id: taskId,
      start_time: new Date().toISOString(),
      interruptions_count: 0,
      completed: false,
      created_at: new Date().toISOString(),
    }

    set({ currentSession: newSession })

    // Save to IndexedDB
    await db.sessions.add(newSession)

    // Queue for sync
    await syncService.queueOperation('create', 'focus_sessions', newSession)
  },

  endSession: async (completed) => {
    const session = get().currentSession

    if (!session) return

    const updatedSession: FocusSession = {
      ...session,
      end_time: new Date().toISOString(),
      completed,
    }

    set({ currentSession: null })

    // Update IndexedDB
    await db.sessions.put(updatedSession)

    // Queue for sync
    await syncService.queueOperation('update', 'focus_sessions', updatedSession)
  },

  addInterruption: async () => {
    const session = get().currentSession

    if (!session) return

    const updatedSession: FocusSession = {
      ...session,
      interruptions_count: session.interruptions_count + 1,
    }

    set({ currentSession: updatedSession })

    // Update IndexedDB
    await db.sessions.put(updatedSession)
  },
}))
