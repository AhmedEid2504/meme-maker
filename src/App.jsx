import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import WallOfMemes from './components/WallOfMemes/WallOfMemes';
import Meme from './components/Meme';
import VideoMeme from './components/VideoMeme';
import DadJokes from './components/DadJokes';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import MyMemes from './components/MyMemes/MyMemes';


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
        <main>
          <Routes>
            <Route path="/" element={<Meme />} />
            <Route path="/wall-of-memes" element={<WallOfMemes />} />
            <Route path="/video-meme" element={<VideoMeme />} />
            <Route path="/my-memes" element={<MyMemes />} />
            <Route path="/dad-jokes" element={<DadJokes />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
    </Router>
  )
}

export default App
