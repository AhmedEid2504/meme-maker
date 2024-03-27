/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import './componentsCSS/image.css'
import {useState, useCallback} from 'react'

const ImageInput = ({imageInput, index, setMeme, setCounter }) => {
    const [showSettings, setShowSettings] = useState(false);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        if (name.startsWith('url')) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setMeme(prevMeme => ({
                    ...prevMeme,
                    imageInputs: prevMeme.imageInputs.map((imageInput, i) =>
                        i === index ? { ...imageInput, url: reader.result, imageUploaded: true } : imageInput
                    ),
                }));
            };
            reader.readAsDataURL(file);
        } else if (name.startsWith('width')) {
            setMeme(prevMeme => ({
                ...prevMeme,
                imageInputs: prevMeme.imageInputs.map((input, i) =>
                    i === index ? { ...input, width: `${value}rem` } : input
                ),
            }));
        }
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
    <div className="input-container image">
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
                    required 
                />
            </div>
        </div>
        <img className='image-preview' src={imageInput.url} alt="" />
        {showSettings && (
                <>
                    <div className="input">
                        <label htmlFor={`width-${index}`}>Image Width:</label>
                        <input
                            id={`width-${index}`}
                            name={`width-${index}`}
                            type="number"
                            className="form-input size"
                            value={parseInt(imageInput.width)}
                            min={1}
                            onChange={handleChange}
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
