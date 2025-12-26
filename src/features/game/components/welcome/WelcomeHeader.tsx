
import React from 'react';

interface WelcomeHeaderProps {
  themeColor: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ themeColor }) => {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 mb-4">
        <div className="flex items-center gap-6 opacity-90 mb-4">
             <div className="h-[2px] w-32 transition-colors duration-500" style={{ background: `linear-gradient(to right, transparent, ${themeColor})` }}></div>
             <div className="text-2xl tracking-[0.3em] font-black uppercase transition-colors duration-500 shadow-black drop-shadow-lg" style={{ color: themeColor }}>
                HỆ THỐNG KHÔNG GIAN
             </div>
             <div className="h-[2px] w-32 transition-colors duration-500" style={{ background: `linear-gradient(to left, transparent, ${themeColor})` }}></div>
        </div>
        <h1 className="text-8xl font-black text-white uppercase tracking-wider leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] glitch-text" data-text="SĂN SAO">
          SĂN SAO
        </h1>
    </div>
  );
};
