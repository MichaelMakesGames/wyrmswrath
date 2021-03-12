import { RNG } from "rot-js";
import { createStandardAction } from "typesafe-actions";
import { MAX_HAND_SIZE } from "~constants";
import cards from "~data/cards";
import { rangeTo } from "~lib/math";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardDiscardToLimit = createStandardAction("cardDiscardToLimit")();
export default cardDiscardToLimit;

function cardDiscardToLimitHandler(
  state: WrappedState,
  action: ReturnType<typeof cardDiscardToLimit>,
): void {
  const hand = state.select.hand();
  const numberToDiscard = hand.length - MAX_HAND_SIZE;
  if (numberToDiscard > 0) {
    const discardIndexes = RNG.shuffle(rangeTo(hand.length)).slice(
      0,
      numberToDiscard,
    );
    const discarded = hand.filter((_, i) => discardIndexes.includes(i));
    const newHand = hand.filter((_, i) => !discardIndexes.includes(i));
    state.setRaw({
      ...state.raw,
      hand: newHand,
      discard: [...state.raw.discard, ...discarded],
    });
    state.act.logMessage({
      message: `You were above the hand limit of ${MAX_HAND_SIZE}, and have been forced to discard the following: ${discarded
        .map((code) => cards[code].name)
        .join(", ")}`,
    });
  }
}

registerHandler(cardDiscardToLimitHandler, cardDiscardToLimit);
