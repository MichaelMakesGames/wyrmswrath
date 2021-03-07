import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~/constants";
import { getPositionToDirection } from "~lib/geometry";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { Direction } from "~types";
import WrappedState from "~types/WrappedState";

const move = createStandardAction("MOVE")<{
  entityId: string;
  direction: Direction;
}>();
export default move;

function moveHandler(
  state: WrappedState,
  action: ReturnType<typeof move>,
): void {
  const entity = state.select.entityById(action.payload.entityId);
  const { pos } = entity;
  if (!pos) {
    return;
  }
  const newPosition = getPositionToDirection(pos, action.payload.direction);
  const entitiesAtNewPosition = state.select.entitiesAtPosition(newPosition);
  if (
    entity.blocking &&
    entitiesAtNewPosition.some((other) => Boolean(other.blocking))
  ) {
    return;
  }
  state.act.updateEntity({
    id: entity.id,
    pos: newPosition,
  });
  if (entity.id === PLAYER_ID) {
    if (state.select.cursorPos() && renderer.isZoomedIn()) {
      state.act.moveCursor(action.payload.direction);
    }
    state.act.playerTookTurn();
  }
}

registerHandler(moveHandler, move);
