import { Required } from "Object/_api";
import { PLAYER_ID } from "~constants";
import {
  getAdjacentPositions,
  getDirectionToPosition,
  getPosKey,
} from "~lib/geometry";
import renderer from "~renderer";
import { Entity, Monster, Pos, RawState } from "~types";
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
  const attackIsPossible = canAttack(monster, dist, pos, playerDijkstra);
  const moveIsPossible = canMove(state, monster, dist, pos, playerDijkstra);
  if (moveIsPossible && monster.prioritizeDistance) {
    move(state, entity, dist, playerDijkstra);
  } else if (attackIsPossible) {
    attack(state, entity, dist, playerDijkstra);
  } else if (moveIsPossible) {
    move(state, entity, dist, playerDijkstra);
  }
}

function attack(
  state: WrappedState,
  entity: Required<Entity, "monster" | "pos">,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
) {
  const { monster, pos } = entity;

  const targetPos = getAttackTargetPos(monster, dist, pos, dijkstra);
  if (!targetPos) return;

  if (dist === 1) {
    renderer.bump(entity.id, targetPos);
    state.act.damage({
      entityId: PLAYER_ID,
      amount: monster.meleeDamage,
    });
  } else {
    renderer.projectile(pos, targetPos, monster.projectileColor);
    state.act.damage({
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
  const { id: entityId, monster, pos } = entity;
  const destination = getMoveDestination(state, monster, dist, pos, dijkstra);
  const direction = getDirectionToPosition(pos, destination || undefined);
  if (direction) {
    state.act.move({ entityId, direction });
  }
}

function canAttack(
  monster: Monster,
  dist: number,
  pos: Pos,
  dijkstra: RawState["playerDijkstra"],
): boolean {
  return Boolean(getAttackTargetPos(monster, dist, pos, dijkstra));
}

function canMove(
  state: WrappedState,
  monster: Monster,
  dist: number,
  pos: Pos,
  dijkstra: RawState["playerDijkstra"],
): boolean {
  return Boolean(getMoveDestination(state, monster, dist, pos, dijkstra));
}

function getMoveDestination(
  state: WrappedState,
  monster: Monster,
  dist: number,
  pos: Pos,
  dijkstra: RawState["playerDijkstra"],
): Pos | null {
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
  monster: Monster,
  dist: number,
  pos: Pos,
  dijkstra: RawState["playerDijkstra"],
): Pos | null {
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
