// ExampleComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExampleComponent() {
    const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/example')
        .then(res => setMessage(res.data.message))
        .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Message from Express:</h1>
      <p>{message}</p>
    </div>
  );
}
export default ExampleComponent;
