import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
import audio from "~lib/audio";
import { getNonTightDirections, getPositionToDirection } from "~lib/geometry";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { Direction, Entity } from "~types";
import WrappedState from "~types/WrappedState";

const moveWyrm = createStandardAction("MOVE_WYRM")<{
  direction: Direction;
  fast?: boolean;
  tightAllowed?: boolean;
  ignoreSlime?: boolean;
}>();
export default moveWyrm;

function moveWyrmHandler(
  state: WrappedState,
  action: ReturnType<typeof moveWyrm>,
): void {
  const { direction, fast, tightAllowed, ignoreSlime } = action.payload;
  const head = state.select.head();
  const tail = state.select.tail();
  if (!head || !tail) return;

  const playerDirection = state.select.playerDirection();
  const nonTightDirections = getNonTightDirections(playerDirection);
  const wouldBeTightTurn =
    Boolean(playerDirection) && !nonTightDirections.includes(direction);
  if (!tightAllowed && wouldBeTightTurn) {
    state.act.logMessage({
      message: "Cannot make a sharp turn without using the Malleable card.",
      type: "error",
    });
    return;
  }

  const destination = getPositionToDirection(head.pos, direction);
  const blockingEntities = state.select.getBlockingEntities(destination, [
    tail,
  ]);
  if (blockingEntities.length && blockingEntities.some((e) => e.diggable)) {
    state.act.dig(destination);
    audio.play("sfx-dig");
    if (!fast) state.act.playerTookTurn();
    return;
  } else if (
    blockingEntities.length &&
    !blockingEntities.every((e) => e.consumable)
  ) {
    state.act.logMessage({
      message: "Cannot move there. Something is in the way.",
      type: "error",
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
        !ignoreSlime &&
        state.select
          .entitiesAtPosition(destination)
          .some((e) => e.ground && e.ground.slimy) &&
        !(head.statusEffects && head.statusEffects.SLIME_WALK)
      ) {
        state.act.logMessage({
          message:
            "You take an extra turning moving into Slime without Slime Walk",
          type: "debuff",
        });
        state.act.playerTookTurn();
        renderer.flashStatusEffect(PLAYER_ID, "icon-slimed");
        audio.play("sfx-slime");
      }

      audio.play("sfx-move-wyrm");

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
