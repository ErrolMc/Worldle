import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GameService } from "../services/GameService";
import { USER_ID_KEY, GAME_RESULT_KEY } from "@renderer/types/LocalStorageKeys";
import { GameResultRequest, LocalGameResult } from "@renderer/types/GameTypes";

import "../styles/GamePanel.css";

const GameOver: React.FC = () => {
  const navigate = useNavigate();
  const userID: string | null = localStorage.getItem(USER_ID_KEY);
  const gameResultString: string | null = localStorage.getItem(GAME_RESULT_KEY);

  const hasReportedRef: React.MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    if (!userID || !gameResultString) {
      navigate("/");
      return;
    }

    if (hasReportedRef.current) {
      return;
    }
    hasReportedRef.current = true;

    const gameResult: LocalGameResult = JSON.parse(gameResultString);

    const reportResult = async () => {

      try {
        await GameService.reportGameResult({
          userID: userID,
          isWin: gameResult.isWin,
          guesses: gameResult.guesses,
          wordOfDayPlayed: gameResult.wordOfDayPlayed
        } as GameResultRequest);

        localStorage.removeItem(GAME_RESULT_KEY);
      } catch (err) {
        console.error("Failed to report game result:", err);
      }
    };

    reportResult();
  }, [userID, gameResultString]);

  if (!gameResultString) {
    return null;
  }

  const gameResultUI: LocalGameResult = JSON.parse(gameResultString);

  return (
    <div className="full-page">
      {gameResultUI.isWin ? (
        <>
          <h2>Congratulations! You guessed the word in {gameResultUI.guesses} attempts!</h2>
          <p>The word was: {gameResultUI.wordOfDayPlayed}</p>
        </>
      ) : (
        <>
          <h2>Game Over! The word was: {gameResultUI.wordOfDayPlayed}</h2>
        </>
      )}
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
};

export default GameOver;
