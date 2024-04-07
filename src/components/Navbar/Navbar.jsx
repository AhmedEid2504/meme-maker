import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../contexts/authContext'; // Import the AuthContext hook
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { doSignOut } from '../Auth/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

    return (
        <nav className={props.darkMode ? "bg-third shadow-sm shadow-black relative h-20 flex justify-between items-center px-5 font-sans transition-all ease-in duration-200" : 
                                        "bg-primary shadow-sm shadow-primary relative h-20 flex justify-between items-center px-5 font-sans transition-all ease-in duration-200"}>
            <div className="flex justify-center items-center p-4 gap-2 text-lg">
                <img 
                    className="w-8 md:w-12"
                    src="../images/troll-face.png"
                    alt="meme maker logo(troll face)"
                />
                <h1 className={props.darkMode ? "text-xl hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" }>
                    <Link className={props.darkMode ? "hover:text-primary text-md transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/">Meme Maker</Link>
                </h1>
            </div>
            {windowWidth > 800 ? (
                <ul className="flex justify-between items-center list-none p-2 text-center gap-5">
                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/">Meme Maker</Link></li>
                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/wall-of-memes">Wall Of Memes</Link></li>
                    <div className="flex justify-center items-center text-center content-center gap-3">
                        {/* toggler */}
                        <div className="flex items-center" >
                            <div 
                                className={props.darkMode ? " w-10 h-6 rounded-xl flex justify-start items-center content-center bg-fourth p-0.5 cursor-pointer transition-all ease-in duration-200" : 
                                                            " w-10 h-6 rounded-xl flex justify-end align-middle items-center content-center bg-secondary p-0.5 cursor-pointer transition-all ease-in duration-200"}
                                onClick={props.toggleDarkMode}
                            >
                                <div><img className="h-5 w-5 transition-all ease-in duration-200" src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        
                        <button className={props.darkMode?  "hover:text-primary transition-all ease-in duration-200 text-2xl w-auto h-auto" : 
                                                            "hover:text-third transition-all ease-in duration-200 text-2xl w-auto h-auto"} onClick={toggleMenu}>☰</button>
                        <button className="hover:text-primary transition-all ease-in duration-200 text-2xl flex items-center justify-center"  onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>
                    </div>
                    {showMenu && (
                        <ul className={showMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-10 w-auto transition-all ease-in duration-200" : "translate-y-20 transition-all ease-in duration-200"} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/dad-jokes">Dad Jokes</Link></li>
                            
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/video-meme">Video Memes</Link></li>
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-10 w-auto transition-all ease-in duration-200" : "translate-y-20 transition-all ease-in duration-200"} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" }  to="/signup">Sign Up</Link></li>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/login">Login</Link></li>
                                </> : 
                                <>
                                    <li><button className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } onClick={handleSignOut}>Sign Out</button></li>
                                </>
                            }

                        </ul>
                    )}
                </ul>
                
            ) : (
                <div className="mobile-nav">
                    <div className="flex justify-center items-center text-center content-center gap-2">
                        <div className="flex items-center" >
                            <div 
                                className={props.darkMode ? " w-10  h-13 rounded-xl flex justify-start  items-center content-center bg-fourth p-0.5 cursor-pointer transition-all" : 
                                                            " w-10  h-13 rounded-xl flex justify-end items-center content-center bg-secondary p-0.5 cursor-pointer transition-all"}
                                onClick={props.toggleDarkMode}
                            >
                                <div className="h-5 w-5"><img className="h-5 w-5" src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                            </div>
                        </div>
                        <button className="hover:text-primary transition-all ease-in duration-200 text-2xl w-auto h-auto" onClick={toggleMenu}>☰</button>
                        <button className="hover:text-primary transition-all ease-in duration-200 text-2xl flex items-center justify-center"  onClick={toggleUserMenu}>
                            <img src="images/user.png" alt="user settings icon" />
                        </button>

                    </div>
                    
                    
                    {showMenu && (
                        <ul className={showMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-auto w-[100vw]" : ""} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/">Meme Maker</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/wall-of-memes">Wall Of Memes</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/video-meme">Video Memes</Link></li>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/dad-jokes">Dad Jokes</Link></li>
                            
                        </ul>
                    )}
                    {showUserMenu && (
                        <ul className={showUserMenu ? "absolute flex flex-col justify-center gap-2 items-center bg-third p-10 top-0 right-0 translate-y-20 h-auto w-[100vw]" : ""} ref={ulRef}>
                            <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/my-memes">Your Memes</Link></li>
                            {!userLoggedIn ?
                                <>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/signup">Sign Up</Link></li>
                                    <li><Link className={props.darkMode ? "hover:text-primary transition-all ease-in duration-200" : "hover:text-third transition-all ease-in duration-200" } to="/login">Login</Link></li>
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


