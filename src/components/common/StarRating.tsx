import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  showCount = true,
  size = 'sm',
}) => {
  const iconSize = size === 'sm' ? 12 : 15;

  return (
    <div className="inline-flex items-center gap-1">
      <Star
        size={iconSize}
        className="fill-[#DCA134] text-[#DCA134] inline-block"
      />
      <span className="text-xs font-semibold text-[#191E28]">
        {rating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-[11px] text-[#71717A] ml-0.5">
          ({count})
        </span>
      )}
    </div>
  );
};
