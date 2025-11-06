export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'now' | 'next' | 'later' | 'done'
export type RoutineCadence = 'daily' | 'weekly' | 'custom'

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  notes?: string
  priority: Priority
  status: TaskStatus
  due?: string
  estimate?: number // minutes
  project?: string
  tags: string[]
  created_at: string
  updated_at: string
  order_index?: number
}

export interface Subtask {
  id: string
  task_id: string
  title: string
  done: boolean
  created_at: string
}

export interface FocusSession {
  id: string
  user_id: string
  task_id?: string
  start_time: string
  end_time?: string
  notes?: string
  interruptions_count: number
  completed: boolean
  created_at: string
}

export interface Routine {
  id: string
  user_id: string
  title: string
  cadence: RoutineCadence
  steps: string[]
  suggested_start_time?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Distraction {
  id: string
  user_id: string
  session_id?: string
  timestamp: string
  type?: string
  note?: string
}

export interface QuickAddParsedTask {
  title: string
  due?: Date
  priority?: Priority
  tags: string[]
  project?: string
}
