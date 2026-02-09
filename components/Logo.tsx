
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-full aspect-square flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* The JS geometric mark extracted from the central shape of the brand identity */}
        {/* Orange Accent parallelogram */}
        <path d="M35 38L48 25L58 35L45 48Z" fill="#FF8C00" />
        {/* White JS monogram path */}
        <path d="M35 55L50 70L70 50V30H80V50C80 75 50 85 25 60V40H35V55Z" fill="white" />
      </svg>
    </div>
    <span className="font-[Montserrat] font-extrabold text-2xl tracking-tighter text-white uppercase sm:inline">
      JESPREC
    </span>
  </div>
);

export default Logo;
