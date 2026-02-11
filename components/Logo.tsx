import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-11" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-full aspect-square flex items-center justify-center">
      <img src="/android-chrome-192x192.png" alt="Jesprec JS Mark" className="h-full w-full object-contain" />
    </div>
    <span className="font-[Montserrat] font-bold text-lg md:text-xl tracking-tight whitespace-nowrap text-foreground">
      Jesprec
    </span>
  </div>
);

export default Logo;