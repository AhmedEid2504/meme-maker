/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useRef } from "react";
import '../components/MemeMaker/meme.css';
import TextInput from '../components/MemeMaker/TextInput'
import ImageInput from "../components/MemeMaker/ImageInput";
import Canvas from "../components/MemeMaker/Canvas";
import { storage } from "../firebase/firebase";
import { ref, listAll, getDownloadURL } from 'firebase/storage';


export default function Meme(props) {
    // Fetch API request here
    useEffect(() => {
        const templatesRef = ref(storage, `templates`);
        // Fetch the list of files in the user's folder
        listAll(templatesRef)
        .then(async (res) => {
            const promises = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    id: itemRef.name, // Use the file name as ID
                    url: url, // URL of the image
                    ref: itemRef // Reference to the file in storage
                };
            });
            // Resolve all promises
            const memeUrls = await Promise.all(promises);
            setAllTemplates(memeUrls);
        })
        .catch((error) => {
            console.error('Error fetching memes:', error);
        });
    }, []);

    
    const [meme, setMeme] = useState({
        randomTemplate: "/images/defaultMeme.png",
        uploadedTemplate: null,
        showUploadedTemplate: false,
        isDragging: false,
        dragElement: "",
        currentElement: "",
        mouseX: 0,
        mouseY: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
        textInputs: [],
        imageInputs: [],
    });
    const [AllTemplates, setAllTemplates] = useState([]);
    const [counter, setCounter] = useState(0);
    const memeContainerRef = useRef(null);
    const [imageInputsVisible, setImageInputsVisible] = useState(false);
    const [textInputsVisible, setTextInputsVisible] = useState(true);

    const toggleImageInputs = () => {
        setImageInputsVisible(true);
        setTextInputsVisible(false); // Hide text inputs when showing image inputs
    };

    const toggleTextInputs = () => {
        setTextInputsVisible(true);
        setImageInputsVisible(false); // Hide image inputs when showing text inputs
    };

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
    
    

    const getMemeTemplate = useCallback(async () => {
        if (!meme.showUploadedTemplate) {
            const randomNumber = Math.floor(Math.random() * AllTemplates.length);
            const url = AllTemplates[randomNumber].url;
            // downloading the image from the api and creating a blob object with it
            // so that it works for the screenshot function as well
            const response = await fetch(url);
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setMeme(prevMeme => ({
                ...prevMeme,
                randomTemplate: imageUrl,
            }));
        } else {
            setMeme(prevMeme => ({
                ...prevMeme,
                randomTemplate: meme.uploadedTemplate,
            }));
        }
    }, [AllTemplates, meme.showUploadedTemplate, meme.uploadedTemplate]);

    const handleTemplateUpload = useCallback((event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setMeme(prevMeme => ({
                ...prevMeme,
                uploadedTemplate: reader.result,
                showUploadedTemplate: true,
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    
    const removeUploadedTemplate = useCallback(() => {
        setMeme(prevMeme => ({
            ...prevMeme,
            uploadedTemplate: null,
            showUploadedTemplate: false,
        }));
    }, []);
    
    const handlePointerDown = useCallback((event, index, type) => {
        event.preventDefault();
        const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        type === "image" ? 
        setMeme(prevMeme => ({
            ...prevMeme,
            isDragging: true,
            dragElement: index,
            currentElement: type,
            mouseX: clientX,
            mouseY: clientY,
            dragOffsetX: prevMeme.imageInputs[index].position.x,
            dragOffsetY: prevMeme.imageInputs[index].position.y,
        })): 
        setMeme(prevMeme => ({
            ...prevMeme,
            isDragging: true,
            dragElement: index,
            currentElement: type,
            mouseX: clientX,
            mouseY: clientY,
            dragOffsetX: prevMeme.textInputs[index].position.x,
            dragOffsetY: prevMeme.textInputs[index].position.y,
        }));
        console.log(type)
    }, []);
    
    const handlePointerMove = useCallback((event) => {
        event.preventDefault(); // Prevent default scrolling behavior
        if (meme.isDragging) {
            const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
            const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
            const deltaX = clientX - meme.mouseX;
            const deltaY = clientY - meme.mouseY;
            
            meme.currentElement === "image" ? 
            setMeme(prevMeme => ({
                ...prevMeme,
                imageInputs: prevMeme.imageInputs.map((imageInput, index) => {
                    if (index === prevMeme.dragElement) {
                        return {
                            ...imageInput,
                            position: {
                                x: `calc(${prevMeme.dragOffsetX} + ${deltaX}px)`,
                                y: `calc(${prevMeme.dragOffsetY} + ${deltaY}px)`,
                            },
                        };
                    }
                    return imageInput;
                }),
                mouseX: clientX,
                mouseY: clientY,
            })) : 
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
            }))
            
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meme.isDragging]);
    
    const handlePointerUp = useCallback(() => {
        setMeme(prevMeme => ({
            ...prevMeme,
            isDragging: false,
            currentElement: "",
        }));
    }, []);
    
    const playSound = () => {
        const audio = new Audio('audio/anotherone.mp3');
        if (audio) {
            audio.volume = 0.1; // Adjust volume here
            audio.play();
        }
    };
    
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
                type:"text"
            }],
        }));
        {counter > 1 ?  playSound() : null}
        toggleTextInputs();
        
    }, [counter]);
    
    

    const handleAddImageInput = useCallback(() => {
        setCounter(prevCount => prevCount + 1)
        setMeme(prevMeme => ({
            ...prevMeme,
            imageInputs: [...prevMeme.imageInputs, { 
                url: null,
                position: { x: "0%", y: "0%" },
                width: "6rem",
                type: "image",
                imageUploaded: false,
            }],
            
        }));
        {counter > 1 ?  playSound() : null}
        toggleImageInputs();
    }, [counter])
    
    
    return (
            // main
            <div className="w-[100%] md:w-[80%] flex flex-col justify-center items-center" 
                onMouseMove={handlePointerMove} 
                onMouseUp={handlePointerUp}
                onTouchMove={handlePointerMove} 
                onTouchEnd={handlePointerUp}
            >
                <div className="flex flex-col justify-center items-center overflow-hidden p-5 w-[100%]">
                    {/* top buttons */}
                    <div className="flex justify-center items-center flex-wrap gap-3">
                        <button 
                            className="bg-primary shadow-md shadow-fourth focus:shadow-inner
                                    focus:shadow-primary p-2 rounded-md hover:bg-secondary
                                    hover:text-third border-2 border-primary transition-all 
                                    duration-200 ease-in
                            "
                            onClick={handleAddTextInput}
                        >Add Text
                        </button>
                        <button 
                            className="bg-primary shadow-md shadow-fourth focus:shadow-inner
                                    focus:shadow-primary p-2 rounded-md hover:bg-secondary
                                    hover:text-third border-2 border-primary transition-all 
                                    duration-200 ease-in
                            "
                            onClick={handleAddImageInput}
                        >Add Image
                        </button>
                    </div>
                    {/* input switch */}
                    <div className="flex justify-center items-center flex-wrap gap-5 p-5">
                        <button className={props.darkMode ? `${textInputsVisible ? "text-primary " : "text-secondary hover:text-primary transition-all"}` :
                                                            `${textInputsVisible ? "text-primary" : "text-fourth hover:text-primary transition-all"}`} onClick={toggleTextInputs}>
                            Text Inputs
                        </button>
                        <button className={props.darkMode ? `${imageInputsVisible ? "text-primary" : "text-secondary hover:text-primary transition-all"}` :
                                                            `${imageInputsVisible ? "text-primary" : "text-fourth hover:text-primary transition-all"}`} onClick={toggleImageInputs}>
                            Image Inputs
                        </button>
                    </div>
                    
                    {imageInputsVisible && (
                        <div className="flex justify-start items-center gap-1 h-[100%] flex-nowrap overflow-x-scroll w-[100%] p-3">
                            {meme.imageInputs.map((imageInput, index) => (
                                <ImageInput 
                                    key={index}
                                    index={index}
                                    imageInput={imageInput}
                                    setMeme={setMeme} 
                                    setCounter={setCounter}
                                    darkMode={props.darkMode}
                                />
                            ))}
                        </div>
                    )}
                    {textInputsVisible && (
                        <div className="flex justify-start flex-nowrap items-center gap-3 h-auto overflow-x-scroll max-w-[100%] p-3">
                            {meme.textInputs.map((textInput, index) => (
                                <TextInput
                                    key={index}
                                    textInput={textInput}
                                    index={index}
                                    setMeme={setMeme} 
                                    setCounter={setCounter}
                                />
                            ))}
                        </div>
                    )}
                        {/* mid buttons */}
                        <div className="flex justify-evenly gap-5 pt-5 flex-wrap">
                            <div className="flex">
                                <label htmlFor="upload-input" 
                                    className={props.darkMode ? "bg-secondary text-fourth p-2 rounded-md cursor-pointer hover:bg-transparent hover:text-secondary border-2 transition-all ease-in duration-200" :
                                                            "bg-third text-secondary shadow-md shadow-fourth focus:shadow-inner focus:shadow-third p-2 rounded-md cursor-pointer hover:bg-transparent hover:text-third border-2 border-third transition-all ease-in duration-200"}
                                >
                                    Upload Template
                                </label>
                                <input
                                    id="upload-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleTemplateUpload}
                                />
                            </div>
            
                            {!meme.showUploadedTemplate && (
                                <button
                                className="bg-primary shadow-md shadow-fourth focus:shadow-inner focus:shadow-primary p-2 rounded-md hover:bg-secondary hover:text-third border-2 border-primary transition-all duration-200 ease-in"
                                    onClick={getMemeTemplate}
                                >
                                    Random Template
                                </button>
                            )}
                            {meme.showUploadedTemplate && (
                                <button
                                className="bg-primary shadow-md shadow-fourth focus:shadow-inner focus:shadow-primary p-2 rounded-md hover:bg-secondary hover:text-third border-2 border-primary transition-all duration-200 ease-in"
                                    onClick={removeUploadedTemplate}
                                >
                                    Remove Template
                                </button>
                            )}
                        </div>
                </div>
                <div ref={memeContainerRef} 
                    className="relative flex flex-col justify-center 
                                items-center h-fit w-fit md:max-w-[80vw] 
                                m-2.5 max-w-[100vw]
                            "
                >
                    <img
                        src={meme.showUploadedTemplate ? meme.uploadedTemplate : meme.randomTemplate}
                        className="meme-image pointer-events-none select-none max-h-[80dvh] w-[100%]"
                        alt="Meme image"
                    />
                    {meme.imageInputs.map((imageInput, index) => (
                        
                        <div
                            key={index}
                            className="meme-added-image absolute flex cursor-move"
                            style={{ 
                                left: imageInput.position.x, 
                                top: imageInput.position.y,
                                
                            }}
                            
                            onMouseDown={(event) => handlePointerDown(event, index, meme.imageInputs[0].type)}
                            onTouchStart={(event) => handlePointerDown(event, index, meme.imageInputs[0].type)}
                        >
                            
                                {imageInput.url && <img
                                    src={imageInput.url}
                                    style={{
                                        width: imageInput.width,
                                    }}
                                    alt="Meme added image"
                                />}
                            
                            
                        </div>
                    ))}
                    
                    {meme.textInputs.map((textInput, index) => (
                        <div
                            key={index}
                            className="meme-text absolute font-sans-impact cursor-move h-min uppercase"
                            style={{ 
                                left: textInput.position.x, 
                                top: textInput.position.y,
                                color: textInput.color,
                                fontSize: `${textInput.size}px`,
                                rotate: `${textInput.rotate}deg`
                            }}
                            onMouseDown={(event) => handlePointerDown(event, index, textInput.type)}
                            onTouchStart={(event) => handlePointerDown(event, index, textInput.type)}
                        >
                            {textInput.text}
                        </div>
                    ))}
                    
                </div>
                    <Canvas 
                        memeContainerRef={memeContainerRef} 
                        imageInputs={meme.imageInputs}
                        darkMode={props.darkMode}
                    />
            </div>
        );
    }