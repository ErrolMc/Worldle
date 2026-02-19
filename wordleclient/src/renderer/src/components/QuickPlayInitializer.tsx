import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getDictionaryService } from "../services/DictionaryService";
import { CURRENT_WORD_KEY, QUICK_PLAY_KEY } from "@renderer/types/LocalStorageKeys";
import { PLAY_ROUTE } from "@renderer/types/RouteNames";

import "../styles/GamePanel.css";

const QuickPlayInitializer: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const word: string = getDictionaryService().getRandomWord();
    localStorage.setItem(CURRENT_WORD_KEY, word);
    localStorage.setItem(QUICK_PLAY_KEY, "true");
    navigate(PLAY_ROUTE);
  }, [navigate]);

  return <div className="full-page">Loading...</div>;
};

export default QuickPlayInitializer;
