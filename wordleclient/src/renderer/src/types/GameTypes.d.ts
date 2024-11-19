export type LetterState = "correct" | "present" | "absent" | "empty";

export interface Letter {
  character: string;
  state: LetterState;
}

export interface Word {
  letters: Letter[];
}

export interface GameState {
  currentWord: string;
  board: Word[];
  curAttempt: number;
  keyboardLetterStates: Record<string, LetterState>;
}
