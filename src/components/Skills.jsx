import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../data/skills';

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

const Skills = () => {
  return (
    <section id="skills">
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          ~ Skills & Tools
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px' }} />
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {skills.map((skillGroup, idx) => (
            <div key={idx}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-dim)' }}>
                {skillGroup.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {skillGroup.items.map((skill, sIdx) => (
                  <motion.div
                    key={sIdx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="hover-target"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      color: 'var(--text)'
                    }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default Skills;
