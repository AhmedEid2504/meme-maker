/* eslint-disable react/prop-types */
import {useCallback, useState} from 'react';
import './componentsCSS/text.css'
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
        <div className="input-container">
            <div className="input">
                <label htmlFor={`text${index + 1}`}>Text:</label>
                <input
                    type="text"
                    name="text"
                    placeholder={`Text ${index + 1}`}
                    className="form-input text"
                    value={textInput.text}
                    onChange={(event) => handleChange(event, index)}
                />
            </div>
            {showSettings && ( 
                <>
                    <div className="input">
                        <label htmlFor="fontSize">Font Size: </label>
                        <input
                            id="fontSize"
                            type="number"
                            name="size"
                            className="form-input size"
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
                        <label htmlFor={`color${index + 1}`}>Color:</label>
                        <input
                            id={`color${index + 1}`}
                            type="color"
                            name="color"
                            className="form-input color"
                            value={textInput.color}
                            onChange={(event) => handleChange(event, index)}
                        />
                    </div>
                    {/* Other settings */}
                </>
            )}
            <div className="input-buttons">
                <button className="form-button remove" onClick={() => handleRemoveTextInput(index)}><img src="images/delete.png" alt="delete icon" /></button>
                <button className="form-button settings" onClick={handleShowSettings} ><img src="/images/settings.png" alt="settings icon" /></button>
            </div>
        </div>
    );
}



export default TextInput;
