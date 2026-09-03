import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience, awards } from '../data/experience';
import { ExternalLink } from 'lucide-react';
import award2025 from '../assets/2025award.webp';
import award2026 from '../assets/2026pronoia awarrd.webp';

const YoutubeIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

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

const Experience = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const awardImages = {
    "2025award.webp": award2025,
    "2026pronoia awarrd.webp": award2026
  };

  return (
    <section id="experience">
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          ~ Experience & Awards
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px' }} />
        </h2>

        <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Experience</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {experience.map((item) => (
            <motion.div
              key={item.id}
              className="bg-elevated hover-target"
              whileHover={{
                y: -4,
                boxShadow: '0 10px 30px -15px rgba(0, 106, 78, 0.2)',
                borderColor: 'var(--accent)'
              }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '22px', margin: 0 }}>
                  {item.role} <span className="accent-text">@ {item.company}</span>
                </h3>
              </div>
              <p style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '16px' }}>
                {item.description}
              </p>
              {item.links && item.links.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                  {item.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-dim)' }} className="hover-target">
                      <ExternalLink size={16} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Awards & Recognition</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {awards.map((item) => (
            <motion.div
              key={item.id}
              className="bg-elevated hover-target"
              whileHover={{
                y: -4,
                boxShadow: '0 10px 30px -15px rgba(0, 106, 78, 0.2)',
                borderColor: 'var(--accent)'
              }}
              transition={{ duration: 0.2 }}
            >
              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>{item.title}</h3>
              <p className="accent-text mono" style={{ margin: '0 0 16px 0', fontSize: '14px' }}>{item.prize}</p>
              
              {item.image && (
                <div 
                  style={{ width: '100%', height: '140px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px', cursor: 'zoom-in' }}
                  onClick={() => setSelectedImg(awardImages[item.image])}
                >
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={awardImages[item.image]} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                  />
                </div>
              )}

              {item.youtubeId && (
                <div 
                  style={{ width: '100%', height: '140px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px', cursor: 'pointer', position: 'relative' }}
                  onClick={() => window.open(`https://youtu.be/${item.youtubeId}`, '_blank')}
                >
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '12px', display: 'flex', pointerEvents: 'none' }}>
                    <YoutubeIcon size={24} />
                  </div>
                </div>
              )}

              {item.links && item.links.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                  {item.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-dim)' }} className="hover-target">
                      {link.icon === 'youtube' ? <YoutubeIcon size={16} /> : <ExternalLink size={16} />}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Reveal>

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

export default Experience;
