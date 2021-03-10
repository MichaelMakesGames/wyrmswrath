import React, { useContext } from "react";
import { SettingsContext } from "~contexts";
import cards, { CardCode } from "~data/cards";
import { ControlCode } from "~types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";

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
      className={`w-40 h-60 ${
        active ? "border-4" : "border"
      } border-white rounded p-2 ml-2 disabled:cursor-not-allowed disabled:text-gray disabled:border-gray`}
      type="button"
      onClick={() => callback(code, index)}
      disabled={disabled}
    >
      <h3>
        <Kbd>{settings.keyboardShortcuts[controlCode][0]}</Kbd> {card.name}
      </h3>
      <span className="text-sm text-gray">{card.fast ? "fast" : "slow"}</span>
      <p className="text-sm">{card.description}</p>
    </button>
  );
}
