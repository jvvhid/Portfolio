import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollRail = ({ sections }) => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use IntersectionObserver to determine the active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div style={{
      position: 'fixed',
      left: 24,
      top: '50%',
      transform: 'translateY(-50%)',
      height: '40vh',
      width: 2,
      backgroundColor: 'var(--border)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Progress fill */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'var(--accent)',
          transformOrigin: 'top'
        }}
        animate={{ scaleY: progress }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
      
      {/* Nodes */}
      {sections.map((id) => (
        <a 
          key={id}
          href={`#${id}`}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: activeSection === id ? 'var(--accent)' : 'var(--bg)',
            border: `2px solid ${activeSection === id ? 'var(--accent)' : 'var(--border)'}`,
            zIndex: 2,
            transition: 'all 0.3s ease',
            cursor: 'none' // Let custom cursor handle it
          }}
          className="hover-target"
          title={`Go to ${id}`}
        />
      ))}
    </div>
  );
};

export default ScrollRail;
