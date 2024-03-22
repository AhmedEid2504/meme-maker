import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Navbar =(props) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showMenu, setShowMenu] = useState(false); 

useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setShowMenu(false); // Close menu on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

const toggleMenu = () => {
    setShowMenu(!showMenu);
};

    return (
        <nav className={props.darkMode ? "dark" : ""}>
            <div className="logo-container">
                <img 
                    className="logo"
                    src="../images/troll-face.png"
                    alt="meme maker logo(troll face)"
                />
                <h1 className="logo-text">Meme Maker</h1>
            </div>
            {windowWidth > 768 ? (
                <ul>
                    <li><button className="nav-button" onClick={() => {/* handle state change */}}>Wall Of Memes</button></li>
                    <li><button className="nav-button" onClick={() => {/* handle state change */}}>Image Memes</button></li>
                    <li><button className="nav-button" onClick={() => {/* handle state change */}}>Video Memes</button></li>
                    <li><button className="nav-button" onClick={() => {/* handle state change */}}>Dad Jokes</button></li>
                    <li>
                        <div className="toggler" >
                            <div 
                                className="toggler-slider"
                                onClick={props.toggleDarkMode}
                            >
                                <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                    </li>
                </ul>
            ) : (
                <div className="mobile-nav">
                    <button className="hamburger-button" onClick={toggleMenu}>☰</button>
                    {showMenu && (
                        <ul className={showMenu ? "show" : ""}>
                            <li><button className="nav-button" onClick={() => {/* handle state change */}}>Wall Of Memes</button></li>
                            <li><button className="nav-button" onClick={() => {/* handle state change */}}>Image Memes</button></li>
                            <li><button className="nav-button" onClick={() => {/* handle state change */}}>Video Memes</button></li>
                            <li><button className="nav-button" onClick={() => {/* handle state change */}}>Dad Jokes</button></li>
                            <li>
                                <div className="toggler" >
                                    <div 
                                        className="toggler-slider"
                                        onClick={props.toggleDarkMode}
                                    >
                                        <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </nav>
    )
}

Navbar.propTypes = {
    // Define PropTypes here
        darkMode: PropTypes.bool,
        toggleDarkMode: PropTypes.func
};

export default Navbar;


