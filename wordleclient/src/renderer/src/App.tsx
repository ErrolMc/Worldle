import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AUTH_ROUTE, GAME_INIT_ROUTE, PLAY_ROUTE, ALREADY_PLAYED_ROUTE, GAME_OVER_ROUTE } from "./types/RouteNames";

import AuthPanel from "./components/AuthPanel";
import GamePanel from "./components/GamePanel";
import GameInitializer from "./components/GameInitializer";
import GameResultPanel from "./components/GameResult";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={AUTH_ROUTE} element={<AuthPanel />} />
        <Route path={GAME_INIT_ROUTE} element={<GameInitializer />} />
        <Route path={PLAY_ROUTE} element={<GamePanel />} />
        <Route path={ALREADY_PLAYED_ROUTE} element={<GameResultPanel shouldReport={false} />} />
        <Route path={GAME_OVER_ROUTE} element={<GameResultPanel shouldReport={true} />} />
      </Routes>
    </Router>
  );
};

export default App;
