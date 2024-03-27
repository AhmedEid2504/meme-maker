/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import './componentsCSS/image.css'
import {useState, useCallback} from 'react'

const ImageInput = ({imageInput, index, setMeme, setCounter }) => {
    const [showSettings, setShowSettings] = useState(false);

    const handleChange = useCallback((event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setMeme(prevMeme => ({
                ...prevMeme,
                imageInputs: prevMeme.imageInputs.map((imageInput, i) =>
                    i === index ? { ...imageInput, url: reader.result } : imageInput
                ),
            }));
        };
        reader.readAsDataURL(file);
    }, [index, setMeme]);



    const handleRemove = useCallback((index) => {
        setCounter(prevCount => prevCount - 1)
        setMeme(prevMeme => ({
            ...prevMeme,
            imageInputs: prevMeme.imageInputs.filter((_, i) => i !== index),
        }));
    }, [setCounter, setMeme]);

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }
  return (
    <div className="input-container">
        <div className="input">
            <div className="upload-container">
                <label htmlFor={`url-${index}`} className="upload-btn">
                    Upload Image
                </label>
                <input
                    id={`url-${index}`}
                    name={`url-${index}`}
                    type="file"
                    accept="image/*"
                    className="upload-input"
                    onChange={handleChange}
                />
            </div>
            <img className='image-preview' src={imageInput.url} alt="" />
        </div>
        {showSettings && (
            <>
                <div className="input">
                    <label htmlFor="width">Image Width: </label>
                    <input
                        id="width"
                        type="number"
                        name="width"
                        className="form-input size"
                        value={imageInput.size}
                        min={30}
                        onChange={(event) => handleChange(event, index)}
                    />
                    
                </div>
            </>
        )}
        <div className="input-buttons">
                <button className="form-button remove" onClick={() => handleRemove(index)}><img src="images/delete.png" alt="delete icon" /></button>
                <button className="form-button settings" onClick={handleShowSettings} ><img src="/images/settings.png" alt="settings icon" /></button>
        </div>
    </div>
  )
}

export default ImageInput
