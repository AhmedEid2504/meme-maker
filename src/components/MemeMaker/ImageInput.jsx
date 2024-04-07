/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import {useState, useCallback} from 'react'

const ImageInput = ({imageInput, index, setMeme, setCounter, darkMode }) => {
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
    <div className="flex flex-col gap-5 justify-center items-center border-4 border-third rounded-md p-4 md:min-w-[40%] min-w-[100%]">
        <div>
            <div className="flex">
                <label htmlFor={`url-${index}`} 
                className={darkMode ?   "bg-secondary text-fourth p-2 rounded-md cursor-pointer hover:bg-transparent hover:text-secondary border-2 transition-all ease-in duration-200" :
                "bg-third text-secondary p-2 rounded-md cursor-pointer hover:bg-transparent hover:text-third border-2 border-third transition-all ease-in duration-200"}
                >
                    Upload Image
                </label>
                <input
                    id={`url-${index}`}
                    name={`url-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                    required 
                />
            </div>
        </div>
        <img className='w-[50%]' src={imageInput.url} alt="" />
        {showSettings && (
                <>
                    <div>
                        <label htmlFor={`width-${index}`}>Width</label>
                        <input
                            id={`width-${index}`}
                            name={`width-${index}`}
                            type="number"
                            className="h-9 text-center border-none rounded-sm bg-third mx-3 w-[35%] p-1"
                            value={parseInt(imageInput.width)}
                            min={1}
                            onChange={handleChange}
                        />
                    </div>
                </>
            )}
        <div className="flex gap-5 items-center justify-between p-3">
            <button className="flex justify-center cursor-pointer items-center rounded-md w-8  h-7 p-0.5" onClick={() => handleRemove(index)}><img className='hover:rotate-45  transition-all ease-in duration-200' src="images/delete.png" alt="delete icon" /></button>
            <button className="flex justify-center cursor-pointer items-center rounded-xl w-7 bg-secondary h-7 p-0.5" onClick={handleShowSettings} ><img className='hover:rotate-180 transition-all ease-in duration-300' src="images/settings.png" alt="settings icon" /></button>
        </div>
    </div>
  )
}

export default ImageInput
