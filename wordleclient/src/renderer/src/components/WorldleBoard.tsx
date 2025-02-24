import React, { useEffect, useRef } from "react";
import { GameState } from "../types/GameTypes";
import Board from "./Board";
import Keyboard from "./Keyboard";

interface WorldleBoardProps {
  gameState: GameState;
  isInteractive?: boolean;
  onKeyPress?: (key: string) => void;
  handleKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const WorldleBoard: React.FC<WorldleBoardProps> = ({
  gameState,
  isInteractive = false,
  onKeyPress,
  handleKeyDown,
  handleKeyUp
}) => {
  const gamePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInteractive && gamePanelRef.current) {
      gamePanelRef.current.focus();
    }
  }, [isInteractive]);

  return (
    <div
      ref={gamePanelRef}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: "none" }}
    >
      <Board gameState={gameState} />
      {isInteractive && onKeyPress && (
        <Keyboard onKeyPress={onKeyPress} keyboardLetterStates={gameState.keyboardLetterStates} />
      )}
    </div>
  );
};

export default WorldleBoard;
