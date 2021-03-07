import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardDiscardFromHand = createStandardAction("cardDiscardFromHand")<
  number
>();
export default cardDiscardFromHand;

function cardDiscardFromHandHandler(
  state: WrappedState,
  action: ReturnType<typeof cardDiscardFromHand>,
): void {
  const index = action.payload;
  const card = state.raw.hand[index];
  if (!card) return;
  state.setRaw({
    ...state.raw,
    hand: [
      ...state.raw.hand.slice(0, index),
      ...state.raw.hand.slice(index + 1),
    ],
    discard: [...state.raw.discard, card],
  });
}

registerHandler(cardDiscardFromHandHandler, cardDiscardFromHand);
