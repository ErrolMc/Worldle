import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AUTH_ROUTE, GAME_INIT_ROUTE, PLAY_ROUTE, ALREADY_PLAYED_ROUTE, GAME_OVER_ROUTE, GAME_HISTORY_ROUTE, QUICK_PLAY_INIT_ROUTE, QUICK_PLAY_RESULT_ROUTE } from "./types/RouteNames";

import AuthPanel from "./components/AuthPanel";
import GamePanel from "./components/GamePanel";
import GameInitializer from "./components/GameInitializer";
import GameResultPanel from "./components/GameResult";
import GameHistoryPanel from "./components/GameHistoryPanel";
import QuickPlayInitializer from "./components/QuickPlayInitializer";
import QuickPlayResult from "./components/QuickPlayResult";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={AUTH_ROUTE} element={<AuthPanel />} />
        <Route path={GAME_INIT_ROUTE} element={<GameInitializer />} />
        <Route path={PLAY_ROUTE} element={<GamePanel />} />
        <Route path={ALREADY_PLAYED_ROUTE} element={<GameResultPanel shouldReport={false} />} />
        <Route path={GAME_OVER_ROUTE} element={<GameResultPanel shouldReport={true} />} />
        <Route path={GAME_HISTORY_ROUTE} element={<GameHistoryPanel />} />
        <Route path={QUICK_PLAY_INIT_ROUTE} element={<QuickPlayInitializer />} />
        <Route path={QUICK_PLAY_RESULT_ROUTE} element={<QuickPlayResult />} />
      </Routes>
    </Router>
  );
};

export default App;
