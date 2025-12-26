
import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { GameState } from './features/game/types';
import { useGameStore } from './features/game/store/useGameStore';
import { useFullscreen } from './common/hooks/useFullscreen';
import { useScaler } from './common/hooks/useScaler';
import { GameHeader } from './features/game/components/GameHeader';
import { ErrorBoundary } from './common/components/ErrorBoundary';
import { LoadingScreen } from './common/components/LoadingScreen';
import { unlockAudioContext } from './features/game/utils/audio-manager';

// Lazy load screens
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'));
const PlayScreen = lazy(() => import('./pages/PlayScreen'));
const ResultScreen = lazy(() => import('./pages/ResultScreen'));
const ShopScreen = lazy(() => import('./pages/ShopScreen'));

// Constants required for Layout
const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

export const App: React.FC = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const userInfo = useGameStore(s => s.userInfo);
  const gameState = useGameStore(s => s.gameState);
  const showConfetti = useGameStore(s => s.showConfetti);
  const setUserInfo = useGameStore(s => s.actions.setUserInfo);

  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- SCALE ENGINE ---
  useScaler(containerRef, stageRef, isFullscreen);

  // --- GLOBAL EVENT LISTENERS ---
  useEffect(() => {
    // FIX #75: iOS Audio Unlock
    const unlockAudio = () => {
        unlockAudioContext();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Iframe Communication
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return; 
      if (e.data.type === 'MINIGAME_DATA') {
        setUserInfo({ name: e.data.userName, stats: e.data.stats });
      }
    };
    window.addEventListener('message', handleMessage);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'MINIGAME_READY' }, '*');
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [setUserInfo]);

  return (
    <ErrorBoundary>
      {/* FIX #2: Viewport Layer (Black, Overflow Hidden) */}
      <div 
        ref={containerRef}
        className={`viewport-layer w-full h-full bg-black overflow-hidden select-none isolation-isolate contain-layout-paint ${
          isFullscreen ? 'fixed inset-0 z-[99999]' : 'relative'
        }`}
      >
        
        {/* FIX #1: Stage Layer (Fixed 1920x1080) */}
        <div 
          ref={stageRef}
          className="scaling-root absolute top-0 left-0 shadow-2xl overflow-hidden bg-space-950 flex flex-col opacity-0 transition-opacity duration-200"
          style={{ 
            width: `${GAME_WIDTH}px`, 
            height: `${GAME_HEIGHT}px`,
            // FIX #49: Origin 0 0 for correct calculation
            transformOrigin: '0 0', 
            // FIX #54: GPU Hints
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            // FIX #55: Strict containment
            contain: 'strict'
          }}
        >
          {showConfetti && (
             <div className="absolute inset-0 pointer-events-none z-[100] flex justify-center items-center"></div>
          )}
          
          <GameHeader 
            gameState={gameState} 
            isFullscreen={isFullscreen} 
            stats={userInfo.stats} 
            userName={userInfo.name} 
            onFullscreen={toggleFullscreen} 
          />

          <div className="flex-1 relative flex flex-row overflow-hidden bg-space-950">
            <Suspense fallback={<LoadingScreen />}>
              {gameState === GameState.WELCOME && <WelcomeScreen />}
              {gameState === GameState.SHOP && <ShopScreen />}
              {gameState === GameState.PLAYING && <PlayScreen />}
              {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY) && <ResultScreen />}
            </Suspense>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
