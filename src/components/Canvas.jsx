/* eslint-disable react/prop-types */
import {storage} from  '../firebase/firebase';
import { ref, uploadString } from 'firebase/storage'
import { useAuth } from '../contexts/authContext';
const Canvas = (props) => {
     // Get the current user from the AuthContext
    const { currentUser } = useAuth();

    const captureScreenshot = () => {
        // Check if all image inputs are uploaded
        const allUploaded = props.imageInputs.every(input => input.imageUploaded);
        if (!allUploaded) {
            // Alert or handle the case where not all images are uploaded
            alert('Please upload all images before downloading or remove the empty inputs.');
            return;
        }

        const memeContainer = props.memeContainerRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Get the dimensions of the actual image
        const imageElement = memeContainer.querySelector('.meme-image');
        const imageWidth = imageElement.naturalWidth;
        const imageHeight = imageElement.naturalHeight;
    
        // Set canvas width and height to match the dimensions of the image
        canvas.width = imageWidth;
        canvas.height = imageHeight;
    
        // Calculate scaling factors
        const scaleX = imageWidth / memeContainer.offsetWidth;
        const scaleY = imageHeight / memeContainer.offsetHeight;
    
        // Draw the content of the meme container onto the canvas
        memeContainer.childNodes.forEach(node => {
            if (node.nodeType === 1) { // If it's an element node
                if (node.tagName === 'IMG') { // If it's a template element
                    ctx.drawImage(node, 0, 0, imageWidth, imageHeight);
                } else if (node.classList.contains('meme-text')) { // If it's a text element
                    const computedStyle = window.getComputedStyle(node);
                    const left = parseFloat(computedStyle.left) * scaleX;
                    const top = parseFloat(computedStyle.top) * scaleY;
                    const fontSize = parseFloat(computedStyle.fontSize) * Math.min(scaleX, scaleY); // Scale font size
                    const color = computedStyle.color;
                    const text = node.innerText;
                    const rotation = parseFloat(computedStyle.rotate) || 0; // Get rotation angle or default to 0
    
                    // Apply text shadow effect as an outline
                    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
                    ctx.lineWidth = 2 * Math.min(scaleX, scaleY); // Adjusted outline width
    
                    // Calculate the center point of the text
                    const centerX = left + (node.offsetWidth * scaleX) / 2;
                    const centerY = top + (node.offsetHeight * scaleY) / 2;
    
                    // Draw the text outline and actual text with the same rotation
                    ctx.save(); // Save the current transformation state
    
                    // Translate to the center point
                    ctx.translate(centerX, centerY);
    
                    // Rotate the context
                    ctx.rotate(rotation * Math.PI / 180); // Apply rotation
    
                    // Draw the text outline
                    ctx.fillStyle = color;
                    ctx.font = `${fontSize}px Impact, sans-serif`;
                    ctx.strokeText(text, -node.offsetWidth * scaleX / 2, fontSize / 2);
    
                    // Draw the actual text
                    ctx.fillText(text, -node.offsetWidth * scaleX / 2, fontSize / 2);
    
                    ctx.restore(); // Restore the original transformation state
                } else if (node.classList.contains('meme-added-image')) {
                    const computedStyle = window.getComputedStyle(node);
                    const left = parseFloat(computedStyle.left) * scaleX;
                    const top = parseFloat(computedStyle.top) * scaleY;
                    const width = parseFloat(computedStyle.width) * scaleX;
                    const height = parseFloat(computedStyle.height) * scaleY;
    
                    // Draw the added image onto the canvas
                    ctx.drawImage(node.querySelector('img'), left, top, width, height);
                }
            }
        });
    
        // Convert the canvas to a data URL
        const screenshotUrl = canvas.toDataURL();
    
        // Serialize canvas data
        const canvasData = {
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            templateImageSrc: imageElement.src, // Save the source of the template image
            elements: []
        };

        memeContainer.childNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.tagName === 'IMG') {
                    // Skip images
                } else if (node.classList.contains('meme-text')) {
                    const computedStyle = window.getComputedStyle(node);
                    canvasData.elements.push({
                        type: 'text',
                        content: node.innerText,
                        style: {
                            left: parseFloat(computedStyle.left),
                            top: parseFloat(computedStyle.top),
                            fontSize: parseFloat(computedStyle.fontSize),
                            color: computedStyle.color,
                            rotate: parseFloat(computedStyle.rotate) || 0
                        }
                    });
                } else if (node.classList.contains('meme-added-image')) {
                    const computedStyle = window.getComputedStyle(node);
                    canvasData.elements.push({
                        type: 'image',
                        src: node.querySelector('img').src,
                        style: {
                            left: parseFloat(computedStyle.left),
                            top: parseFloat(computedStyle.top),
                            width: parseFloat(computedStyle.width),
                            height: parseFloat(computedStyle.height)
                        }
                    });
                }
            }
        });

        // Create a download link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = screenshotUrl;
        downloadLink.download = 'Meme_Maker.png';
        downloadLink.click();

        // Store canvas data
        localStorage.setItem('canvasData', JSON.stringify(canvasData));
        console.log(canvasData);
        console.log(downloadLink);

        // Generate a timestamp for the file name
        const timestamp = new Date().toISOString();

        // send canvas data to firebase storage 
        const canvasDataString = JSON.stringify(canvasData);
        const canvasRef = ref(storage, `user-memes/${currentUser.uid}/canvasData_${timestamp}.json`);
        try {
            uploadString(canvasRef, canvasDataString, 'raw');
            console.log("Canvas data uploaded successfully");
        } catch (error) {
            console.error("Error uploading canvas data:", error);
        }
    }

    return (  
        <button className="form-button download" onClick={captureScreenshot}><img src="images/download.png" alt="download icon" /></button>
    )
}

export default Canvas;
