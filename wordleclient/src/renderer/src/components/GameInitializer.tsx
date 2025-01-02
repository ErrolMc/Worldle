import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { GameService } from "../services/GameService";
import { USER_ID_KEY, CURRENT_WORD_KEY } from "@renderer/types/LocalStorageKeys";
import { AUTH_ROUTE, PLAY_ROUTE, ALREADY_PLAYED_ROUTE } from "@renderer/types/RouteNames";

import "../styles/GamePanel.css";

const GameInitializer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const userID: string | null = localStorage.getItem(USER_ID_KEY);

  useEffect(() => {
    let isCancelled: boolean = false;

    const initializeGame = async () => {
      if (!userID) {
        navigate(AUTH_ROUTE);
        return;
      }

      try {
        const hasPlayedToday: boolean = await GameService.hasUserPlayedToday(userID);
        if (isCancelled) return;

        if (hasPlayedToday) {
          navigate(ALREADY_PLAYED_ROUTE);
        } else {
          const wordOfDay: string = await GameService.getWordOfTheDay();
          if (isCancelled) return;

          // store the word of the day for use in GamePanel
          localStorage.setItem(CURRENT_WORD_KEY, wordOfDay);
          navigate(PLAY_ROUTE);
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Initialization error:", err);
        navigate(AUTH_ROUTE);
      }
    };

    initializeGame();

    return () => {
      isCancelled = true;
    };
  }, [userID, navigate]);

  return <div className="full-page">Initializing...</div>;
};

export default GameInitializer;
