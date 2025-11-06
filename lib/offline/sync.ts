import { createClient } from '../supabase/client'
import { db, type PendingSync } from './db'

export class SyncService {
  private supabase = createClient()
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  private isSyncing = false

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.syncPending()
      })
      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }

  async queueOperation(
    type: 'create' | 'update' | 'delete',
    table: string,
    data: any
  ) {
    await db.pendingSync.add({
      type,
      table,
      data,
      timestamp: Date.now(),
    })

    if (this.isOnline) {
      this.syncPending()
    }
  }

  async syncPending() {
    if (this.isSyncing || !this.isOnline) return

    this.isSyncing = true

    try {
      const pending = await db.pendingSync.orderBy('timestamp').toArray()

      for (const operation of pending) {
        try {
          await this.executeOperation(operation)
          await db.pendingSync.delete(operation.id!)
        } catch (error) {
          console.error('Failed to sync operation:', error)
          // Keep the operation in queue for retry
          break
        }
      }
    } finally {
      this.isSyncing = false
    }
  }

  private async executeOperation(operation: PendingSync) {
    const { type, table, data } = operation

    switch (type) {
      case 'create':
        await this.supabase.from(table).insert(data)
        break
      case 'update':
        await this.supabase.from(table).update(data).eq('id', data.id)
        break
      case 'delete':
        await this.supabase.from(table).delete().eq('id', data.id)
        break
    }
  }

  async fetchAndCache(userId: string) {
    if (!this.isOnline) return

    try {
      // Fetch and cache tasks
      const { data: tasks } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)

      if (tasks) {
        await db.tasks.bulkPut(tasks)
      }

      // Fetch and cache routines
      const { data: routines } = await this.supabase
        .from('routines')
        .select('*')
        .eq('user_id', userId)

      if (routines) {
        await db.routines.bulkPut(routines)
      }

      // Fetch and cache sessions (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: sessions } = await this.supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', weekAgo.toISOString())

      if (sessions) {
        await db.sessions.bulkPut(sessions)
      }
    } catch (error) {
      console.error('Failed to fetch and cache:', error)
    }
  }

  getOnlineStatus() {
    return this.isOnline
  }
}

export const syncService = new SyncService()
