
import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Coordinate } from '../types';
import { getPlanetSvg } from '../data/game-skin-planet';
import { getStarSvg, getStarStyle, StarType } from '../data/game-skin-star';
import { getRocketSvg, ROCKET_SKINS } from '../data/game-skin-rocket';
import { getOriginSvg } from '../data/game-skin-misc';

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

  // 1. CACHE CÁC TÀI NGUYÊN
  const planetSeed = useMemo(() => Math.floor(Math.random() * 100), [coordinates]);
  
  // Cache Rocket SVG base64
  const rocketBase64 = useMemo(() => {
    const svgString = getRocketSvg(selectedRocketId);
    return btoa(unescape(encodeURIComponent(svgString)));
  }, [selectedRocketId]);
  
  const cachedOriginBase64 = useMemo(() => btoa(unescape(encodeURIComponent(getOriginSvg()))), []);
  const cachedPlanetBase64 = useMemo(() => {
    const endCoord = coordinates[coordinates.length - 1];
    if (!endCoord) return '';
    return btoa(unescape(encodeURIComponent(getPlanetSvg(planetSeed))));
  }, [coordinates, planetSeed]);

  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
    onPointClickRef.current = onPointClick;
  }, [onCursorMove, onPointClick]);

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

    // RENDER TÀU BẰNG SVG BASE64
    const currentSkin = ROCKET_SKINS[selectedRocketId];
    const scale = currentSkin?.scale || 1.0;
    const baseSize = 80; // Size hợp lý cho SVG
    const renderSize = baseSize * scale;
    const glowColor = currentSkin?.glowColor || currentSkin?.primaryColor || '#38BDF8';

    // SVG được thiết kế hướng lên trên (UP)
    // Filter drop-shadow đơn giản để không lag mobile
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

  useEffect(() => {
    if (!boardRef.current || objectsRef.current.points.length === 0) return;
    const board = boardRef.current;
    const { points, rocket, trail } = objectsRef.current;
    
    board.suspendUpdate(); 

    points.forEach((point: any, index: number) => {
        const isEnd = index === coordinates.length - 1;
        if (isEnd) { point.setAttribute({ visible: false }); return; }
        
        if (index === 0) {
            point.setText(`<img src="data:image/svg+xml;base64,${cachedOriginBase64}" width="20" height="20" style="display: block; pointer-events: none;" />`);
            return;
        }

        let type: StarType = 'locked';
        if (index < currentStep) { 
            type = 'passed'; 
        } else if (index === currentStep) { 
            type = 'current'; 
        } else if (index === currentStep + 1) { 
            type = 'target'; 
        }

        const style = getStarStyle(type);
        const base64 = btoa(unescape(encodeURIComponent(getStarSvg(type))));
        point.setText(`<img src="data:image/svg+xml;base64,${base64}" width="${style.size}" height="${style.size}" style="display: block; pointer-events: none; -webkit-backface-visibility: hidden;" />`);
        point.setAttribute({ label: { visible: index >= currentStep, fontSize: index === currentStep + 1 ? 18 : 14 } });
    });

    const pathPoints = coordinates.slice(0, currentStep + 1);
    if (trail) { 
        trail.dataX = pathPoints.map(p => p.x); 
        trail.dataY = pathPoints.map(p => p.y); 
        trail.updateCurve(); 
    }

    if (rocket) {
        const currentCoordData = coordinates[currentStep];
        const prevCoordData = currentStep > 0 ? coordinates[currentStep - 1] : { x: 0, y: 0 };
        
        let rotationDeg = 0;
        
        if (currentStep > 0) {
             const dx = (currentCoordData.x - prevCoordData.x) * board.unitX;
             const dy = (currentCoordData.y - prevCoordData.y) * -board.unitY; 
             
             // Logic xoay tàu:
             // Math.atan2(dy, dx) trả về góc vector di chuyển.
             // CSS rotate() xoay theo chiều kim đồng hồ.
             // Tàu trong SVG mặc định hướng LÊN (UP).
             // Để tàu xoay đúng hướng di chuyển: rotation = atan2 + 90.
             
             rotationDeg = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
        }
        
        if (rocket.rendNode) {
            rocket.rendNode.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
            rocket.rendNode.style.transform = `rotate(${rotationDeg}deg)`;
            rocket.rendNode.style.webkitBackfaceVisibility = 'hidden'; 
        }
        
        rocket.moveTo([currentCoordData.x, currentCoordData.y], currentStep === 0 ? 0 : 800, { effect: '<>' });
    }
    
    board.unsuspendUpdate(); 
  }, [currentStep, coordinates, cachedOriginBase64, rocketBase64]);

  return { boxRef };
};
