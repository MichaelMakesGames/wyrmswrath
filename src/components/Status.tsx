import React from "react";
import { useDispatch, useSelector } from "react-redux";
import levels from "~data/levels";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
// @ts-ignore
import tiles from "../assets/tiles/*.png";
import { HEX_HEIGHT, HEX_WIDTH } from "~constants";
import { StatusEffect } from "~types";
import Tippy from "@tippyjs/react";
import { T } from "ts-toolbelt";

export default function Status() {
  const dispatch = useDispatch();
  const size = useSelector(selectors.playerSize);
  const level = useSelector(selectors.level);
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

  let mainStatus = `Level ${level + 1}: ${levels[level].name}`;
  if (gameOver && victory) {
    mainStatus = "Victory!";
  } else if (gameOver && energy <= 0) {
    mainStatus = "Starvation";
  } else if (gameOver && health <= 0) {
    mainStatus = "Slain";
  } else if (gameOver) {
    mainStatus = "Defeat";
  }

  useControl({
    code: ControlCode.NewGame,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.newGame()),
  });

  return (
    <section className="p-2 border-b border-gray" data-section="STATUS">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col w-full">
          <h2 className="text-xl">{mainStatus}</h2>

          <section className="mt-1">
            <dl className="flex flex-row justify-between">
              <Stat
                label="Health"
                tooltip="Use healing cards and mushroom terrain to regain health."
                current={health}
                max={maxHealth}
              />
              <Stat
                label="Energy"
                tooltip={`You lose ${
                  size / 2
                } (size/2) energy each turn. Eat enemies and their drops to gain more energy.`}
                current={energy}
                max={maxEnergy}
              />
            </dl>
          </section>

          <section className="flex flex-row mt-1">
            <h3 className="mr-1">Unlocks:</h3>
            <dl className="flex-1 flex flex-row justify-between">
              <SuitProgress
                progress={crystalProgress}
                unlock={crystalUnlock}
                suit="crystal"
              />
              <SuitProgress
                progress={mushroomProgress}
                unlock={mushroomUnlock}
                suit="mushroom"
              />
              <SuitProgress
                progress={slimeProgress}
                unlock={slimeUnlock}
                suit="slime"
              />
            </dl>
          </section>

          <StatusEffects />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  tooltip,
  max,
  current,
}: {
  label: string;
  tooltip: string;
  max: number;
  current: number;
}) {
  return (
    <Tippy content={tooltip}>
      <div>
        <dt className="inline">{`${label}: `}</dt>
        <dd
          className={
            current / max <= 0.2 ? "inline text-red animate-pulse" : "inline"
          }
        >
          {current}/{max}
        </dd>
      </div>
    </Tippy>
  );
}

function SuitProgress({
  progress,
  unlock,
  suit,
}: {
  progress: number;
  unlock: number;
  suit: string;
}) {
  return (
    <Tippy
      content={`Progress towards your next card unlock. Eat ${suit} enemies and drops to unlock.`}
    >
      <div className="inline-block">
        <dt className="inline">
          <img alt={suit} src={tiles[`suit-${suit}`]} className="inline" />
        </dt>
        <dd className="inline">
          {progress}/{unlock}
        </dd>
      </div>
    </Tippy>
  );
}

function StatusEffects() {
  const statusEffects = useSelector(selectors.playerStatusEffects);
  const hasStatusEffects = Object.values(statusEffects).some(Boolean);
  return (
    <section className="mt-1">
      <h3 className="inline">Status Effects: </h3>
      {!hasStatusEffects && "None"}
      {Object.values(statusEffects)
        .filter(Boolean)
        .map((se: StatusEffect) => {
          const tile = `icon-${se.type.toLowerCase().replace("_", "-")}`;
          const name = se.type
            .substring(0, 1)
            .concat(se.type.substring(1).toLowerCase().replace("_", " "));
          return (
            <Tippy
              content={`${name}${se.value ? ` (${se.value})` : ""}${
                se.expiresIn
                  ? `, expires in ${se.expiresIn} ${
                      se.expiresIn === 1 ? "turn" : "turns"
                    }`
                  : ", does not expire"
              }`}
              key={se.type}
            >
              <img
                style={{ marginTop: -2 }}
                width={HEX_WIDTH}
                height={HEX_HEIGHT}
                className="inline"
                alt={name}
                src={tiles[tile]}
              />
            </Tippy>
          );
        })}
    </section>
  );
}
