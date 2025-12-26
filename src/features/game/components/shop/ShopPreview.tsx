
import React, { useMemo } from 'react';
import { Lock, Shield, Box, Activity } from 'lucide-react';
import { RocketStyle, getRocketSvg } from '../../data/game-skin-rocket';

interface ShopPreviewProps {
    currentSkin: RocketStyle;
    isOwned: boolean;
}

export const ShopPreview: React.FC<ShopPreviewProps> = React.memo(({ currentSkin, isOwned }) => {
    
    // Memoize the base64 generation to avoid recalc on every render if props stay same
    const svgBase64 = useMemo(() => {
        const svgString = getRocketSvg(currentSkin.id);
        return btoa(unescape(encodeURIComponent(svgString)));
    }, [currentSkin.id]);
    
    const themeColor = currentSkin.primaryColor;

    return (
        // ROOT CONTAINER: Chỉ định vị tương đối, chiếm hết khổ cha, không padding để tránh cộng dồn kích thước
        <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/5 bg-black/20 group">
            
            {/* ================================================================================== */}
            {/* LAYER 0: DEEP BACKGROUND (Họa tiết nền) */}
            {/* ================================================================================== */}
            
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 {/* Grid to lớn, dùng vh/vw để scale theo màn hình */}
                 <div className="w-[150%] h-[150%] border border-slate-700/50 rounded-full"></div>
                 <div className="absolute w-[100%] h-[100%] border border-slate-700/30 rounded-full border-dashed"></div>
                 {/* Crosshair lines */}
                 <div className="absolute w-full h-[1px] bg-slate-700/50"></div>
                 <div className="absolute h-full w-[1px] bg-slate-700/50"></div>
            </div>

            {/* ================================================================================== */}
            {/* LAYER 1: THE CARD FRAME (DÙNG ABSOLUTE INSET ĐỂ KHÔNG PHÁ LAYOUT) */}
            {/* ================================================================================== */}
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
                
                {/* 1.1 Khung kính mờ bao phủ toàn bộ */}
                <div className="absolute inset-0 bg-space-900/40 backdrop-blur-sm">
                    {/* Grid Pattern bên trong */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                </div>

                {/* 1.2 4 Góc trang trí (Corner Accents) - Neo tuyệt đối */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 transition-colors duration-500 rounded-tl-xl" style={{ borderColor: themeColor }}></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 transition-colors duration-500 rounded-tr-xl" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 transition-colors duration-500 rounded-bl-xl" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 transition-colors duration-500 rounded-br-xl" style={{ borderColor: themeColor }}></div>

                {/* 1.4 Bệ đỡ ba chiều (Platform) - Nằm thấp xuống dưới */}
                <div className="absolute bottom-[8%] w-[50%] h-[60px] border border-white/5 rounded-[100%] [transform:rotateX(65deg)] flex items-center justify-center">
                    <div 
                        className="w-[100%] h-[100%] border-2 border-dashed rounded-[100%] opacity-30"
                        style={{ borderColor: themeColor }}
                    ></div>
                    <div 
                        className="absolute inset-0 rounded-[100%] blur-2xl opacity-20"
                        style={{ background: themeColor }}
                    ></div>
                </div>

                {/* 1.5 CON TÀU (THE SHIP) - Tự động co giãn theo chiều cao */}
                <div className="relative z-20 w-full h-full flex items-center justify-center p-8 pb-12">
                    <img 
                        key={currentSkin.id} 
                        src={`data:image/svg+xml;base64,${svgBase64}`}
                        alt={currentSkin.name}
                        className={`
                            h-[65%] w-auto max-w-[80%] object-contain animate-hover-engine transition-all duration-500 
                            ${!isOwned ? 'grayscale opacity-40 contrast-125' : ''}
                        `}
                        style={{ 
                            filter: isOwned 
                                ? `drop-shadow(0 0 40px ${themeColor}40)` 
                                : 'drop-shadow(0 10px 10px #000)',
                            willChange: 'transform' 
                        }}
                    />
                </div>

                {/* 1.6 Giao diện thông số nổi (UI Overlay) */}
                
                {/* Tên Class Tàu (Góc trái trên) */}
                <div className="absolute top-6 left-6 flex flex-col z-20">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Unit Model</span>
                    <span className="text-4xl font-black uppercase text-white tracking-tighter leading-none opacity-90" style={{ textShadow: `0 0 20px ${themeColor}50` }}>
                        {currentSkin.id}
                    </span>
                    <div className="h-1 w-20 mt-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                </div>

                {/* Thông số phụ (Góc phải giữa) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-6 items-end z-20">
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-[10px] font-mono tracking-wider opacity-60">SHIELD</span>
                        <Shield size={16} className="text-slate-200" />
                    </div>
                    <div className="w-1 h-8 bg-slate-800/50 rounded-full"></div>
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-[10px] font-mono tracking-wider opacity-60">THRUST</span>
                        <Activity size={16} className="text-slate-200" />
                    </div>
                    <div className="w-1 h-8 bg-slate-800/50 rounded-full"></div>
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-[10px] font-mono tracking-wider opacity-60">CARGO</span>
                        <Box size={16} className="text-slate-200" />
                    </div>
                </div>

                {/* Trạng thái (Góc trái dưới) */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
                     <div className={`w-2 h-2 rounded-sm animate-pulse ${isOwned ? 'bg-neon-green shadow-[0_0_10px_#0AFF60]' : 'bg-neon-pink'}`}></div>
                     <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isOwned ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {isOwned ? 'System Operational' : 'Authorization Locked'}
                     </span>
                </div>

                {/* Màn hình khóa (Locked Overlay) */}
                {!isOwned && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                        {/* Lớp phủ tối mờ */}
                        <div className="absolute inset-0 bg-space-950/60"></div>
                        
                        {/* Icon Ổ khóa */}
                        <div className="relative z-10 flex flex-col items-center scale-125">
                             <div className="w-20 h-20 rounded-full border-2 border-slate-700 bg-space-900/90 flex items-center justify-center mb-4 shadow-2xl">
                                <Lock size={32} className="text-slate-500" />
                             </div>
                             <div className="px-6 py-2 bg-black/50 border border-neon-pink/50 text-neon-pink text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-md rounded-sm">
                                Restricted Access
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
