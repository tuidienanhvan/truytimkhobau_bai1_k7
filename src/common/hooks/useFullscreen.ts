
import { useState, useEffect, useCallback } from 'react';

// FIX #59: iOS Detection
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [embedId, setEmbedId] = useState<string>('');

  useEffect(() => {
    // 1. Native Fullscreen Change
    // FIX #64: Sync state with native change
    const onFullscreenChange = () => {
      // Ignore if iOS (handled manually)
      if (isIOS()) return;

      const doc = document as any;
      const isNativeFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
      
      // Sync state if it drifted
      if (isNativeFull !== isFullscreen) {
         setIsFullscreen(isNativeFull);
      }
    };

    // 2. Listen for Iframe Messages
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'fullscreenState') {
        setIsFullscreen(!!e.data.isFullscreen);
        if (e.data.id) setEmbedId(e.data.id);
      }
      
      if (e.data?.type === 'piaiInit' && e.data.id) {
         setEmbedId(e.data.id);
      }
    };

    // FIX #65: Escape key handling for CSS Fullscreen
    const onKeydown = (e: KeyboardEvent) => {
       if (e.key === 'Escape' && isFullscreen) {
           // Check if native fullscreen is active
           const doc = document as any;
           const isNativeFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
           // If not native (CSS mode), toggle off manually
           if (!isNativeFull) {
               setIsFullscreen(false);
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

  // FIX #66: Notify Parent (if needed) - logic already in toggleFullscreen
  const toggleFullscreen = useCallback(async () => {
    // FIX #62: Toggle Logic with Fallback Chain

    // Priority 1: Parent Embed
    if (embedId && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'toggleFullscreen', id: embedId }, '*');
      return;
    }

    // Priority 2: iOS CSS Fullscreen (Native not supported)
    if (isIOS()) {
        setIsFullscreen(prev => !prev);
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
            setIsFullscreen(true);
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
            setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn("Fullscreen API failed, falling back to CSS mode:", err);
      // FIX: Fallback to CSS Fullscreen on error
      setIsFullscreen(prev => !prev);
    }
  }, [embedId]);

  return { isFullscreen, toggleFullscreen };
};
