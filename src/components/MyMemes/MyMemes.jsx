/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyMemes = (props) => {
    const shareWarning = () => toast("This will share the image to the public, please don't upload personal Images", {type: "warning"});
    const downloadNotify = () => toast("Meme Downloaded To Your Device", {type: "success"});
    const deleteNotify = () => toast("Meme Deleted", {type: "info"});
    
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
                            ref: itemRef // Reference to the file in storage
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

    const handleDelete = async (memeRef, memeId) => {
        try {
            // Delete the meme file from Firebase Storage
            await deleteObject(memeRef);
            // Remove the deleted meme from the state
            setMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeId));
            // Show notification
            deleteNotify();
        } catch (error) {
            console.error('Error deleting meme:', error);
        }
    };

    return (
            <div className="flex flex-col items-center justify-center">
                <h1 className={props.darkMode ? "text-xl text-secondary transition-all duration-200 ease-in mb-5" : "text-xl text-third transition-all duration-200 ease-in mb-5"}>Your Memes</h1>
                <div className="flex flex-col justify-center items-center gap-5">
                    {memes.map((meme) => (
                    <div key={meme.id} className='flex flex-col justify-center items-center gap-3 w-auto p-5 border-4 border-third'>
                        <img  src={meme.url} alt="Meme" />
                        <div className="flex justify-center flex-wrap items-center gap-5">
                            <button id='download' 
                                className="flex justify-center gap-1 items-center shadow-md shadow-fourth 
                                            focus:shadow-inner focus:shadow-secondary w-auto bg-primary p-1 
                                            rounded-md cursor-pointer hover:bg-third transition-all ease-in duration-200
                                        " 
                                onClick={() => handleDownload(meme.url)}
                            >
                                <img className='w-7 md:w-8 p-0.5' src="images/download.png" alt="download icon" />
                                Download
                            </button>
                            <button id='share' 
                                className="flex justify-center gap-1 items-center shadow-md shadow-fourth 
                                            focus:shadow-inner focus:shadow-secondary w-auto bg-primary p-1 
                                            rounded-md cursor-pointer hover:bg-third  transition-all ease-in duration-200
                                        " 
                                onClick={() => handleShare(meme.url)}
                            >
                                <img className='w-7 md:w-8 p-0.5' src="images/share.png" alt="share icon" />
                                Share To The Wall
                            </button> 
                            <div className="card-button">
                                <button id='delete' 
                                    className="flex justify-center cursor-pointer items-center rounded-md w-8 p-0.5" 
                                    onClick={() => handleDelete(meme.ref, meme.id)}
                                >
                                    <img className='hover:rotate-45  transition-all ease-in duration-200' 
                                        src="images/delete.png" alt="delete icon" 
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
    );
};

export default MyMemes;
