import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import cameraImg from '../assets/hobbies/camera.webp';
import bikeImg from '../assets/hobbies/bike.webp';
import pcImg from '../assets/hobbies/pc.webp';

const FloatingHobbies = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax effects tied to scroll for the entire container
  const containerY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Floating animation for when not scrolling
  const floatingAnimation = (delay) => ({
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }
  });

  const baseImageStyle = {
    width: '8vw',
    minWidth: '60px',
    maxWidth: '100px',
    height: 'auto',
    display: 'block'
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 1024px) {
            .floating-hobbies {
              display: none !important;
            }
          }
        `}
      </style>
      <motion.div 
        className="floating-hobbies"
        style={{
          position: 'fixed',
          right: '4%',
          top: '25%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8vh', // Equal distance guaranteed
          opacity: 0.2,
          mixBlendMode: 'screen',
          filter: 'sepia(1) hue-rotate(100deg) saturate(3)',
          zIndex: 0,
          pointerEvents: 'none',
          y: containerY
        }}
      >
        <motion.div animate={floatingAnimation(0)}>
          <img src={cameraImg} alt="Camera" style={baseImageStyle} />
        </motion.div>
        
        <motion.div animate={floatingAnimation(2)}>
          <img src={bikeImg} alt="Bike" style={baseImageStyle} />
        </motion.div>

        <motion.div animate={floatingAnimation(4)}>
          <img src={pcImg} alt="PC Component" style={baseImageStyle} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default FloatingHobbies;
