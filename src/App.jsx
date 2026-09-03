import React from 'react';
import CustomCursor from './components/CustomCursor';
import ScrollRail from './components/ScrollRail';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Mosaic from './components/Mosaic';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import FloatingHobbies from './components/FloatingHobbies';
import './index.css';

function App() {
  const sections = [
    'hero',
    'about',
    'education',
    'experience',
    'mosaic',
    'projects',
    'skills',
    'contact'
  ];

  return (
    <>
      <CustomCursor />
      <ScrollRail sections={sections} />
      <FloatingHobbies />

      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Mosaic />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}

export default App;
