
import { useEffect, useRef, useMemo } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { Coordinate, GameState } from '../../types/common';
import { getPlanetSvg } from '../../data/game-skin-planet';
import { getStarSvg, getStarStyle, StarType } from '../../data/game-skin-star';
import { getRocketSvg, ROCKET_SKINS } from '../../data/game-skin-rocket';
import { saveMinigameResult } from '../../data/game-api';
import { playSound } from '../../utils/audio-manager';

// Import Event System
import { getEventHandler } from '../../events/logic/registry';

export const useGraphBoard = (
  currentStep: number,
  coordinates: Coordinate[],
  onCursorMove: (x: number, y: number) => void,
  onPointClick: (index: number, x: number, y: number) => void
) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  const objectsRef = useRef<any>({ points: [], rocket: null, earth: null, trail: null });
  const onCursorMoveRef = useRef(onCursorMove);
  const onPointClickRef = useRef(onPointClick);
  
  const lastMoveTime = useRef(0);
  const selectedRocketId = useGameStore(s => s.selectedRocketId);
  const activeEvent = useGameStore(s => s.activeEvent);
  const eventStage = useGameStore(s => s.eventStage);

  const planetSeed = useMemo(() => Math.floor(Math.random() * 100), [coordinates]);
  
  const rocketBase64 = useMemo(() => {
    const svgString = getRocketSvg(selectedRocketId);
    return btoa(unescape(encodeURIComponent(svgString)));
  }, [selectedRocketId]);
  
  const cachedPlanetBase64 = useMemo(() => {
    const endCoord = coordinates[coordinates.length - 1];
    if (!endCoord) return '';
    return btoa(unescape(encodeURIComponent(getPlanetSvg(planetSeed))));
  }, [coordinates, planetSeed]);

  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
    onPointClickRef.current = onPointClick;
  }, [onCursorMove, onPointClick]);

  // INIT BOARD
  useEffect(() => {
    if (!boxRef.current || !coordinates || coordinates.length === 0) return;
    const JXG = (window as any).JXG;
    if (!JXG) return;
    
    if(boardRef.current) JXG.JSXGraph.freeBoard(boardRef.current);

    boardRef.current = JXG.JSXGraph.initBoard(boxRef.current.id, {
        boundingbox: [-6, 6, 6, -6], 
        keepaspectratio: false, 
        axis: false, 
        showNavigation: false, 
        showCopyright: false, 
        grid: false, 
        pan: { enabled: false }, 
        zoom: { enabled: false }, 
        backgroundColor: 'transparent',
        renderer: 'svg',
        antialias: true,
        precision: {
            touch: 16,
            mouse: 2
        }
    });
    
    const board = boardRef.current;
    board.suspendUpdate();

    board.on('move', (e: any) => {
        const now = Date.now();
        if (now - lastMoveTime.current > 32) {
            const cPos = board.getUsrCoordsOfMouse(e);
            onCursorMoveRef.current(parseFloat(cPos[0].toFixed(1)), parseFloat(cPos[1].toFixed(1)));
            lastMoveTime.current = now;
        }
    });

    const axisColor = '#00F0FF'; 
    const labelColor = '#94A3B8';

    const xAxis = board.create('axis', [[0, 0], [1, 0]], {
        name: 'x',
        strokeColor: axisColor, strokeWidth: 2, strokeOpacity: 0.6, highlight: false,
        withLabel: true,
        label: { position: 'rt', offset: [-20, 20], color: axisColor, fontSize: 18, fontWeight: 'bold' }
    });
    xAxis.removeAllTicks();
    board.create('ticks', [xAxis, 1], {
        strokeColor: axisColor, strokeOpacity: 0.3, strokeWidth: 1, majorHeight: 10,
        drawLabels: true,
        label: { fontSize: 14, fontFamily: 'Roboto Mono', fontWeight: 'bold', color: labelColor, anchorX: 'middle', anchorY: 'top', offset: [0, -5] },
        drawZero: true, insertTicks: false
    });
    
    const yAxis = board.create('axis', [[0, 0], [0, 1]], {
        name: 'y',
        strokeColor: axisColor, strokeWidth: 2, strokeOpacity: 0.6, highlight: false,
        withLabel: true,
        label: { position: 'rt', offset: [25, -10], color: axisColor, fontSize: 18, fontWeight: 'bold' }
    });
    yAxis.removeAllTicks();
    board.create('ticks', [yAxis, 1], {
        strokeColor: axisColor, strokeOpacity: 0.3, strokeWidth: 1, majorHeight: 10,
        drawLabels: true,
        label: { fontSize: 14, fontFamily: 'Roboto Mono', fontWeight: 'bold', color: labelColor, anchorX: 'right', anchorY: 'middle', offset: [-10, 0] },
        drawZero: false, insertTicks: false
    });

    objectsRef.current = { points: [], rocket: null, earth: null, trail: null };

    coordinates.forEach((coord, index) => {
        if (index === 0) {
            const coreDot = board.create('point', [0, 0], {
                name: '', size: 3, fillColor: '#64748B', strokeColor: '#0F172A', strokeWidth: 1,
                fixed: true, highlight: false, layer: 5
            });

            const rInner = 8 / board.unitX; 
            board.create('circle', [[0,0], rInner], {
                strokeColor: '#64748B', strokeWidth: 1.5, strokeOpacity: 0.6,
                fillColor: 'none', highlight: false, fixed: true, layer: 4, interactive: false
            });

            const rOuter = 14 / board.unitX;
            board.create('circle', [[0,0], rOuter], {
                strokeColor: '#475569', strokeWidth: 1, strokeOpacity: 0.4,
                dash: 2, fillColor: 'none', highlight: false, fixed: true, layer: 4, interactive: false
            });
            
            objectsRef.current.points.push(coreDot);
            return;
        }

        const point = board.create('text', [coord.x, coord.y, ''], {
            anchorX: 'middle', anchorY: 'middle', fixed: true, layer: 5, 
            highlight: false, withLabel: true,
            label: { color: '#64748B', fontSize: 14, offset: [15, 15], visible: true },
        });
        
        point.on('down', (e: any) => {
             const scrCoords = point.coords.scrCoords;
             onPointClickRef.current(index, scrCoords[1], scrCoords[2]);
        });
        objectsRef.current.points.push(point);
    });

    objectsRef.current.trail = board.create('curve', [[0], [0]], {
        strokeColor: '#00F0FF', strokeWidth: 3, strokeOpacity: 0.6, layer: 0, highlight: false
    });

    const currentSkin = ROCKET_SKINS[selectedRocketId];
    const scale = currentSkin?.scale || 1.0;
    const baseSize = 80;
    const renderSize = baseSize * scale;
    const glowColor = currentSkin?.glowColor || currentSkin?.primaryColor || '#38BDF8';

    objectsRef.current.rocket = board.create('text', [0, 0, 
        `<img src="data:image/svg+xml;base64,${rocketBase64}" width="${renderSize}" height="${renderSize}" style="display: block; pointer-events: none; -webkit-backface-visibility: hidden; filter: drop-shadow(0 0 8px ${glowColor});" />`
    ], {
        anchorX: 'middle', anchorY: 'middle', layer: 10, fixed: true, highlight: false, 
    });

    const endCoord = coordinates[coordinates.length - 1];
    const earthObj = board.create('text', [endCoord.x, endCoord.y, `<img src="data:image/svg+xml;base64,${cachedPlanetBase64}" width="180" height="180" style="display: block; pointer-events: none; -webkit-backface-visibility: hidden;" />`], {
        anchorX: 'middle', anchorY: 'middle', layer: 5, fixed: true, highlight: false
    });
    objectsRef.current.earth = earthObj;

    earthObj.on('down', (e: any) => {
        const scrCoords = earthObj.coords.scrCoords;
        onPointClickRef.current(coordinates.length - 1, scrCoords[1], scrCoords[2]);
    });

    board.unsuspendUpdate(); 

  }, [coordinates, planetSeed, rocketBase64, cachedPlanetBase64, selectedRocketId]);

  // HANDLE ROCKET POSITION & EVENT ANIMATIONS
  useEffect(() => {
    if (!boardRef.current || objectsRef.current.points.length === 0) return;
    const board = boardRef.current;
    const { points, rocket, trail } = objectsRef.current;
    
    board.suspendUpdate(); 

    // Update Star States
    points.forEach((point: any, index: number) => {
        const isEnd = index === coordinates.length - 1;
        if (isEnd) { point.setAttribute({ visible: false }); return; }
        if (index === 0) return;

        let type: StarType = 'locked';
        if (index < currentStep) type = 'passed'; 
        else if (index === currentStep) type = 'current'; 
        else if (index === currentStep + 1) type = 'target'; 

        const style = getStarStyle(type);
        const base64 = btoa(unescape(encodeURIComponent(getStarSvg(type))));
        point.setText(`<img src="data:image/svg+xml;base64,${base64}" width="${style.size}" height="${style.size}" style="display: block; pointer-events: none; -webkit-backface-visibility: hidden;" />`);
        point.setAttribute({ label: { visible: index >= currentStep, fontSize: index === currentStep + 1 ? 18 : 14 } });
    });

    // Update Trail
    const pathPoints = coordinates.slice(0, currentStep + 1);
    if (trail) { 
        trail.dataX = pathPoints.map(p => p.x); 
        trail.dataY = pathPoints.map(p => p.y); 
        trail.updateCurve(); 
    }

    // --- ROCKET MOVEMENT LOGIC ---
    if (rocket) {
        const currentCoordData = coordinates[currentStep];
        
        // --- CASE 1: SỰ KIỆN ĐẶC BIỆT (EVENT SYSTEM) ---
        if (activeEvent && eventStage === 'init') {
            gameActions.setEventStage('animating'); // Lock status to prevent re-trigger

            const nextStep = currentStep + 1;
            const nextCoordData = coordinates[nextStep] || currentCoordData;

            // Xử lý chung khi kết thúc event (Game Over hoặc Next Phase)
            const onEventFinish = () => {
                 setTimeout(() => {
                     const state = useGameStore.getState();
                     
                     // Nếu event là loại thua ngay (instant_loss)
                     if (activeEvent.type === 'instant_loss') {
                        playSound('lose');
                        gameActions.addLog(`TÍN HIỆU MẤT KẾT NỐI: ${activeEvent.title}`, "error");
                        
                        // Save & End Game
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
                        gameActions.resolveActiveEvent();
                     }
                 }, 800); 
            };

            // Tìm Handler trong Registry
            const handler = getEventHandler(activeEvent.id);

            if (handler) {
                // Nếu có Handler riêng, sử dụng nó
                handler.animate({
                    board,
                    rocket,
                    startCoord: currentCoordData,
                    endCoord: nextCoordData,
                    onFinish: onEventFinish
                });
            } else {
                // Fallback: Nếu không tìm thấy handler (hoặc event đơn giản), di chuyển bình thường đến bước tiếp theo
                // Logic cũ: Mặc định di chuyển nếu không có handler
                console.warn(`No handler found for event: ${activeEvent.id}, skipping animation.`);
                // Tạm thời cho kết thúc luôn nếu không có animation
                onEventFinish(); 
            }

        } 
        
        // --- CASE 2: DI CHUYỂN BÌNH THƯỜNG (NORMAL MOVE) ---
        else if (!activeEvent || eventStage === null) {
            
            const prevCoordData = currentStep > 0 ? coordinates[currentStep - 1] : { x: 0, y: 0 };
            let rotationDeg = 0;
            
            if (currentStep > 0) {
                 const dx = (currentCoordData.x - prevCoordData.x) * board.unitX;
                 const dy = (currentCoordData.y - prevCoordData.y) * -board.unitY; 
                 rotationDeg = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
            }
            
            if (rocket.rendNode) {
                rocket.rendNode.style.opacity = '1';
                rocket.rendNode.style.filter = 'none'; // Reset filter nếu trước đó bị grayscale
                rocket.rendNode.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                rocket.rendNode.style.transform = `rotate(${rotationDeg}deg) scale(1)`; // Reset scale
                rocket.rendNode.style.webkitBackfaceVisibility = 'hidden'; 
            }
            
            rocket.moveTo([currentCoordData.x, currentCoordData.y], currentStep === 0 ? 0 : 800, { effect: '<>' });
        }
    }
    
    board.unsuspendUpdate(); 
  }, [currentStep, coordinates, rocketBase64, activeEvent, eventStage]);

  return { boxRef };
};
