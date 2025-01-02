import React from "react";

import "../styles/GamePanel.css";

const AlreadyPlayed: React.FC = () => {
  return (
    <div className="full-page">
      <h2>You've already played today!</h2>
      <p>Come back tomorrow for a new word.</p>
      <button onClick={() => (window.location.href = "/")}>Return to Home</button>
    </div>
  );
};

export default AlreadyPlayed;
