import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
import { getNonTightDirections, getPositionToDirection } from "~lib/geometry";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { Direction, Entity } from "~types";
import WrappedState from "~types/WrappedState";

const moveWyrm = createStandardAction("MOVE_WYRM")<{
  direction: Direction;
  fast?: boolean;
  tightAllowed?: boolean;
}>();
export default moveWyrm;

function moveWyrmHandler(
  state: WrappedState,
  action: ReturnType<typeof moveWyrm>,
): void {
  const { direction, fast, tightAllowed } = action.payload;
  const head = state.select.head();
  const tail = state.select.tail();
  if (!head || !tail) return;

  const playerDirection = state.select.playerDirection();
  const nonTightDirections = getNonTightDirections(playerDirection);
  const wouldBeTightTurn = !nonTightDirections.includes(direction);
  if (!tightAllowed && wouldBeTightTurn) {
    state.act.logMessage({
      message: "Cannot take a tight turn without using the Malleable card.",
    });
    return;
  }

  const destination = getPositionToDirection(head.pos, direction);
  const blockingEntities = state.select.getBlockingEntities(destination, [
    tail,
  ]);
  if (blockingEntities.length && blockingEntities.some((e) => e.diggable)) {
    state.act.dig(destination);
    if (!fast) state.act.playerTookTurn();
    return;
  } else if (
    blockingEntities.length &&
    !blockingEntities.every((e) => e.consumable)
  ) {
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
        pos: destination,
      });
      state.act.consume();
      if (!fast) state.act.playerTookTurn();

      if (
        state.select
          .entitiesAtPosition(destination)
          .some((e) => e.ground && e.ground.slimy) &&
        !(head.statusEffects && head.statusEffects.SLIME_WALK)
      ) {
        state.act.logMessage({
          message:
            "You take an extra turning moving into Slime without Slime Walk",
        });
        state.act.playerTookTurn();
        renderer.flashStatusEffect(PLAYER_ID, "icon-slimed");
      }

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
