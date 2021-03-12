import { createStandardAction } from "typesafe-actions";
import { MAX_HAND_SIZE } from "~constants";
import { rangeTo } from "~lib/math";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardRedrawHand = createStandardAction("cardRedrawHand")();
export default cardRedrawHand;

function cardRedrawHandHandler(
  state: WrappedState,
  action: ReturnType<typeof cardRedrawHand>,
): void {
  state.raw.hand.forEach(() => state.act.cardDiscardFromHand(0));
  rangeTo(Math.min(MAX_HAND_SIZE, state.select.handSize())).forEach(() =>
    state.act.cardDraw(),
  );
}

registerHandler(cardRedrawHandHandler, cardRedrawHand);
