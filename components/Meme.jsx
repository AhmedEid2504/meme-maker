import { useState, useEffect, useCallback } from "react";

export default function Meme() {
    const [meme, setMeme] = useState({
        randomImage: "http://i.imgflip.com/1bij.jpg",
        uploadedImage: null,
        showUploadedImage: false,
        isDragging: false,
        dragElement: "",
        mouseX: 0,
        mouseY: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
        textInputs: [{ text: "", position: { x: "27%", y: "0%" } }],
    });

    const [allMemes, setAllMemes] = useState([]);

    useEffect(() => {
        // Fetch API request here
        fetch("https://api.imgflip.com/get_memes")
            .then((res) => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);

    const getMemeImage = useCallback(() => {
        if (!meme.showUploadedImage) {
            const randomNumber = Math.floor(Math.random() * allMemes.length);
            const url = allMemes[randomNumber].url;
            setMeme(prevMeme => ({
                ...prevMeme,
                randomImage: url,
            }));
        } else {
            setMeme(prevMeme => ({
                ...prevMeme,
                randomImage: meme.uploadedImage,
            }));
        }
    }, [allMemes, meme.showUploadedImage, meme.uploadedImage]);

    const handleImageUpload = useCallback((event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setMeme(prevMeme => ({
                ...prevMeme,
                uploadedImage: reader.result,
                showUploadedImage: true,
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    const removeUploadedImage = useCallback(() => {
        setMeme(prevMeme => ({
            ...prevMeme,
            uploadedImage: null,
            showUploadedImage: false,
        }));
    }, []);

    const handlePointerDown = useCallback((event, index) => {
        event.preventDefault();
        const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        setMeme(prevMeme => ({
            ...prevMeme,
            isDragging: true,
            dragElement: index,
            mouseX: clientX,
            mouseY: clientY,
            dragOffsetX: prevMeme.textInputs[index].position.x,
            dragOffsetY: prevMeme.textInputs[index].position.y,
        }));
    }, []);

    const handlePointerMove = useCallback((event) => {
        event.preventDefault(); // Prevent default scrolling behavior
        if (meme.isDragging) {
            const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
            const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
            const deltaX = clientX - meme.mouseX;
            const deltaY = clientY - meme.mouseY;

            setMeme(prevMeme => ({
                ...prevMeme,
                textInputs: prevMeme.textInputs.map((textInput, index) => {
                    if (index === prevMeme.dragElement) {
                        return {
                            ...textInput,
                            position: {
                                x: `calc(${prevMeme.dragOffsetX} + ${deltaX}px)`,
                                y: `calc(${prevMeme.dragOffsetY} + ${deltaY}px)`,
                            },
                        };
                    }
                    return textInput;
                }),
                mouseX: clientX,
                mouseY: clientY,
            }));
        }
    }, [meme.isDragging]);

    const handlePointerUp = useCallback(() => {
        setMeme(prevMeme => ({
            ...prevMeme,
            isDragging: false,
        }));
    }, []);

    const handleAddTextInput = useCallback(() => {
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: [...prevMeme.textInputs, { text: "", position: { x: "27%", y: "0%" } }],
        }));
    }, []);

    const handleRemoveTextInput = useCallback((index) => {
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.filter((_, i) => i !== index),
        }));
    }, []);

    const handleChange = useCallback((event, index) => {
        const { value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.map((textInput, i) => {
                if (i === index) {
                    return { ...textInput, text: value };
                }
                return textInput;
            }),
        }));
    }, []);
    
    return (
        <main 
            onMouseMove={handlePointerMove} 
            onMouseUp={handlePointerUp}
            onTouchMove={handlePointerMove} 
            onTouchEnd={handlePointerUp}
        >
            <div className="form">
                <div className="inputs-container">
                    <button className="form-button add" onClick={handleAddTextInput}>Add Text</button>
                        {meme.textInputs.map((textInput, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    placeholder={`Text ${index + 1}`}
                                    className="form-input"
                                    value={textInput.text}
                                    onChange={(event) => handleChange(event, index)}
                                />
                                <button className="form-button remove" onClick={() => handleRemoveTextInput(index)}>Remove</button>
                            </div>
                        ))}
                </div>
                <div className="upload-container">
                    <label htmlFor="upload-input" className="upload-btn">
                        Upload Image
                    </label>
                    <input
                        id="upload-input"
                        type="file"
                        accept="image/*"
                        className="upload-input"
                        onChange={handleImageUpload}
                    />
                </div>

                {!meme.showUploadedImage && (
                    <button
                        className="form-button"
                        onClick={getMemeImage}
                    >
                        Generate Meme
                    </button>
                )}
                {meme.showUploadedImage && (
                    <button
                        className="form-button"
                        onClick={removeUploadedImage}
                    >
                        Remove Image
                    </button>
                )}
            </div>
            <div className="meme">
                <img
                    src={meme.showUploadedImage ? meme.uploadedImage : meme.randomImage}
                    className="meme-image"
                    alt="Meme"
                />
                {meme.textInputs.map((textInput, index) => (
                    <div
                        key={index}
                        className="meme-text"
                        style={{ left: textInput.position.x, top: textInput.position.y }}
                        onMouseDown={(event) => handlePointerDown(event, index)}
                        onTouchStart={(event) => handlePointerDown(event, index)}
                    >
                        {textInput.text}
                    </div>
                ))}
            </div>
        </main>
    );
}
