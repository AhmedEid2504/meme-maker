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
                const userFolders = await listAll(rootRef); // List all folders (user directories) in the "wall-of-memes" directory

                // Iterate through each user's folder
                for (const userFolder of userFolders.prefixes) {
                    const userImages = await listAll(userFolder); // List all images in the user's folder

                    // Iterate through each image in the user's folder
                    for (const imageRef of userImages.items) {
                        const downloadURL = await getDownloadURL(imageRef);
                        urls.push(downloadURL);
                    }
                }

                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesFromAllUsers();
    }, []); // No dependencies needed as we only fetch once on component mount

    return (
        <div className='main-container'>
            <div className="main">
                <h2>Community Memes</h2>
                <div className="meme-cards-container">
                    {imageUrls.map((imageUrl, index) => (
                        <div key={index} className='meme-card'>
                            <img src={imageUrl} alt={`Meme ${index + 1}`} />
                            <div className='card-buttons'>
                                <a href={imageUrl} download={`Meme_${index + 1}.png`} target="_blank" rel="noopener noreferrer">
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
