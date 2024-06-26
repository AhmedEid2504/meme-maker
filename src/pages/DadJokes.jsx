/* eslint-disable react/prop-types */
import { useState } from "react";

const DadJokes = (props) => {
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
        <div className={props.darkMode ?"flex flex-col items-center justify-around w-full p-3 gap-4 text-secondary font-mono" :
                                        "flex flex-col items-center justify-around w-full p-3 gap-4 text-fourth font-mono"}>
            <h1 className="text-2xl">Dad Jokes</h1>
            <button className="bg-primary shadow-md shadow-fourth hover:shadow-inner
                                    hover:shadow-primary p-2 rounded-md hover:bg-secondary
                                    hover:text-third border-2 border-primary transition-all 
                                    duration-200 ease-in text-xl
                            " onClick={getDadJoke}>Get Joke</button>
            <div id="joke">
                <h2 className="text-xl text-center" >{joke}</h2>
            </div>
        </div>
    )
}

export default DadJokes
