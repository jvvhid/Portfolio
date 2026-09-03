import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const Reveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Mac OS Dock style magnification item
const MosaicItem = ({ index, mouseX, mouseY, content }) => {
  const itemRef = useRef(null);

  // Calculate distance from cursor to the center of this item
  const distance = useTransform([mouseX, mouseY], ([x, y]) => {
    if (!itemRef.current || x === -100) return Infinity;
    const rect = itemRef.current.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const itemCenterY = rect.top + rect.height / 2;
    // Euclidean distance
    return Math.sqrt(Math.pow(x - itemCenterX, 2) + Math.pow(y - itemCenterY, 2));
  });

  // Transform distance into scale. 
  // If cursor is close (distance ~0), scale up to 1.15
  // If cursor is far (distance > 200px), scale is 1
  const scale = useTransform(distance, [0, 200], [1.15, 1], { clamp: true });
  const smoothScale = useSpring(scale, { damping: 20, stiffness: 300 });

  return (
    <motion.div
      ref={itemRef}
      onClick={() => content.onClick && content.onClick(content.src)}
      style={{
        scale: smoothScale,
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: smoothScale, // Bring hovered items to front
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        cursor: 'zoom-in',
        width: '100%'
      }}
      className="hover-target masonry-item"
    >
      <img src={content.src} alt="myWall item" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
    </motion.div>
  );
};

const Mosaic = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const handleMouseMove = (e) => {
    // Only apply if not preferring reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(-100);
    mouseY.set(-100);
  };

  const imageModules = import.meta.glob('../assets/favorite photos/*.jpg', { eager: true });
  const tiles = Object.values(imageModules).map(module => ({ src: module.default, onClick: setSelectedImg }));

  return (
    <section
      id="mosaic"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
        maxWidth: '100%',
        padding: '120px 0'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px', color: 'var(--text)' }}>
            ~ myWall
            <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px', opacity: 0.2 }} />
          </h2>

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="masonry-grid"
          >
            {tiles.map((tile, i) => (
              <MosaicItem key={i} index={i} mouseX={mouseX} mouseY={mouseY} content={tile} />
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out'
            }}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedImg}
              alt="Full size view"
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Mosaic;
