
import React from 'react';
import { AlertTriangle, Gift, Skull, Zap, Fuel, ArrowRight } from 'lucide-react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { GameState } from '../../types';
import { saveMinigameResult } from '../../data/game-api';
import { playSound } from '../../utils/audio-manager';
import { Button } from '../../../../common/components/Button';

export const EventModal: React.FC = () => {
    const activeEvent = useGameStore(s => s.activeEvent);
    
    if (!activeEvent) return null;

    const handleConfirm = () => {
        // Handle terminal events immediately before resolving
        if (activeEvent.type === 'instant_loss') {
            playSound('lose');
            const state = useGameStore.getState();
            gameActions.addLog(`SỰ KIỆN: ${activeEvent.title} - NHIỆM VỤ THẤT BẠI`, "error");
            
            gameActions.addToHistory({
                id: Date.now().toString(),
                timestamp: Date.now(),
                score: state.score,
                result: 'gameover',
                duration: 300 - state.timeLeft,
                totalSteps: state.currentLevel,
                accuracy: 0
            });
            saveMinigameResult(state.score, 'gameover');
            gameActions.setGameState(GameState.GAME_OVER);
            gameActions.resolveActiveEvent(); // Just clear it
            return;
        }

        if (activeEvent.type === 'instant_win') {
            playSound('win');
            const state = useGameStore.getState();
            gameActions.addLog(`SỰ KIỆN: ${activeEvent.title} - CHIẾN THẮNG`, "success");
             gameActions.addToHistory({
                id: Date.now().toString(),
                timestamp: Date.now(),
                score: state.score + 1000,
                result: 'victory',
                duration: 300 - state.timeLeft,
                totalSteps: state.coordinates.length,
                accuracy: 100
            });
            saveMinigameResult(state.score + 1000, 'victory');
            gameActions.setGameState(GameState.VICTORY);
            gameActions.resolveActiveEvent();
            return;
        }

        // For non-terminal events, resolve and continue
        gameActions.resolveActiveEvent();
        playSound('click');
        
        // Resume game flow if needed (depends on how trigger was called, 
        // but typically we just close modal and game state is still PLAYING)
    };

    const getIcon = () => {
        switch (activeEvent.icon) {
            case 'fuel': return <Fuel size={64} className="text-neon-pink" />;
            case 'alien': return <Skull size={64} className="text-neon-green" />;
            case 'skull': return <Skull size={64} className="text-slate-400" />;
            case 'gem': return <Gift size={64} className="text-neon-yellow" />;
            case 'portal': return <Zap size={64} className="text-neon-blue" />;
            default: return <AlertTriangle size={64} className="text-neon-pink" />;
        }
    };

    const isBad = activeEvent.type === 'instant_loss' || activeEvent.type === 'lose_coin';

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`
                w-full max-w-lg p-1 rounded-xl relative overflow-hidden
                bg-space-900 border-2 shadow-[0_0_50px_rgba(0,0,0,0.8)]
                ${isBad ? 'border-neon-pink' : 'border-neon-blue'}
            `}>
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-10 bg-[length:20px_20px] ${isBad ? 'bg-neon-pink' : 'bg-neon-blue'}`} 
                     style={{backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)'}}>
                </div>

                <div className="relative z-10 bg-[#080b14]/90 p-8 flex flex-col items-center text-center">
                    
                    {/* Header Badge */}
                    <div className={`
                        mb-6 px-4 py-1 rounded border uppercase tracking-[0.3em] font-bold text-xs
                        ${isBad ? 'bg-neon-pink/10 border-neon-pink text-neon-pink' : 'bg-neon-blue/10 border-neon-blue text-neon-blue'}
                    `}>
                        Cảnh báo sự kiện
                    </div>

                    {/* Icon Container */}
                    <div className={`
                        w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4
                        ${isBad ? 'bg-neon-pink/5 border-neon-pink/30' : 'bg-neon-blue/5 border-neon-blue/30'}
                    `}>
                        <div className="animate-bounce">
                            {getIcon()}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className={`text-3xl font-black uppercase mb-4 ${isBad ? 'text-neon-pink' : 'text-neon-blue'}`}>
                        {activeEvent.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        {activeEvent.description}
                    </p>

                    {/* Action */}
                    <Button 
                        onClick={handleConfirm}
                        variant={isBad ? 'danger' : 'primary'}
                        fullWidth
                        className="py-4 text-xl"
                    >
                        {isBad && activeEvent.type === 'instant_loss' ? 'CHẤP NHẬN SỐ PHẬN' : 'TIẾP TỤC'} <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
