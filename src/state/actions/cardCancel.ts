import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cardCancel = createStandardAction("cardCancel")();
export default cardCancel;

function cardCancelHandler(
  state: WrappedState,
  action: ReturnType<typeof cardCancel>,
): void {
  state.setRaw({
    ...state.raw,
    playing: null,
  });
}

registerHandler(cardCancelHandler, cardCancel);
