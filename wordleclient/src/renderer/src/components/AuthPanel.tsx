import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import '../styles/AuthPanel.css';

const AuthPanel: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="full-page">
      {isLogin ? (
        <LoginForm setIsLogin={setIsLogin} />
      ) : (
        <RegisterForm setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default AuthPanel;
