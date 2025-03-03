import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GameService } from "../services/GameService";
import { USER_ID_KEY, GAME_RESULT_KEY } from "@renderer/types/LocalStorageKeys";
import { GameResult, LetterState } from "@renderer/types/GameTypes";
import { GameResultRequest } from "@renderer/types/ApiTypes";
import { GameState } from "@renderer/types/GameTypes";
import { MAX_ATTEMPTS } from "@renderer/types/Constants";
import { GAME_HISTORY_ROUTE } from "@renderer/types/RouteNames";
import WorldleBoard from "./WorldleBoard";

import "../styles/GamePanel.css";

const GameResultPanel: React.FC<{ shouldReport?: boolean }> = ({ shouldReport = false }) => {
  const navigate = useNavigate();
  const userID = localStorage.getItem(USER_ID_KEY);
  const gameResultString = localStorage.getItem(GAME_RESULT_KEY);
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (!userID || !gameResultString) {
      navigate("/");
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
        }
      };

      reportResult();
    }
  }, [userID, gameResultString, shouldReport]);

  if (!gameResultString) {
    console.log("No game result string");
    return null;
  }

  const gameResult: GameResult = JSON.parse(gameResultString);

  // Calculate letter states for the completed game
  const calculateLetterState = (char: string, index: number, word: string): LetterState => {
    if (!word || !char) return "empty";
    if (word[index].toLowerCase() === char.toLowerCase()) return "correct";
    if (word.toLowerCase().includes(char.toLowerCase())) return "present";
    return "absent";
  };

  // Create a GameState object for the WordleBoard component
  const boardState: GameState = {
    currentWord: gameResult.wotd,
    board: [
      // First add the actual attempts
      ...gameResult.attempts.map((attempt) => ({
        letters: attempt.split("").map((char, index) => ({
          character: char,
          state: calculateLetterState(char, index, gameResult.wotd)
        }))
      })),
      // Then pad with empty rows up to MAX_ATTEMPTS
      ...Array(MAX_ATTEMPTS - gameResult.attempts.length).fill({
        letters: Array(5).fill({ character: "", state: "empty" })
      })
    ],
    curAttempt: gameResult.attempts.length,
    keyboardLetterStates: {}
  };

  return (
    <div className="full-page">
      <h2>
        {gameResult.isWin
          ? `Congratulations! You won in ${gameResult.attempts.length} attempts!`
          : "Better luck next time!"}
      </h2>
      <p>The word was: {gameResult.wotd}</p>
      <WorldleBoard gameState={boardState} isInteractive={false} />
      <div className="button-container">
        <button onClick={() => navigate("/")}>Return to Login</button>
        <button onClick={() => navigate(GAME_HISTORY_ROUTE)}>View Game History</button>
      </div>
      <p>Come back tomorrow for a new word!</p>
    </div>
  );
};

export default GameResultPanel;
