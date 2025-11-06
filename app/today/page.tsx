'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useTasksStore } from '@/lib/store/tasks'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils'
import type { Task, TaskStatus } from '@/lib/types'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { celebrate } from '@/lib/confetti'
import { toast } from 'sonner'

export default function TodayPage() {
  const supabase = createClient()
  const { tasks, fetchTasks, updateTask, deleteTask, loading } = useTasksStore()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchTasks(user.id)
      }
    }
    getUser()
  }, [supabase])

  const tasksByStatus = {
    now: tasks.filter((t) => t.status === 'now'),
    next: tasks.filter((t) => t.status === 'next'),
    later: tasks.filter((t) => t.status === 'later'),
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status })
  }

  const handleComplete = async (task: Task) => {
    await updateTask(task.id, { status: 'done' })

    // Celebrate with confetti!
    celebrate()

    toast.success('Task completed!', {
      description: `"${task.title}" is done. Great work!`,
    })
  }

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId)
    toast.success('Task deleted')
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="group relative rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <button
          onClick={() => handleComplete(task)}
          className="focus-ring mt-0.5 rounded"
          aria-label="Complete task"
        >
          <Circle className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="mb-2 font-medium leading-none">{task.title}</h3>

          {task.notes && (
            <p className="mb-2 text-sm text-muted-foreground">{task.notes}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {task.priority && (
              <Badge
                variant={
                  task.priority === 'high'
                    ? 'destructive'
                    : task.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                }
              >
                {task.priority}
              </Badge>
            )}

            {task.due && (
              <span className="text-xs text-muted-foreground">
                {formatTime(new Date(task.due))}
              </span>
            )}

            {task.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(task.id)}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex gap-2">
        {task.status !== 'now' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(task.id, 'now')}
          >
            Move to Now
          </Button>
        )}
        {task.status !== 'next' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(task.id, 'next')}
          >
            Move to Next
          </Button>
        )}
        {task.status !== 'later' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(task.id, 'later')}
          >
            Move to Later
          </Button>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Today</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Now Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                Now ({tasksByStatus.now.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.now.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  What's your main focus?
                </p>
              ) : (
                tasksByStatus.now.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Next Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                Next ({tasksByStatus.next.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.next.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  What's coming up next?
                </p>
              ) : (
                tasksByStatus.next.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Later Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                Later ({tasksByStatus.later.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.later.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Add tasks for later
                </p>
              ) : (
                tasksByStatus.later.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
