import { Required } from "Object/_api";
import { PLAYER_ID } from "~constants";
import { getAdjacentPositions, getPosKey } from "~lib/geometry";
import { Entity, Pos, RawState } from "~types";

export function entityList(state: RawState) {
  return Object.values(state.entities);
}

export function entitiesWithComps<C extends keyof Entity>(
  state: RawState,
  ...comps: C[]
): Required<Entity, C>[] {
  const byComps = comps
    .map((comp) => state.entitiesByComp[comp] || new Set())
    .sort((a, b) => a.size - b.size);
  const [smallest, ...rest] = byComps;
  return Array.from(smallest)
    .filter((id) => rest.every((idSet) => idSet.has(id)))
    .map((id) => state.entities[id]) as Required<Entity, C>[];
}

export function entitiesWithTemplate(state: RawState, template: TemplateName) {
  return entityList(state).filter((e) => e.template === template);
}

export function entityById(state: RawState, entityId: string) {
  return state.entities[entityId];
}

export function player(state: RawState) {
  return state.entities[PLAYER_ID] as Required<
    Entity,
    "pos" | "display" | "conductive"
  > | null;
}

export function playerPos(state: RawState) {
  const entity = player(state);
  return entity ? entity.pos : null;
}

export function entitiesAtPosition(state: RawState, position: Pos) {
  const key = getPosKey(position);
  return Array.from(state.entitiesByPosition[key] || []).map(
    (id) => state.entities[id],
  ) as Required<Entity, "pos">[];
}

export function entitiesAtCursor(state: RawState) {
  const { cursorPos } = state;
  return cursorPos && entitiesAtPosition(state, cursorPos);
}

export function adjacentEntities(state: RawState, position: Pos) {
  return getAdjacentPositions(position).reduce<Entity[]>(
    (entities, adjacentPosition) =>
      entities.concat(entitiesAtPosition(state, adjacentPosition)),
    [],
  );
}

export function isPositionBlocked(
  state: RawState,
  position: Pos,
  exceptEntities: Entity[] = [],
) {
  return entitiesAtPosition(state, position).some(
    (entity) =>
      entity.blocking &&
      entity.blocking.moving &&
      !exceptEntities.includes(entity),
  );
}

export function head(state: RawState) {
  const segments = entitiesWithComps(state, "pos", "wyrm");
  return segments.find((segment) => !segment.wyrm.connectsTo);
}

export function tail(state: RawState) {
  const segments = entitiesWithComps(state, "pos", "wyrm");
  return segments.find((segment) =>
    segments.every((other) => other.wyrm.connectsTo !== segment.id),
  );
}
