import React from 'react';
import '../styles/Keyboard.css';

const Keyboard: React.FC = () => {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
  ];
  
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className={`key ${key === "ENTER" || key === "⌫" ? "special-key" : ""}`}>
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;