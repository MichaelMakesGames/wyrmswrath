import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardShuffleDiscards = createStandardAction("cardShuffleDiscards")();
export default cardShuffleDiscards;

function cardShuffleDiscardsHandler(
  state: WrappedState,
  action: ReturnType<typeof cardShuffleDiscards>,
): void {
  state.setRaw({
    ...state.raw,
    deck: [...state.raw.deck, ...state.raw.discard],
    discard: [],
  });
  state.act.cardShuffleDeck();
}

registerHandler(cardShuffleDiscardsHandler, cardShuffleDiscards);
