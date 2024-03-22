import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from 'html2canvas';
export default function Meme() {
    // Fetch API request here
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then((res) => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);
    
    const [meme, setMeme] = useState({
        randomImage: "/images/defaultMeme.png",
        uploadedImage: null,
        showUploadedImage: false,
        isDragging: false,
        dragElement: "",
        mouseX: 0,
        mouseY: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
        textInputs: [{ 
            text: "", 
            position: { x: "27%", y: "0%" }, 
            color: "#F5F5F5",
            size: "",
            defaultSizes:["20", "25", "30", "35", "40", "45", "50", "55"],
            rotate:"",
        }],
    });
    const [allMemes, setAllMemes] = useState([]);
    const [counter, setCounter] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
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
    
    useEffect(() => {
        if (counter > 1) {
            playSound()
        }
    }, [counter])

    const playSound = () => {
        const audio = new Audio('audio/anotherone.mp3');
        if (audio) {
            audio.volume = 0.1; // Adjust volume here
            audio.play();
        }
    };

    const memeContainerRef = useRef(null);

    const captureScreenshot = useCallback(() => {
        html2canvas(memeContainerRef.current).then(canvas => {
            const screenshotUrl = canvas.toDataURL();
            const downloadLink = document.createElement('a');
            downloadLink.href = screenshotUrl;
            downloadLink.download = 'Meme_Maker.png';
            downloadLink.click();
            const audio = new Audio('');
            audio.play();
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
        setCounter(prevCount => prevCount + 1)
        setMeme(prevMeme => ({
            ...prevMeme,
            textInputs: [...prevMeme.textInputs, { 
                text: "", 
                position: { x: "27%", y: "0%" }, 
                color: "#F5F5F5", // Default color
                size: "",   // Default size
                defaultSizes:["20", "25", "30", "35", "40", "45", "50", "55"],
                rotate:"",
            }],
        }));
        
    }, []);

    const handleRemoveTextInput = useCallback((index) => {
        setCounter(prevCount => prevCount - 1)
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
                        ? { ...textInput, [name]: parseInt(value) }
                        : { ...textInput, [name]: value }
                    : textInput
            ),
        }));
    }, []);
    
    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }
    return (
        <div className="main-container">
            <div className="main" 
                onMouseMove={handlePointerMove} 
                onMouseUp={handlePointerUp}
                onTouchMove={handlePointerMove} 
                onTouchEnd={handlePointerUp}
            >
                <div className="form">
                    <button className="form-button add" onClick={handleAddTextInput}>Add Text</button>
                    <div className="inputs-container">
                        {meme.textInputs.map((textInput, index) => (
                            <div className="input-container" key={index}>
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
                                            <label htmlFor={`rotate${index + 1}`}>Rotate:</label>
                                            <input
                                                id="rotate"
                                                type="number"
                                                name="rotate"
                                                placeholder="deg"
                                                className="form-input rotate"
                                                value={textInput.rotate}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </div>
                                        <div className="input">
                                            <label htmlFor={`color${index + 1}`}>Color:</label>
                                            <input
                                                id="color"
                                                type="color"
                                                name="color"
                                                className="form-input color"
                                                value={textInput.color}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="input-buttons">
                                    <button className="form-button remove" onClick={() => handleRemoveTextInput(index)}><img src="images/delete.png" alt="delete icon" /></button>
                                    <button className="form-button settings" onClick={handleShowSettings} ><img src="/images/settings.png" alt="settings icon" /></button>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="mid-buttons">

                            <div className="upload-container">
                                <label htmlFor="upload-input" className="upload-btn">
                                    Upload Template
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
                                    className="form-button random"
                                    onClick={getMemeImage}
                                >
                                    Random Template
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
                                fontSize: `${textInput.size}px`,
                                rotate: `${textInput.rotate}deg`
                            }}
                            onMouseDown={(event) => handlePointerDown(event, index)}
                            onTouchStart={(event) => handlePointerDown(event, index)}
                        >
                            {textInput.text}
                        </div>
                    ))}
                </div>
                <div className="footer-buttons">
                    <button className="form-button download" onClick={captureScreenshot}><img src="images/download.png" alt="download icon" /></button>
                    <button className="form-button share"><img src="images/share.png" alt="share icon" /></button>
                </div>
                </div>
            </div>
        );
    }