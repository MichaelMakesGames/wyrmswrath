import levels from "~data/levels";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";
import generateMap from "./generateMap";
import { getPositionToDirection } from "./geometry";

export default function makeLevel(state: WrappedState): WrappedState {
  state.act.removeEntities(
    state.select
      .entityList()
      .filter((e) => e.pos && !(e.wyrm && e.wyrm.isPlayer))
      .map((e) => e.id),
  );

  const { start, entities } = generateMap(levels[state.raw.level]);
  for (const entity of entities) {
    state.act.addEntity(entity);
  }

  const head = state.select.head();
  if (head && start) {
    let currentSegment: undefined | Entity = head;
    let currentPos = getPositionToDirection(start, "NW");
    while (currentSegment && currentSegment.wyrm) {
      state.act.dig(currentPos);
      state.act.updateEntity({
        id: currentSegment.id,
        pos: currentPos,
      });
      currentSegment = findPreviousSegment(state, currentSegment.id);
      currentPos = getPositionToDirection(currentPos, "NW");
    }
  }
  return state;
}

function findPreviousSegment(state: WrappedState, currentSegmentId: string) {
  return state.select
    .entitiesWithComps("wyrm")
    .find((e) => e.wyrm.connectsTo === currentSegmentId);
}
