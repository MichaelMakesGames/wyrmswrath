import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import WrappedState from "~types/WrappedState";

const cardRemoveFromHand = createStandardAction("cardRemoveFromHand")<number>();
export default cardRemoveFromHand;

function cardRemoveFromHandHandler(
  state: WrappedState,
  action: ReturnType<typeof cardRemoveFromHand>,
): void {
  const index = action.payload;
  if (!state.raw.hand[index]) return;
  state.setRaw({
    ...state.raw,
    hand: [
      ...state.raw.hand.slice(0, index),
      ...state.raw.hand.slice(index + 1),
    ],
  });
  wyrmDisplaySystem(state);
}

registerHandler(cardRemoveFromHandHandler, cardRemoveFromHand);
