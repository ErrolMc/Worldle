import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GameService } from "../services/GameService";
import { USER_ID_KEY, GAME_RESULT_KEY } from "@renderer/types/LocalStorageKeys";
import { GameResult } from "@renderer/types/GameTypes";
import { GameResultRequest } from "@renderer/types/ApiTypes";
import { createDisplayGameState } from "@renderer/utils/GameStateCalculator";
import { GAME_HISTORY_ROUTE, AUTH_ROUTE } from "@renderer/types/RouteNames";
import WorldleBoard from "./WorldleBoard";

import "../styles/GamePanel.css";

const GameResultPanel: React.FC<{ shouldReport?: boolean }> = ({ shouldReport = false }) => {
  const navigate = useNavigate();
  const userID = localStorage.getItem(USER_ID_KEY);
  const gameResultString = localStorage.getItem(GAME_RESULT_KEY);
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (!userID || !gameResultString) {
      navigate(AUTH_ROUTE);
      return;
    }

    if (shouldReport && !hasReportedRef.current) {
      hasReportedRef.current = true;
      const gameResult: GameResult = JSON.parse(gameResultString);

      const reportResult = async () => {
        try {
          await GameService.reportGameResult({
            userID: userID,
            isWin: gameResult.isWin,
            attempts: gameResult.attempts,
            wotd: gameResult.wotd
          } as GameResultRequest);
        } catch (err) {
          console.error("Failed to report game result:", err);
          navigate(AUTH_ROUTE);
        }
      };

      reportResult();
    }
  }, [userID, gameResultString, shouldReport]);

  if (!gameResultString) {
    console.log("No game result string");
    return null;
  }

  // Create a GameState object for the WordleBoard component
  const gameResult: GameResult = JSON.parse(gameResultString);

  return (
    <div className="full-page">
      <h2>
        {gameResult.isWin
          ? `Congratulations! You won in ${gameResult.attempts.length} attempts!`
          : "Better luck next time!"}
      </h2>
      <p>The word was: {gameResult.wotd}</p>
      <WorldleBoard
        gameState={createDisplayGameState(gameResult.attempts, gameResult.wotd)}
        isInteractive={false}
      />
      <div className="button-container">
        <button onClick={() => navigate("/")}>Return to Login</button>
        <button onClick={() => navigate(GAME_HISTORY_ROUTE)}>View Game History</button>
      </div>
      <p>Come back tomorrow for a new word!</p>
    </div>
  );
};

export default GameResultPanel;
