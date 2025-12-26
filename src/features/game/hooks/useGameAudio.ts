import { useEffect } from 'react';
import { toggleAmbientSound, playSound } from '../utils/audio-manager';

export const useGameAudio = () => {
    // Manage Ambient Sound Lifecycle (Engine Drone)
    useEffect(() => {
        // Mount: Start Ambient Sound
        toggleAmbientSound(true);
        
        // Unmount: Stop Ambient Sound
        return () => {
            toggleAmbientSound(false);
        };
    }, []);

    // Return helper function if components need to play specific SFX
    return {
        playSfx: playSound
    };
};