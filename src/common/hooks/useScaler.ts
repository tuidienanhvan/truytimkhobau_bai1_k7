
import { useEffect, useRef, useCallback, RefObject } from 'react';

// CONSTANTS
const GAME_W = 1920;
const GAME_H = 1080;

// 30. isTextEditing based on activeElement
const isTextEditing = () => {
  const el = document.activeElement;
  if (!el) return false;
  
  if (el instanceof HTMLInputElement) {
    const textTypes = ['text', 'password', 'email', 'search', 'tel', 'url', 'number'];
    return textTypes.includes(el.type);
  }
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLElement && el.isContentEditable) return true;
  
  return false;
};

// 19, 74. VisualViewport Reader with Offsets
const readViewport = () => {
  const vv = window.visualViewport;
  if (vv) {
    return { 
      w: vv.width, 
      h: vv.height,
      offX: vv.offsetLeft,
      offY: vv.offsetTop
    };
  }
  return {
    w: document.documentElement.clientWidth || window.innerWidth,
    h: document.documentElement.clientHeight || window.innerHeight,
    offX: 0,
    offY: 0
  };
};

export const useScaler = (
  containerRef: RefObject<HTMLDivElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  isFullscreen: boolean
) => {
  const scaleKeepRef = useRef(1);
  const baselineRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);

  // 4, 46. Compute Scale Logic (Pixel Perfect - No Rounding)
  const computeScale = useCallback((vw: number, vh: number) => {
    let scale = Math.min(vw / GAME_W, vh / GAME_H);
    
    // Safety check
    if (!Number.isFinite(scale) || scale <= 0) {
      scale = scaleKeepRef.current || 1;
    }
    
    return Math.max(0.1, scale); // Clamp min
  }, []);

  // 20, 50, 75. Apply Transform & Sync Container
  const applyTransform = useCallback((vw: number, vh: number, scale: number, offX: number, offY: number) => {
    if (!stageRef.current) return;

    // 48. Full precision scale
    const contentWidth = GAME_W * scale;
    const contentHeight = GAME_H * scale;

    // 21. Center calculation (Round translate only)
    const tx = Math.round(offX + (vw - contentWidth) / 2);
    const ty = Math.round(offY + (vh - contentHeight) / 2);

    // 26. transform-origin: 0 0 convention
    stageRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    
    // 20. Sync Container with visualViewport (Critical for iOS)
    if (containerRef.current) {
         containerRef.current.style.width = `${vw}px`;
         containerRef.current.style.height = `${vh}px`;
         containerRef.current.style.transform = `translate(${offX}px, ${offY}px)`;
    }

  }, [stageRef, containerRef]);

  // 32. Dual threshold keyboard detection
  const shouldFreezeForKeyboard = useCallback((currentH: number) => {
    if (!isTextEditing()) return false;
    
    const baseH = baselineRef.current.h || currentH;
    const diff = baseH - currentH;
    
    // > 150px AND > 15%
    return diff > 150 && diff > (baseH * 0.15);
  }, []);

  // 76. Main Update Loop
  const updateScale = useCallback(() => {
    const { w: vw, h: vh, offX, offY } = readViewport();
    
    // 33. Freeze logic
    if (shouldFreezeForKeyboard(vh)) {
       applyTransform(vw, vh, scaleKeepRef.current, offX, offY);
       return;
    }

    const scale = computeScale(vw, vh);
    scaleKeepRef.current = scale;
    applyTransform(vw, vh, scale, offX, offY);

    // 31. Baseline update
    if (!isTextEditing()) {
       baselineRef.current = { w: vw, h: vh };
    }
  }, [applyTransform, computeScale, shouldFreezeForKeyboard]);

  // 6, 22, 77. Event Listener Setup
  useEffect(() => {
    const vv = window.visualViewport;
    
    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateScale);
    };
    
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    window.addEventListener('focusin', onResize, { passive: true });
    window.addEventListener('focusout', () => setTimeout(onResize, 100), { passive: true });
    
    if (vv) {
        vv.addEventListener('resize', onResize, { passive: true });
        vv.addEventListener('scroll', onResize, { passive: true });
    }
    
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    if (containerRef.current) ro.observe(containerRef.current);

    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('focusin', onResize);
      window.removeEventListener('focusout', onResize);
      if (vv) {
          vv.removeEventListener('resize', onResize);
          vv.removeEventListener('scroll', onResize);
      }
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateScale, containerRef]);

  // 16, 78. FOUC Shield
  useEffect(() => {
     if (stageRef.current) {
         requestAnimationFrame(() => {
             stageRef.current!.style.opacity = '1';
         });
     }
  }, [stageRef]);

  return { updateScale };
};
