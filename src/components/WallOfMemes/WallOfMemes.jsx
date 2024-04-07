/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/authContext';
const WallOfMemes = (props) => {
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
        <div className="flex flex-col items-center justify-center">
            <h1 className={props.darkMode ? "text-xl text-secondary transition-all duration-200 ease-in mb-5" : "text-xl text-third transition-all duration-200 ease-in mb-5"}>Wall Of Memes</h1>
            <div className="flex flex-col justify-center items-center gap-5">
                {imageUrls.map((imageUrl, index) => (
                    <div key={index} className='flex flex-col justify-center items-center gap-3 w-auto p-5 border-4 border-third'>
                        <img src={imageUrl.downloadURL} alt={`Meme ${index}`} />
                        <div className="flex justify-center flex-wrap items-center gap-5">
                            <button id='download' className="flex justify-center gap-1 items-center shadow-md shadow-fourth 
                                    focus:shadow-inner focus:shadow-secondary w-auto bg-primary p-1 
                                    rounded-md cursor-pointer hover:bg-third transition-all ease-in duration-200
                                "  onClick={() => handleDownload(imageUrl.downloadURL)}><img className='w-7 md:w-8 p-0.5' src="images/download.png" alt="download icon" />Download</button>
                            { currentUser && currentUser.uid === imageUrl.userId && (
                                    <button className="flex justify-center cursor-pointer items-center rounded-md w-8 p-0.5" onClick={() => handleDelete(imageUrl.downloadURL)}>
                                        <img className='hover:rotate-45  transition-all ease-in duration-200' 
                                            src="images/delete.png" alt="delete icon" 
                                        />
                                    </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WallOfMemes;
