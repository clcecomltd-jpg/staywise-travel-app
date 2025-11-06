'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Timer,
  ListChecks,
  TrendingUp,
  LogOut,
  Plus,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuickAdd } from '../features/QuickAdd'
import { useKeyboardShortcuts } from '../features/KeyboardShortcuts'
import { syncService } from '@/lib/offline/sync'

const navigation = [
  { name: 'Today', href: '/today', icon: Calendar, shortcut: 't' },
  { name: 'Focus', href: '/focus', icon: Timer, shortcut: 'f' },
  { name: 'Routines', href: '/routines', icon: ListChecks, shortcut: 'r' },
  { name: 'Progress', href: '/progress', icon: TrendingUp, shortcut: 'p' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { openQuickAdd } = useKeyboardShortcuts()
  const [isOnline, setIsOnline] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Monitor online status
    const updateOnlineStatus = () => setIsOnline(syncService.getOnlineStatus())
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-xl font-bold text-primary">ADHD Planner</h1>
        </div>

        <div className="flex flex-1 flex-col gap-y-5 overflow-y-auto px-4 py-4">
          <Button
            onClick={openQuickAdd}
            className="w-full justify-start gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Quick Add (q)
          </Button>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 tap-target transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.name}</span>
                    <kbd className="hidden group-hover:inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-muted px-1 text-[10px] font-medium opacity-50">
                      {item.shortcut}
                    </kbd>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-orange-500" />
                  <span>Offline</span>
                </>
              )}
            </div>
            {user && (
              <div className="text-xs text-muted-foreground px-3 truncate">
                {user.email}
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex md:hidden h-14 items-center border-b px-4">
          <h1 className="text-lg font-bold text-primary">ADHD Planner</h1>
          <Button
            onClick={openQuickAdd}
            size="icon"
            className="ml-auto"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile navigation */}
        <nav className="flex md:hidden border-t bg-background">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 tap-target transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <QuickAdd />
    </div>
  )
}
