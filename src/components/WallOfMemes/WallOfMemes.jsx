import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './wallofmemes.css';

const WallOfMemes = () => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchImagesFromAllUsers = async () => {
            const urls = [];

            try {
                const rootRef = ref(storage, 'wall-of-memes');
                const rootListResult = await listAll(rootRef);

                for (const item of rootListResult.items) {
                    const userListResult = await listAll(item);

                    for (const userItem of userListResult.items) {
                        if (userItem.contentType.startsWith('Meme')) { // Adjusted condition to check if content type starts with 'Meme'
                            const downloadURL = await getDownloadURL(userItem);
                            urls.push(downloadURL);
                        }
                    }
                }

                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesFromAllUsers();
    }, []); // Empty dependency array to run the effect only once

    return (
        <div className='main-container'>
            <div className="main">
                <h2>Community Memes</h2>
                <div className="meme-cards-container">
                    {imageUrls.map((imageUrl) => (
                    <div key={imageUrl} className='meme-card'> {/* Changed key to imageUrl */}
                        <img  src={imageUrl} alt="Meme" /> {/* Removed .id and .url from imageUrl */}
                        <div className='card-buttons'>
                            <a href={imageUrl} download><button className='card-button-download'>Download</button></a>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallOfMemes;
