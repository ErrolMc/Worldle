import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your authentication logic here
    navigate('/game'); // Redirect to the game panel after login
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
