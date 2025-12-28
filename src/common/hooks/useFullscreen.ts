
import { useState, useEffect, useCallback } from 'react';

// 36. Device Detection
const detectDevice = () => {
  const ua = navigator.userAgent || '';
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream,
  };
};

// 38. CSS Pseudo-fullscreen styles
const fullscreenStyles = {
  default: `
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  `,
  fullscreen: `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    z-index: 99999;
    background: #000;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) 
             env(safe-area-inset-bottom) env(safe-area-inset-left);
  `
};

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [embedId, setEmbedId] = useState<string>('');

  // 37. Sync State & Style
  const setFullscreenState = (state: boolean) => {
    setIsFullscreen(state);
    const container = document.querySelector('.viewport-layer') as HTMLElement;
    if (container) {
       container.style.cssText = state ? fullscreenStyles.fullscreen : fullscreenStyles.default;
       // Trigger scaler update
       window.dispatchEvent(new Event('resize'));
    }
  };

  useEffect(() => {
    // 41. Fullscreen Change Handler
    const onFullscreenChange = () => {
      const { isIOS } = detectDevice();
      if (isIOS) return;

      const doc = document as any;
      const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
      
      const isNativeFull = !!fsEl;
      if (isNativeFull !== isFullscreen) {
         setFullscreenState(isNativeFull);
      }
    };

    // 43. Iframe Message Handler
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'fullscreenState') {
        setFullscreenState(!!e.data.isFullscreen);
        if (e.data.id) setEmbedId(e.data.id);
      }
      if (e.data?.type === 'piaiInit' && e.data.id) {
         setEmbedId(e.data.id);
      }
    };

    // 42. Escape Key for CSS Fullscreen
    const onKeydown = (e: KeyboardEvent) => {
       if (e.key === 'Escape' && isFullscreen) {
           const doc = document as any;
           const isNativeFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
           if (!isNativeFull) {
               setFullscreenState(false);
           }
       }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    window.addEventListener('message', onMessage);
    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
      window.removeEventListener('message', onMessage);
      document.removeEventListener('keydown', onKeydown);
    };
  }, [isFullscreen]);

  // 39. Toggle with Fallback Chain
  const toggleFullscreen = useCallback(async () => {
    const { isIOS } = detectDevice();

    // Priority 1: Parent Embed
    if (embedId && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'toggleFullscreen', id: embedId }, '*');
      return;
    }

    // Priority 2: iOS CSS Fullscreen
    if (isIOS) {
        setFullscreenState(!isFullscreen);
        return;
    }

    const docElm = document.documentElement as any;
    const doc = document as any;
    const isNativeFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

    try {
      if (!isNativeFull) {
        // Request Native
        if (docElm.requestFullscreen) {
          await docElm.requestFullscreen();
        } else if (docElm.webkitRequestFullscreen) {
          await docElm.webkitRequestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          await docElm.mozRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          await docElm.msRequestFullscreen();
        } else {
            // Fallback to CSS
            setFullscreenState(true);
        }
      } else {
        // Exit Native
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        } else {
            setFullscreenState(false);
        }
      }
    } catch (err) {
      console.warn("Fullscreen API failed, falling back to CSS mode:", err);
      setFullscreenState(true);
    }
  }, [embedId, isFullscreen]);

  return { isFullscreen, toggleFullscreen };
};
