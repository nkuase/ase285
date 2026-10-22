class DBExample {
  constructor(path, onError) {
    // Simulate opening a database file
    console.log(`Opening database at: ${path}`);

    // Pretend something goes wrong
    const error = Math.random() > 0.5 ? new Error('DB connection failed!') : null;

    // If error exists, call the error callback
    if (error) {
      if (typeof onError === 'function') {
        onError(error);
      } else {
        throw error;
      }
    } else {
      console.log('Database opened successfully.');
    }
  }
}

const db = new DBExample('.', (err) => {
  console.error('Failed to open DB:', err.message);
  process.exit(1);
});