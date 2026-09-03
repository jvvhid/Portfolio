import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { Mail } from 'lucide-react';

const GithubIcon = () => (
  <svg xmlns="http://www.currentColor.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.currentColor.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsappIcon = () => (
  <svg xmlns="http://www.currentColor.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
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

const Contact = () => {
  return (
    <section id="contact" style={{ textAlign: 'center', padding: '160px 24px' }}>
      <Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center', textAlign: 'left' }}>
          <div>
            <span className="mono accent-text" style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>What's Next?</span>
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 60px)', margin: '0 0 24px 0' }}>~ Get In Touch</h2>
            <p style={{ maxWidth: '600px', margin: '0 0 48px 0', fontSize: '18px', color: 'var(--text-dim)' }}>
              If you want to have stunning photoshoot for your product/event. You know whom to contact.
              You can connect for chitchats too. I am cool.
            </p>

            <a
              href={profile.contact.email}
              className="hover-target"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 106, 78, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Say Hello
            </a>
          </div>

          <div>
            <p className="mono" style={{ fontSize: '14px', marginBottom: '16px', color: '#ffffff' }}>
              We can vibe if you listen to
            </p>
            <iframe 
              style={{ borderRadius: '12px', overflow: 'hidden' }} 
              src="https://open.spotify.com/embed/track/5fVZC9GiM4e8vu99W0Xf6J?utm_source=generator&theme=0" 
              width="100%" 
              height="160" 
              frameBorder="0"
              scrolling="no" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </Reveal>

      <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href={profile.contact.whatsapp} target="_blank" rel="noreferrer" className="text-dim hover-target">
            <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <WhatsappIcon />
            </motion.div>
          </a>
          <a href={profile.contact.instagram} target="_blank" rel="noreferrer" className="text-dim hover-target">
            <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <InstagramIcon />
            </motion.div>
          </a>
          <a href={profile.contact.github} target="_blank" rel="noreferrer" className="text-dim hover-target">
            <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <GithubIcon />
            </motion.div>
          </a>
        </div>
        <p className="mono text-dim" style={{ fontSize: '12px' }}>
          Designed & Built by {profile.name}
        </p>
      </div>
    </section>
  );
};

export default Contact;
