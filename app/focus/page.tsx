'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useTasksStore } from '@/lib/store/tasks'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDuration } from '@/lib/utils'
import { Play, Pause, Square, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const POMODORO_DURATION = 25 * 60 // 25 minutes
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

export default function FocusPage() {
  const supabase = createClient()
  const {
    tasks,
    fetchTasks,
    currentSession,
    startSession,
    endSession,
    addInterruption,
  } = useTasksStore()

  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(POMODORO_DURATION)
  const [selectedTaskId, setSelectedTaskId] = useState<string>()
  const [sessionNotes, setSessionNotes] = useState('')
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

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleStart = async () => {
    if (!currentSession) {
      await startSession(selectedTaskId)
    }
    setIsRunning(true)
    toast.success('Focus session started! You got this!')
  }

  const handlePause = () => {
    setIsRunning(false)
    toast.info('Session paused. Take a breath.')
  }

  const handleStop = async () => {
    if (currentSession) {
      await endSession(false)
    }
    setIsRunning(false)
    setTimeLeft(duration)
    toast.info('Session ended.')
  }

  const handleComplete = async () => {
    if (currentSession) {
      await endSession(true)
    }
    setIsRunning(false)
    setTimeLeft(duration)

    toast.success('Session complete!', {
      description: 'Great job! Time for a break.',
    })

    // Play a gentle sound (optional, would need to add audio element)
  }

  const handleDistraction = async () => {
    await addInterruption()
    toast.info('Distraction logged', {
      description: 'It happens! Refocus and keep going.',
    })
  }

  const progress = ((duration - timeLeft) / duration) * 100

  const availableTasks = tasks.filter((t) => t.status !== 'done')

  return (
    <AppLayout>
      <div className="container max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Focus Timer</h1>
          <p className="text-muted-foreground">
            Stay focused with the Pomodoro technique
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="text-7xl md:text-9xl font-bold tabular-nums">
                {formatDuration(timeLeft)}
              </div>

              <Progress value={progress} className="h-3" />

              {currentSession && (
                <div className="text-sm text-muted-foreground">
                  Interruptions: {currentSession.interruptions_count}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
              {!isRunning ? (
                <div className="space-y-3">
                  <Select
                    value={selectedTaskId}
                    onValueChange={setSelectedTaskId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific task</SelectItem>
                      {availableTasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={duration === POMODORO_DURATION ? 'default' : 'outline'}
                      onClick={() => {
                        setDuration(POMODORO_DURATION)
                        setTimeLeft(POMODORO_DURATION)
                      }}
                    >
                      25 min
                    </Button>
                    <Button
                      variant={duration === SHORT_BREAK ? 'default' : 'outline'}
                      onClick={() => {
                        setDuration(SHORT_BREAK)
                        setTimeLeft(SHORT_BREAK)
                      }}
                    >
                      5 min
                    </Button>
                    <Button
                      variant={duration === LONG_BREAK ? 'default' : 'outline'}
                      onClick={() => {
                        setDuration(LONG_BREAK)
                        setTimeLeft(LONG_BREAK)
                      }}
                    >
                      15 min
                    </Button>
                  </div>

                  <Button
                    size="xl"
                    className="w-full"
                    onClick={handleStart}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Focus Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handlePause}
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={handleStop}
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Stop
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                    onClick={handleDistraction}
                  >
                    <AlertCircle className="mr-2 h-5 w-5" />
                    I'm Distracted
                  </Button>

                  <Textarea
                    placeholder="Session notes (optional)"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold">Tips for focused work:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Close unnecessary tabs and apps</li>
                <li>Put your phone on do-not-disturb</li>
                <li>Tell others you're in focus mode</li>
                <li>Take breaks between sessions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
