import React, { useState } from "react";
import { MAX_ATTEMPTS, WORD_LENGTH } from "../types/Constants";
import { GameState, Word, LetterState, Letter } from "@renderer/types/GameTypes";
import Board from "./Board";

const emptyRow = (): Word => ({
  letters: Array(WORD_LENGTH).fill({ character: "", state: "empty" as LetterState })
});

const initialGameState: GameState = {
  currentWord: "react",
  board: Array(MAX_ATTEMPTS)
    .fill(null)
    .map(() => emptyRow()),
  curAttempt: 0
};

const GamePanel: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentGuess, setCurrentGuess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGuess = e.target.value.toLowerCase().slice(0, WORD_LENGTH);
    setCurrentGuess(newGuess);

    setGameState((prevState) => {
      const updatedBoard = [...prevState.board];

      const attemptLetters = newGuess
          .split("")
          .map((char, _) => ({ character: char, state: "empty" }))
          .concat(Array(5 - newGuess.length).fill({ character: "", state: "empty" })) as Letter[];

      updatedBoard[gameState.curAttempt] = { letters: attemptLetters };
      return { ...prevState, board: updatedBoard };
    });
  };

  const handleGuess = () => {
    // block wrong length words and more than max attempts
    if (currentGuess.length !== WORD_LENGTH) return;
    if (gameState.curAttempt == MAX_ATTEMPTS) return;

    const newAttempt: Word = {
      letters: currentGuess.split("").map((char, index) => {
        let state: LetterState = "absent";
        if (gameState.currentWord[index] === char.toLowerCase()) {
          state = "correct";
        } else if (gameState.currentWord.includes(char)) {
          state = "present";
        }
        return { character: char, state };
      })
    };

    const newBoard = [...gameState.board];
    newBoard[gameState.curAttempt] = newAttempt;

    setGameState((prevState) => ({
      ...prevState,
      board: newBoard,
      curAttempt: prevState.curAttempt + 1
    }));
    setCurrentGuess(""); // reset the current guess after processing
  };

  return (
    <div>
      <h2>Welcome to the Wordle Game</h2>
      <Board gameState={gameState} />

      <input
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        maxLength={gameState.currentWord.length} // Ensure input matches word length
      />
      <button onClick={handleGuess}>Submit Guess</button>
    </div>
  );
};

export default GamePanel;
