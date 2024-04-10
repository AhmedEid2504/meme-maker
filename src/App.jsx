import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import WallOfMemes from './pages/WallOfMemes';
import MemeMaker from './pages/MemeMaker';
import VideoMeme from './pages/VideoMeme';
import DadJokes from './pages/DadJokes';
import MyMemes from './pages/MyMemes';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';


function App() {

  const [darkMode, setDarkMode] = useState(true);

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
    <Router>
        <ToastContainer
          type="info"
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition: Bounce
        />
        <Navbar 
          toggleDarkMode={toggleDarkMode} 
          darkMode={darkMode} 
        />
        <main className='bg-transparent p-10 items-center justify-evenly flex 
                rounded-lg border-4 border-third 
                w-auto -z-[1]
                m-8 transition-all'
                >
          <Routes>
            <Route path="/" element={<MemeMaker darkMode={darkMode}  />} />
            <Route path="/wall-of-memes" element={<WallOfMemes darkMode={darkMode}  />} />
            <Route path="/video-meme" element={<VideoMeme darkMode={darkMode}  />} />
            <Route path="/my-memes" element={<MyMemes darkMode={darkMode}  />} />
            <Route path="/dad-jokes" element={<DadJokes darkMode={darkMode}  />} />
            <Route path="/signup" element={<Signup darkMode={darkMode}  />} />
            <Route path="/login" element={<Login darkMode={darkMode}  />} />
          </Routes>
        </main>
    </Router>
  )
}

export default App
