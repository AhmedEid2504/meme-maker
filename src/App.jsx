import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Meme from '../components/Meme';
import './index.css'


function App() {

  const [darkMode, setDarkMode] = useState(true)
  
  useEffect(() => {
    document.body.className = darkMode ? "dark" : ""
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => prevDarkMode = !prevDarkMode)
  }
  

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Meme darkMode={darkMode} />
    </>
  )
}

export default App
