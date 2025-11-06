'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ListChecks } from 'lucide-react'
import { toast } from 'sonner'

// Mock routines data for MVP
const mockRoutines = [
  {
    id: '1',
    title: 'Morning Routine',
    cadence: 'daily',
    steps: [
      'Take medication',
      'Review today\'s tasks',
      'Set top 3 priorities',
      'Clear workspace',
    ],
  },
  {
    id: '2',
    title: 'Evening Wind Down',
    cadence: 'daily',
    steps: [
      'Review completed tasks',
      'Plan tomorrow',
      'Clear desk',
      'Set out tomorrow\'s essentials',
    ],
  },
  {
    id: '3',
    title: 'Weekly Review',
    cadence: 'weekly',
    steps: [
      'Review past week\'s achievements',
      'Plan next week\'s goals',
      'Update project list',
      'Schedule focus time',
    ],
  },
]

export default function RoutinesPage() {
  const handleSpawnTasks = (routine: typeof mockRoutines[0]) => {
    toast.success(`Tasks spawned from "${routine.title}"`, {
      description: 'Check your Today page!',
    })
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Routines</h1>
          <p className="text-muted-foreground">
            Build consistent habits with structured routines
          </p>
        </div>

        <div className="grid gap-4">
          {mockRoutines.map((routine) => (
            <Card key={routine.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    {routine.title}
                  </CardTitle>
                  <Button onClick={() => handleSpawnTasks(routine)}>
                    Add to Today
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {routine.cadence}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {routine.steps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Checkbox id={`${routine.id}-${index}`} />
                      <label
                        htmlFor={`${routine.id}-${index}`}
                        className="text-sm cursor-pointer"
                      >
                        {step}
                      </label>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              💡 Tip: Routines help reduce decision fatigue and build momentum.
              Start small and be consistent!
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
