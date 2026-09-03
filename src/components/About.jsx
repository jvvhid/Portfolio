import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

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

const About = () => {
  return (
    <section id="about" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <Reveal>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          ~ About Me
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flex: 1, opacity: 0.5 }}></div>
        </h2>

        <div style={{ maxWidth: '800px' }}>
          <p style={{ marginBottom: '16px', fontSize: '18px', lineHeight: 1.6 }}>
            {profile.bio}
          </p>
        </div>
      </Reveal>
    </section>
  );
};

export default About;
