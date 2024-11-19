import { useState, useRef } from 'react';
import { MAX_ATTEMPTS, WORD_LENGTH } from "@renderer/types/Constants";
import { GameState, Word, LetterState, Letter } from "@renderer/types/GameTypes";

const emptyRow = (): Word => ({
  letters: Array(WORD_LENGTH).fill({ character: "", state: "empty" as LetterState })
});

const initialGameState: GameState = {
  currentWord: "react",
  board: Array(MAX_ATTEMPTS)
    .fill(null)
    .map(() => emptyRow()),
  curAttempt: 0,
  keyboardLetterStates: {}
};

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const currentGuess = useRef<string>("");
  const lastKey = useRef<string | null>(null);

  const updateBoard = (guess: string) => {
    setGameState((prevState) => {
      const updatedBoard = [...prevState.board];
      const currentAttemptIndex = prevState.curAttempt;
  
      const attemptLetters = guess
        .split("")
        .map((char) => ({ character: char, state: "empty" } as Letter))
        .concat(
          Array(WORD_LENGTH - guess.length).fill({ character: "", state: "empty" })
        ) as Letter[];
  
      updatedBoard[currentAttemptIndex] = { letters: attemptLetters };
  
      return { ...prevState, board: updatedBoard };
    });
  };

  const handleGuess = () => {
    if (currentGuess.current.length !== WORD_LENGTH || gameState.curAttempt === MAX_ATTEMPTS) return;

    const newKeyboardLetterStates = gameState.keyboardLetterStates;

    const newAttempt: Word = {
      letters: currentGuess.current.split("").map((char, index) => {
        let state: LetterState = "absent";

        // set the state
        if (gameState.currentWord[index] === char.toLowerCase()) {
          state = "correct";
        } else if (gameState.currentWord.includes(char)) {
          state = "present";
        }

        // update the keyboard letter states
        if (!newKeyboardLetterStates.hasOwnProperty(char)) {
            newKeyboardLetterStates[char] = state;
        }
        else if (newKeyboardLetterStates[char] === "absent" && state !== "absent") {
            newKeyboardLetterStates[char] = state;
        }
        else if (newKeyboardLetterStates[char] === "present" && state === "correct") {
            newKeyboardLetterStates[char] = state;
        }

        return { character: char, state };
      })
    };

    const newBoard = [...gameState.board];
    newBoard[gameState.curAttempt] = newAttempt;

    setGameState((prevState) => ({
      ...prevState,
      board: newBoard,
      curAttempt: prevState.curAttempt + 1,
      keyboardLetterStates: newKeyboardLetterStates
    }));
    currentGuess.current = "";
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      handleGuess();
      return;
    }
  
    let updatedGuess = currentGuess.current;
  
    if (key === "Backspace") {
      updatedGuess = updatedGuess.slice(0, -1);
    } else if (/^[a-zA-Z]$/.test(key) && updatedGuess.length < WORD_LENGTH) {
      updatedGuess += key.toLowerCase();
    }
  
    currentGuess.current = updatedGuess;
    updateBoard(updatedGuess);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (lastKey.current !== event.key) {
      lastKey.current = event.key; 
      handleKeyPress(event.key); 
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (lastKey.current === event.key) {
      lastKey.current = null;
    }
  };

  return {
    gameState,
    handleKeyPress,
    handleKeyDown,
    handleKeyUp
  };
}