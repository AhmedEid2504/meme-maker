import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './wallofmemes.css';

const WallOfMemes = () => {
    const [imageUrls, setImageUrls] = useState([]);

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

                        // Extract timestamp from the filename
                        const timestampIndex = fileName.lastIndexOf('_At_'); // Finding the last occurrence of '_At_' in the filename
                        const timestampString = fileName.substring(timestampIndex + 4, fileName.lastIndexOf('.png')); // Extracting the timestamp substring
                        const createTime = new Date(timestampString);

                        urls.push({ downloadURL, createTime });
                    }
                }

                // Sort URLs based on createTime in descending order
                urls.sort((a, b) => b.createTime - a.createTime);

                setImageUrls(urls.map(item => item.downloadURL));
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesFromAllUsers();
    }, []);

    const downloadImage = (imageUrl) => {
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
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className='main-container'>
            <div className="main">
                <h2>Community Memes</h2>
                <div className="meme-cards-container">
                    {imageUrls.map((imageUrl, index) => (
                        <div key={index} className='meme-card'>
                            <img src={imageUrl} alt={`Meme ${index}`} />
                            <div className='card-buttons'>
                                <button className='card-button-download' onClick={() => downloadImage(imageUrl)}>Download</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallOfMemes;