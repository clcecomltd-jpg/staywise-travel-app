import React from 'react';
import { User, Home, Check } from 'lucide-react';

interface HostPickerCardProps {
  mode: 'guest' | 'host';
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export const HostPickerCard: React.FC<HostPickerCardProps> = ({
  mode,
  selected,
  onClick,
  className = ''
}) => {
  const config = {
    guest: {
      title: 'Guest Mode',
      subtitle: 'Access property info and local guides',
      icon: <User className="w-6 h-6" />,
      gradient: 'from-[#0D1B2A] to-[#1B263B]',
      iconBg: selected ? 'bg-indigo-500/25 border-indigo-400/40' : 'bg-indigo-500/20 border-indigo-400/30',
      iconColor: selected ? 'text-indigo-200' : 'text-indigo-300',
      glowColor: 'purple'
    },
    host: {
      title: 'Host Mode', 
      subtitle: 'Manage properties and guest guides',
      icon: <Home className="w-6 h-6" />,
      gradient: 'from-[#0B1F36] to-[#142850]',
      iconBg: selected ? 'bg-cyan-500/25 border-cyan-400/40' : 'bg-cyan-500/20 border-cyan-400/30',
      iconColor: selected ? 'text-cyan-200' : 'text-cyan-300',
      glowColor: 'aqua'
    }
  };

  const currentConfig = config[mode];

  return (
    <div 
      className={`cursor-pointer transition-all duration-300 transform relative ${
        selected ? '-translate-y-2' : 'hover:-translate-y-1'
      } ${className}`}
      onClick={onClick}
    >
      {/* Subtle thin white glow outside card for selection */}
      {selected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded-2xl blur-sm opacity-75" />
      )}
      
      <div className={`bg-gradient-to-br ${currentConfig.gradient} rounded-2xl p-6 border glass-card relative overflow-hidden ${
        selected ? 'border-white/20' : 'border-white/10 hover:border-white/15'
      }`} style={{ minHeight: '120px' }}>
        <div className="flex items-center space-x-4 relative z-10">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${currentConfig.iconBg}`}>
            <div className={`transition-all duration-300 ${currentConfig.iconColor}`}>
              {currentConfig.icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg font-medium mb-1">{currentConfig.title}</h3>
            <p className="text-white/70 text-sm">{currentConfig.subtitle}</p>
          </div>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-fade-in shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostPickerCard;