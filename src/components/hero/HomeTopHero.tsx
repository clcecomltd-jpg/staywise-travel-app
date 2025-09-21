import React, { type CSSProperties, useEffect, useMemo, useState } from 'react'
import {
  CalendarCheck,
  KeyRound,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
  Wifi
} from 'lucide-react'
import { cn } from '../../lib/utils'

type HomeTopHeroActionHandlers = {
  onViewBookings?: () => void
  onOpenCheckInGuide?: () => void
  onOpenMessages?: () => void
  onPropertyClick?: () => void
}

export type HomeTopHeroProps = HomeTopHeroActionHandlers & {
  guestFirstName: string
  propertyName: string
  checkInISO?: string
  checkOutISO?: string
  unreadMessages?: number
  onboardingProgress?: number // 0..1
  isSuperhost?: boolean
  isLoading?: boolean
  hookText?: string
  readinessLabel?: string
  weatherLabel?: string
  className?: string
}

const clampProgress = (value: number | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, Math.round(value)))
}

export function HomeTopHero({
  guestFirstName,
  propertyName,
  checkInISO,
  checkOutISO,
  unreadMessages = 0,
  onboardingProgress = 0,
  isSuperhost = false,
  isLoading = false,
  hookText,
  readinessLabel = 'Trip readiness',
  weatherLabel,
  className,
  onViewBookings,
  onOpenCheckInGuide,
  onOpenMessages,
  onPropertyClick
}: HomeTopHeroProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches)
    }

    updateMotionPreference(mediaQuery)

    const listener = (event: MediaQueryListEvent) => updateMotionPreference(event)
    mediaQuery.addEventListener('change', listener)

    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
    } catch (error) {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    }
  }, [])

  const checkInDisplay = useMemo(() => {
    if (!checkInISO) return null

    const date = new Date(checkInISO)
    if (Number.isNaN(date.getTime())) return null

    return dateFormatter.format(date)
  }, [checkInISO, dateFormatter])

  const checkOutDisplay = useMemo(() => {
    if (!checkOutISO) return null

    const date = new Date(checkOutISO)
    if (Number.isNaN(date.getTime())) return null

    return dateFormatter.format(date)
  }, [checkOutISO, dateFormatter])

  const progressPercent = clampProgress(onboardingProgress * 100)
  const progressStep = clampProgress(onboardingProgress * 5)
  const greetedName = guestFirstName?.trim().split(' ')[0] ?? 'Guest'
  const avatarInitial = greetedName.charAt(0).toUpperCase() || 'G'
  const dynamicHook = hookText ?? 'Your stay, perfectly staged for you.'
  const reducedAnimation = prefersReducedMotion || isLoading

  const progressStyles = useMemo(() => {
    const base: (CSSProperties & { '--progress-target'?: string }) = {
      width: `${progressPercent}%`
    }

    if (!reducedAnimation) {
      base.transition = 'width 0.8s var(--ease-out)'
    }

    base['--progress-target'] = `${progressPercent}%`
    return base
  }, [progressPercent, reducedAnimation])

  const gradientClasses = 'absolute inset-0 pointer-events-none'
  const baseSectionClasses = cn(
    'glass-card relative overflow-hidden',
    'p-5 sm:p-6 md:p-7',
    'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--ios-blue)]',
    !reducedAnimation && 'animate-rise-in',
    className
  )

  const heroContent = (
    <div className="relative z-10 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="grid h-12 w-12 place-items-center rounded-full text-lg font-semibold uppercase shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))',
                  color: 'var(--foreground)'
                }}
                aria-hidden
              >
                {avatarInitial}
              </div>
              <span
                className="absolute -bottom-1 -right-1 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-black"
                style={{
                  background: 'linear-gradient(135deg, var(--ios-blue), var(--brand-orange-end))'
                }}
                aria-hidden
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="home-hero-title" className="text-[length:var(--text-hero)] font-medium leading-tight">
                  Welcome back, {greetedName}
                </h1>
                <span aria-hidden className="text-xl">👋</span>
              </div>
              <span className="mt-1 block text-sm text-muted-foreground">{dynamicHook}</span>
              <div
                aria-hidden
                className="mt-3 h-0.5 w-20 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--ios-blue), var(--brand-orange-start))'
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {weatherLabel && (
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium glass-button">
                <Sparkles className="h-4 w-4 opacity-80" aria-hidden />
                <span>{weatherLabel}</span>
              </div>
            )}
            {isSuperhost && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-orange-start), var(--brand-orange-end))',
                  color: 'white',
                  boxShadow: '0 0 16px rgba(255, 195, 113, 0.18)'
                }}
              >
                <Star className="h-4 w-4" aria-hidden />
                Superhost
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onPropertyClick}
          className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/20 px-4 py-3 text-left text-sm font-semibold text-primary-foreground transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ios-blue)] dark:border-white/10 dark:bg-white/5 dark:text-white"
          style={{
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)'
          }}
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 opacity-80" aria-hidden />
            <span className="line-clamp-1">{propertyName}</span>
          </span>
          <span className="text-xs font-medium text-muted-foreground transition group-hover:text-foreground">
            View property
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {checkInDisplay && (
              <div className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 backdrop-blur">
                <CalendarCheck className="h-4 w-4" aria-hidden />
                <span>
                  <strong className="font-semibold">Check-in</strong> {checkInDisplay}
                </span>
              </div>
            )}
            {checkOutDisplay && (
              <div className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 backdrop-blur">
                <CalendarCheck className="h-4 w-4 -scale-x-100" aria-hidden />
                <span>
                  <strong className="font-semibold">Check-out</strong> {checkOutDisplay}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 backdrop-blur">
              <Wifi className="h-4 w-4" aria-hidden />
              <span>Wi-Fi ready</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wide">{readinessLabel}</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label={readinessLabel}
        >
          <div
            className={cn('h-full rounded-full bg-primary', !reducedAnimation && 'animate-progress')}
            style={progressStyles}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ActionButton icon={CalendarCheck} label="View bookings" onClick={onViewBookings} />
          <ActionButton icon={KeyRound} label="Check-in guide" onClick={onOpenCheckInGuide} />
          <ActionButton
            icon={MessageCircle}
            label="Messages"
            onClick={onOpenMessages}
            badgeCount={unreadMessages}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Onboarding {progressStep}/5 • Every detail’s synced for your arrival.
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section
        aria-labelledby="home-hero-title"
        role="group"
        aria-busy="true"
        className={cn(baseSectionClasses, 'animate-none')}
        style={{ borderRadius: 'var(--glass-radius)' }}
      >
        <GradientBackdrop className={gradientClasses} />
        <div className="relative z-10 flex flex-col gap-5">
          <span id="home-hero-title" className="sr-only">
            Welcome back
          </span>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/20" aria-hidden />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-full bg-white/20" aria-hidden />
                  <div className="h-3 w-48 rounded-full bg-white/10" aria-hidden />
                </div>
              </div>
              <div className="h-4 w-20 rounded-full bg-white/10" aria-hidden />
            </div>
            <div className="h-12 w-full rounded-2xl bg-white/10" aria-hidden />
          </div>
          <div className="animate-pulse space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-9 w-32 rounded-xl bg-white/10" aria-hidden />
              <div className="h-9 w-32 rounded-xl bg-white/10" aria-hidden />
              <div className="h-9 w-28 rounded-xl bg-white/10" aria-hidden />
            </div>
            <div className="h-2 w-full rounded-full bg-white/10" aria-hidden />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="h-12 rounded-xl bg-white/10" aria-hidden />
              <div className="h-12 rounded-xl bg-white/10" aria-hidden />
              <div className="h-12 rounded-xl bg-white/10" aria-hidden />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      role="region"
      aria-labelledby="home-hero-title"
      className={baseSectionClasses}
      style={{ borderRadius: 'var(--glass-radius)' }}
    >
      <GradientBackdrop className={gradientClasses} />
      {heroContent}
    </section>
  )
}

type ActionButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  onClick?: () => void
  badgeCount?: number
}

function ActionButton({ icon: Icon, label, onClick, badgeCount = 0 }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-12 items-center justify-center gap-2 rounded-xl glass-button px-4 text-sm font-semibold text-foreground transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ios-blue)]"
    >
      <Icon className="h-5 w-5 opacity-90" aria-hidden />
      <span>{label}</span>
      {badgeCount > 0 && (
        <span
          className="absolute -top-1 -right-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm"
          aria-label={`${badgeCount} unread messages`}
        >
          {badgeCount}
        </span>
      )}
    </button>
  )
}

function GradientBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn(className, 'overflow-hidden')} aria-hidden>
      <div
        className="absolute inset-0 opacity-95 transition-opacity duration-500 dark:hidden"
        style={{
          background: 'linear-gradient(135deg, var(--bg-light-gradient-start), var(--bg-light-gradient-end))'
        }}
      />
      <div
        className="absolute inset-0 hidden opacity-95 transition-opacity duration-500 dark:block"
        style={{
          background: 'linear-gradient(135deg, var(--bg-dark-gradient-start), var(--bg-dark-gradient-end))'
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.18), transparent 60%)'
        }}
      />
    </div>
  )
}

export default HomeTopHero
