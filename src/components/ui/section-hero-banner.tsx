import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface SectionHeroBannerProps {
  title: string;
  icon: LucideIcon;
  description: string;
  isOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeroBanner: React.FC<SectionHeroBannerProps> = ({
  title,
  icon: Icon,
  description,
  isOpen = false,
  className,
  children
}) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 group",
      "border border-white/20 backdrop-blur-xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)]",
      isOpen
        ? "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"
        : "bg-gradient-to-br from-white/5 via-white/3 to-white/5 hover:bg-gradient-to-br hover:from-blue-500/5 hover:via-purple-500/5 hover:to-indigo-500/5",
      className
    )}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div
          className={cn(
            "absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-10 transition-all duration-500",
            isOpen ? "opacity-20 scale-110" : "group-hover:opacity-15"
          )}
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
          }}
        />
        <div
          className={cn(
            "absolute -bottom-6 -left-6 w-16 h-16 rounded-full opacity-8 transition-all duration-500",
            isOpen ? "opacity-15 scale-110" : "group-hover:opacity-12"
          )}
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Glass overlay */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg"
              : "bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30"
          )}>
            <Icon className={cn(
              "w-6 h-6 transition-all duration-300",
              isOpen ? "text-white" : "text-blue-400 group-hover:text-blue-300"
            )} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-bold transition-all duration-300",
              isOpen ? "text-white" : "text-white/95 group-hover:text-white"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-sm transition-all duration-300",
              isOpen ? "text-white/80" : "text-white/70 group-hover:text-white/80"
            )}>
              {description}
            </p>
          </div>
        </div>

        {/* Custom trigger indicator */}
        <div className="flex items-center space-x-2">
          {children}
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-white/20 rotate-180"
              : "bg-white/10 group-hover:bg-white/15"
          )}>
            <svg
              className="w-3 h-3 text-white/80 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};