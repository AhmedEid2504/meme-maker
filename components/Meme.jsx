import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from 'html2canvas';
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
        textInputs: [{ 
            text: "Text", 
            position: { x: "27%", y: "0%" }, 
            color: "#F5F5F5",
            size: ""
        }],
    });
    const [allMemes, setAllMemes] = useState([]);
    const defaultSizes = ["20", "25", "30", "35", "40", "45", "50", "55"]; // Default sizes

    // prevent scrolling when dragging for phones
    useEffect(() => {
        const preventScrollRefresh = (e) => {
            if (meme.isDragging) {
                if (e.touches.length !== 1) return;
                if (e.touches[0].clientY > 0) {
                    e.preventDefault();
                }
            }
        };
    
        document.body.addEventListener("touchmove", preventScrollRefresh, {
            passive: false,
        });
    
        return () => {
            document.body.removeEventListener("touchmove", preventScrollRefresh);
        };
    }, [meme.isDragging]);


    // Fetch API request here
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then((res) => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);

    const memeContainerRef = useRef(null);

    const captureScreenshot = useCallback(() => {
        html2canvas(memeContainerRef.current).then(canvas => {
            const screenshotUrl = canvas.toDataURL();
            const downloadLink = document.createElement('a');
            downloadLink.href = screenshotUrl;
            downloadLink.download = 'meme_screenshot.png';
            downloadLink.click();
        });
    }, []);

    const getMemeImage = useCallback(async () => {
        if (!meme.showUploadedImage) {
            const randomNumber = Math.floor(Math.random() * allMemes.length);
            const url = allMemes[randomNumber].url;
            // downloading the image from the api and creating a blob object with it
            // so that it works for the screenshot function as well
            const response = await fetch(url);
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setMeme(prevMeme => ({
                ...prevMeme,
                randomImage: imageUrl,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            textInputs: [...prevMeme.textInputs, { 
                text: "Text", 
                position: { x: "27%", y: "0%" }, 
                color: "#F5F5F5", // Default color
                size: ""      // Default size
            }],
        }));
    }, []);

    const handleRemoveTextInput = useCallback((index) => {
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.filter((_, i) => i !== index),
        }));
    }, []);

    const handleChange = useCallback((event, index) => {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: prevMeme.textInputs.map((textInput, i) =>
                i === index
                    ? name === "size"
                        ? { ...textInput, size: parseInt(value) }
                        : { ...textInput, [name]: value }
                    : textInput
            ),
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
                        <div className="input-container" key={index}>
                            <input
                                type="color"
                                name="color"
                                className="form-input color"
                                value={textInput.color}
                                onChange={(event) => handleChange(event, index)}
                            />
                            <input
                                type="text"
                                name="text"
                                placeholder={`Text ${index + 1}`}
                                className="form-input text"
                                value={textInput.text}
                                onChange={(event) => handleChange(event, index)}
                            />
                            <input
                                type="number"
                                name="size"
                                className="form-input size"
                                value={textInput.size}
                                min={13}
                                list="defaultNumbers"
                                onChange={(event) => handleChange(event, index)}
                            />
                            <datalist id="defaultNumbers">
                                {defaultSizes.map((size, i) => (
                                    <option key={i} value={size}></option>
                                ))}
                            </datalist>

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
                <div ref={memeContainerRef} className="meme">
                <img
                    src={meme.showUploadedImage ? meme.uploadedImage : meme.randomImage}
                    className="meme-image"
                    alt="Meme"
                />
                {meme.textInputs.map((textInput, index) => (
                    <div
                        key={index}
                        className="meme-text"
                        style={{ 
                            left: textInput.position.x, 
                            top: textInput.position.y,
                            color: textInput.color,
                            fontSize: textInput.size
                        }}
                        onMouseDown={(event) => handlePointerDown(event, index)}
                        onTouchStart={(event) => handlePointerDown(event, index)}
                    >
                        {textInput.text}
                    </div>
                ))}
            </div>
            <button className="form-button download" onClick={captureScreenshot}>Download Meme</button>
            </main>
        );
    }