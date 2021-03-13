import Tippy from "@tippyjs/react";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAX_HAND_SIZE } from "~constants";
import { SettingsContext } from "~contexts";
import cards from "~data/cards";
import { noFocusOnClick } from "~lib/controls";
import actions from "~state/actions";
import selectors from "~state/selectors";
import wrapState from "~state/wrapState";
import { Direction } from "~types";
import { ControlCode } from "~types/ControlCode";
import Card from "./Card";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Icons from "./Icons";
import Kbd from "./Kbd";

export default function BottomMenu() {
  const deck = useSelector(selectors.deck);
  const discard = useSelector(selectors.discard);
  const handSize = useSelector(selectors.handSize);
  return (
    <section
      className="border-t border-gray flex flex-row"
      data-section="BOTTOM_MENU"
    >
      <div className="w-64 flex-none p-3 border-gray border-r">
        <div className="flex flex-row text-sm mb-3">
          <Tippy
            content={
              <div>
                {deck.length === 0 && "Empty"}
                {deck
                  .map((code) => cards[code].name)
                  .sort()
                  .map((name, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i}>{name}</div>
                  ))}
              </div>
            }
          >
            <div>Deck: {deck.length}</div>
          </Tippy>
          <Tippy
            content={
              <div>
                {discard.length === 0 && "Empty"}
                {discard
                  .map((code) => cards[code].name)
                  .sort()
                  .map((name, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i}>{name}</div>
                  ))}
              </div>
            }
          >
            <div className="flex-1 text-center">Discards: {discard.length}</div>
          </Tippy>
          <Tippy content="Wyrm size + 1. This is how many cards you draw when you Wait and Redraw. If you ever have more than 10 cards, you will randomly discard down to 10.">
            <div>Hand Size: {handSize}</div>
          </Tippy>
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

  return (
    <div>
      <h3 className="text-xl text-center">
        {playing === null ? "Move and End Turn" : "Choose Direction"}
      </h3>
      <DirectionControls />
      {playing === null ? (
        <HotkeyButton
          className="w-full"
          controlCode={ControlCode.Wait}
          label="Wait and Redraw"
          hotkeyGroup={HotkeyGroup.Main}
          callback={() => dispatch(actions.wait())}
        />
      ) : (
        <HotkeyButton
          className="w-full"
          controlCode={ControlCode.Back}
          hotkeyGroup={HotkeyGroup.Main}
          label="Cancel"
          callback={() => dispatch(actions.cardCancel())}
        />
      )}
    </div>
  );
}

function DirectionControls() {
  return (
    <div className="flex flex-row w-32 h-32 mx-auto my-3">
      <div className="flex flex-col flex-1">
        <div style={{ flex: "0.5 0 0%" }} />
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="NW" />
        </div>
        <div style={{ flex: "0 0 4px" }} />
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="SW" />
        </div>
        <div style={{ flex: "0.5 0 0%" }} />
      </div>
      <div className="flex flex-col flex-1">
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="N" />
        </div>
        <div style={{ flex: "1 0 0%" }} />
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="S" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div style={{ flex: "0.5 0 0%" }} />
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="NE" />
        </div>
        <div style={{ flex: "0 0 4px" }} />
        <div style={{ flex: "1 0 0%" }}>
          <DirectionButton direction="SE" />
        </div>
        <div style={{ flex: "0.5 0 0%" }} />
      </div>
    </div>
  );
}

function DirectionButton({ direction }: { direction: Direction }) {
  const dispatch = useDispatch();
  const playing = useSelector(selectors.playing);
  const callback = () =>
    dispatch(
      playing !== null
        ? actions.cardResolve(direction)
        : actions.moveWyrm({ direction }),
    );
  const hand = useSelector(selectors.hand);
  const state = useSelector(selectors.state);
  const settings = useContext(SettingsContext);
  useControl({
    code: direction as ControlCode,
    group: HotkeyGroup.Main,
    callback,
  });

  let background = "bg-lightGray";
  let valid = true;
  if (playing !== null) {
    const cardCode = hand[playing];
    const card = cards[cardCode];

    if (card.type === "crystal") background = "bg-lightBlue";
    if (card.type === "slime") background = "bg-lightGreen";
    if (card.type === "mushroom") background = "bg-lightPurple";

    valid = (card.validator
      ? card.validator(wrapState(state), direction)
      : { valid: true }
    ).valid;
  } else {
    valid = selectors.wyrmCanMove(state, direction);
  }

  const rotate = ["N", "NE", "SE", "S", "SW", "NW"].indexOf(direction) * 60;

  return (
    <Tippy
      content={
        <div>
          {playing === null ? `Move ${direction} ` : `Target ${direction} `}
          <Kbd light>
            {settings.keyboardShortcuts[ControlCode[direction]][0]}
          </Kbd>
        </div>
      }
    >
      <button
        className={`w-full h-full border ${background} text-black rounded-full disabled:bg-darkestGray disabled:border-gray disabled:text-gray disabled:cursor-not-allowed`}
        type="button"
        onClick={noFocusOnClick(callback)}
        disabled={!valid}
      >
        <div
          className="w-8 h-8 mx-auto my-auto"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <Icons.UpArrow />
        </div>
      </button>
    </Tippy>
  );
}

function Hand() {
  const hand = useSelector(selectors.hand);
  const playing = useSelector(selectors.playing);
  const dispatch = useDispatch();
  return (
    <div
      className="flex-none flex flex-row flex-wrap overflow-y-auto p-3"
      style={{ height: 250 + 24, gap: "0.25rem", width: "calc(100% - 16rem)" }}
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
