import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '../data/achievements';

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

const Achievements = () => {
  const [zoomedImage, setZoomedImage] = useState(null);

  return (
    <section id="achievements">
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <span className="mono accent-text" style={{ fontSize: '20px' }}>06.</span>
          Achievements & Research
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px' }} />
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {achievements.map((item) => (
            <div
              key={item.id}
              className="bg-elevated"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', margin: 0 }}>{item.title}</h3>
                <span className="mono accent-text">{item.date}</span>
              </div>
              <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '8px' }}>{item.organization}</p>
              <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '16px' }}>{item.description}</p>
              
              {item.image && (
                <div style={{ marginTop: '16px' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    loading="lazy"
                    onClick={() => setZoomedImage(item.image)}
                    className="hover-target"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      cursor: 'zoom-in',
                      border: '1px solid var(--border)'
                    }} 
                  />
                </div>
              )}

              {item.links && item.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                  {item.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono accent-text hover-target"
                      style={{ fontSize: '14px', textDecoration: 'underline' }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              cursor: 'zoom-out'
            }}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={zoomedImage}
              alt="Zoomed Achievement"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;
