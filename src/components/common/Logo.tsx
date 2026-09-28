import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showSubtitle = true, variant = 'dark' }) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const subSizes = {
    sm: 'text-[6px]',
    md: 'text-[8px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  };

  const isLight = variant === 'light';

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={`group inline-flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="VIVA FASHION Home"
    >
      <div className="flex flex-col items-center">
        {/* Lotus Icon */}
        <svg
          viewBox="0 0 40 40"
          className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-12 h-12'} mb-0.5`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4C20 4 14 12 14 18C14 22 16.5 26 20 28C23.5 26 26 22 26 18C26 12 20 4 20 4Z"
            className={`${isLight ? 'fill-white' : 'fill-[#C2185B]'} transition-colors`}
          />
          <path
            d="M8 14C8 14 4 20 4 24C4 27 6 30 8 31C10 30 12 27 12 24C12 20 8 14 8 14Z"
            className={`${isLight ? 'fill-white/80' : 'fill-[#C2185B]/80'} transition-colors`}
          />
          <path
            d="M32 14C32 14 36 20 36 24C36 27 34 30 32 31C30 30 28 27 28 24C28 20 32 14 32 14Z"
            className={`${isLight ? 'fill-white/80' : 'fill-[#C2185B]/80'} transition-colors`}
          />
          <path
            d="M12 10C12 10 8 16 8 20C8 23 10 26 12 27C14 26 16 23 16 20C16 16 12 10 12 10Z"
            className={`${isLight ? 'fill-white/60' : 'fill-[#C2185B]/60'} transition-colors`}
          />
          <path
            d="M28 10C28 10 32 16 32 20C32 23 30 26 28 27C26 26 24 23 24 20C24 16 28 10 28 10Z"
            className={`${isLight ? 'fill-white/60' : 'fill-[#C2185B]/60'} transition-colors`}
          />
        </svg>

        {/* Brand Name */}
        <span
          className={`${textSizes[size]} font-serif font-bold tracking-wide ${isLight ? 'text-white' : 'text-[#1A1A2E]'} leading-none select-none`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          VIVA
        </span>
        {showSubtitle && (
          <span
            className={`${subSizes[size]} tracking-[0.22em] uppercase ${isLight ? 'text-white/80' : 'text-[#C2185B]'} font-semibold mt-0.5 leading-none select-none`}
          >
            FASHION
          </span>
        )}
      </div>
    </a>
  );
};
