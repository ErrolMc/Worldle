import {
  GameResultRequest,
  HasUserPlayedResponse,
  GameHistoryResponse
} from "@renderer/types/ApiTypes";
import { GAME_API_URL } from "@renderer/types/Constants";
import { LOGIN_TOKEN_KEY } from "@renderer/types/LocalStorageKeys";

export class GameService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(LOGIN_TOKEN_KEY);
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    };
  }

  static async getWordOfTheDay(): Promise<string> {
    try {
      const response = await fetch(`${GAME_API_URL}/wotd`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Failed to fetch word of the day");
      }

      const word = await response.text();
      return word;
    } catch (error) {
      throw error;
    }
  }

  static async reportGameResult(result: GameResultRequest): Promise<void> {
    try {
      const response = await fetch(`${GAME_API_URL}/report`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(result)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  }

  static async hasUserPlayedToday(userID: string): Promise<HasUserPlayedResponse> {
    try {
      const response = await fetch(`${GAME_API_URL}/has-played?userID=${userID}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Failed to check if user has played");
      }

      const data: HasUserPlayedResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getGameHistory(userID: string): Promise<GameHistoryResponse> {
    try {
      const response = await fetch(`${GAME_API_URL}/game-history?userID=${userID}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Failed to fetch game history");
      }

      const data: GameHistoryResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
