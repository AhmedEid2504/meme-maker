/* eslint-disable react/prop-types */
import {useCallback, useState} from 'react';

const TextInput = ({ textInput, index, setMeme, setCounter }) => {
    const [showSettings, setShowSettings] = useState(false);

    const handleChange = useCallback((event, index) => {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.map((textInput, i) =>
                i === index
                    ? name === "size"
                        ? { ...textInput, [name]: parseInt(value) }
                        : { ...textInput, [name]: value }
                    : textInput
            ),
        }));
    }, [setMeme]);

    const handleRemoveTextInput = useCallback((index) => {
        setCounter(prevCount => prevCount - 1)
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.filter((_, i) => i !== index),
        }));
    }, [setCounter, setMeme]);

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }
    
    return (
        <div className="flex flex-col gap-5 border-4 border-third rounded-md p-3 md:min-w-[50%] min-w-[100%]">
            <div>
                <label htmlFor={`text${index + 1}`}>Text</label>
                <input
                    type="text"
                    name="text"
                    placeholder={`Text ${index + 1}`}
                    className="h-9 border-none rounded-sm bg-third mx-3 indent-2 w-[70%] p-1"
                    value={textInput.text}
                    onChange={(event) => handleChange(event, index)}
                />
            </div>
            {showSettings && ( 
                <>
                    <div>
                        <label htmlFor="fontSize">Font Size </label>
                        <input
                            id="fontSize"
                            type="number"
                            name="size"
                            className="h-9 text-center border-none rounded-sm bg-third mx-3 w-[28%] p-1"
                            placeholder="px"
                            value={textInput.size}
                            min={13}
                            list="defaultNumbers"
                            onChange={(event) => handleChange(event, index)}
                        />
                        <datalist id="defaultNumbers">
                            {textInput.defaultSizes.map((size, i) => (
                                <option key={i} value={size}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className="input">
                        <label htmlFor={`rotate${index + 1}`}>Rotate</label>
                        <input
                            id="rotate"
                            type="number"
                            name="rotate"
                            placeholder="deg"
                            className="h-9 text-center border-none rounded-sm bg-third mx-3 w-[23%] p-1"
                            value={textInput.rotate}
                            onChange={(event) => handleChange(event, index)}
                        />
                    </div>
                    <div className="input">
                        <label htmlFor={`color${index + 1}`}>Color</label>
                        <input
                            id={`color${index + 1}`}
                            type="color"
                            name="color"
                            className="h-9 text-center border-none rounded-sm bg-third mx-3 w-[18%] p-1"
                            value={textInput.color}
                            onChange={(event) => handleChange(event, index)}
                        />
                    </div>
                </>
            )}
            <div className="flex justify-evenly items-center p-3">
                <button className="flex justify-center cursor-pointer items-center rounded-md w-8 p-0.5" onClick={() => handleRemoveTextInput(index)}><img className='hover:rotate-45  transition-all ease-in duration-200' src="images/delete.png" alt="delete icon" /></button>
                <button className="flex justify-center cursor-pointer items-center rounded-xl w-7 bg-secondary h-7 p-0.5" onClick={handleShowSettings} ><img className='hover:rotate-180 transition-all ease-in duration-300' src="images/settings.png" alt="settings icon" /></button>
            </div>
        </div>
    );
}



export default TextInput;
