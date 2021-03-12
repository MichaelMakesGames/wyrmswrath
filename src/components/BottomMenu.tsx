import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cards from "~data/cards";
import actions from "~state/actions";
import selectors from "~state/selectors";
import wrapState from "~state/wrapState";
import { Direction } from "~types";
import { ControlCode } from "~types/ControlCode";
import Card from "./Card";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup, useControl } from "./HotkeysProvider";

export default function BottomMenu() {
  const deck = useSelector(selectors.deck);
  const discard = useSelector(selectors.discard);
  return (
    <section
      className="border-t border-gray flex flex-row"
      data-section="BOTTOM_MENU"
    >
      <div className="w-64 flex-none p-3 border-gray border-r">
        <div>
          Deck: {deck.length} {deck.length !== 1 ? "Cards" : "Card"}
        </div>
        <div>
          Discards: {discard.length} {discard.length !== 1 ? "Cards" : "Card"}
        </div>
        <PlayControls />
      </div>
      <Hand />
    </section>
  );
}

function PlayControls() {
  const dispatch = useDispatch();
  const playing = useSelector(selectors.playing);
  if (playing === null)
    return (
      <div>
        <HotkeyButton
          controlCode={ControlCode.Wait}
          label="Wait and Redraw"
          hotkeyGroup={HotkeyGroup.Main}
          callback={() => dispatch(actions.wait())}
        />
      </div>
    );

  return (
    <div>
      Choose Direction:
      <div className="mb-1">
        <DirectionButton direction="NW" />
        <DirectionButton direction="N" />
        <DirectionButton direction="NE" />
      </div>
      <div className="mb-1">
        <DirectionButton direction="SW" />
        <DirectionButton direction="S" />
        <DirectionButton direction="SE" />
      </div>
      <HotkeyButton
        controlCode={ControlCode.Back}
        hotkeyGroup={HotkeyGroup.Main}
        label="Cancel"
        callback={() => dispatch(actions.cardCancel())}
      />
    </div>
  );
}

function DirectionButton({ direction }: { direction: Direction }) {
  const dispatch = useDispatch();
  const callback = () => dispatch(actions.cardResolve(direction));
  const playing = useSelector(selectors.playing);
  const hand = useSelector(selectors.hand);
  const state = useSelector(selectors.state);
  useControl({
    code: direction as ControlCode,
    group: HotkeyGroup.Main,
    callback,
  });

  if (playing === null) return null;
  const cardCode = hand[playing];
  const card = cards[cardCode];
  const { valid } = card.validator
    ? card.validator(wrapState(state), direction)
    : { valid: true };

  return (
    <button className="btn" type="button" onClick={callback} disabled={!valid}>
      {direction}
    </button>
  );
}

function Hand() {
  const hand = useSelector(selectors.hand);
  const playing = useSelector(selectors.playing);
  const dispatch = useDispatch();
  return (
    <div
      className="flex-none flex flex-row flex-wrap overflow-y-auto p-3"
      style={{ height: 250 + 24, gap: "0.5rem", width: "calc(100% - 16rem)" }}
    >
      {hand.map((code, index) => (
        <Card
          // eslint-disable-next-line react/no-array-index-key
          key={`${code}-${index}`}
          code={code}
          index={index}
          callback={() => dispatch(actions.cardPlay(index))}
          active={playing === index}
          disabled={playing !== null && playing !== index}
        />
      ))}
    </div>
  );
}
