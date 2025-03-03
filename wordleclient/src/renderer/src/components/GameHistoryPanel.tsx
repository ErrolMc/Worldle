import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameService } from "../services/GameService";
import { USER_ID_KEY } from "@renderer/types/LocalStorageKeys";
import { GameHistoryResponse } from "@renderer/types/ApiTypes";
import { GameResult } from "@renderer/types/GameTypes";
import { createDisplayGameState } from "@renderer/utils/GameStateCalculator";
import WorldleBoard from "./WorldleBoard";
import "../styles/GameHistoryPanel.css";

const GameHistoryPanel: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameResult[]>([]);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const userID = localStorage.getItem(USER_ID_KEY);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        if (!userID) return;
        const response: GameHistoryResponse = await GameService.getGameHistory(userID);
        setGames(response.gameResults);
      } catch (error) {
        console.error("Failed to fetch game history:", error);
      }
    };

    fetchGameHistory();
  }, [userID]);

  return (
    <div className="full-page">
      <div className="game-history-panel">
        <div className="game-history-header">
          <h2>Game History</h2>
          <button className="close-button" onClick={() => navigate(-1)}>
            ×
          </button>
        </div>
        <div className="game-history-list">
          {games.map((game) => (
            <div key={game.datePlayed} className="game-history-item">
              <div
                className="game-history-summary"
                onClick={() =>
                  setExpandedDate(expandedDate === game.datePlayed ? null : game.datePlayed)
                }
              >
                <div className="game-info">
                  <span className="game-date">
                    {new Date(game.datePlayed).toLocaleDateString()}
                  </span>
                  <span className={`game-result ${game.isWin ? "win" : "loss"}`}>
                    {game.isWin ? "Won" : "Lost"}
                  </span>
                  <span className="attempts">{game.attempts.length} attempts</span>
                </div>
                <span className="expand-icon">{expandedDate === game.datePlayed ? "▼" : "▶"}</span>
              </div>
              {expandedDate === game.datePlayed && (
                <div className="game-details">
                  <p>Word: {game.wotd}</p>
                  <WorldleBoard
                    gameState={createDisplayGameState(game.attempts, game.wotd)}
                    isInteractive={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHistoryPanel;
