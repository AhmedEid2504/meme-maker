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

    return (
        <div className='main-container'>
            <div className="main">
                <h2>Community Memes</h2>
                <div className="meme-cards-container">
                    {imageUrls.map((imageUrl) => (
                        <div key={imageUrl} className='meme-card'>
                            <img src={imageUrl} alt={`Meme ${imageUrl}`} />
                            <div className='card-buttons'>
                                <a href={imageUrl} download={`Meme_${imageUrl}.png`} target="_blank" rel="noopener noreferrer">
                                    <button className='card-button-download'>Download</button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallOfMemes;
