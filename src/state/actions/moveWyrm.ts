import { createStandardAction } from "typesafe-actions";
import { getPositionToDirection } from "~lib/geometry";
import { registerHandler } from "~state/handleAction";
import { Direction, Entity } from "~types";
import WrappedState from "~types/WrappedState";

const moveWyrm = createStandardAction("MOVE_WYRM")<Direction>();
export default moveWyrm;

function moveWyrmHandler(
  state: WrappedState,
  action: ReturnType<typeof moveWyrm>,
): void {
  const head = state.select.head();
  const tail = state.select.tail();
  if (!head || !tail) return;

  const destination = getPositionToDirection(head.pos, action.payload);
  if (state.select.isPositionBlocked(destination, [tail])) {
    state.act.logMessage({
      message: "Cannot move there. Something is in the way.",
    });
    return;
  }

  let currentSegment: Entity = tail;
  while (true) {
    if (!currentSegment.pos || !currentSegment.wyrm) {
      throw new Error("Invalid wyrm segment was missing pos or wyrm component");
    }
    if (!currentSegment.wyrm.connectsTo) {
      state.act.updateEntity({
        ...currentSegment,
        pos: getPositionToDirection(currentSegment.pos, action.payload),
      });
      state.act.playerTookTurn();
      return;
    } else {
      const next = state.select.entityById(currentSegment.wyrm.connectsTo);
      state.act.updateEntity({
        ...currentSegment,
        pos: next.pos,
      });
      currentSegment = next;
    }
  }
}

registerHandler(moveWyrmHandler, moveWyrm);
