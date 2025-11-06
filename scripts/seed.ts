/**
 * Seed script for demo data
 * Run with: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Seeding database with demo data...')

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('❌ Not authenticated. Please sign in first.')
    process.exit(1)
  }

  console.log(`✅ Authenticated as ${user.email}`)

  // Create demo tasks
  const tasks = [
    {
      user_id: user.id,
      title: 'Review project proposal',
      notes: 'Check budget and timeline sections',
      priority: 'high',
      status: 'now',
      tags: ['work', 'urgent'],
      project: 'ClientProject',
    },
    {
      user_id: user.id,
      title: 'Schedule dentist appointment',
      priority: 'medium',
      status: 'next',
      tags: ['health', 'personal'],
    },
    {
      user_id: user.id,
      title: 'Buy groceries',
      notes: 'Milk, eggs, bread, vegetables',
      priority: 'medium',
      status: 'later',
      tags: ['errands'],
    },
    {
      user_id: user.id,
      title: 'Plan weekend trip',
      priority: 'low',
      status: 'later',
      tags: ['personal', 'fun'],
    },
    {
      user_id: user.id,
      title: 'Complete expense report',
      priority: 'high',
      status: 'next',
      tags: ['work', 'admin'],
      project: 'Admin',
    },
  ]

  const { data: createdTasks, error: tasksError } = await supabase
    .from('tasks')
    .insert(tasks)
    .select()

  if (tasksError) {
    console.error('❌ Error creating tasks:', tasksError)
  } else {
    console.log(`✅ Created ${createdTasks?.length} demo tasks`)
  }

  // Create demo routines
  const routines = [
    {
      user_id: user.id,
      title: 'Morning Routine',
      cadence: 'daily',
      steps: [
        'Take medication',
        'Review today\'s tasks',
        'Set top 3 priorities',
        'Clear workspace',
      ],
      suggested_start_time: '08:00:00',
      active: true,
    },
    {
      user_id: user.id,
      title: 'Evening Wind Down',
      cadence: 'daily',
      steps: [
        'Review completed tasks',
        'Plan tomorrow',
        'Clear desk',
        'Set out tomorrow\'s essentials',
      ],
      suggested_start_time: '20:00:00',
      active: true,
    },
    {
      user_id: user.id,
      title: 'Weekly Review',
      cadence: 'weekly',
      steps: [
        'Review past week\'s achievements',
        'Plan next week\'s goals',
        'Update project list',
        'Schedule focus time',
      ],
      active: true,
    },
  ]

  const { data: createdRoutines, error: routinesError } = await supabase
    .from('routines')
    .insert(routines)
    .select()

  if (routinesError) {
    console.error('❌ Error creating routines:', routinesError)
  } else {
    console.log(`✅ Created ${createdRoutines?.length} demo routines`)
  }

  // Create demo focus session
  const session = {
    user_id: user.id,
    task_id: createdTasks?.[0]?.id,
    start_time: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 min ago
    end_time: new Date().toISOString(),
    interruptions_count: 1,
    completed: true,
    notes: 'Good focus session, one phone distraction',
  }

  const { error: sessionError } = await supabase
    .from('focus_sessions')
    .insert(session)

  if (sessionError) {
    console.error('❌ Error creating session:', sessionError)
  } else {
    console.log('✅ Created demo focus session')
  }

  console.log('\n🎉 Seeding complete!')
  console.log('Visit http://localhost:3000/today to see your demo data')
}

seed().catch(console.error)
