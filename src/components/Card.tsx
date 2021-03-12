import React, { useContext } from "react";
import { SettingsContext } from "~contexts";
import cards, { CardCode } from "~data/cards";
import { ControlCode } from "~types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";
// @ts-ignore
import cardCrystal from "~assets/tiles/card-crystal.png";
// @ts-ignore
import cardMushroom from "~assets/tiles/card-mushroom.png";
// @ts-ignore
import cardSlime from "~assets/tiles/card-slime.png";
import colors from "~colors";

const cardBackgrounds = {
  crystal: cardCrystal,
  mushroom: cardMushroom,
  slime: cardSlime,
};

export default function Card({
  code,
  index,
  disabled = false,
  callback,
  hotkeyGroup = HotkeyGroup.Main,
  active = false,
}: {
  code: CardCode;
  index: number;
  disabled?: boolean;
  callback: (code: CardCode, index: number) => void;
  hotkeyGroup?: HotkeyGroup;
  active?: boolean;
}) {
  const card = cards[code];

  const controlCode = [
    ControlCode.Menu1,
    ControlCode.Menu2,
    ControlCode.Menu3,
    ControlCode.Menu4,
    ControlCode.Menu5,
    ControlCode.Menu6,
    ControlCode.Menu7,
    ControlCode.Menu8,
    ControlCode.Menu9,
    ControlCode.Menu0,
  ][index];
  const settings = useContext(SettingsContext);

  useControl({
    code: controlCode,
    group: hotkeyGroup,
    callback: () => callback(code, index),
    disabled,
  });

  return (
    <button
      className="relative flex-none flex flex-col rounded align-top px-6 pt-12 disabled:cursor-not-allowed disabled:opacity-50 transform transition-all hover:scale-105 hover:shadow-xl"
      style={{
        width: 170,
        height: 250,
        backgroundImage: `url("${cardBackgrounds[card.type]}")`,
        backgroundColor: colors.background,
      }}
      type="button"
      onClick={() => callback(code, index)}
      disabled={disabled}
    >
      <h3>
        <Kbd>{settings.keyboardShortcuts[controlCode][0]}</Kbd> {card.name}
      </h3>
      <span className="$text-xs text-lightGray">
        {card.fast ? "fast" : "slow"}
      </span>
      <p
        className={
          card.description.length > 80 ||
          (card.name.length > 10 && card.description.length > 30)
            ? "text-xs"
            : "text-sm"
        }
      >
        {card.description}
      </p>
    </button>
  );
}
