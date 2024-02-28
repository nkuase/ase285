const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module

const app = express();
const port = process.env.PORT || 5001;
const clientDirectory = '../client/build';

// Middleware
app.use(bodyParser.json());

// Serve the static files from the 'build' directory
app.use(express.static(path.join(__dirname, clientDirectory)));

// Define routes
app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// For any other requests, serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, clientDirectory, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
