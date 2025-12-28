
import React from 'react';
import { Button } from '../common/components/Button';
import { Trophy, AlertTriangle, RefreshCw } from 'lucide-react';
import { useResultScreen } from '../features/game/hooks/result/useResultScreen';

export default function ResultScreen() {
  const { isVictory, score, handleReset } = useResultScreen();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-black/80 backdrop-blur-md z-50 font-tech">
      <div className={`relative max-w-2xl w-full p-1 border-2 ${isVictory ? 'border-neon-yellow' : 'border-neon-pink'} bg-space-900/95 shadow-2xl`}>
         <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-current text-white z-10"></div>
         <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-current text-white z-10"></div>
         <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-current text-white z-10"></div>
         <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-current text-white z-10"></div>

         <div className="py-12 px-16 flex flex-col items-center relative overflow-hidden">
             <div className={`absolute inset-0 opacity-5 ${isVictory ? 'bg-neon-yellow' : 'bg-neon-pink'} bg-[length:4px_4px]`}></div>

             <div className="mb-8 relative">
                 <div className={`absolute inset-0 blur-3xl opacity-40 ${isVictory ? 'bg-neon-yellow' : 'bg-neon-pink'}`}></div>
                 {isVictory ? (
                     <Trophy size={120} className="text-neon-yellow relative z-10 drop-shadow-[0_0_25px_rgba(252,238,10,0.8)] animate-bounce" />
                 ) : (
                     <AlertTriangle size={120} className="text-neon-pink relative z-10 drop-shadow-[0_0_25px_rgba(255,0,60,0.8)] animate-pulse" />
                 )}
             </div>

             <h2 className={`text-6xl font-black uppercase tracking-widest mb-4 ${isVictory ? 'text-neon-yellow' : 'text-neon-pink'} glitch-text`} data-text={isVictory ? 'NHIỆM VỤ HOÀN THÀNH' : 'THẤT BẠI NGHIÊM TRỌNG'}>
                {isVictory ? 'NHIỆM VỤ HOÀN THÀNH' : 'THẤT BẠI NGHIÊM TRỌNG'}
             </h2>
             
             <div className="h-0.5 w-full bg-slate-800 my-8 relative">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full ${isVictory ? 'bg-neon-yellow' : 'bg-neon-pink'} shadow-[0_0_15px_currentColor]`}></div>
             </div>

             <p className="text-slate-400 text-lg uppercase tracking-[0.3em] mb-2 font-bold">ĐIỂM TÍCH LŨY</p>
             <div className={`text-8xl font-black mb-12 font-mono ${isVictory ? 'text-white text-neon' : 'text-slate-500'}`}>
                {score}
             </div>

             <Button 
                onClick={handleReset} 
                variant={isVictory ? 'primary' : 'danger'}
                className="w-full flex justify-center items-center gap-4 text-2xl py-5"
             >
                <RefreshCw size={28} />
                {isVictory ? 'CHƠI LẠI' : 'THỬ LẠI'}
             </Button>
         </div>
      </div>
    </div>
  );
}
