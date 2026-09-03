import React from 'react';
import { motion } from 'framer-motion';
import { education } from '../data/education';

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

const Education = () => {
  return (
    <section id="education">
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          ~ Education
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flexGrow: 1, marginLeft: '16px' }}></div>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {education.map((item) => (
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
                <h3 style={{ fontSize: '22px', margin: 0 }}>{item.institution}</h3>
                <span className="mono accent-text">{item.duration}</span>
              </div>
              {item.degree && (
                <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: item.result ? '8px' : '16px', color: 'var(--text)' }}>
                  {item.degree}
                </p>
              )}
              {item.result && (
                <p className="mono accent-text" style={{ fontSize: '15px', marginBottom: '16px' }}>
                  {item.result}
                </p>
              )}
              {item.coursework && item.coursework.length > 0 && (
                <div>
                  <p className="mono text-dim" style={{ marginBottom: '8px' }}>Relevant Coursework:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="mono"
                        style={{
                          padding: '4px 12px',
                          backgroundColor: 'var(--bg)',
                          borderRadius: '4px',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default Education;
