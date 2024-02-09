const http = require('http');

// Specify the URL of the web server
const url = 'http://localhost:5500/test';

// Make a GET request to the server
const req = http.get(url, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

    // When response is complete, log the content
  res.on('end', () => {
    console.log('Check the results');
    console.log(responseData == 'OK');
  });

});

// Handle errors
req.on('error', (error) => {
  console.error(`Error fetching data from server: ${error.message}`);
});
