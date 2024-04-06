import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../contexts/authContext'; // Import the AuthContext hook
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { doSignOut } from '../Auth/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './nav.css'


const Navbar =(props) => {
    const signedoutNotify = () => toast("Signed Out", { type: "info" });

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
        signedoutNotify();
    };

    /* ul.show {
    max-height: 60dvh; 
    width: 20vw; 
    text-align: center; 
    border: none;
    height: auto; 
    transform: translateY(10dvh); 
} */

    return (
        <nav className={props.darkMode ? "bg-third shadow-sm shadow-black relative h-20 flex justify-between items-center px-5 font-sans" : 
                                        "bg-primary shadow-sm shadow-primary relative h-20 flex justify-between items-center px-5 font-sans"}>
            <div className="flex justify-center items-center p-4 gap-2 text-lg">
                <img 
                    className="w-8 md:w-12"
                    src="../images/troll-face.png"
                    alt="meme maker logo(troll face)"
                />
                <h1 className={props.darkMode ? "text-xl hover:text-primary transition-colors" : "hover:text-third transition-colors" }>
                    <Link className={props.darkMode ? "hover:text-primary text-md transition-colors" : "hover:text-third transition-colors" } to="/">Meme Maker</Link>
                </h1>
            </div>
            {windowWidth > 800 ? (
                <ul className="flex justify-between items-center list-none p-1 text-center gap-4">
                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/">Meme Maker</Link></li>
                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/wall-of-memes">Wall Of Memes</Link></li>
                    <div className="flex justify-center items-center text-center content-center gap-2">
                        <div className="toggler" >
                            <div 
                                className="toggler-slider"
                                onClick={props.toggleDarkMode}
                            >
                                <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        
                        <button className={props.darkMode?  "hover:text-primary transition-colors text-2xl w-auto h-auto" : 
                                                            "hover:text-third transition-colors text-2xl w-auto h-auto"} onClick={toggleMenu}>☰</button>
                        <button className="hover:text-primary transition-colors text-2xl flex items-center justify-center"  onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>
                    </div>
                    {showMenu && (
                        <ul className={showMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-10 w-auto transition transition-duration: 150ms" : "translate-y-20 transition-all transition-duration: 150ms"} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/dad-jokes">Dad Jokes</Link></li>
                            
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/video-meme">Video Memes</Link></li>
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-10 w-auto transition transition-duration: 150ms" : "translate-y-20 transition-all transition-duration: 150ms"} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" }  to="/signup">Sign Up</Link></li>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/login">Login</Link></li>
                                </> : 
                                <>
                                    <li><button className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } onClick={handleSignOut}>Sign Out</button></li>
                                </>
                            }

                        </ul>
                    )}
                </ul>
                
            ) : (
                <div className="mobile-nav">
                    <div className="flex justify-center items-center text-center content-center gap-2">
                        <div className="toggler" >
                            <div 
                                className="toggler-slider"
                                onClick={props.toggleDarkMode}
                            >
                                <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        <button className="hover:text-primary transition-colors text-2xl w-auto h-auto" onClick={toggleMenu}>☰</button>
                        <button className="hover:text-primary transition-colors text-2xl flex items-center justify-center"  onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>

                    </div>
                    
                    
                    {showMenu && (
                        <ul className={showMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-auto w-[100vw]" : ""} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/">Meme Maker</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/wall-of-memes">Wall Of Memes</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/video-meme">Video Memes</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/dad-jokes">Dad Jokes</Link></li>
                            
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-auto w-[100vw]" : ""} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/signup">Sign Up</Link></li>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-colors" : "hover:text-third transition-colors" } to="/login">Login</Link></li>
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


