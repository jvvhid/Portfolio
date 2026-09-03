import React, { useRef, useEffect, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import profileImage from '../assets/web.png';

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

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const init = () => {
      const parent = containerRef.current;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      const img = new Image();
      img.src = profileImage;
      img.onload = () => {
        // Draw image to offscreen canvas to get pixel data
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
        
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        particles = [];
        const step = 7; // Medium step for good performance
        
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            if (a > 0) {
              const baseBrightness = (r * 0.299 + g * 0.587 + b * 0.114);
              
              if (baseBrightness > 20) {
                // Apply a strong flat boost to compensate for text-rendering darkness
                const boost = 1.0;
                const finalR = Math.min(255, r * boost);
                const finalG = Math.min(255, g * boost);
                const finalB = Math.min(255, b * boost);
                const adjustedBrightness = Math.min(255, baseBrightness * boost);

                // Edge detection
                let isEdge = false;
                if (x >= step && x < canvas.width - step && y >= step && y < canvas.height - step) {
                  const leftA = data[index - step * 4 + 3];
                  const rightA = data[index + step * 4 + 3];
                  const topA = data[index - canvas.width * step * 4 + 3];
                  const bottomA = data[index + canvas.width * step * 4 + 3];
                  if (leftA === 0 || rightA === 0 || topA === 0 || bottomA === 0) {
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
    };

    init();

    window.addEventListener('resize', init);

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(mouse, noise3D, time);
        p.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      window.removeEventListener('resize', init);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
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
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default ParticlePortrait;
