import {
  GameResultRequest,
  HasUserPlayedResponse,
  GameHistoryResponse
} from "@renderer/types/ApiTypes";
import { GAME_API_URL } from "@renderer/types/Constants";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export class GameService {
  static async getWordOfTheDay(): Promise<string> {
    try {
      const response: Response = await fetchWithAuth(`${GAME_API_URL}/wotd`);

      if (!response.ok) {
        throw new Error("Failed to fetch word of the day");
      }

      const word: string = await response.text();
      return word;
    } catch (error) {
      throw error;
    }
  }

  static async reportGameResult(result: GameResultRequest): Promise<void> {
    try {
      const response: Response = await fetchWithAuth(`${GAME_API_URL}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
      });

      if (!response.ok) {
        const error: string = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  }

  static async hasUserPlayedToday(userID: string): Promise<HasUserPlayedResponse> {
    try {
      const response: Response = await fetchWithAuth(`${GAME_API_URL}/has-played?userID=${userID}`);

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
      const response: Response = await fetchWithAuth(
        `${GAME_API_URL}/game-history?userID=${userID}`
      );

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
