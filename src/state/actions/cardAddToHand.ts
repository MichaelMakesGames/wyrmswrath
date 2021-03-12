import { createStandardAction } from "typesafe-actions";
import { CardCode } from "~data/cards";
import { registerHandler } from "~state/handleAction";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import WrappedState from "~types/WrappedState";

const cardAddToHand = createStandardAction("cardAddToHand")<{
  cardCode: CardCode;
  clearProgress: boolean;
}>();
export default cardAddToHand;

function cardAddToHandHandler(
  state: WrappedState,
  action: ReturnType<typeof cardAddToHand>,
) {
  const { cardCode, clearProgress } = action.payload;
  state.setRaw({
    ...state.raw,
    hand: [...state.raw.hand, cardCode],
    crystalProgress:
      cardCode.startsWith("CRYSTAL") && clearProgress
        ? 0
        : state.raw.crystalProgress,
    mushroomProgress:
      cardCode.startsWith("MUSHROOM") && clearProgress
        ? 0
        : state.raw.mushroomProgress,
    slimeProgress:
      cardCode.startsWith("SLIME") && clearProgress
        ? 0
        : state.raw.slimeProgress,
  });
  wyrmDisplaySystem(state);
}

registerHandler(cardAddToHandHandler, cardAddToHand);
