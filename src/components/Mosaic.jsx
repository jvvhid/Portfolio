import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const Reveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
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
      <img src={content.src} alt="myWall item" style={{ width: '100%', height: 'auto', display: 'block' }} />
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

  const imageModules = import.meta.glob('../assets/favorite photos/*.webp', { eager: true });
  
  const [loadedTiles, setLoadedTiles] = useState([]);
  const [colCount, setColCount] = useState(3);

  useEffect(() => {
    const arr = Object.values(imageModules).map(module => ({ src: module.default, onClick: setSelectedImg }));
    
    Promise.all(arr.map(item => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = item.src;
        img.onload = () => resolve({ ...item, aspectRatio: img.width / img.height });
      });
    })).then(tilesWithRatio => {
       // Custom sorting as requested: DSC08982 first, DSC08871 not adjacent (put it last)
       tilesWithRatio.sort((a, b) => {
         if (a.src.includes('DSC08982')) return -1;
         if (b.src.includes('DSC08982')) return 1;
         if (a.src.includes('DSC08871')) return 1;
         if (b.src.includes('DSC08871')) return -1;
         return a.src.localeCompare(b.src);
       });
       setLoadedTiles(tilesWithRatio);
    });
  }, []);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth <= 480) setColCount(1);
      else if (window.innerWidth <= 900) setColCount(2);
      else setColCount(4);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Distribute items into columns to keep heights balanced (greedy algorithm)
  const columns = Array.from({ length: colCount }, () => ({ height: 0, items: [] }));
  loadedTiles.forEach(tile => {
    let shortestCol = columns[0];
    for (const c of columns) {
      if (c.height < shortestCol.height) shortestCol = c;
    }
    shortestCol.items.push(tile);
    // Add relative height to column (width is 1, so height is 1/aspectRatio)
    shortestCol.height += (1 / tile.aspectRatio);
  });

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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <Reveal>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px', color: 'var(--text)' }}>
            ~ myWall
            <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px', opacity: 0.2 }} />
          </h2>

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'flex', gap: colCount === 1 ? '0' : (colCount === 2 ? '16px' : '24px'), alignItems: 'stretch' }}
          >
            {columns.map((col, colIndex) => (
              <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: colCount === 1 ? '16px' : (colCount === 2 ? '16px' : '24px'), flex: 1 }}>
                {col.items.map((tile, i) => (
                  <MosaicItem key={i} index={i} mouseX={mouseX} mouseY={mouseY} content={tile} />
                ))}
              </div>
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
