import "../styles/GamePanel.css";

import Board from "./Board";
import Keyboard from "./Keyboard";
import Popup from "./Popup";

import { useGameLogic } from "../hooks/useGameLogic";
import { useRef } from "react";

const GamePanel: React.FC = () => {
  // create a ref for the div
  const gamePanelRef = useRef<HTMLDivElement>(null);
  const { gameState, handleKeyPress, handleKeyDown, handleKeyUp, wrongWordPopupVisible } =
    useGameLogic();

  return (
    <div
      className="full-page"
      ref={gamePanelRef} // attach the ref to the div
      tabIndex={0} // make div focusable
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: "none" }} // Remove focus outline
    >
      <Popup message="Word not in dictionary" visible={wrongWordPopupVisible} />
      <Board gameState={gameState} />
      <Keyboard onKeyPress={handleKeyPress} keyboardLetterStates={gameState.keyboardLetterStates} />
    </div>
  );
};

export default GamePanel;
