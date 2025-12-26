
import React, { useState } from 'react';
import { useGameStore, gameActions } from '../features/game/store/useGameStore';
import { playSound, unlockAudioContext } from '../features/game/utils/audio-manager';
import { QUESTION_BANK, generateRandomCoordinates } from '../features/game/data/game-constants';
import { ROCKET_SKINS } from '../features/game/data/game-skin-rocket';

// Sub-components
import { WelcomeHeader } from '../features/game/components/welcome/WelcomeHeader';
import { MissionBriefing } from '../features/game/components/welcome/MissionBriefing';
import { HangarPreview } from '../features/game/components/welcome/HangarPreview';
import { FlightControl } from '../features/game/components/welcome/FlightControl';

export default function WelcomeScreen() {
  const selectedSkinId = useGameStore(s => s.selectedRocketId);
  const ownedSkins = useGameStore(s => s.ownedSkins);
  
  // FIX: Chỉ cho phép chọn tàu đã sở hữu trên màn hình Welcome
  // Sắp xếp theo thứ tự mặc định của game để không bị nhảy lung tung
  const allSkinIds = Object.keys(ROCKET_SKINS);
  const availableSkins = allSkinIds.filter(id => ownedSkins.includes(id));
  
  const currentIndex = availableSkins.indexOf(selectedSkinId);
  const [isStarting, setIsStarting] = useState(false);

  const onStart = async () => {
      if (isStarting) return;
      
      setIsStarting(true);
      unlockAudioContext();
      playSound('start');

      // Logic tạo game
      const numberOfPoints = 9;
      const coordinates = generateRandomCoordinates(numberOfPoints);
      const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
      const numberOfQuestionsNeeded = coordinates.length - 1;
      const gameQuestions = shuffled.slice(0, numberOfQuestionsNeeded);
      
      setTimeout(() => {
          gameActions.startGame(gameQuestions, coordinates);
      }, 500);
  };

  const changeSkin = (dir: number) => {
      if (availableSkins.length <= 1) return; // Không cần chuyển nếu chỉ có 1 tàu

      playSound('select');
      let nextIndex = currentIndex + dir;
      if (nextIndex < 0) nextIndex = availableSkins.length - 1;
      if (nextIndex >= availableSkins.length) nextIndex = 0;
      
      const nextSkinId = availableSkins[nextIndex];
      if (nextSkinId) {
          gameActions.setSelectedSkin(nextSkinId);
      }
  };

  const currentSkin = ROCKET_SKINS[selectedSkinId];
  const themeColor = currentSkin.primaryColor; // Màu chủ đạo của tàu

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-0 relative overflow-hidden bg-space-950 font-tech select-none">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* AMBIENT GLOW - Lan tỏa màu sắc của tàu ra môi trường */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-20 pointer-events-none blur-[100px] transition-colors duration-700 ease-in-out"
        style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` }}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(10,20,40,0)_0%,rgba(5,7,10,1)_90%)]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1700px] h-full flex flex-col pt-12 pb-8">
        
        {/* HEADER */}
        <WelcomeHeader themeColor={themeColor} />

        {/* CONTENT GRID */}
        <div className="flex-1 grid grid-cols-12 gap-8 items-center px-12">
            
            {/* LEFT COLUMN: BRIEFING */}
            <MissionBriefing />

            {/* CENTER COLUMN: HANGAR PREVIEW */}
            <HangarPreview 
                currentSkin={currentSkin}
                onPrev={() => changeSkin(-1)}
                onNext={() => changeSkin(1)}
                hasMultipleSkins={availableSkins.length > 1}
            />

            {/* RIGHT COLUMN: SPECS & ACTION */}
            <FlightControl 
                currentSkin={currentSkin}
                isStarting={isStarting}
                onStart={onStart}
            />
        </div>

        {/* FOOTER */}
        <div className="text-center opacity-40 text-[10px] tracking-[0.5em] font-mono uppercase mt-4">
            Authorized Personnel Only • Secure Connection • PiStudy Corp
        </div>
      </div>
    </div>
  );
}
