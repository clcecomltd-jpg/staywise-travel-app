'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react'

export default function ProgressPage() {
  // Mock data for MVP
  const stats = {
    today: {
      focusedMinutes: 75,
      completedTasks: 5,
      topDistraction: 'Social media',
    },
    week: {
      focusedMinutes: 320,
      completedTasks: 23,
      streak: 4,
    },
  }

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Progress</h1>
          <p className="text-muted-foreground">
            Track your focus and accomplishments
          </p>
        </div>

        {/* Today Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Today</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Focused Minutes
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.today.focusedMinutes}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(stats.today.focusedMinutes / 25)} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.today.completedTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep up the momentum!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Distraction
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {stats.today.topDistraction}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awareness is key
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* This Week */}
        <div>
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Focus Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(stats.week.focusedMinutes / 60)}h{' '}
                  {stats.week.focusedMinutes % 60}m
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(stats.week.focusedMinutes / 25)} sessions total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasks Completed
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.week.completedTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg {Math.floor(stats.week.completedTasks / 7)} per day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Streak
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {stats.week.streak} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep it going!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle>💡 Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              • Your most productive time is typically <strong>9-11 AM</strong>
            </p>
            <p>
              • You complete <strong>2.3x more tasks</strong> after a focus
              session
            </p>
            <p>
              • Tasks with high priority get done <strong>85% of the time</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
