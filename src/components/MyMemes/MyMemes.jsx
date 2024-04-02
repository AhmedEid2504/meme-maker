import { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';
import './mymemes.css';

const MyMemes = () => {
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
                <h2>Your Memes</h2>
                <div className="meme-cards-container">
                    {memes.map((meme) => (
                    <div key={meme.id} className='meme-card'>
                        <img  src={meme.url} alt="Meme" />
                        <div className='card-buttons'>
                                <button className='card-button-download' onClick={() => downloadImage(meme.url)}>Download</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyMemes;
