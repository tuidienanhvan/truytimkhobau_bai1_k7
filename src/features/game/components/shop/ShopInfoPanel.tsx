
import React from 'react';
import { Coins, Gauge, Shield, Zap, Check } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { RocketStyle } from '../../data/game-skin-rocket';
import { SHIP_STATS } from '../../data/game-ship-stats';
import { StatBar } from './StatBar';

interface ShopInfoPanelProps {
    currentSkin: RocketStyle;
    isOwned: boolean;
    isEquipped: boolean;
    canAfford: boolean;
    onEquip: () => void;
    onBuy: () => void;
}

export const ShopInfoPanel: React.FC<ShopInfoPanelProps> = ({ 
    currentSkin, isOwned, isEquipped, canAfford, onEquip, onBuy 
}) => {
    const stats = SHIP_STATS[currentSkin.id] || { speed: 50, armor: 50, energy: 50 };

    return (
        // FIX: Removed backdrop-blur-md, using solid opaque background for better performance
        <div className="h-[320px] bg-space-900 border-t border-white/10 p-10 flex gap-12 relative z-20 shrink-0">
            
            {/* Info Column */}
            <div className="flex-1">
                <h2 
                    className="text-5xl font-black uppercase tracking-wider mb-2 transition-colors duration-300"
                    style={{ color: currentSkin.primaryColor }}
                >
                    {currentSkin.name}
                </h2>
                <div className="text-xl text-white font-bold mb-6 flex items-center gap-3">
                    <span className="px-3 py-0.5 bg-white/10 rounded text-sm text-slate-300 tracking-widest border border-white/10">
                        CLASS: {currentSkin.id.toUpperCase()}
                    </span>
                    {!isOwned && (
                         <span className="px-3 py-0.5 bg-neon-yellow/10 rounded text-sm text-neon-yellow tracking-widest border border-neon-yellow/30 flex items-center gap-2">
                            <Coins size={14} /> {currentSkin.price.toLocaleString()}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                    {currentSkin.description}
                </p>
            </div>

            {/* Stats Column */}
            <div className="w-[350px] shrink-0 pt-2">
                 <StatBar label="Tốc độ" value={stats.speed} icon={Gauge} iconColor="text-neon-blue" primaryColor={currentSkin.primaryColor} />
                 <StatBar label="Giáp" value={stats.armor} icon={Shield} iconColor="text-neon-pink" primaryColor={currentSkin.primaryColor} />
                 <StatBar label="Năng lượng" value={stats.energy} icon={Zap} iconColor="text-neon-yellow" primaryColor={currentSkin.primaryColor} />
                 
                 <div className="mt-8">
                    {isOwned ? (
                        isEquipped ? (
                            <Button 
                                variant="secondary" 
                                fullWidth 
                                disabled
                                className="opacity-50 cursor-not-allowed border-green-500/50 text-green-500 bg-green-500/5"
                            >
                                <Check className="mr-2" size={20} /> ĐANG SỬ DỤNG
                            </Button>
                        ) : (
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={onEquip}
                                style={{
                                    borderColor: currentSkin.primaryColor,
                                    color: currentSkin.primaryColor,
                                    boxShadow: `0 0 15px ${currentSkin.primaryColor}30`
                                }}
                                className="!bg-transparent hover:!bg-white/10"
                            >
                                TRANG BỊ
                            </Button>
                        )
                    ) : (
                        <Button 
                            variant="warning" 
                            fullWidth 
                            onClick={onBuy}
                            disabled={!canAfford}
                            className={!canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                        >
                            <div className="flex flex-col items-center leading-none py-1">
                                <span className="text-xs mb-1">MỞ KHÓA</span>
                                <span className="text-xl flex items-center gap-2">
                                    <Coins size={20} /> {currentSkin.price.toLocaleString()}
                                </span>
                            </div>
                        </Button>
                    )}
                 </div>
            </div>

        </div>
    );
};
