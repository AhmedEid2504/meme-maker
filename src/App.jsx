import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Meme from '../components/Meme';
import './index.css'

function App() {

  const [darkMode, setDarkMode] = useState(true)


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
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <main>
        <Meme darkMode={darkMode} />
      </main>
    </>
  )
}

export default App
