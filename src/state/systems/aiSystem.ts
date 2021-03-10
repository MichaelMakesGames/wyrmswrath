import { Required } from "Object/_api";
import { DIRECTIONS, PLAYER_ID } from "~constants";
import {
  getAdjacentPositions,
  getDirectionToPosition,
  getPositionToDirection,
  getPosKey,
} from "~lib/geometry";
import { choose } from "~lib/rng";
import renderer from "~renderer";
import { Entity, Pos, RawState } from "~types";
import WrappedState from "~types/WrappedState";

export default function aiSystem(state: WrappedState): void {
  state.act.calcPlayerDijkstra();
  for (const entity of state.select.entitiesWithComps("monster", "pos")) {
    handleMonster(state, entity);
  }
}

function handleMonster(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
): void {
  const playerDijkstra = state.raw.playerDijkstra;
  const { pos, monster } = entity;
  const posKey = getPosKey(pos);
  const dist = playerDijkstra.dist[posKey];
  if (!dist) return;
  const attackIsPossible = canAttack(entity, dist, playerDijkstra);
  const moveIsPossible = canMove(state, entity, dist, playerDijkstra);
  if (isConfused(entity)) {
    doConfusedTurn(state, entity);
  } else if (moveIsPossible && monster.prioritizeDistance) {
    move(state, entity, dist, playerDijkstra);
  } else if (attackIsPossible) {
    attack(state, entity, dist, playerDijkstra);
  } else if (moveIsPossible) {
    move(state, entity, dist, playerDijkstra);
  }
}

function isSlimed(entity: Entity) {
  return Boolean(entity.statusEffects && entity.statusEffects.SLIMED);
}

function isConfused(entity: Entity) {
  return Boolean(entity.statusEffects && entity.statusEffects.CONFUSED);
}

function isParalyzed(entity: Entity) {
  return Boolean(entity.statusEffects && entity.statusEffects.PARALYZED);
}

function doConfusedTurn(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
) {
  const options: (() => void)[] = [];
  for (const direction of DIRECTIONS) {
    const blockingEntities = state.select.getBlockingEntities(
      getPositionToDirection(entity.pos, direction),
    );
    if (
      blockingEntities.length === 0 &&
      !isParalyzed(entity) &&
      !isSlimed(entity)
    ) {
      options.push(() => state.act.move({ entityId: entity.id, direction }));
    } else if (
      blockingEntities.length === 1 &&
      blockingEntities[0].health &&
      entity.monster.meleeDamage &&
      !isSlimed(entity)
    ) {
      options.push(() => {
        state.act.damage({
          entityId: blockingEntities[0].id,
          amount: entity.monster.meleeDamage,
          actorId: entity.id,
        });
      });
    }
  }
  if (options.length) choose(options)();
}

function attack(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
) {
  const { monster, pos } = entity;

  const targetPos = getAttackTargetPos(entity, dist, dijkstra);
  if (!targetPos) return;

  if (dist === 1) {
    renderer.bump(entity.id, targetPos);
    state.act.damage({
      actorId: entity.id,
      entityId: PLAYER_ID,
      amount: monster.meleeDamage,
    });
  } else {
    renderer.projectile(pos, targetPos, monster.projectileColor);
    state.act.damage({
      actorId: entity.id,
      entityId: PLAYER_ID,
      amount: monster.rangedDamage,
    });
  }
}

function move(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
) {
  const { id: entityId, pos } = entity;
  const destination = getMoveDestination(state, entity, dist, dijkstra);
  const direction = getDirectionToPosition(pos, destination || undefined);
  if (direction) {
    state.act.move({ entityId, direction });
  }
}

function canAttack(
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): boolean {
  return (
    !isSlimed(entity) && Boolean(getAttackTargetPos(entity, dist, dijkstra))
  );
}

function canMove(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): boolean {
  return (
    !isSlimed(entity) &&
    !isParalyzed(entity) &&
    Boolean(getMoveDestination(state, entity, dist, dijkstra))
  );
}

function getMoveDestination(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): Pos | null {
  const { monster, pos } = entity;
  for (const adjacent of getAdjacentPositions(pos)) {
    const adjacentDist = dijkstra.dist[getPosKey(adjacent)];
    if (
      adjacentDist &&
      Math.abs(monster.idealDistance - adjacentDist) <
        Math.abs(monster.idealDistance - dist) &&
      !state.select.isPositionBlocked(adjacent)
    ) {
      return adjacent;
    }
  }
  return null;
}

function getAttackTargetPos(
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): Pos | null {
  const { monster, pos } = entity;
  if (dist === 1 && monster.meleeDamage) {
    return dijkstra.prev[getPosKey(pos)] || null;
  } else if (dist > 1 && dist <= monster.range && monster.rangedDamage) {
    let current = pos;
    while (dijkstra.prev[getPosKey(current)]) {
      current = dijkstra.prev[getPosKey(current)];
    }
    return current;
  }
  return null;
}
