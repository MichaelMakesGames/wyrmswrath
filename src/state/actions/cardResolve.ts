import { createStandardAction } from "typesafe-actions";
import cards from "~data/cards";
import audio from "~lib/audio";
import { registerHandler } from "~state/handleAction";
import animationToggleSystem from "~state/systems/animationToggleSystem";
import colorToggleSystem from "~state/systems/colorToggleSystem";
import energySystem from "~state/systems/energySystem";
import fovSystem from "~state/systems/fovSystem";
import gameOverSystem from "~state/systems/gameOverSystem";
import stairsSystem from "~state/systems/stairsSystem";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
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
      type: "error",
    });
    return;
  }

  if (card.preDiscard) card.effect(state, direction);
  state.act.cardDiscardFromHand(index);
  state.setRaw({
    ...state.raw,
    playing: null,
  });
  if (!card.preDiscard) card.effect(state, direction);
  audio.play(card.sfx || `sfx-${card.type}`);

  if (!card.fast) {
    state.act.playerTookTurn();
  } else {
    energySystem(state);
    stairsSystem(state);
    fovSystem(state);
    gameOverSystem(state);
    colorToggleSystem(state);
    animationToggleSystem(state);
    fovSystem(state);
    wyrmDisplaySystem(state);
  }
}

registerHandler(cardResolveHandler, cardResolve);
