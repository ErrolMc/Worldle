import Board from "./Board";
import Keyboard from "./Keyboard";
import "../styles/GamePanel.css";
import { useGameLogic } from "../hooks/useGameLogic";
import { useRef } from "react";

const GamePanel: React.FC = () => {
  // create a ref for the div
  const gamePanelRef = useRef<HTMLDivElement>(null);
  const { gameState, handleKeyPress, handleKeyDown, handleKeyUp } = useGameLogic();

  return (
    <div
      className="full-page"
      ref={gamePanelRef} // attach the ref to the div
      tabIndex={0} // make div focusable
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: "none" }} // Remove focus outline
    >
      <Board gameState={gameState} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default GamePanel;
