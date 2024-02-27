// Necessary imports
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Creating Express application
const app = express();
const port = 3000;

// Using middleware to parse JSON in the request body
app.use(bodyParser.json());

// Using 'Translate' as an endpoint for handling translation requests
app.post('/translate', async (req, res) => {
  try {
    // Extracting the 'text' parameter from the request body
    const { text } = req.body;

    // Checking if the 'text' parameter is missing or invalid
    if (!text) {
      return res.status(400).json({ error: 'Missing or invalid request body. Please provide a "text" key in the JSON data.' });
    }

    // Making a GET request to the translation service (mymemory)
    const translationResponse = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: 'en|fr'
      }
    });

    // Extracting the translated text from the response
    const translation = translationResponse.data?.responseData?.translatedText;

    // Checking if the translation is unsuccessful
    if (!translation) {
      return res.status(500).json({ error: 'Error during translation. Please try again later.' });
    }

    // Preparing the response object with the translated text
    const response = { translation };

    // Sending the response as JSON
    return res.json(response);
  } catch (error) {
    // Handling unexpected errors and log them
    console.error(error);

    // Returning an internal server error response
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Starting the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
