import Dexie, { Table } from 'dexie'
import type { Task, FocusSession, Routine, Distraction, Subtask } from '../types'

export interface PendingSync {
  id?: number
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: number
}

export class OfflineDatabase extends Dexie {
  tasks!: Table<Task>
  subtasks!: Table<Subtask>
  sessions!: Table<FocusSession>
  routines!: Table<Routine>
  distractions!: Table<Distraction>
  pendingSync!: Table<PendingSync>

  constructor() {
    super('ADHDPlannerDB')

    this.version(1).stores({
      tasks: 'id, user_id, status, due, created_at',
      subtasks: 'id, task_id',
      sessions: 'id, user_id, start_time',
      routines: 'id, user_id',
      distractions: 'id, user_id, session_id, timestamp',
      pendingSync: '++id, timestamp, table',
    })
  }
}

export const db = new OfflineDatabase()
