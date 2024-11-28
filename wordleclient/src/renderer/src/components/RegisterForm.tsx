import React, { useState } from "react";
import { AuthService } from "../services/AuthService";
import "../styles/LoginRegisterForm.css";

const RegisterForm: React.FC<{ setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsLogin
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.register(username, password);
      setSuccess("Registration successful! Please login.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
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
          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={isLoading} style={{ width: "130px" }}>
              {isLoading ? "Registering..." : "Register"}
            </button>
            <button onClick={() => setIsLogin(true)} style={{ width: "170px" }}>Switch to Login</button>
          </div>
        </form>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>

  );
};

export default RegisterForm;
