import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useGameLogic } from "../hooks/useGameLogic";
import { CURRENT_WORD_KEY, GAME_RESULT_KEY } from "@renderer/types/LocalStorageKeys";
import { GAME_INIT_ROUTE, GAME_OVER_ROUTE } from "@renderer/types/RouteNames";
import { GameResult } from "@renderer/types/GameTypes";

import Popup from "./Popup";
import WorldleBoard from "./WorldleBoard";

import "../styles/GamePanel.css";

const GamePanel: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const currentWord: string | null = localStorage.getItem(CURRENT_WORD_KEY);

  if (!currentWord) {
    // if the word is not available, redirect back to the initializer
    navigate(GAME_INIT_ROUTE);
    return null;
  }

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
      localStorage.setItem(
        GAME_RESULT_KEY,
        JSON.stringify({
          isWin: isWin,
          wotd: currentWord,
          attempts: (
            gameState.board.map((word) =>
              word.letters.map((letter) => letter.character).join("")
            ) as string[]
          ).filter((attempt) => attempt.trim() !== "")
        } as GameResult)
      );

      // Navigate to GameOver component
      navigate(GAME_OVER_ROUTE);
    }
  }, [gameOver, isWin]);

  return (
    <div className="full-page">
      <Popup message="Word not in dictionary" visible={wrongWordPopupVisible} />
      <WorldleBoard
        gameState={gameState}
        isInteractive={true}
        onKeyPress={handleKeyPress}
        handleKeyDown={handleKeyDown}
        handleKeyUp={handleKeyUp}
      />
    </div>
  );
};

export default GamePanel;
