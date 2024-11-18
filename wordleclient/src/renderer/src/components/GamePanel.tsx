import React, { useState, useRef, useEffect } from "react";
import { MAX_ATTEMPTS, WORD_LENGTH } from "@renderer/types/Constants";
import { GameState, Word, LetterState, Letter } from "@renderer/types/GameTypes";
import Board from "./Board";
import Keyboard from "./Keyboard";
import "../styles/GamePanel.css";

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
  const lastKey = useRef<string | null>(null); // track the last key pressed across renders

  // create a ref for the div
  const gamePanelRef = useRef<HTMLDivElement>(null);

  // Focus the div when the component mounts
  useEffect(() => {
    if (gamePanelRef.current) {
      gamePanelRef.current.focus();
    }
  }, []);

  const handleKeyPress = (key: string) => {
    setGameState((prevState) => {
      const updatedBoard = [...prevState.board];
      const currentAttemptIndex = prevState.curAttempt;

      let updatedGuess = currentGuess;

      if (key === "Enter") {
        handleGuess();
        return prevState; // no changes to the board until the guess is processed
      } else if (key === "Backspace") {
        updatedGuess = updatedGuess.slice(0, -1); // remove last character for backspace
      } else if (/^[a-zA-Z]$/.test(key) && updatedGuess.length < WORD_LENGTH) {
        updatedGuess += key.toLowerCase(); // add the pressed key
      }

      setCurrentGuess(updatedGuess);

      // update the current row's letters
      const attemptLetters = updatedGuess
        .split("")
        .map((char) => ({ character: char, state: "empty" } as Letter))
        .concat(
          Array(WORD_LENGTH - updatedGuess.length).fill({ character: "", state: "empty" })
        ) as Letter[];

      updatedBoard[currentAttemptIndex] = { letters: attemptLetters };

      return { ...prevState, board: updatedBoard };
    });
  };

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || gameState.curAttempt === MAX_ATTEMPTS) return;

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault(); // prevent default behavior

    // only process if the key is different from the last key pressed
    if (lastKey.current !== event.key) {
      lastKey.current = event.key; 
      handleKeyPress(event.key); 
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // reset last key when the key is released
    if (lastKey.current === event.key) {
      lastKey.current = null;
    }
  };

  return (
    <div
      className="full-page"
      ref={gamePanelRef} // attach the ref to the div
      tabIndex={0} // make div focusable
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: "none", height: "100vh", display: "flex", flexDirection: "column" }} // Remove focus outline
    >
      <Board gameState={gameState} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default GamePanel;
