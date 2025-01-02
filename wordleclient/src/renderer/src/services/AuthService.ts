import { LoginResponse, LoginRequest } from "@renderer/types/AuthTypes";
import { AUTH_API_URL } from "@renderer/types/Constants";

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
}
