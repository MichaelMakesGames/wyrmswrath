/* global document */
import Tippy from "@tippyjs/react";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { SettingsContext } from "~contexts";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import { ControlCode } from "~types/ControlCode";
import { isMac, noFocusOnClick } from "~lib/controls";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";
import KeyboardControls from "./KeyboardControls";

export default function Menu() {
  const [isOpen, open, close, toggle] = useBoolean(false);
  const [controlsIsOpen, openControls, closeControls] = useBoolean(false);
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const menuShortcuts = settings.keyboardShortcuts[ControlCode.Menu];

  useControl({
    code: ControlCode.Menu,
    callback: open,
    group: HotkeyGroup.Main,
    allowedGroups: [HotkeyGroup.CardGain],
  });

  useControl({
    code: ControlCode.Menu,
    callback: close,
    group: HotkeyGroup.Menu,
    disabled: !isOpen,
  });

  useControl({
    code: ControlCode.Back,
    callback: close,
    group: HotkeyGroup.Menu,
    disabled: !isOpen,
  });

  useControl({
    code: ControlCode.NewGame,
    callback: () => dispatch(actions.newGame()),
    group: HotkeyGroup.Main,
    allowedGroups: [
      HotkeyGroup.Intro,
      HotkeyGroup.GameOver,
      HotkeyGroup.Menu,
      HotkeyGroup.CardGain,
    ],
  });

  const toggleFullscreen = () => {
    if (document.fullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
  useControl({
    code: ControlCode.ToggleFullscreen,
    callback: toggleFullscreen,
    group: HotkeyGroup.Main,
    allowedGroups: [
      HotkeyGroup.Intro,
      HotkeyGroup.GameOver,
      HotkeyGroup.Menu,
      HotkeyGroup.CardGain,
    ],
    disabled: !isMac(), // F11 is already the shortcut on Windows and Linux
  });

  useControl({
    code: ControlCode.Help,
    callback: openControls,
    group: HotkeyGroup.Main,
    allowedGroups: [
      HotkeyGroup.Intro,
      HotkeyGroup.GameOver,
      HotkeyGroup.Menu,
      HotkeyGroup.CardGain,
    ],
  });

  return (
    <Tippy
      visible={isOpen}
      arrow={false}
      interactive
      onClickOutside={close}
      placement="bottom-end"
      content={
        isOpen ? (
          <ul>
            <MenuOption
              controlCode={ControlCode.NewGame}
              label="New Game"
              callback={() => dispatch(actions.newGame())}
              closeMenu={close}
            />
            <MenuOption
              controlCode={ControlCode.Help}
              label="Controls"
              callback={openControls}
              closeMenu={close}
            />
            <MenuOption
              controlCode={ControlCode.ToggleFullscreen}
              label="Toggle Fullscreen"
              callback={toggleFullscreen}
              closeMenu={close}
            />
          </ul>
        ) : null
      }
    >
      <button onClick={noFocusOnClick(toggle)} type="button">
        <Kbd light>{menuShortcuts[0]}</Kbd> Menu
        {controlsIsOpen && <KeyboardControls onClose={closeControls} />}
      </button>
    </Tippy>
  );
}

function MenuOption({
  controlCode,
  callback,
  closeMenu,
  label,
}: {
  controlCode: ControlCode;
  callback: () => void;
  closeMenu: () => void;
  label: string;
}) {
  const settings = useContext(SettingsContext);
  const shortcuts = settings.keyboardShortcuts[controlCode];

  return (
    <li className="mb-1 last:mb-0">
      <button
        type="button"
        onClick={noFocusOnClick(() => {
          closeMenu();
          callback();
        })}
      >
        <Kbd light>{shortcuts[0]}</Kbd> {label}
      </button>
    </li>
  );
}
