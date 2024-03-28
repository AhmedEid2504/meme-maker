import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import './componentsCSS/nav.css'
const Navbar =(props) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showMenu, setShowMenu] = useState(false); 
    const ulRef = useRef(null);



    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Add event listener for clicks outside the ul
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (ulRef.current && !ulRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    const toggleMenu = (event) => {
        event.stopPropagation(); // Stop event propagation
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
                    <li><button className="nav-button" onClick={() => {props.changeComponent('wallofmemes')}}>Wall Of Memes</button></li>
                    <li><button className="nav-button" onClick={() => {props.changeComponent('meme')}}>Image Memes</button></li>
                    <li><button className="nav-button" onClick={() => {props.changeComponent('videomeme')}}>Video Memes</button></li>
                    <li><button className="nav-button" onClick={() => {props.changeComponent('dadjokes')}}>Dad Jokes</button></li>
                    <li><button className="nav-button" onClick={() => {props.changeComponent('signup')}}>Sign Up</button></li>
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
                        <ul className={showMenu ? "show" : ""} ref={ulRef}>
                            <li><button className="nav-button" onClick={() => {props.changeComponent('wallofmemes')}}>Wall Of Memes</button></li>
                            <li><button className="nav-button" onClick={() => {props.changeComponent('meme')}}>Image Memes</button></li>
                            <li><button className="nav-button" onClick={() => {props.changeComponent('videomeme')}}>Video Memes</button></li>
                            <li><button className="nav-button" onClick={() => {props.changeComponent('dadjokes')}}>Dad Jokes</button></li>
                            <li><button className="nav-button" onClick={() => {props.changeComponent('signup')}}>Sign Up</button></li>
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
        toggleDarkMode: PropTypes.func,
        changeComponent:     PropTypes.func,

};

export default Navbar;


