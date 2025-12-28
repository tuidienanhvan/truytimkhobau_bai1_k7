
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { X, Cpu, Lock, Unlock, ShieldCheck } from 'lucide-react';
import { renderMath } from '../../../../../common/utils/mathjax';
import { useGameStore, gameActions } from '../../../store/useGameStore';
import { Question } from '../../../types/entities';

interface QuestionModalProps {
    question: Question;
    isVictoryPhase: boolean;
    containerBounds: { width: number; height: number };
    handleSubmit: (e?: React.FormEvent) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = React.memo(({
    question,
    isVictoryPhase,
    containerBounds,
    handleSubmit
}) => {
    const { isOpen, position } = useGameStore(s => s.modalState);
    const { answer, isSubmitting } = useGameStore(s => s.inputState);

    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const questionContainerRef = useRef<HTMLDivElement>(null);
    
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isMathReady, setIsMathReady] = useState(false);

    useLayoutEffect(() => {
        if (!isOpen) {
            setIsVisible(false);
            setIsMathReady(false);
            return;
        }

        const modalW = 480; 
        const modalH = modalRef.current?.offsetHeight || 300;
        const parentW = containerBounds.width || window.innerWidth;
        const parentH = containerBounds.height || window.innerHeight;

        const { x, y } = position;
        const OFFSET_X = 60;
        const PADDING = 20;

        let finalY = y - (modalH / 2);
        if (finalY < PADDING) finalY = PADDING;
        else if (finalY + modalH > parentH - PADDING) finalY = parentH - modalH - PADDING;

        let finalX = x + OFFSET_X;
        if (finalX + modalW > parentW - PADDING) {
            const tryLeft = x - OFFSET_X - modalW;
            if (tryLeft > PADDING) finalX = tryLeft;
            else {
                finalX = (parentW - modalW) / 2;
                finalY = (parentH - modalH) / 2;
            }
        }

        setCoords({ x: finalX, y: finalY });
        
        setIsVisible(true);
        if (!isVictoryPhase) {
            setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
        }

    }, [isOpen, position, containerBounds, isVictoryPhase]);

    useEffect(() => {
        if (isVisible && isOpen && questionContainerRef.current) {
            const timer = setTimeout(() => {
                renderMath(questionContainerRef.current)
                    .then(() => setIsMathReady(true));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isVisible, isOpen, question]);

    const handleClose = () => {
        gameActions.setModalState(false);
    };

    if (!isOpen) return null;

    const theme = isVictoryPhase ? {
        border: 'border-neon-yellow',
        text: 'text-neon-yellow',
        bgIcon: 'bg-neon-yellow/10',
        icon: Unlock
    } : {
        border: 'border-neon-blue',
        text: 'text-neon-blue',
        bgIcon: 'bg-neon-blue/10',
        icon: Lock
    };

    const Icon = theme.icon;
    const isModalRight = coords.x > position.x;

    return (
        <div 
            ref={modalRef}
            className={`
                absolute z-[50] w-[480px] max-w-[90vw]
                flex flex-col shadow-2xl
                transition-opacity duration-200
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ 
                left: `${coords.x}px`, 
                top: `${coords.y}px`
            }}
        >
            <div className={`
                absolute top-1/2 -translate-y-1/2 
                ${isModalRight ? '-left-12' : '-right-12'} 
                w-12 h-[2px] 
                bg-gradient-to-r ${isModalRight ? 'from-transparent to-neon-blue' : 'from-neon-blue to-transparent'} 
                ${isVictoryPhase ? 'from-neon-yellow to-transparent' : ''}
                opacity-40 hidden md:block pointer-events-none
            `}></div>

            <div className={`
                relative overflow-hidden rounded-lg
                bg-[#080b14] /* Solid dark background */
                border ${theme.border}
                flex flex-col
                shadow-[0_0_50px_rgba(0,0,0,0.8)]
            `}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded border border-white/10 ${theme.bgIcon} ${theme.text}`}>
                            <Icon size={16} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className={`font-tech font-bold text-xs tracking-[0.2em] uppercase ${theme.text}`}>
                                {isVictoryPhase ? 'SYSTEM UNLOCKED' : 'ENCRYPTED SIGNAL'}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-500 hover:text-white p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 relative z-10 min-h-[120px]">
                    {isVictoryPhase ? (
                        <div className="py-4 flex flex-col items-center text-center">
                             <div className="w-16 h-16 mb-4 rounded-full bg-neon-yellow/10 flex items-center justify-center border border-neon-yellow/50 shadow-[0_0_20px_rgba(252,238,10,0.3)]">
                                <ShieldCheck size={32} className="text-neon-yellow" />
                             </div>
                             <h3 className="text-xl text-white font-bold uppercase tracking-wider mb-2">ĐÃ GIẢI MÃ</h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                <Cpu size={12} className={theme.text} />
                                <span>Dữ liệu đầu vào</span>
                            </div>
                            
                            <div 
                                ref={questionContainerRef}
                                className={`text-xl text-slate-100 font-medium leading-relaxed transition-opacity duration-200 ${isMathReady ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {question.question}
                            </div>
                            
                            {!isMathReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#080b14]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs text-slate-500 font-mono animate-pulse">ĐANG GIẢI MÃ...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!isVictoryPhase && (
                    <div className="p-4 bg-black/40 border-t border-white/5">
                        <form onSubmit={handleSubmit} className="relative flex items-center bg-[#0A0C10] border border-slate-800 rounded focus-within:border-neon-blue transition-all">
                            <div className="pl-3 py-3 text-neon-blue font-mono font-bold">{'>'}</div>
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={answer}
                                onChange={(e) => gameActions.setInputAnswer(e.target.value)}
                                placeholder="NHẬP MÃ..."
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono p-3 uppercase tracking-wider"
                                autoComplete="off"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!answer.trim() || isSubmitting}
                                className={`mr-1 px-4 py-2 rounded font-bold text-xs uppercase transition-all ${!answer.trim() || isSubmitting ? 'text-slate-600' : 'bg-neon-blue text-black'}`}
                            >
                                {isSubmitting ? '...' : 'GỬI'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
});
