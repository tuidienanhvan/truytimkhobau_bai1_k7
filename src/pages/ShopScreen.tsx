
import React from 'react';
import { useShopScreen } from '../features/game/hooks/shop/useShopScreen';

// Sub-components
import { ShopSidebar } from '../features/game/components/shop/ShopSidebar';
import { ShopPreview } from '../features/game/components/shop/ShopPreview';
import { ShopInfoPanel } from '../features/game/components/shop/ShopInfoPanel';
import { ShopHeader } from '../features/game/components/shop/ShopHeader';

export default function ShopScreen() {
    const {
        skinIds,
        currentSkin,
        selectedSkinId,
        ownedSkins,
        isOwned,
        canAfford,
        isEquipped,
        handleEquip,
        handleBuy,
        handleBack
    } = useShopScreen();

    return (
        <div className="w-full h-full flex flex-col bg-space-950 font-tech relative overflow-hidden select-none">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(10,20,40,0)_0%,rgba(5,7,10,1)_90%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>

            {/* HEADER COMPONENT */}
            <ShopHeader onBack={handleBack} />

            {/* MAIN CONTENT */}
            <div className="flex-1 grid grid-cols-12 gap-0 relative z-10 overflow-hidden min-h-0">
                
                {/* LEFT: LIST */}
                <ShopSidebar 
                    skinIds={skinIds}
                    selectedSkinId={selectedSkinId}
                    ownedSkins={ownedSkins}
                />

                {/* RIGHT: PREVIEW & STATS */}
                <div className="col-span-8 h-full relative flex flex-col py-10 pr-12 pl-4">
                    
                    {/* Preview Area */}
                    <div className="flex-1 relative flex items-center justify-center min-h-0">
                        <ShopPreview 
                            currentSkin={currentSkin}
                            isOwned={isOwned}
                        />
                    </div>

                    {/* Info Panel */}
                    <div className="shrink-0 mt-4 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-space-900">
                        <ShopInfoPanel 
                            currentSkin={currentSkin}
                            isOwned={isOwned}
                            isEquipped={isEquipped}
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
