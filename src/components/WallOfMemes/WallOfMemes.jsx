import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import './wallofmemes.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/authContext';
const WallOfMemes = () => {
    const downloadNotify = () => toast("Meme Downloaded To Your Device", {type: "success"});
    const deleteNotify = () => toast("Meme Deleted Successfully", {type: "info"});
    const [imageUrls, setImageUrls] = useState([]);
    const {currentUser} = useAuth()

    useEffect(() => {
        const fetchImagesFromAllUsers = async () => {
            try {
                const urls = [];
                const rootRef = ref(storage, 'wall-of-memes');
                const userFolders = await listAll(rootRef);

                for (const userFolder of userFolders.prefixes) {
                    const userImages = await listAll(userFolder);
                
                    for (const imageRef of userImages.items) {
                        const downloadURL = await getDownloadURL(imageRef);
                        const fileName = imageRef.name;
                
                        // Extract user ID from the image name
                        const userIdStartIndex = fileName.indexOf('Meme-Maker_') + 'Meme-Maker_'.length;
                        const userIdEndIndex = fileName.indexOf('_At_');
                        const userId = fileName.substring(userIdStartIndex, userIdEndIndex);
                
                        // Extract timestamp from the filename
                        const timestampIndex = fileName.lastIndexOf('_At_');
                        const timestampString = fileName.substring(timestampIndex + 4, fileName.lastIndexOf('.png'));
                        const createTime = new Date(timestampString);
                
                        urls.push({ downloadURL, createTime, userId });
                    }
                }

                // Sort URLs based on createTime in descending order
                urls.sort((a, b) => b.createTime - a.createTime);

                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesFromAllUsers();
    }, []);

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
                    link.setAttribute("download", "image.png"); // Change the filename as needed
                    document.body.appendChild(link);
                    link.click();
                    console.log(imageUrl.userId);
                });
            })
            .catch(err => {
                console.log(err);
            });
        downloadNotify();
    };

    const handleDelete = async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        try {
            await deleteObject(imageRef);
            const updatedUrls = imageUrls.filter((image) => image.downloadURL !== imageUrl);
            setImageUrls(updatedUrls);
            deleteNotify();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    

    return (
        <div className='main-container'>
            <div className="main">
                <h1>Wall Of Memes</h1>
                <div className="meme-cards-container">
                    {imageUrls.map((imageUrl, index) => (
                        <div key={index} className='meme-card'>
                            <img src={imageUrl.downloadURL} alt={`Meme ${index}`} />
                            <div className="card-buttons">
                                <div className="card-button">
                                    <button id='download' className="card-button-download" onClick={() => handleDownload(imageUrl.downloadURL)}><img src="images/download.png" alt="download icon" /></button>
                                    <label htmlFor='download'>Download</label>
                                </div>
                                { currentUser && currentUser.uid === imageUrl.userId && (
                                    <div className="card-button">
                                        <button className="card-button-delete" onClick={() => handleDelete(imageUrl.downloadURL)}>
                                            <img src="images/delete.png" alt="delete icon" />
                                        </button>
                                        <label>Delete</label>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallOfMemes;
