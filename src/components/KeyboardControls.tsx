import React, { useContext } from "react";
import { SettingsContext } from "~contexts";
import { ControlCode } from "~types/ControlCode";
import Kbd from "./Kbd";
import Modal from "./Modal";
import { useControl, HotkeyGroup } from "~components/HotkeysProvider";
import HotkeyButton from "./HotkeyButton";

export default function KeyboardControls({ onClose }: { onClose: () => void }) {
  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Help,
    callback: onClose,
  });

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="flex flex-row">
        <h2 className="text-2xl flex-grow">Keyboard Controls</h2>
        <HotkeyButton
          controlCode={ControlCode.Back}
          callback={onClose}
          hotkeyGroup={HotkeyGroup.Help}
          label="Close"
        />
      </div>
      <section className="my-3">
        <h3 className="text-xl">Movement and Card Targeting</h3>
        <Shortcut code={ControlCode.NW} label="Move/target Northwest" />
        <Shortcut code={ControlCode.N} label="Move/target North" />
        <Shortcut code={ControlCode.NE} label="Move/target Northeast" />
        <Shortcut code={ControlCode.SW} label="Move/target Southwest" />
        <Shortcut code={ControlCode.S} label="Move/target South" />
        <Shortcut code={ControlCode.SE} label="Move/target Southeast" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Card Play</h3>
        <Shortcut code={ControlCode.Menu1} label="Play Card 1" />
        <Shortcut code={ControlCode.Menu2} label="Play Card 2" />
        <Shortcut code={ControlCode.Menu3} label="Play Card 3" />
        <Shortcut code={ControlCode.Menu4} label="Play Card 4" />
        <Shortcut code={ControlCode.Menu5} label="Play Card 5" />
        <Shortcut code={ControlCode.Menu6} label="Play Card 6" />
        <Shortcut code={ControlCode.Menu7} label="Play Card 7" />
        <Shortcut code={ControlCode.Menu8} label="Play Card 8" />
        <Shortcut code={ControlCode.Menu9} label="Play Card 9" />
        <Shortcut code={ControlCode.Menu0} label="Play Card 10" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Miscellaneous</h3>
        <Shortcut
          code={ControlCode.Back}
          label="Cancel card play or close various menus"
        />
        <Shortcut code={ControlCode.Menu} label="Open main menu" />
        <Shortcut code={ControlCode.Help} label="Open this help menu" />
        <Shortcut code={ControlCode.NewGame} label="Start a new game" />
        <Shortcut code={ControlCode.ZoomIn} label="Zoom in map (default)" />
        <Shortcut code={ControlCode.ZoomOut} label="Zoom out map" />
        <Shortcut
          code={ControlCode.ToggleFullscreen}
          label="Toggle fullscreen"
        />
      </section>
    </Modal>
  );
}

function Shortcut({ code, label }: { code: ControlCode; label: string }) {
  const settings = useContext(SettingsContext);
  return (
    <div className="ml-3">
      {label}:
      {settings.keyboardShortcuts[code].map((key) => (
        <Kbd className="ml-1" key={key}>
          {key}
        </Kbd>
      ))}
    </div>
  );
}
