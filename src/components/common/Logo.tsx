import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showSubtitle = true }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const monogramSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const textSizes = {
    sm: 'text-[6px]',
    md: 'text-[8px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={`group inline-flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="VIVA FASHION ETHNIC Home"
    >
      <div
        className={`${sizeClasses[size]} rounded-full border border-[#D2AF9D]/70 bg-[#FAF7F2] p-0.5 flex items-center justify-center shadow-sm relative overflow-hidden transition-colors group-hover:border-[#C27D6E]`}
      >
        {/* Inner concentric ring */}
        <div className="w-full h-full rounded-full border border-[#DEC3B5]/50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDFB] to-[#F8F4EC] p-1 text-center">
          {/* Top subtle ornament arc */}
          <span className="text-[#C27D6E] text-[7px] leading-none mb-0.5 opacity-80">✦</span>
          
          {/* Monogram initials */}
          <span
            className={`font-serif ${monogramSizes[size]} font-bold tracking-tight text-[#191E28] leading-none select-none`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            VF
          </span>

          {/* Subtext */}
          {showSubtitle && size !== 'sm' && (
            <span
              className={`font-sans ${textSizes[size]} tracking-[0.18em] uppercase text-[#A66355] font-semibold mt-0.5 leading-none select-none`}
            >
              VIVA FASHION
            </span>
          )}
        </div>
      </div>
    </a>
  );
};
