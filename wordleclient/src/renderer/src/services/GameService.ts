import { GameResultRequest, HasUserPlayedResponse } from "@renderer/types/GameTypes";
import { GAME_API_URL } from "@renderer/types/Constants";

export class GameService {
  static async getWordOfTheDay(): Promise<string> {
    try {
      const response = await fetch(`${GAME_API_URL}/wotd`);

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
        headers: {
          "Content-Type": "application/json"
        },
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

  static async hasUserPlayedToday(userID: string): Promise<boolean> {
    try {
      const response = await fetch(`${GAME_API_URL}/has-played?userID=${userID}`);

      if (!response.ok) {
        throw new Error("Failed to check if user has played");
      }

      const data: HasUserPlayedResponse = await response.json();
      return data.hasPlayed;
    } catch (error) {
      throw error;
    }
  }
}
