
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RocketStyle, getRocketSvg } from '../../data/game-skin-rocket';

interface HangarPreviewProps {
  currentSkin: RocketStyle;
  onPrev: () => void;
  onNext: () => void;
  hasMultipleSkins: boolean;
}

export const HangarPreview: React.FC<HangarPreviewProps> = ({ 
  currentSkin, onPrev, onNext, hasMultipleSkins 
}) => {
  const themeColor = currentSkin.primaryColor;
  const svgString = getRocketSvg(currentSkin.id);
  const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));

  return (
    <div className="col-span-6 h-full flex flex-col items-center justify-center relative">
        
        {/* Hangar Floor Grid - Dynamic Color */}
        <div 
            className="absolute bottom-20 w-[500px] h-[500px] border border-slate-800/50 rounded-full opacity-30 [transform:rotateX(75deg)] transition-colors duration-500 animate-[spin_20s_linear_infinite]"
            style={{ background: `radial-gradient(circle, ${themeColor}15 0%, transparent 70%)` }}
        ></div>
        <div 
            className="absolute bottom-20 w-[300px] h-[300px] border rounded-full opacity-50 [transform:rotateX(75deg)] transition-colors duration-500"
            style={{ borderColor: `${themeColor}40` }}
        ></div>
        
        {/* Navigation - Left */}
        {hasMultipleSkins && (
            <button 
                onClick={onPrev}
                className="absolute left-4 z-20 group p-4 hover:bg-white/5 rounded-full transition-all"
            >
                <ChevronLeft size={64} className="text-slate-700 group-hover:text-white transition-colors" />
            </button>
        )}

        {/* THE SHIP */}
        <div className="relative z-10 mb-12 filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]">
            <img 
                src={`data:image/svg+xml;base64,${svgBase64}`}
                alt={currentSkin.name}
                className="w-[480px] h-[480px] object-contain animate-hover-engine"
                style={{ 
                    // Chỉ dùng drop-shadow nhẹ để tôn vật thể, không làm lóa
                    filter: `drop-shadow(0 0 20px ${currentSkin.glowColor}50)` 
                }}
            />
        </div>

        {/* Navigation - Right */}
        {hasMultipleSkins && (
            <button 
                onClick={onNext}
                className="absolute right-4 z-20 group p-4 hover:bg-white/5 rounded-full transition-all"
            >
                <ChevronRight size={64} className="text-slate-700 group-hover:text-white transition-colors" />
            </button>
        )}

        {/* Ship Info Plate */}
        <div className="text-center z-20 bg-space-950/80 px-8 py-4 rounded-lg border border-slate-800 backdrop-blur-md">
            <h3 className="text-4xl font-black text-white tracking-[0.2em] uppercase mb-1 transition-colors duration-500" style={{ color: themeColor }}>
                {currentSkin.name}
            </h3>
            <div className="text-slate-400 text-sm font-mono tracking-wider flex items-center justify-center gap-2">
                 CLASS: <span className="text-white font-bold">{currentSkin.id.toUpperCase()}</span>
            </div>
        </div>
    </div>
  );
};
