import { createStandardAction } from "typesafe-actions";
import cards from "~data/cards";
import { registerHandler } from "~state/handleAction";
import { Direction } from "~types";
import WrappedState from "~types/WrappedState";

const cardResolve = createStandardAction("cardResolve")<
  Direction | undefined
>();
export default cardResolve;

function cardResolveHandler(
  state: WrappedState,
  action: ReturnType<typeof cardResolve>,
): void {
  const index = state.raw.playing;
  if (index === null) return;
  const cardCode = state.raw.hand[index];
  const card = cards[cardCode];
  const direction = action.payload;

  const validationResult = card.validator
    ? card.validator(state, direction)
    : { valid: true };
  if (!validationResult.valid) {
    state.act.logMessage({
      message: validationResult.message || "Invalid Card Play",
    });
    return;
  }

  card.effect(state, direction);
  state.act.cardDiscardFromHand(index);
  state.setRaw({
    ...state.raw,
    playing: null,
  });
  if (!card.fast) {
    state.act.playerTookTurn();
  }
}

registerHandler(cardResolveHandler, cardResolve);
