import React, { useRef, useEffect, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import profileImage from '../assets/web.webp';

const DENSITY = ' .:-=+*#%@';

class Particle {
  constructor(x, y, char, color) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.char = char;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
  }

  update(mouse, noise3D, time) {
    // Calculate distance to mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    // Repulsion force from mouse
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = 100; // Repulsion radius
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * 5;
    let directionY = forceDirectionY * force * 5;

    // Simple wave flow field (much faster than 3D noise)
    let waveVal = Math.sin(this.baseX * 0.01 + time * 0.001) * Math.cos(this.baseY * 0.01 + time * 0.001);
    let angle = waveVal * Math.PI * 2;
    let flowX = Math.cos(angle) * 0.5;
    let flowY = Math.sin(angle) * 0.5;

    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // Return to base with spring + flow field
      this.x -= (this.x - this.baseX) * 0.1 - flowX;
      this.y -= (this.y - this.baseY) * 0.1 - flowY;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillText(this.char, this.x, this.y);
  }
}

const ParticlePortrait = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const isInteractiveRef = useRef(false);

  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsReducedMotion(reducedMotionQuery.matches);

    const updateMedia = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
    };

    reducedMotionQuery.addEventListener('change', updateMedia);
    
    return () => {
      reducedMotionQuery.removeEventListener('change', updateMedia);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const noise3D = createNoise3D();
    
    let mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchStart = (e) => {
      setIsInteractive(true);
      // Let the first tap pass through or just update mouse position
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleTouchMove = (e) => {
      if (isInteractiveRef.current) {
        e.preventDefault(); // Stop page scrolling
        const rect = canvas.getBoundingClientRect();
        if (e.touches.length > 0) {
          mouse.x = e.touches[0].clientX - rect.left;
          mouse.y = e.touches[0].clientY - rect.top;
        }
      }
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
      setIsInteractive(false);
    };

    // Close interactive mode if touching outside
    const handleGlobalTouchStart = (e) => {
      if (canvas && !canvas.contains(e.target)) {
        setIsInteractive(false);
        handleMouseLeave();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Use passive: false so we can call e.preventDefault() on touchmove
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);
    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });

    // Preload the image once so init() never waits on the network
    const img = new Image();
    img.src = profileImage;

    const init = () => {
      const parent = containerRef.current;
      if (!parent) return;

      const w = parent.clientWidth;
      const h = parent.clientHeight;

      // Guard: skip if layout hasn't settled yet (0-sized container)
      if (w === 0 || h === 0) return;

      canvas.width = w;
      canvas.height = h;

      // If the image isn't decoded yet, wait for it
      if (!img.complete || img.naturalWidth === 0) return;

      // Draw image to offscreen canvas to get pixel data
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      
      // Scale image to fit canvas while maintaining aspect ratio (zoomed in 15% to crop more of the top)
      const scale = Math.max(w / img.width, h / img.height) * 1.15;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (w - drawWidth) / 2;
      const offsetY = h - drawHeight;

      offscreen.width = w;
      offscreen.height = h;
      offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      const imageData = offCtx.getImageData(0, 0, w, h);
      const data = imageData.data;
      
      particles = [];
      const step = 7; // Medium step for good performance
      
      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const index = (y * w + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          
          if (a > 0) {
            const baseBrightness = (r * 0.299 + g * 0.587 + b * 0.114);
            
            if (baseBrightness > 20) {
              // Use Gamma correction instead of flat boost to prevent color "burning" (clipping)
              const gamma = 0.6; // Values < 1.0 make it brighter by lifting midtones
              let finalR = Math.pow(r / 255, gamma) * 255;
              let finalG = Math.pow(g / 255, gamma) * 255;
              let finalB = Math.pow(b / 255, gamma) * 255;
              let adjustedBrightness = Math.pow(baseBrightness / 255, gamma) * 255;

              // Apply 1.25x contrast
              const contrast = 1.25;
              const applyContrast = (val) => Math.min(255, Math.max(0, ((val / 255 - 0.5) * contrast + 0.5) * 255));
              finalR = applyContrast(finalR);
              finalG = applyContrast(finalG);
              finalB = applyContrast(finalB);
              adjustedBrightness = applyContrast(adjustedBrightness);

              // Edge detection
              let isEdge = false;
              if (x >= step && x < w - step && y >= step && y < h - step) {
                const leftA = data[index - step * 4 + 3];
                const rightA = data[index + step * 4 + 3];
                const topA = data[index - w * step * 4 + 3];
                const bottomA = data[index + w * step * 4 + 3];
                if (leftA < 50 || rightA < 50 || topA < 50 || bottomA < 50) {
                  isEdge = true;
                }
              }

              let charIndex = Math.floor((adjustedBrightness / 255) * (DENSITY.length - 1));
              let char = DENSITY[charIndex];
              let finalColor = `rgba(${Math.floor(finalR)}, ${Math.floor(finalG)}, ${Math.floor(finalB)}, ${a/255})`;

              if (isEdge) {
                char = '#';
                finalColor = 'rgba(255, 255, 255, 0.9)'; // White border
              }
              
              particles.push(new Particle(x, y, char, finalColor));
            }
          }
        }
      }
    };

    // Wait for both image decode AND layout to settle before first init
    const startWhenReady = () => {
      const parent = containerRef.current;
      if (!parent) return;

      const tryInit = () => {
        if (parent.clientWidth > 0 && parent.clientHeight > 0) {
          init();
          // Only start animation loop once particles exist
          if (particles.length > 0 && !animationFrameId) {
            animate(0);
          }
        }
      };

      // Use ResizeObserver to detect when the container actually has dimensions
      const ro = new ResizeObserver(() => {
        tryInit();
      });
      ro.observe(parent);

      // Also try immediately in case layout is already settled
      tryInit();

      return ro;
    };

    let ro;
    if (img.complete && img.naturalWidth > 0) {
      ro = startWhenReady();
    } else {
      img.onload = () => {
        ro = startWhenReady();
      };
    }

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(mouse, noise3D, time);
        p.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('touchstart', handleGlobalTouchStart);
    };
  }, [isReducedMotion]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      {isReducedMotion ? (
        <img 
          src={profileImage} 
          alt="Profile Portrait" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
        />
      ) : (
        <canvas 
          ref={canvasRef} 
          className={isInteractive ? 'interactive-canvas' : ''}
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '100%',
            transition: 'box-shadow 0.3s ease',
            boxShadow: isInteractive ? '0 0 30px rgba(255, 255, 255, 0.15)' : 'none',
            zIndex: isInteractive ? 10 : 1,
            position: 'relative',
            cursor: isInteractive ? 'crosshair' : 'default'
          }} 
        />
      )}
    </div>
  );
};

export default ParticlePortrait;
