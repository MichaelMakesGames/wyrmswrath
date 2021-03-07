import { createStandardAction } from "typesafe-actions";
import cards from "~data/cards";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardPlay = createStandardAction("cardPlay")<number>();
export default cardPlay;

function cardPlayHandler(
  state: WrappedState,
  action: ReturnType<typeof cardPlay>,
): void {
  const index = action.payload;
  const cardCode = state.raw.hand[index];
  if (!cardCode) return;
  const card = cards[cardCode];
  state.setRaw({
    ...state.raw,
    playing: index,
  });
  if (!card.directional) {
    state.act.cardResolve(undefined);
  }
}

registerHandler(cardPlayHandler, cardPlay);
