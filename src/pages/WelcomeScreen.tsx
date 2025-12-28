
import React from 'react';
import { useWelcomeScreen } from '../features/game/hooks/welcome/useWelcomeScreen';

// Sub-components
import { WelcomeHeader } from '../features/game/components/welcome/WelcomeHeader';
import { MissionBriefing } from '../features/game/components/welcome/MissionBriefing';
import { HangarPreview } from '../features/game/components/welcome/HangarPreview';
import { FlightControl } from '../features/game/components/welcome/FlightControl';

export default function WelcomeScreen() {
  const { 
    currentSkin, 
    isStarting, 
    hasMultipleSkins, 
    onStart, 
    changeSkin 
  } = useWelcomeScreen();

  const themeColor = currentSkin.primaryColor;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-0 relative overflow-hidden bg-space-950 font-tech select-none">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
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
            
            <MissionBriefing />

            <HangarPreview 
                currentSkin={currentSkin}
                onPrev={() => changeSkin(-1)}
                onNext={() => changeSkin(1)}
                hasMultipleSkins={hasMultipleSkins}
            />

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
