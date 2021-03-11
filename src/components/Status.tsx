import React from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup } from "./HotkeysProvider";

export default function Status() {
  const dispatch = useDispatch();
  const energy = useSelector(selectors.playerEnergy);
  const maxEnergy = useSelector(selectors.playerMaxEnergy);
  const health = useSelector(selectors.playerHealth);
  const maxHealth = useSelector(selectors.playerMaxHealth);
  const crystalProgress = useSelector(selectors.crystalProgress);
  const crystalUnlock = useSelector(selectors.crystalUnlock);
  const mushroomProgress = useSelector(selectors.mushroomProgress);
  const mushroomUnlock = useSelector(selectors.mushroomUnlock);
  const slimeProgress = useSelector(selectors.slimeProgress);
  const slimeUnlock = useSelector(selectors.slimeUnlock);
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);

  let mainStatus = "Level 1";
  if (gameOver && victory) {
    mainStatus = "Victory!";
  } else if (gameOver && energy <= 0) {
    mainStatus = "Starvation";
  } else if (gameOver && health <= 0) {
    mainStatus = "Slain";
  } else if (gameOver) {
    mainStatus = "Defeat";
  }

  return (
    <section className="p-2 border-b border-gray" data-section="STATUS">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col">
          <p className="text-xl">
            {mainStatus}{" "}
            {gameOver && (
              <span className="text-sm">
                <HotkeyButton
                  controlCode={ControlCode.NewGame}
                  hotkeyGroup={HotkeyGroup.Main}
                  label="New Game"
                  callback={() => dispatch(actions.newGame())}
                />
              </span>
            )}
          </p>
          <p>
            Health: {health}/{maxHealth}
          </p>
          <p>
            Energy: {energy}/{maxEnergy}
          </p>
          <div className="mt-2">
            <h3>Unlock Progress</h3>
            <p>
              Crystal: {crystalProgress}/{crystalUnlock}
            </p>
            <p>
              Mushroom: {mushroomProgress}/{mushroomUnlock}
            </p>
            <p>
              Slime: {slimeProgress}/{slimeUnlock}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
