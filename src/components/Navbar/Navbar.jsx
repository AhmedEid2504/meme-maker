import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../contexts/authContext'; // Import the AuthContext hook
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { doSignOut } from '../Auth/auth'
import './nav.css'
const Navbar =(props) => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showMenu, setShowMenu] = useState(false); 
    const [showUserMenu, setShowUserMenu] = useState(false);
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
            setShowUserMenu(false);
        }
    };

    const toggleMenu = (event) => {
        event.stopPropagation(); // Stop event propagation
        setShowMenu(!showMenu);
        setShowUserMenu(false);
    };
    const toggleUserMenu = (event) => {
        event.stopPropagation(); // Stop event propagation
        setShowUserMenu(!showUserMenu);
        setShowMenu(false);
    };

    const handleSignOut = async () => {
        await doSignOut()
        navigate("/")
    };

    return (
        <nav className={props.darkMode ? "dark" : ""}>
            <div className="logo-container">
                <img 
                    className="logo"
                    src="../images/troll-face.png"
                    alt="meme maker logo(troll face)"
                />
                <h1 className="logo-text">
                    <Link to="/">Meme Maker</Link>
                </h1>
            </div>
            {windowWidth > 800 ? (
                <ul>
                    <li><Link to="/">Meme Maker</Link></li>
                    <li><Link to="/wall-of-memes">Wall Of Memes</Link></li>
                    <div className="nav-buttons">
                        <div className="toggler" >
                            <div 
                                className="toggler-slider"
                                onClick={props.toggleDarkMode}
                            >
                                <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        <button className="hamburger-button" onClick={toggleMenu}>☰</button>
                        <button className="user-settings-button" onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>
                    </div>
                    {showMenu && (
                        <ul className={showMenu ? "show" : ""} ref={ulRef}>
                            <li><Link to="/dad-jokes">Dad Jokes</Link></li>
                            
                            <li><Link to="/video-meme">Video Memes</Link></li>
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "show" : ""} ref={ulRef}>
                            <li><Link to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link to="/signup">Sign Up</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                </> : 
                                <>
                                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                                </>
                            }

                        </ul>
                    )}
                </ul>
                
            ) : (
                <div className="mobile-nav">
                    <div className="nav-buttons">
                        <div className="toggler" >
                            <div 
                                className="toggler-slider"
                                onClick={props.toggleDarkMode}
                            >
                                <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        <button className="hamburger-button" onClick={toggleMenu}>☰</button>
                        <button className="user-settings-button" onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>

                    </div>
                    
                    
                    {showMenu && (
                        <ul className={showMenu ? "show" : ""} ref={ulRef}>
                            <li><Link to="/">Meme Maker</Link></li>
                            <li><Link to="/wall-of-memes">Wall Of Memes</Link></li>
                            <li><Link to="/video-meme">Video Memes</Link></li>
                            <li><Link to="/dad-jokes">Dad Jokes</Link></li>
                            
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "show" : ""} ref={ulRef}>
                            <li><Link to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link to="/signup">Sign Up</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                </> : 
                                <>
                                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                                </>
                            }

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


