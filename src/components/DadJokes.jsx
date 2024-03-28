import { useState } from "react";
import './componentsCSS/joke.css'

const DadJokes = () => {
    const [joke, setJoke] = useState("Loading...");
    
    // Fetch API request here
    const getDadJoke = async () => { 
        let config = {
            headers : {
                Accept:"application/json",
            },
        };
        let a = await fetch("https://icanhazdadjoke.com/", config);
        let b = await a.json()
        setJoke(b.joke);
        playSound()
    }
    const playSound = () => {
        const audio = new Audio('audio/drums.mp3');
        if (audio) {
            audio.volume = 0.2; // Adjust volume here
            audio.play();
        }
    };

    return (
        <div className="joke-container">
            <h1>Dad Jokes</h1>
            <button className="joke-button" onClick={getDadJoke}>Get Joke</button>
            <div id="joke">
                <h2>{joke}</h2>
            </div>
        </div>
    )
}

export default DadJokes
