import { useState, useEffect, useCallback, useRef } from "react";
import './componentsCSS/meme.css';
import TextInput from './TextInput'
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
            position: { x: "0%", y: "0%" }, 
            color: "#F5F5F5",
            size: "25",
            defaultSizes:["20", "25", "30", "35", "40", "45", "50", "55"],
            rotate:"0",
        }],
    });
    const [allMemes, setAllMemes] = useState([]);
    const [counter, setCounter] = useState(0);
    
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

    const captureScreenshot = () => {
        const memeContainer = memeContainerRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Get the dimensions of the actual image
        const imageElement = memeContainer.querySelector('.meme-image');
        const imageWidth = imageElement.naturalWidth;
        const imageHeight = imageElement.naturalHeight;
    
        // Set canvas width and height to match the dimensions of the image
        canvas.width = imageWidth;
        canvas.height = imageHeight;
    
        // Calculate scaling factors
        const scaleX = imageWidth / memeContainer.offsetWidth;
        const scaleY = imageHeight / memeContainer.offsetHeight;
    
        // Draw the content of the meme container onto the canvas
        memeContainer.childNodes.forEach(node => {
            if (node.nodeType === 1) { // If it's an element node
                if (node.tagName === 'IMG') { // If it's an image element
                    ctx.drawImage(node, 0, 0, imageWidth, imageHeight);
                } else if (node.classList.contains('meme-text')) { // If it's a text element
                    const computedStyle = window.getComputedStyle(node);
                    const left = parseFloat(computedStyle.left) * scaleX;
                    const top = parseFloat(computedStyle.top) * scaleY;
                    const fontSize = parseFloat(computedStyle.fontSize) * Math.min(scaleX, scaleY); // Scale font size
                    const color = computedStyle.color;
                    const text = node.innerText;
                    const rotation = parseFloat(computedStyle.rotate) || 0; // Get rotation angle or default to 0
    
                    // Apply text shadow effect as an outline
                    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
                    ctx.lineWidth = 2 * Math.min(scaleX, scaleY); // Adjusted outline width
    
                    // Calculate the center point of the text
                    const centerX = left + (node.offsetWidth * scaleX) / 2;
                    const centerY = top + (node.offsetHeight * scaleY) / 2;
    
                    // Draw the text outline and actual text with the same rotation
                    ctx.save(); // Save the current transformation state
    
                    // Translate to the center point
                    ctx.translate(centerX, centerY);
    
                    // Rotate the context
                    ctx.rotate(rotation * Math.PI / 180); // Apply rotation
    
                    // Draw the text outline
                    ctx.fillStyle = color;
                    ctx.font = `${fontSize}px Impact, sans-serif`;
                    ctx.strokeText(text, -node.offsetWidth * scaleX / 2, fontSize / 2);
    
                    // Draw the actual text
                    ctx.fillText(text, -node.offsetWidth * scaleX / 2, fontSize / 2);
    
                    ctx.restore(); // Restore the original transformation state
                }
            }
        });
    
        // Convert the canvas to a data URL
        const screenshotUrl = canvas.toDataURL();
    
        // Create a download link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = screenshotUrl;
        downloadLink.download = 'Meme_Maker.png';
        downloadLink.click();
    };
    
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
                position: { x: "0%", y: "0%" }, 
                color: "#F5F5F5",
                size: "25",
                defaultSizes:["20", "25", "30", "35", "40", "45", "50", "55"],
                rotate:"0",
            }],
        }));
        
    }, []);

    
    
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
                            <TextInput
                                key={index}
                                textInput={textInput}
                                index={index}
                                handlePointerDown={handlePointerDown}
                                setMeme={setMeme} 
                                setCounter={setCounter}
                            />
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