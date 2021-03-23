import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Direction } from "~types";
import WrappedState from "~types/WrappedState";
import { getPositionToDirection, isPositionInMap } from "~lib/geometry";

const moveCursor = createStandardAction("MOVE_CURSOR")<Direction>();
export default moveCursor;

function moveCursorHandler(
  state: WrappedState,
  action: ReturnType<typeof moveCursor>,
): void {
  const pos = state.select.cursorPos() || state.select.playerPos();
  if (!pos) return;
  const newPosition = getPositionToDirection(pos, action.payload);
  state.act.setCursorPos(newPosition);
}

registerHandler(moveCursorHandler, moveCursor);
