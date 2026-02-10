import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-full aspect-square flex items-center justify-center">
      <img src="/public/logo.svg" alt="Jesprec JS Mark" className="h-full w-full" />
    </div>
    <span className="font-[Montserrat] font-[800] text-xl md:text-2xl tracking-tight whitespace-nowrap text-white">
      Jesprec <span className="ml-1.5">Studios</span>
    </span>
  </div>
);

export default Logo;