import { useState, useEffect, useCallback } from "react";

export default function Meme() {
    useEffect(() => {
        const preventScrollRefresh = (e) => {
            // Check if the user is scrolling up
            if (e.touches.length !== 1) return;
            if (e.touches[0].clientY > 0) {
                e.preventDefault();
            }
        };

        document.body.addEventListener("touchmove", preventScrollRefresh, {
            passive: false,
        });

        return () => {
            document.body.removeEventListener("touchmove", preventScrollRefresh);
        };
    }, []);
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg",
        uploadedImage: null,
        showUploadedImage: false,
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

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }, []);

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

    const handleTouchStart = (e) => {
        const target = e.target;
        const memeText = target.closest('.meme-text');
        if (memeText) {
            const rect = memeText.getBoundingClientRect();
            const offsetX = e.touches[0].clientX - rect.left;
            const offsetY = e.touches[0].clientY - rect.top;
            
            const handleTouchMove = (e) => {
                const parentRect = memeText.parentElement.getBoundingClientRect();
                const x = e.touches[0].clientX - parentRect.left - offsetX - memeText.offsetWidth / 2;
                let y = e.touches[0].clientY - parentRect.top - offsetY - memeText.offsetHeight / 2;
                if (memeText.classList.contains('bottom')) {
                    y = e.touches[0].clientY - parentRect.bottom + memeText.offsetHeight + offsetY;
                }
                memeText.style.transform = `translate(${x}px, ${y}px)`;
            };

    
            const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
    
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    };

    const handleMouseDown = (e) => {
        const target = e.target;
        const memeText = target.closest('.meme-text');
        if (memeText) {
            const rect = memeText.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            const handleMouseMove = (e) => {
                const parentRect = memeText.parentElement.getBoundingClientRect();
                const x = e.clientX - parentRect.left - offsetX - memeText.offsetWidth / 2;
                let y = e.clientY - parentRect.top - offsetY - memeText.offsetHeight / 2;
                if (memeText.classList.contains('bottom')) {
                    y = e.clientY - parentRect.bottom + memeText.offsetHeight + offsetY;
                }
                memeText.style.transform = `translate(${x}px, ${y}px)`;
            };

    
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
    
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });
        }
    };


    return (
        <main>
            <div className="form">
                <label htmlFor="top-text">
                    Top text
                </label>
                <input
                    id="top-text"
                    type="text"
                    placeholder=""
                    className="form-input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <label htmlFor="bottom-text">
                    Bottom text
                </label>
                <input
                    id="bottom-text"
                    type="text"
                    className="form-input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <div className="upload-container">
                    <label htmlFor="upload-input" className="upload-btn">
                        Upload Meme Image
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
                        Generate Random Meme
                    </button>
                )}
                {meme.showUploadedImage && (
                    <button
                        className="form-button"
                        onClick={removeUploadedImage}
                    >
                        Remove Uploaded Image
                    </button>
                )}

            </div>
            <div className="meme" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
                <img
                    src={meme.showUploadedImage ? meme.uploadedImage : meme.randomImage}
                    className="meme-image"
                    alt="Meme"
                />
                <h2 className="meme-text top">{meme.topText}</h2>
                <h2 className="meme-text bottom">{meme.bottomText}</h2>
            </div>
        </main>
    )
}
