import React from "react";

// Shown while the app is waiting for the server connection.
const LoadingSpinner = () => {
  return (
    <div className="overlay">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
