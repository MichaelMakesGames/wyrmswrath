import levels from "~data/levels";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import { Direction, Entity, Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "./entities";
import generateMap from "./generateMap";
import generatePalace from "./generatePalace";
import { getPositionToDirection, getRelativePosition } from "./geometry";

export default function makeLevel(state: WrappedState): WrappedState {
  state.act.removeEntities(
    state.select
      .entityList()
      .filter((e) => e.pos && !(e.wyrm && e.wyrm.isPlayer))
      .map((e) => e.id),
  );

  if (state.raw.level === levels.length - 1) {
    generatePalace(state);
    return state;
  }

  const { start, entities } = generateMap(levels[state.raw.level]);
  for (const entity of entities) {
    state.act.addEntity(entity);
  }

  const head = state.select.head();
  if (head && start) {
    if (state.select.level() === 0) {
      generateNest(state, start);
    } else {
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
  }
  return state;
}

function findPreviousSegment(state: WrappedState, currentSegmentId: string) {
  return state.select
    .entitiesWithComps("wyrm")
    .find((e) => e.wyrm.connectsTo === currentSegmentId);
}

function generateNest(state: WrappedState, origin: Pos) {
  const entitiesToRemove: string[] = [];
  for (const pos of [
    [],
    ["N"],
    ["NE"],
    ["SE"],
    ["S"],
    ["SW"],
    ["NW"],
    ["N", "N"],
    ["N", "NE"],
    ["NE", "NE"],
    ["NE", "SE"],
    ["SE", "SE"],
    ["S", "SE"],
    ["S", "S"],
    ["S", "SW"],
    ["SW", "SW"],
    ["NW", "SW"],
    ["NW", "NW"],
    ["N", "NW"],
  ].map((dirs) => getRelativePosition(origin, dirs as Direction[]))) {
    state.act.dig(pos);
    entitiesToRemove.push(
      ...state.select
        .entitiesAtPosition(pos)
        .filter((e) => !e.wyrm)
        .map((e) => e.id),
    );
    state.act.addEntity(createEntityFromTemplate("TERRAIN_GROUND", { pos }));
  }
  state.act.removeEntities(entitiesToRemove);

  state.select
    .entitiesWithComps("wyrm")
    .forEach((e) => state.act.updateEntity({ id: e.id, pos: origin }));
  state.act.addEntity(
    createEntityFromTemplate("DECORATION_EGG_HATCHED", { pos: origin }),
  );

  const skeleton: Entity[] = [];
  let previous: null | Entity = null;
  for (const pos of ["S", "SE", "NE", "N", "NW", "SW"].map((d) =>
    getPositionToDirection(origin, d as Direction),
  )) {
    const segment = createEntityFromTemplate("WYRM", {
      pos,
      wyrm: { isPlayer: false, connectsTo: previous ? previous.id : undefined },
    });
    state.act.addEntity(segment);
    skeleton.push(segment);
    previous = segment;
  }
  wyrmDisplaySystem(state);
  // remove the wyrm component just to be safe
  skeleton.forEach(({ id }) =>
    state.act.updateEntity({
      id,
      wyrm: undefined,
      blocking: undefined,
      health: undefined,
    }),
  );
}
