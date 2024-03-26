# Meme Maker Project

This project is a meme maker application built using React. It allows users to create memes by adding text to images, either by selecting from a collection of random meme templates fetched from an API or by uploading their own images. The application provides customization options for text, such as font size, color, and rotation. Users can then download the created memes as images.

# Project Structure

The project consists of the following components:

1. Meme: This is the main component that handles the application logic. It contains the state and event handlers for the meme generator.
2. TextInput: This is a child component that renders a text input field and handles input, deletion, and dragging of the text elements. It receives a prop textInput which contains the text input's properties, and event handlers.
3. Canvas: This is a child component that handles the creation of the meme image. It makes use of the memeContainerRef to access the canvas containing the meme and create a screenshot of it.

## Features

- Generate a random meme image from a collection of memes or upload a custom image.

- Allows users to upload their own images.

- Supports adding multiple text inputs with customization options such as text, font size, color, and rotation and can drag and drop the text.

- Download the generated meme as an image file.

- Get Dad Jokes from Dad Jokes Page

# Technologies:

- React
- JavaScript
- CSS
- Fetch API *File Reader API *Web Audio API *Canvas API

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/meme-maker.git
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



