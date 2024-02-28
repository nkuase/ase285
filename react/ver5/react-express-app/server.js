const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// Define routes
app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
