import React from "react";
import { GameState } from "../types/GameTypes";
import "../styles/Board.css";

interface BoardProps {
  gameState: GameState;
}

const Board: React.FC<BoardProps> = ({ gameState }) => {
  return (
    <div>
      {gameState.board.map((attempt, index) => (
        <div key={index} className="attempt-row">
          {attempt.letters.map((letter, i) => (
            <span key={i} className={`letter ${letter.state}`}>
              {letter.character}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
