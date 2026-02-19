import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_WORD_KEY, GAME_RESULT_KEY, QUICK_PLAY_KEY } from "@renderer/types/LocalStorageKeys";
import { GameResult } from "@renderer/types/GameTypes";
import { createDisplayGameState } from "@renderer/utils/GameStateCalculator";
import { AUTH_ROUTE, QUICK_PLAY_INIT_ROUTE } from "@renderer/types/RouteNames";
import WorldleBoard from "./WorldleBoard";

import "../styles/GamePanel.css";

const QuickPlayResult: React.FC = () => {
  const navigate = useNavigate();
  const gameResultString = localStorage.getItem(GAME_RESULT_KEY);

  useEffect(() => {
    if (!gameResultString) {
      navigate(AUTH_ROUTE);
    }
  }, []);

  if (!gameResultString) {
    return null;
  }

  const gameResult: GameResult = JSON.parse(gameResultString);

  const handlePlayAgain = () => {
    localStorage.removeItem(CURRENT_WORD_KEY);
    localStorage.removeItem(GAME_RESULT_KEY);
    localStorage.removeItem(QUICK_PLAY_KEY);
    navigate(QUICK_PLAY_INIT_ROUTE);
  };

  const handleReturnToLogin = () => {
    localStorage.removeItem(CURRENT_WORD_KEY);
    localStorage.removeItem(GAME_RESULT_KEY);
    localStorage.removeItem(QUICK_PLAY_KEY);
    navigate(AUTH_ROUTE);
  };

  return (
    <div className="full-page">
      <h2>
        {gameResult.isWin
          ? `You won in ${gameResult.attempts.length} attempt${gameResult.attempts.length === 1 ? "" : "s"}!`
          : "Better luck next time!"}
      </h2>
      <p>The word was: {gameResult.wotd}</p>
      <WorldleBoard
        gameState={createDisplayGameState(gameResult.attempts, gameResult.wotd)}
        isInteractive={false}
      />
      <div className="button-container">
        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={handleReturnToLogin}>Return to Login</button>
      </div>
    </div>
  );
};

export default QuickPlayResult;
