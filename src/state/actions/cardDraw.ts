import { createStandardAction } from "typesafe-actions";
import audio from "~lib/audio";
import { rangeTo } from "~lib/math";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardDraw = createStandardAction("cardDraw")<number>();
export default cardDraw;

function cardDrawHandler(
  state: WrappedState,
  action: ReturnType<typeof cardDraw>,
): void {
  rangeTo(action.payload).forEach(() => {
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
  });

  rangeTo(action.payload).forEach((i) =>
    setTimeout(
      () => audio.play(`kenney-card-slide-${(i % 8) + 1}`),
      250 * (i + 1),
    ),
  );
}

registerHandler(cardDrawHandler, cardDraw);
