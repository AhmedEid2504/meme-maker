# Meme Maker Project

This project is a meme maker application built using React. It allows users to create memes by adding text to images, either by selecting from a collection of random meme templates fetched from an API or by uploading their own images. The application provides customization options for text, such as font size, color, and rotation. Users can then download the created memes as images.

# Project Structure

The project consists of the following components:

1. Meme: This is the main component that handles the application logic. It contains the state and event handlers for the meme generator.
2. TextInput: This is a child component that renders a text input field and handles input, deletion, and dragging of the text elements. It receives a prop textInput which contains the text input's properties, and event handlers.
3. Canvas: This is a child component that handles the creation of the meme image. It makes use of the memeContainerRef to access the canvas containing the meme and create a screenshot of it.
4. ImageInput: just like the TextInput the user can upload images to be added on the template can be moved too with customizations like size

5. WallOfMemes: meme social media where users can share their memes, authenticated users can post guests can only look

6. MyMemes: private meme library for users to store their memes

7. SignUp, Login

## Features

- Login Or SignUp to save your memes or share it

- Generate a random meme image from a collection of memes or upload a custom Template.

- Supports adding multiple text inputs with customization options such as size, color, and rotation and can drag and drop the text.

- adding images with customizations over the template

- Download the Made Meme, Save it to MyMemes, Share it to the Wall Of Memes.

- MyMemes a private  space where you can save your favorite memes and delete  them if needed.

- The "Wall of Memes" is publicly accessible showcase where everyone can see all the generated memes.   

- post or look at Memes in Wall of memes

- Get Dad Jokes from Dad Jokes Page

# Technologies:

- React
- Firebase

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/AhmedEid2504/meme-maker.git
    ```

2. Navigate to the project directory:
    ```bash
    cd meme-maker
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Live Version

use this link to see the live demo: https://meme-maker-nu.vercel.app



