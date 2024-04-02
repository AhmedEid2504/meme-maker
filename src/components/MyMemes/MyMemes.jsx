import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './mymemes.css';

const MyMemes = () => {
    const shareWarning = () => toast("This will share the image to the public, please don't upload personal Images", {type: "warning"});
    const downloadNotify = () => toast("Meme Downloaded To Your Device", {type: "success"});
    
    const { currentUser } = useAuth();
    const [memes, setMemes] = useState([]);

    useEffect(() => {
        if (currentUser) {
            // Define the reference to the user's folder in storage
            const userMemesRef = ref(storage, `user-memes/${currentUser.uid}/`);

            // Fetch the list of files in the user's folder
            listAll(userMemesRef)
                .then(async (res) => {
                    const promises = res.items.map(async (itemRef) => {
                        const url = await getDownloadURL(itemRef);
                        return {
                            id: itemRef.name, // Use the file name as ID
                            url: url, // URL of the image
                        };
                    });
                    // Resolve all promises
                    const memeUrls = await Promise.all(promises);
                    setMemes(memeUrls);
                })
                .catch((error) => {
                    console.error('Error fetching memes:', error);
                });
        }
    }, [currentUser]);

    const handleDownload = (imageUrl) => {
        fetch(imageUrl, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function(buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Meme-Maker.png"); // Change the filename as needed
                    document.body.appendChild(link);
                    link.click();
                    downloadNotify();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleShare = async (memeUrl) => {
        // Generate a timestamp for the file name
        const timestamp = new Date().toISOString();
        // Define the reference to the storage location in the wall-of-memes bucket
        const storageRef = ref(storage, `wall-of-memes/${currentUser.uid}/Meme-Maker_${currentUser.uid}_At_${timestamp}.png`);
    
        try {
            // Fetch the image data as a Blob
            const response = await fetch(memeUrl);
            const blob = await response.blob();
            
            // Upload the meme to the wall-of-memes bucket with correct content type
            await uploadBytes(storageRef, blob, { contentType: 'image/png' });
            
            shareWarning();
        } catch (error) {
            console.error('Error sharing meme:', error);
        }
    };

    return (
        <div className='main-container'>
            <div className="main">
                <h2>Your Memes</h2>
                <div className="meme-cards-container">
                    {memes.map((meme) => (
                    <div key={meme.id} className='meme-card'>
                        <img  src={meme.url} alt="Meme" />
                        <div className="card-buttons">
                            <div className="card-button">
                                <button id='download' className="card-button-download" onClick={() => handleDownload(meme.url)}><img src="images/download.png" alt="download icon" /></button>
                                <label htmlFor='download'>Download</label>
                            </div>
                            <div className="card-button">
                                <button id='share' className="card-button-share" onClick={() => handleShare(meme.url)}><img src="images/share.png" alt="share icon" /></button>    
                                <label htmlFor='share'>Share To The Wall</label>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyMemes;
