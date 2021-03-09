import { createStandardAction } from "typesafe-actions";
import { CardCode } from "~data/cards";
import { registerHandler } from "~state/handleAction";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import WrappedState from "~types/WrappedState";

const cardAddToDeck = createStandardAction("CARD_ADD_TO_DECK")<CardCode>();
export default cardAddToDeck;

function cardAddToDeckHandler(
  state: WrappedState,
  action: ReturnType<typeof cardAddToDeck>,
) {
  state.setRaw({
    ...state.raw,
    deck: [...state.raw.deck, action.payload],
  });
  state.act.cardShuffleDeck();
  wyrmDisplaySystem(state);
}

registerHandler(cardAddToDeckHandler, cardAddToDeck);
