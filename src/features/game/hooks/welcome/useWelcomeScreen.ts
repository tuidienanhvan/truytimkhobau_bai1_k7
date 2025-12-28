
import { useState, useCallback } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { playSound, unlockAudioContext } from '../../utils/audio-manager';
import { QUESTION_BANK, generateRandomCoordinates } from '../../data/game-constants';
import { ROCKET_SKINS } from '../../data/game-skin-rocket';

export const useWelcomeScreen = () => {
  const selectedSkinId = useGameStore(s => s.selectedRocketId);
  const ownedSkins = useGameStore(s => s.ownedSkins);
  const [isStarting, setIsStarting] = useState(false);

  const allSkinIds = Object.keys(ROCKET_SKINS);
  const availableSkins = allSkinIds.filter(id => ownedSkins.includes(id));
  const currentIndex = availableSkins.indexOf(selectedSkinId);

  const onStart = useCallback(async () => {
      if (isStarting) return;
      
      setIsStarting(true);
      unlockAudioContext();
      playSound('start');

      const numberOfPoints = 9;
      const coordinates = generateRandomCoordinates(numberOfPoints);
      
      const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
      const numberOfQuestionsNeeded = coordinates.length - 1;
      const gameQuestions = shuffled.slice(0, numberOfQuestionsNeeded);
      
      setTimeout(() => {
          gameActions.startGame(gameQuestions, coordinates);
      }, 500);
  }, [isStarting]);

  const changeSkin = useCallback((dir: number) => {
      if (availableSkins.length <= 1) return;

      playSound('select');
      let nextIndex = currentIndex + dir;
      
      if (nextIndex < 0) nextIndex = availableSkins.length - 1;
      if (nextIndex >= availableSkins.length) nextIndex = 0;
      
      const nextSkinId = availableSkins[nextIndex];
      if (nextSkinId) {
          gameActions.setSelectedSkin(nextSkinId);
      }
  }, [availableSkins, currentIndex]);

  const currentSkin = ROCKET_SKINS[selectedSkinId];

  return {
      currentSkin,
      isStarting,
      hasMultipleSkins: availableSkins.length > 1,
      onStart,
      changeSkin
  };
};
