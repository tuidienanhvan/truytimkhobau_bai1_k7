
import { useEffect, useRef, useCallback, RefObject } from 'react';

// CONSTANTS
const GAME_W = 1920;
const GAME_H = 1080;

// 37. Text Editing Detection
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

// 21. Viewport Reader (VisualViewport > Client)
const readViewport = () => {
  const vv = window.visualViewport;
  if (vv) {
    return { w: vv.width, h: vv.height };
  }
  return {
    w: document.documentElement.clientWidth || window.innerWidth,
    h: document.documentElement.clientHeight || window.innerHeight,
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

  // 46, 47. Compute Scale Logic
  const computeScale = useCallback((vw: number, vh: number) => {
    let scale = Math.min(vw / GAME_W, vh / GAME_H);
    
    // Safety check for invalid dimensions
    if (!Number.isFinite(scale) || scale <= 0) {
      scale = scaleKeepRef.current || 1;
    }
    
    return Math.max(0.1, scale); // Clamp min
  }, []);

  // 50. Apply Transform (Read-Write separation)
  const applyTransform = useCallback((vw: number, vh: number, scale: number) => {
    if (!stageRef.current) return;

    // FIX #79: Handle VisualViewport Offset (Pinch-zoom / Scroll correction)
    const vv = window.visualViewport;
    const offX = vv ? vv.offsetLeft : 0;
    const offY = vv ? vv.offsetTop : 0;

    // 48. Full precision scale (No Rounding)
    const contentWidth = GAME_W * scale;
    const contentHeight = GAME_H * scale;

    // Center calculation (Rounding allowed for translation to avoid blur)
    // Add offset to ensure content stays within visual viewport when zoomed/panned
    const tx = Math.round(offX + (vw - contentWidth) / 2);
    const ty = Math.round(offY + (vh - contentHeight) / 2);

    // 50. Single transform string, origin 0 0
    stageRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    
    // FIX #58: Sync Container Height (Crucial for iOS Safari Bottom Bar)
    // We force the container to match the Visual Viewport height exactly.
    // This prevents the bottom of the game from being "clipped" or hidden 
    // behind the floating URL bar or keyboard.
    if (containerRef.current) {
         // Force pixel dimensions to match visual viewport
         // This overrides 'h-full' or 'inset-0' which might rely on Layout Viewport
         containerRef.current.style.width = `${vw}px`;
         containerRef.current.style.height = `${vh}px`;
         
         // Fix position if panned (though translation handles stage, container sync helps events)
         containerRef.current.style.transform = `translate(${offX}px, ${offY}px)`;
    }

  }, [stageRef, containerRef]);

  // 40. Keyboard Detection Strategy
  const shouldFreezeForKeyboard = useCallback((currentH: number) => {
    if (!isTextEditing()) return false;
    
    const baseH = baselineRef.current.h || currentH;
    const diff = baseH - currentH;
    
    // Dual threshold: > 150px AND > 15%
    return diff > 150 && diff > (baseH * 0.15);
  }, []);

  // Main Update Loop
  const updateScale = useCallback(() => {
    const { w: vw, h: vh } = readViewport();
    
    // 41. Freeze logic
    if (shouldFreezeForKeyboard(vh)) {
       // Keep old scale, but update position (centering + offset)
       applyTransform(vw, vh, scaleKeepRef.current);
       return;
    }

    const scale = computeScale(vw, vh);
    scaleKeepRef.current = scale;
    applyTransform(vw, vh, scale);

    // 39. Lazy baseline update
    if (!isTextEditing()) {
       baselineRef.current = { w: vw, h: vh };
    }
  }, [applyTransform, computeScale, shouldFreezeForKeyboard]);

  // 31. RAF Debounce
  const onResize = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateScale);
  }, [updateScale]);

  useEffect(() => {
    // 21-29. Event Listeners
    const vv = window.visualViewport;
    
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    window.addEventListener('focusin', onResize, { passive: true });
    window.addEventListener('focusout', () => setTimeout(onResize, 100), { passive: true }); // 42. Unfreeze fast
    
    if (vv) {
        vv.addEventListener('resize', onResize, { passive: true });
        vv.addEventListener('scroll', onResize, { passive: true });
    }
    
    // 30. ResizeObserver
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    if (containerRef.current) ro.observe(containerRef.current);

    // 29. Visibility Change
    const onVisChange = () => { if (!document.hidden) onResize(); };
    document.addEventListener('visibilitychange', onVisChange);

    // Init
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
      document.removeEventListener('visibilitychange', onVisChange);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onResize, containerRef]);

  // 57. FOUC Shield Trigger
  useEffect(() => {
     if (stageRef.current) {
         requestAnimationFrame(() => {
             stageRef.current!.style.opacity = '1';
         });
     }
  }, [stageRef]);

  return { updateScale };
};
