
import { useEffect } from 'react';
import { toggleAmbientSound, playSound } from '../../utils/audio-manager';

export const useGameAudio = () => {
    useEffect(() => {
        toggleAmbientSound(true);
        return () => {
            toggleAmbientSound(false);
        };
    }, []);

    return {
        playSfx: playSound
    };
};
