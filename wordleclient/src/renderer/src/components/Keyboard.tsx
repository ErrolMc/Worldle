import React from 'react';
import '../styles/Keyboard.css';
import { LetterState } from '../types/GameTypes';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardLetterStates: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardLetterStates }) => {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
  ];

  const handleClick = (key: string) => {
    if (key === "⌫") onKeyPress("Backspace");
    else onKeyPress(key === "ENTER" ? "Enter" : key);
  };

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${key === "ENTER" || key === "⌫" ? "special-key" : ""}  ${keyboardLetterStates[key.toLowerCase()] || ""}`}
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
