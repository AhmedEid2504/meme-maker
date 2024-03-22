import PropTypes from "prop-types";

const Navbar =(props) => {
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
            <div 
                className="toggler" 
            >
                <div 
                    className="toggler-slider"
                    onClick={props.toggleDarkMode}
                >
                    <div className="toggler-slider-circle"><img src={props.darkMode ? "images/moon.png" : "images/sun.png"} alt="moon icon" /></div>
                </div>
            </div>
        </nav>
    )
}

Navbar.propTypes = {
    // Define PropTypes here
        darkMode: PropTypes.bool,
        toggleDarkMode: PropTypes.func
};

export default Navbar;


