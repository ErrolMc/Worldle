import { GameResult } from "./GameTypes";

export interface HasUserPlayedResponse {
  hasPlayed: boolean;
  gameResult: GameResult;
}

export interface GameResultRequest {
  userID: string;
  attempts: string[];
  wotd: string;
  isWin: boolean;
}