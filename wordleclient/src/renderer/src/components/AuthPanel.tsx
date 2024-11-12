import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPanel: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default AuthPanel;
