
import { useEffect, useCallback, useMemo } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { ROCKET_SKINS } from '../../data/game-skin-rocket';
import { GameState } from '../../types/common';
import { playSound } from '../../utils/audio-manager';

export const useShopScreen = () => {
    const selectedSkinId = useGameStore(s => s.selectedRocketId);
    const ownedSkins = useGameStore(s => s.ownedSkins);
    const coins = useGameStore(s => s.coins);
    const previewId = useGameStore(s => s.previewSkinId);
    
    const skinIds = useMemo(() => Object.keys(ROCKET_SKINS), []);
    const currentSkin = ROCKET_SKINS[previewId] || ROCKET_SKINS['apollo'];
    
    const isOwned = ownedSkins.includes(previewId);
    const canAfford = coins >= currentSkin.price;
    const isEquipped = selectedSkinId === previewId;

    useEffect(() => {
        gameActions.setPreviewSkinId(selectedSkinId);
    }, []); 

    const handleEquip = useCallback(() => {
        playSound('correct');
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

    return {
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
    };
};
