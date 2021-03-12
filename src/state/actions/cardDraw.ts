import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardDraw = createStandardAction("cardDraw")();
export default cardDraw;

function cardDrawHandler(
  state: WrappedState,
  action: ReturnType<typeof cardDraw>,
): void {
  if (!state.raw.deck.length) {
    state.act.cardShuffleDiscards();
  }
  if (!state.raw.deck.length) {
    return;
  }
  const [first, ...rest] = state.raw.deck;
  state.setRaw({
    ...state.raw,
    deck: rest,
    hand: [...state.raw.hand, first],
  });
  state.act.cardDiscardToLimit();
}

registerHandler(cardDrawHandler, cardDraw);
