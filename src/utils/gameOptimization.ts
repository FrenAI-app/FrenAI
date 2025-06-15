
// Game optimization utilities
export const GAME_CONFIG = {
  TARGET_FPS: 60,
  MAX_EFFECTS: 10,
  MAX_MATCH_EFFECTS: 5,
  EFFECT_CLEANUP_THRESHOLD: 20,
  FRAME_TIME_MS: 16.67, // 1000/60
};

export const throttleGameLoop = (callback: (timestamp: number) => void) => {
  let lastTime = 0;
  
  return (currentTime: number) => {
    if (currentTime - lastTime >= GAME_CONFIG.FRAME_TIME_MS) {
      lastTime = currentTime;
      callback(currentTime);
    }
  };
};

export const optimizeCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  // Enable hardware acceleration hints
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  return ctx;
};

export const createImageCache = () => {
  const cache = new Map<string, HTMLImageElement>();
  
  const loadImage = async (src: string): Promise<HTMLImageElement> => {
    if (cache.has(src)) {
      return cache.get(src)!;
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        cache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  };
  
  const clearCache = () => {
    cache.clear();
  };
  
  return { loadImage, clearCache, size: () => cache.size };
};
