import React, { useEffect, useRef } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useGameLogic } from "../hooks/useGameLogic";
import { CURRENT_WORD_KEY, GAME_RESULT_KEY } from "@renderer/types/LocalStorageKeys";
import { GAME_INIT_ROUTE, GAME_OVER_ROUTE } from "@renderer/types/RouteNames";
import { LocalGameResult } from "@renderer/types/GameTypes";

import Board from "./Board";
import Keyboard from "./Keyboard";
import Popup from "./Popup";

import "../styles/GamePanel.css";

const GamePanel: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const currentWord: string | null = localStorage.getItem(CURRENT_WORD_KEY);

  if (!currentWord) {
    // if the word is not available, redirect back to the initializer
    navigate(GAME_INIT_ROUTE);
    return null;
  }

  const gamePanelRef = useRef<HTMLDivElement>(null);

  const {
    gameState,
    handleKeyPress,
    handleKeyDown,
    handleKeyUp,
    wrongWordPopupVisible,
    gameOver,
    isWin
  } = useGameLogic(currentWord);

  // handle game completion
  useEffect(() => {
    if (gameOver) {
      // store game result in localStorage for GameOver component
      localStorage.setItem(
        GAME_RESULT_KEY,
        JSON.stringify({
          isWin: isWin,
          guesses: gameState.curAttempt,
          wordOfDayPlayed: currentWord
        } as LocalGameResult)
      );

      // Navigate to GameOver component
      navigate(GAME_OVER_ROUTE);
    }
  }, [gameOver, isWin]);

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
