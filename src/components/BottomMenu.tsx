import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsContext } from "~contexts";
import cards, { CardCode } from "~data/cards";
import actions from "~state/actions";
import selectors from "~state/selectors";
import wrapState from "~state/wrapState";
import { Direction } from "~types";
import { ControlCode } from "~types/ControlCode";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";

export default function BottomMenu() {
  const deck = useSelector(selectors.deck);
  const discard = useSelector(selectors.discard);
  return (
    <section
      className="border-t border-b border-gray flex flex-row p-3"
      data-section="BOTTOM_MENU"
    >
      <div>
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
  return (
    <div className="flex flex-row h-60">
      {hand.map((code, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={`${code}-${index}`} code={code} index={index} />
      ))}
    </div>
  );
}

function Card({ code, index }: { code: CardCode; index: number }) {
  const dispatch = useDispatch();
  const isPlayingCard = useSelector(selectors.isPlayingCard);
  const playing = useSelector(selectors.playing);
  const thisCardIsBeingPlayed = playing === index;
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
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.cardPlay(index)),
    disabled: isPlayingCard,
  });

  return (
    <button
      className={`w-40 h-60 ${
        thisCardIsBeingPlayed ? "border-4" : "border"
      } border-white rounded p-2 ml-2 disabled:cursor-not-allowed disabled:text-gray disabled:border-gray`}
      type="button"
      onClick={() => dispatch(actions.cardPlay(index))}
      disabled={isPlayingCard && !thisCardIsBeingPlayed}
    >
      <h3>
        <Kbd>{settings.keyboardShortcuts[controlCode][0]}</Kbd> {card.name}
      </h3>
      <span className="text-sm text-gray">{card.type}</span>
      <p className="text-sm">{card.description}</p>
    </button>
  );
}
