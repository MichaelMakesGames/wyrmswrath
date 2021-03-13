/* global window */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBoolean } from "~hooks";
import selectors from "~state/selectors";
import Kbd from "./Kbd";
import Modal from "./Modal";

export default function GameOver() {
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const playerHealth = useSelector(selectors.playerHealth);
  const playerEnergy = useSelector(selectors.playerEnergy);
  const [isOpen, open, close] = useBoolean(false);

  useEffect(() => {
    if (gameOver) open();
    if (!gameOver) close();
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  if (!gameOver) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      <h2 className="text-xl">{victory ? "Victory!" : "Defeat"}</h2>
      {victory && (
        <p className="mt-1">
          The Rogue-King is defeated and the Chalice has been retrieved.
        </p>
      )}
      {playerHealth < 0 && (
        <p className="mt-1">
          You were slain! Vengeance is not yours today, but perhaps in another
          life...
        </p>
      )}
      {playerEnergy < 0 && (
        <p className="mt-1">
          Starvation! Keep an eye on your energy, and make sure to eat lots of
          humans.
        </p>
      )}
      <p className="mt-1">
        Press <Kbd>N</Kbd> to start a new game, or other key to close this
        window.
      </p>
    </Modal>
  );
}
