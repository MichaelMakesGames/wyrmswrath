import { RNG } from "rot-js";
import { createStandardAction } from "typesafe-actions";
import audio from "~lib/audio";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardShuffleDeck = createStandardAction("cardShuffleDeck")();
export default cardShuffleDeck;

function cardShuffleDeckHandler(
  state: WrappedState,
  action: ReturnType<typeof cardShuffleDeck>,
): void {
  state.setRaw({
    ...state.raw,
    deck: RNG.shuffle(state.raw.deck),
  });
  audio.play("kenney-card-shuffle");
}

registerHandler(cardShuffleDeckHandler, cardShuffleDeck);
