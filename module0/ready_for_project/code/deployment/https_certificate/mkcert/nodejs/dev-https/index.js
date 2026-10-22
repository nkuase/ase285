import fs from 'fs';
import https from 'https';
import express from 'express';

const app = express();
app.get('/', (_req, res) => res.send('Hello HTTPS (local)'));

https.createServer({
  key:  fs.readFileSync('./certs/localhost+3-key.pem'),
  cert: fs.readFileSync('./certs/localhost+3.pem'),
}, app).listen(8443, () => {
  console.log('✅ HTTPS server running at https://localhost:8443');
});