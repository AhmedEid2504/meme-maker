import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Meme from '../components/Meme';
import './index.css';
import DadJokes from '../components/DadJokes';

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [activeComponent, setActiveComponent] = useState('meme');
  // Function to switch between components in the main section of the page
  function changeComponent(component) {
    setActiveComponent(component);
  }

  useEffect(() => {
    document.body.className = darkMode ? "dark" : ""
    !darkMode && playSound();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);


  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => prevDarkMode = !prevDarkMode)
  }

  const playSound = () => {
    const audio = new Audio('audio/flashbang.mp3');
    if (audio) {
      audio.volume = 0.2; // Adjust volume here
      audio.play();
    }
  };
  

  return (
    <>
      <Navbar 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        changeComponent={changeComponent}
        activeComponent={activeComponent}
      />
      <main>
        {activeComponent === 'meme' ?  <Meme darkMode={darkMode} /> : <DadJokes />} 
      </main>
    </>
  )
}

export default App
