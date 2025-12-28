
import React, { useState, useLayoutEffect } from 'react';
import { GraphBoard } from '../features/game/components/play/GraphBoard';
import { usePlayScreen } from '../features/game/hooks/play/usePlayScreen';

// Sub-components
import { ProgressHUD } from '../features/game/components/play/ProgressHUD';
import { RadarHUD } from '../features/game/components/play/RadarHUD';
import { EventPanel } from '../features/game/events/EventPanel';
import { MissionLog } from '../features/game/components/play/MissionLog';
import { SidebarControls } from '../features/game/components/play/InputTerminal';

// Modals
import { QuestionModal } from '../features/game/components/play/modals/QuestionModal';

export default function PlayScreen() {
  const {
      // Graph
      currentStep, coordinates, handleCursorMove, handlePointClick,
      // Status & Logic
      progressWidth, timeLeft, lives, cursorPos, nextCoord,
      question, isVictoryPhase,
      // Input Logic (Actions only)
      handleSubmit, handleHint
  } = usePlayScreen();

  const [boardBounds, setBoardBounds] = useState({ width: 0, height: 0 });
  
  useLayoutEffect(() => {
    const jxgContainer = document.getElementById('jxgbox');
    if (!jxgContainer) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const updateBounds = () => {
        if (jxgContainer) {
            setBoardBounds({
                width: jxgContainer.clientWidth,
                height: jxgContainer.clientHeight
            });
        }
    };

    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateBounds, 100);
    });
    
    resizeObserver.observe(jxgContainer);
    updateBounds();

    return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full h-full flex gap-0 overflow-hidden bg-space-950 relative font-tech text-slate-200">
      
      {/* 1. LEFT: GRAPH BOARD - Sử dụng isolation-isolate để cô lập hoàn toàn lớp đồ thị */}
      <div className="flex-1 relative h-full border-r border-slate-800 z-10 bg-transparent min-w-0 isolation-isolate">
         <GraphBoard 
            key={coordinates.length > 0 ? coordinates[0].x : 'init'}
            currentStep={currentStep} 
            coordinates={coordinates}
            onCursorMove={handleCursorMove} 
            onPointClick={handlePointClick}
         />

         <QuestionModal 
            question={question}
            isVictoryPhase={isVictoryPhase}
            containerBounds={boardBounds}
            handleSubmit={handleSubmit}
        />
      </div>

      {/* 2. RIGHT: HUD & LOGS */}
      <div className="w-[600px] shrink-0 flex flex-col bg-space-900 border-l border-white/5 relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20">
         <ProgressHUD progress={progressWidth} timeLeft={timeLeft} lives={lives} />
         <RadarHUD cursorPos={cursorPos} nextCoord={nextCoord} />
         
         {/* NEW: Event Panel inserted here */}
         <EventPanel />
         
         <div className="flex-1 min-h-0 border-t border-slate-700/50">
            <MissionLog />
         </div>
         <div className="shrink-0">
            <SidebarControls handleHint={handleHint} isVictoryPhase={isVictoryPhase} />
         </div>
      </div>
    </div>
  );
}
