import { GameState, LetterState } from "@renderer/types/GameTypes";
import { MAX_ATTEMPTS } from "@renderer/types/Constants";

export const createDisplayGameState = (attempts: string[], word: string): GameState => ({
  currentWord: word,
  board: [
    ...attempts.map((attempt) => ({
      letters: attempt.split("").map((char, index) => ({
        character: char,
        state: calculateLetterState(char, index, word)
      }))
    })),
    ...Array(MAX_ATTEMPTS - attempts.length).fill({
      letters: Array(5).fill({ character: "", state: "empty" as LetterState })
    })
  ],
  curAttempt: attempts.length,
  keyboardLetterStates: {}
});

const calculateLetterState = (char: string, index: number, word: string): LetterState => {
  if (!word || !char) return "empty";
  if (word[index]?.toLowerCase() === char.toLowerCase()) return "correct";
  if (word.toLowerCase().includes(char.toLowerCase())) return "present";
  return "absent";
};
