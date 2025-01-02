import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { LoginResponse } from "@renderer/types/AuthTypes";
import { LOGIN_TOKEN_KEY, USER_ID_KEY } from "@renderer/types/LocalStorageKeys";
import { GAME_INIT_ROUTE } from "@renderer/types/RouteNames";

import "../styles/LoginRegisterForm.css";

const LoginForm: React.FC<{ setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsLogin
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const resp: LoginResponse = await AuthService.login(username, password);
      localStorage.setItem(LOGIN_TOKEN_KEY, resp.token);
      localStorage.setItem(USER_ID_KEY, resp.userID);

      navigate(GAME_INIT_ROUTE);
    } catch (error) {
      localStorage.clear();
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={isLoading} style={{ width: "130px" }}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button onClick={() => setIsLogin(false)}>Switch to Register</button>
          </div>
        </form>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginForm;
