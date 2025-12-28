
import React from 'react';
import { Lock, Coins, ListFilter } from 'lucide-react';
import { ROCKET_SKINS, getRocketSvg, RocketStyle } from '../../data/game-skin-rocket';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { playSound } from '../../utils/audio-manager';

interface ShopSidebarProps {
    skinIds: string[];
    selectedSkinId: string;
    ownedSkins: string[];
    // Removed: previewId, onSelect -> Moved to Store & Internal Component
}

interface ShopSidebarItemProps {
    id: string;
    skin: RocketStyle;
    isEquipped: boolean;
    skinOwned: boolean;
}

// Global Cache for SVGs
const svgCache: Record<string, string> = {};
const getCachedSvgBase64 = (id: string) => {
    if (!svgCache[id]) {
        const svg = getRocketSvg(id);
        svgCache[id] = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
    return svgCache[id];
};

// ATOMIC COMPONENT: Tự kết nối store để kiểm tra trạng thái
const ShopSidebarItem = React.memo(({ id, skin, isEquipped, skinOwned }: ShopSidebarItemProps) => {
    
    // PERFORMANCE MAGIC: 
    // Chỉ subscribe vào đúng logic "mình có phải là previewSkinId không?"
    // Khi previewSkinId thay đổi trong store, chỉ item CŨ và item MỚI re-render.
    // 13 item còn lại sẽ KHÔNG re-render.
    const isSelected = useGameStore(s => s.previewSkinId === id);

    const handleSelect = () => {
        playSound('select');
        gameActions.setPreviewSkinId(id);
    };

    const svgBase64 = getCachedSvgBase64(id);

    return (
        <div 
            onClick={handleSelect}
            className={`
                relative cursor-pointer p-3 rounded-lg border transition-colors duration-200 shrink-0 group
                ${isSelected 
                    ? 'bg-white/10 border-white/40' 
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-slate-700'}
            `}
        >
            {/* Simple Selection Bar */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue rounded-l-lg"></div>
            )}

            <div className="flex items-center gap-4 relative z-10 pl-2">
                {/* Icon Box */}
                <div className={`
                    w-14 h-14 rounded-md flex items-center justify-center shrink-0 border transition-all relative overflow-hidden bg-black/40
                    ${isSelected ? 'border-white/30' : 'border-white/5'}
                `}>
                    <img 
                        src={svgBase64}
                        alt={skin.name}
                        className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110 relative z-10"
                        style={{ 
                            filter: isSelected ? `drop-shadow(0 0 5px ${skin.primaryColor})` : 'none'
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                    
                    {!skinOwned && (
                        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                            <Lock size={16} className="text-slate-500" />
                        </div>
                    )}
                </div>
                
                {/* Text Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-center w-full">
                        <span className={`text-sm font-bold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {skin.name}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        {isEquipped ? (
                             <span className="text-[10px] text-neon-green font-bold tracking-wider px-2 py-0.5 rounded bg-neon-green/10 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div> DÙNG
                             </span>
                        ) : (
                             <span className="text-[10px] text-slate-600 font-mono truncate max-w-[100px]">
                                CLASS-{skin.id.toUpperCase()}
                             </span>
                        )}

                        {!skinOwned && (
                            <div className="text-xs text-neon-yellow font-bold flex items-center gap-1">
                                <Coins size={10} /> {skin.price.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});


export const ShopSidebar: React.FC<ShopSidebarProps> = React.memo(({ 
    skinIds, selectedSkinId, ownedSkins 
}) => {
    return (
        <div className="col-span-4 h-full flex flex-col py-10 pl-12 pr-6 min-h-0">
            {/* THE FRAME */}
            <div className="flex-1 flex flex-col bg-space-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative">
                
                {/* 1. FRAME HEADER */}
                <div className="h-16 shrink-0 flex items-center justify-between px-6 bg-black/40 border-b border-white/5 relative z-20">
                    <div className="flex items-center gap-3 text-neon-blue">
                        <div className="p-1.5 bg-neon-blue/10 rounded">
                            <ListFilter size={18} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Danh sách mẫu</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                        {ownedSkins.length}/{skinIds.length} SỞ HỮU
                    </div>
                </div>

                {/* 2. SCROLLABLE AREA */}
                <div 
                    className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 relative z-10 bg-black/20"
                    style={{ 
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {skinIds.map((id) => (
                        <ShopSidebarItem 
                            key={id}
                            id={id}
                            skin={ROCKET_SKINS[id]}
                            isEquipped={selectedSkinId === id}
                            skinOwned={ownedSkins.includes(id)}
                        />
                    ))}
                </div>

                {/* 3. DECORATION */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-space-900 to-transparent pointer-events-none z-20"></div>
            </div>
        </div>
    );
});
