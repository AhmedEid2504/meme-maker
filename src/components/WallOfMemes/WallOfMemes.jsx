/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './wallofmemes.css';
import { useAuth } from '../../contexts/authContext';

const WallOfMemes = () => {
    const {currentUser} = useAuth()
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchImagesFromAllUsers = async () => {
            try {
                const urls = [];
                const rootRef = ref(storage, 'wall-of-memes');
                const userRef = ref(rootRef, currentUser.uid); // Reference to the current user's directory

                const userImages = await listAll(userRef); // List all images in the user's directory

                for (const imageRef of userImages.items) {
                    const downloadURL = await getDownloadURL(imageRef);
                    urls.push(downloadURL);
                }

                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesFromAllUsers();
    }, [currentUser]); // Dependency on currentUser to fetch images for the current user

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
