import { LoginResponse, LoginRequest } from "@renderer/types/AuthTypes";
import { AUTH_API_URL } from "@renderer/types/Constants";
import { LOGIN_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@renderer/types/LocalStorageKeys";

export class AuthService {
  static async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response: Response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          audienceURI: "WordleElectronApp"
        } as LoginRequest)
      });

      if (!response.ok) {
        const error: string = await response.text();
        throw new Error(error);
      }

      const resp: LoginResponse = await response.json();
      localStorage.setItem(LOGIN_TOKEN_KEY, resp.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, resp.refreshToken);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  static async register(username: string, password: string): Promise<void> {
    try {
      console.log("Trying to register");
      const response: Response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          audienceURI: "WordleElectronApp"
        } as LoginRequest)
      });

      if (!response.ok) {
        const error: string = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${AUTH_API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(LOGIN_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
