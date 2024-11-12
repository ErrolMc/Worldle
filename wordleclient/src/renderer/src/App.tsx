import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthPanel from './components/AuthPanel'
import GamePanel from './components/GamePanel'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPanel />} />
        <Route path="/game" element={<GamePanel />} />
      </Routes>
    </Router>
  );
};

export default App
