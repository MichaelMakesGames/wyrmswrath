import { createStandardAction } from "typesafe-actions";
import { CardCode } from "~data/cards";
import { registerHandler } from "~state/handleAction";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import WrappedState from "~types/WrappedState";

const cardAddToHand = createStandardAction("cardAddToHand")<CardCode>();
export default cardAddToHand;

function cardAddToHandHandler(
  state: WrappedState,
  action: ReturnType<typeof cardAddToHand>,
) {
  state.setRaw({
    ...state.raw,
    deck: [...state.raw.deck, action.payload],
  });
  wyrmDisplaySystem(state);
}

registerHandler(cardAddToHandHandler, cardAddToHand);
