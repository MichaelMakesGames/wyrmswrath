import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const wait = createStandardAction("wait")();
export default wait;

function waitHandler(
  state: WrappedState,
  action: ReturnType<typeof wait>,
): void {
  state.act.cardRedrawHand();
  state.act.playerTookTurn();
}

registerHandler(waitHandler, wait);
