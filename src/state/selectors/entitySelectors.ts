import { Required } from "Object/_api";
import { MAX_ENERGY_PER_SIZE, PLAYER_ID } from "~constants";
import {
  getAdjacentPositions,
  getDirectionToPosition,
  getPosKey,
} from "~lib/geometry";
import { sum } from "~lib/math";
import { Direction, Entity, Pos, RawState } from "~types";

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

export function getBlockingEntities(
  state: RawState,
  position: Pos,
  exceptEntities: Entity[] = [],
) {
  return entitiesAtPosition(state, position).filter(
    (entity) =>
      entity.blocking &&
      entity.blocking.moving &&
      !exceptEntities.includes(entity),
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
  return segments.find(
    (segment) => segment.wyrm.isPlayer && !segment.wyrm.connectsTo,
  );
}

export function tail(state: RawState) {
  const segments = entitiesWithComps(state, "pos", "wyrm");
  return segments.find(
    (segment) =>
      segment.wyrm.isPlayer &&
      segments.every((other) => other.wyrm.connectsTo !== segment.id),
  );
}

export function tailToHead(
  state: RawState,
): Required<Entity, "pos" | "wyrm">[] {
  let current = tail(state);
  const segments: Required<Entity, "pos" | "wyrm">[] = [];
  while (current) {
    segments.push(current);
    const next = entityById(state, current.wyrm.connectsTo || "FAKE_ID");
    if (next && next.wyrm && next.pos) {
      current = next as typeof current;
    } else {
      current = undefined;
    }
  }
  return segments;
}

export function playerDirection(state: RawState): null | Direction {
  const h = head(state);
  if (!h) return null;
  const b1 = entitiesWithComps(state, "wyrm", "pos").find(
    (e) => e.wyrm.connectsTo === h.id,
  );
  if (!b1) return null;
  return getDirectionToPosition(b1.pos, h.pos);
}

export function playerSize(state: RawState): number {
  return entitiesWithComps(state, "wyrm").filter((e) => e.wyrm.isPlayer).length;
}

export function playerHealth(state: RawState): number {
  return sum(
    ...entitiesWithComps(state, "health", "wyrm").map((e) => e.health.current),
  );
}

export function playerMaxHealth(state: RawState): number {
  return sum(
    ...entitiesWithComps(state, "health", "wyrm").map((e) => e.health.max),
  );
}

export function playerEnergy(state: RawState): number {
  return state.energy;
}

export function playerMaxEnergy(state: RawState): number {
  return playerSize(state) * MAX_ENERGY_PER_SIZE;
}

export function name(state: RawState, id: string): string {
  const entity = entityById(state, id);
  return entity.name || "Enemy";
}
