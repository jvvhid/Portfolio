import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { projects } from '../data/projects';
import { ExternalLink } from 'lucide-react';

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

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring configuration for the image trail
  const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });

  const handleMouseMove = (e) => {
    // Offset the image slightly from the cursor so it doesn't block the link
    cursorX.set(e.clientX + 24);
    cursorY.set(e.clientY - 60);
  };

  return (
    <section id="projects" style={{ position: 'relative' }}>
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          ~ Projects
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px' }} />
        </h2>

        <div
          style={{ display: 'flex', flexDirection: 'column' }}
          onMouseMove={handleMouseMove}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setActiveProject(project)}
              onMouseLeave={() => setActiveProject(null)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '32px 0',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                zIndex: 10
              }}
              className="hover-target"
            >
              <div>
                <a href={project.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '28px', margin: 0 }}>{project.name}</h3>
                  <ExternalLink size={20} className="text-dim" />
                </a>
                <p style={{ color: 'var(--text-dim)', margin: '8px 0 16px 0', fontSize: '18px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="mono accent-text">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Floating Image Reveal */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          pointerEvents: 'none',
          zIndex: 5,
          width: '320px',
          height: '220px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
      >
        {activeProject && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Replace with actual img tag when image is available */}
            {/* <img src={activeProject.image} alt={activeProject.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
            <span className="mono text-dim">Preview: {activeProject.name}</span>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
