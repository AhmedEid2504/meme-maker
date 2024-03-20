import { createRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Meme from '../components/Meme';
import './index.css'

function App() {

  const [darkMode, setDarkMode] = useState(true)
  const audioRef = createRef();

  useEffect(() => {
    document.body.className = darkMode ? "dark" : ""
    !darkMode && playSound();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);


  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => prevDarkMode = !prevDarkMode)
  }

  const playSound = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1; // Adjust volume here
      audio.play();
    }
  };
  

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <audio ref={audioRef} src="/audio/flashbang.mp3"/>
      <Meme darkMode={darkMode} />
    </>
  )
}

export default App
