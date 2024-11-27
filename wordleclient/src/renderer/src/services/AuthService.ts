import { LoginResponse, LoginRequest } from "@renderer/types/AuthTypes";
import { API_BASE_URL } from "@renderer/types/Constants";

export class AuthService {
  static async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
        const error = await response.text();
        throw new Error(error);
      }

      const data: LoginResponse = await response.json();
      return data.token;
    } catch (error) {
      throw error;
    }
  }

  static async register(username: string, password: string): Promise<void> {
    try {
      console.log("Trying to register");
      const response = await fetch(`${API_BASE_URL}/register`, {
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

      console.log("Response: ", response);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  }
}
