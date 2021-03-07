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
        <h2 className="text-2xl flex-grow">Mouse Controls</h2>
        <HotkeyButton
          controlCode={ControlCode.Back}
          callback={onClose}
          hotkeyGroup={HotkeyGroup.Help}
          label="Close"
        />
      </div>
      <section className="my-3 pl-3">
        <p>Under construction.</p>
      </section>
      <div className="flex flex-row">
        <h2 className="text-2xl flex-grow">Keyboard Shortcuts</h2>
      </div>
      <section className="my-3">
        <h3 className="text-xl">Movement</h3>
        <Shortcut code={ControlCode.NW} label="NW" />
        <Shortcut code={ControlCode.N} label="N" />
        <Shortcut code={ControlCode.NE} label="NE" />
        <Shortcut code={ControlCode.SW} label="SW" />
        <Shortcut code={ControlCode.S} label="S" />
        <Shortcut code={ControlCode.SE} label="SE" />
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
