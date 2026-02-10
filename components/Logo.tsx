
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-full aspect-square flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Extracted JS mark from brand identity */}
        {/* Orange Accent */}
        <path d="M38 32L48 22L58 32L48 42Z" fill="#FF8C00" />
        {/* White JS path */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M40 50C40 44.4772 44.4772 40 50 40H70V30H80V55C80 68.8071 68.8071 80 55 80C41.1929 80 30 68.8071 30 55V45H40V50ZM50 70C58.2843 70 65 63.2843 65 55V50H50C50 55.5228 45.5228 60 40 60V65C45.5228 65 50 67.2386 50 70Z" 
          fill="white" 
        />
      </svg>
    </div>
    <span className="font-[Montserrat] font-[800] text-xl md:text-2xl tracking-tighter text-white uppercase whitespace-nowrap">
      JESPREC
    </span>
  </div>
);

export default Logo;
