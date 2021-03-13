import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBoolean } from "~hooks";
import { useControl, HotkeyGroup } from "~components/HotkeysProvider";
import selectors from "~state/selectors";
import Modal from "./Modal";
import { ControlCode } from "~types/ControlCode";
import Kbd from "./Kbd";
import HotkeyButton from "./HotkeyButton";

export default function Introduction() {
  const [isOpen, open, close] = useBoolean(false);
  const turn = useSelector(selectors.turn);
  const player = useSelector(selectors.player);
  useEffect(() => {
    if (player && turn === 0) {
      open();
    }
  }, [Boolean(player), turn]);

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Intro,
    callback: close,
    disabled: !isOpen,
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen onRequestClose={close}>
      <h2 className="text-xl">The Wyrm is dead, but an egg remains...</h2>
      <div className="text-sm">
        <p className="my-1">
          The Rogue who now calls himself King of the Dungeon has stolen the
          Chalice.
        </p>
        <p className="my-1">
          Grow, explore, ascend, and find his Palace, and retrieve your
          birthright.
        </p>
        <hr className="border-gray my-3" />
        <div className="mb-3">
          <p className="my-1">
            Wyrm&apos;s Wrath is a deck-building roguelike. Each turn you can:
          </p>
          <ul className="list-disc">
            <li className="ml-3">play any number of fast cards:</li>
            <li className="ml-3">then play a slow card</li>
            <li className="ml-3">or redraw your hand</li>
            <li className="ml-3">or move</li>
          </ul>
          <p className="my-1">
            You can kill enemies by damaging them with card abilities, or you
            can simply move into their space, instantly eating them.
          </p>
          <p className="my-1">
            To win, explore each level to find the stairs, and reach the Palace
            on level 5. Retrieve the Chalice by eating the King, or killing him
            then eating the Chalice.
          </p>
        </div>
        <p className="my-2 text-sm text-lightGray">
          Press <Kbd>?</Kbd> at any time to view full keyboard controls.
        </p>
        <HotkeyButton
          label="Start Game"
          className="mt-2"
          controlCode={ControlCode.Menu1}
          callback={close}
          hotkeyGroup={HotkeyGroup.Intro}
        />
      </div>
    </Modal>
  );
}
