
import React, { useEffect, useCallback } from 'react';
import { useGameStore, gameActions } from '../features/game/store/useGameStore';
import { ROCKET_SKINS } from '../features/game/data/game-skin-rocket';
import { GameState } from '../features/game/types';
import { playSound } from '../features/game/utils/audio-manager';

// Sub-components
import { ShopSidebar } from '../features/game/components/shop/ShopSidebar';
import { ShopPreview } from '../features/game/components/shop/ShopPreview';
import { ShopInfoPanel } from '../features/game/components/shop/ShopInfoPanel';
import { ShopHeader } from '../features/game/components/shop/ShopHeader';

export default function ShopScreen() {
    // 1. Selector hiệu năng: Chỉ lấy những thứ cần thiết
    const selectedSkinId = useGameStore(s => s.selectedRocketId);
    const ownedSkins = useGameStore(s => s.ownedSkins);
    const coins = useGameStore(s => s.coins);
    const previewId = useGameStore(s => s.previewSkinId); // Lấy từ Store
    
    const skinIds = Object.keys(ROCKET_SKINS);
    const currentSkin = ROCKET_SKINS[previewId] || ROCKET_SKINS['apollo'];
    
    const isOwned = ownedSkins.includes(previewId);
    const canAfford = coins >= currentSkin.price;

    // 2. Sync State: Khi vào màn hình Shop, reset preview về tàu đang trang bị
    useEffect(() => {
        gameActions.setPreviewSkinId(selectedSkinId);
    }, []); // Chỉ chạy 1 lần khi mount

    const handleEquip = useCallback(() => {
        playSound('correct');
        // Vì handleEquip phụ thuộc vào previewId (từ store), nó sẽ được tạo lại khi preview đổi.
        // Tuy nhiên nút bấm nằm ở panel bên phải, việc re-render panel này là bắt buộc.
        gameActions.setSelectedSkin(previewId);
    }, [previewId]);

    const handleBuy = useCallback(() => {
        const skin = ROCKET_SKINS[previewId];
        const success = gameActions.buySkin(previewId, skin.price);
        if (success) {
            playSound('correct');
        } else {
            playSound('wrong');
        }
    }, [previewId]);

    const handleBack = useCallback(() => {
        playSound('click');
        gameActions.setGameState(GameState.WELCOME);
    }, []);

    return (
        <div className="w-full h-full flex flex-col bg-space-950 font-tech relative overflow-hidden select-none">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(10,20,40,0)_0%,rgba(5,7,10,1)_90%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>

            {/* HEADER COMPONENT */}
            <ShopHeader onBack={handleBack} />

            {/* MAIN CONTENT */}
            <div className="flex-1 grid grid-cols-12 gap-0 relative z-10 overflow-hidden min-h-0">
                
                {/* LEFT: LIST (Self-contained logic) */}
                {/* OPTIMIZATION: Không truyền previewId vào đây nữa để tránh re-render Sidebar khi preview đổi */}
                <ShopSidebar 
                    skinIds={skinIds}
                    selectedSkinId={selectedSkinId}
                    ownedSkins={ownedSkins}
                />

                {/* RIGHT: PREVIEW & STATS */}
                <div className="col-span-8 h-full relative flex flex-col py-10 pr-12 pl-4">
                    
                    {/* Preview Area (Flexible Space) */}
                    <div className="flex-1 relative flex items-center justify-center min-h-0">
                        <ShopPreview 
                            currentSkin={currentSkin}
                            isOwned={isOwned}
                        />
                    </div>

                    {/* Info Panel (Fixed Height at Bottom) */}
                    <div className="shrink-0 mt-4 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-space-900">
                        <ShopInfoPanel 
                            currentSkin={currentSkin}
                            isOwned={isOwned}
                            isEquipped={selectedSkinId === previewId}
                            canAfford={canAfford}
                            onEquip={handleEquip}
                            onBuy={handleBuy}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
