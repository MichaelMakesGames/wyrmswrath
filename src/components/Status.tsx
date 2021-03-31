import Tippy from "@tippyjs/react";
import React from "react";
import { useSelector } from "react-redux";
import { HEX_HEIGHT, HEX_WIDTH } from "~constants";
import levels from "~data/levels";
import selectors from "~state/selectors";
import { StatusEffect } from "~types";
// @ts-ignore
import tiles from "../assets/tiles/*.png";
import Icons from "./Icons";

export default function Status() {
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

  return (
    <section className="p-2 border-b border-gray" data-section="STATUS">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col w-full">
          <h2 className="text-xl">{mainStatus}</h2>

          <section className="mt-1">
            <dl className="flex flex-row justify-between">
              <Stat
                label="Size"
                tooltip="Size. Determines your max health, max energy and energy loss, and affects many card abilities."
                current={size}
              />
              <Stat
                icon={
                  <span className="inline-block w-5 h-5 relative top-0.5 text-red">
                    <Icons.Health />
                  </span>
                }
                tooltip="Health. Use healing cards and mushroom terrain to regain health."
                current={health}
                max={maxHealth}
              />
              <Stat
                icon={
                  <span className="inline-block w-5 h-5 relative top-0.5 text-lighterYellow">
                    <Icons.Energy />
                  </span>
                }
                tooltip={`Energy. You lose ${
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
  icon,
  tooltip,
  max,
  current,
}: {
  label?: string;
  icon?: React.ReactNode;
  tooltip: string;
  max?: number;
  current: number;
}) {
  return (
    <Tippy content={tooltip} placement="bottom">
      <div>
        <dt className="inline">
          {label && `${label}: `}
          {icon}
        </dt>
        <dd
          className={
            max && current / max <= 0.2
              ? "inline text-red animate-pulse"
              : "inline"
          }
        >
          {current}
          {max && `/${max}`}
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
