import { Required } from "Object/_api";
import { DIRECTIONS, PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
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
  const tookTurn: string[] = [];
  for (const entity of state.select.entitiesWithComps("monster", "pos")) {
    handleMonster(state, entity, tookTurn);
    tookTurn.push(entity.id);
  }
}

type MonsterEntity = Required<Entity, "monster" | "pos">;

const abilityTargetingFuncs: Record<
  string,
  (state: WrappedState, entity: MonsterEntity) => Pos | null
> = {};

const abilityFuncs: Record<
  string,
  (
    state: WrappedState,
    entity: MonsterEntity,
    target: Pos,
    tookTurn: string[],
  ) => void
> = {};

function handleMonster(
  state: WrappedState,
  entity: MonsterEntity,
  tookTurn: string[],
): void {
  const playerDijkstra = state.raw.playerDijkstra;
  const { pos, monster } = entity;
  const posKey = getPosKey(pos);
  const dist = playerDijkstra.dist[posKey];
  if (!dist) return;
  const attackIsPossible = canAttack(entity, dist, playerDijkstra);
  const moveIsPossible = canMove(state, entity, dist, playerDijkstra);
  const abilityCodeAndTarget = getAbilityCodeAndTarget(state, entity);
  if (isConfused(entity)) {
    doConfusedTurn(state, entity);
  } else if (moveIsPossible && monster.prioritizeDistance) {
    move(state, entity, dist, playerDijkstra);
  } else if (abilityCodeAndTarget) {
    doAbility(state, entity, tookTurn, ...abilityCodeAndTarget);
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

function getAbilityCodeAndTarget(
  state: WrappedState,
  entity: MonsterEntity,
): [string, Pos] | null {
  for (const { code, readyIn } of entity.monster.abilities) {
    if (readyIn <= 0 && abilityTargetingFuncs[code] && abilityFuncs[code]) {
      const target = abilityTargetingFuncs[code](state, entity);
      if (target) return [code, target];
    }
  }
  return null;
}

function doAbility(
  state: WrappedState,
  entity: MonsterEntity,
  tookTurn: string[],
  abilityCode: string,
  target: Pos,
) {
  abilityFuncs[abilityCode](state, entity, target, tookTurn);
  state.act.updateEntity({
    id: entity.id,
    monster: {
      ...entity.monster,
      abilities: entity.monster.abilities.map((a) =>
        a.code === abilityCode ? { ...a, readyIn: a.coolDown + 1 } : a,
      ),
    },
  });
}

function doConfusedTurn(state: WrappedState, entity: MonsterEntity) {
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
  entity: MonsterEntity,
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
  entity: MonsterEntity,
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
  entity: MonsterEntity,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): boolean {
  return (
    !isSlimed(entity) && Boolean(getAttackTargetPos(entity, dist, dijkstra))
  );
}

function canMove(
  state: WrappedState,
  entity: MonsterEntity,
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
  entity: MonsterEntity,
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
  entity: MonsterEntity,
  dist: number,
  dijkstra: RawState["playerDijkstra"],
): Pos | null {
  const { monster, pos } = entity;
  if (dist === 1 && monster.meleeDamage) {
    return dijkstra.prev[getPosKey(pos)] || null;
  } else if (
    dist > 1 &&
    dist <= monster.range &&
    monster.rangedDamage &&
    entity.inFov
  ) {
    let current = pos;
    while (dijkstra.prev[getPosKey(current)]) {
      current = dijkstra.prev[getPosKey(current)];
    }
    return current;
  }
  return null;
}

abilityTargetingFuncs.HEAL = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const inRange3 = (pos: Pos) =>
    playerDijkstra.dist[getPosKey(pos)] || Infinity <= 3;
  if (!inRange3(entity.pos)) return null;
  const targetEntity = state.select
    .entitiesWithComps("monster", "pos", "health")
    .filter((e) => inRange3(e.pos) && e.health.current < e.health.max)
    .sort(
      (a, b) =>
        b.health.max - b.health.current - (a.health.max - a.health.current),
    )[0];
  if (targetEntity) {
    return targetEntity.pos;
  }
  return null;
};

abilityFuncs.HEAL = (state, entity, targetPos) => {
  const target = state.select
    .entitiesAtPosition(targetPos)
    .find((e) => e.health);
  if (!target) return;
  state.act.heal({ entityId: target.id, amount: 2 });

  const actorName = state.select.name(entity.id);
  const targetName = state.select.name(target.id);
  state.act.logMessage({
    message: `${actorName} heals 2 damage from ${targetName}.`,
    type: "enemy",
  });
};

abilityTargetingFuncs.SPAWN_SLIME = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const inRange4 = (pos: Pos) =>
    playerDijkstra.dist[getPosKey(pos)] || Infinity <= 4;
  if (!inRange4(entity.pos)) return null;
  for (const adjacent of getAdjacentPositions(entity.pos).sort(
    (a, b) =>
      (playerDijkstra.dist[getPosKey(a)] || Infinity) -
      (playerDijkstra.dist[getPosKey(b)] || Infinity),
  )) {
    if (!state.select.isPositionBlocked(adjacent)) {
      return adjacent;
    }
  }
  return null;
};

abilityFuncs.SPAWN_SLIME = (state, entity, pos) => {
  state.act.addEntity(
    createEntityFromTemplate("MONSTER_TRAINED_SLIME", { pos }),
  );

  state.act.logMessage({
    message: `${state.select.name(entity.id)} summons a Trained Slime.`,
    type: "enemy",
  });
};

abilityTargetingFuncs.POISON = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  if (playerDijkstra.dist[getPosKey(entity.pos)] !== 1) return null;
  return playerDijkstra.prev[getPosKey(entity.pos)];
};

abilityFuncs.POISON = (state, entity, pos) => {
  state.act.logMessage({
    message: `${state.select.name(entity.id)} poisons Player.`,
    type: "debuff",
  });

  renderer.bump(entity.id, pos);
  state.act.statusEffectAdd({
    entityId: PLAYER_ID,
    type: "POISONED",
    value: 1,
  });
};

abilityTargetingFuncs.CHARGE = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const dist = playerDijkstra.dist[getPosKey(entity.pos)] || Infinity;
  if (dist <= 1 || dist > 4) return null;
  let pos = entity.pos;
  while (true) {
    const next = playerDijkstra.prev[getPosKey(pos)];
    if (!next) return pos;
    if (
      state.select.isPositionBlocked(
        next,
        state.select.entitiesWithComps("wyrm"),
      )
    )
      return null;
    pos = next;
  }
};

abilityFuncs.CHARGE = (state, entity, target) => {
  state.act.logMessage({
    message: `${state.select.name(entity.id)} poisons Player.`,
    type: "debuff",
  });

  const playerDijkstra = state.raw.playerDijkstra;
  let current = entity.pos;
  const path: Pos[] = [];
  while (true) {
    const next = playerDijkstra.prev[getPosKey(current)];
    if (!next) {
      path.pop();
      break;
    } else {
      current = next;
      path.push(next);
    }
  }
  for (const pos of path) {
    state.act.updateEntity({
      id: entity.id,
      pos,
    });
  }
  attack(state, entity, 1, playerDijkstra);
};

abilityTargetingFuncs.SLIME_BOMB = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const dist = playerDijkstra.dist[getPosKey(entity.pos)] || Infinity;
  const adjacentPositions = new Set(
    getAdjacentPositions(entity.pos).map(getPosKey),
  );
  if (dist <= 1 || dist > 3) return null;
  const target = state.select
    .entitiesWithComps("wyrm", "pos")
    .filter((e) => e.wyrm.isPlayer)
    .flatMap((e) => getAdjacentPositions(e.pos))
    .filter(
      (pos) =>
        !adjacentPositions.has(getPosKey(pos)) &&
        !state.select.isPositionBlocked(pos),
    )
    .sort((a, b) => {
      const aDist = Math.abs(a.x - entity.pos.x) + Math.abs(a.y - entity.pos.y);
      const bDist = Math.abs(b.x - entity.pos.x) + Math.abs(b.y - entity.pos.y);
      return aDist - bDist;
    })[0];
  return target || null;
};

abilityFuncs.SLIME_BOMB = (state, entity, target) => {
  state.act.logMessage({
    message: `${state.select.name(entity.id)} throws a Slime Bomb.`,
    type: "enemy",
  });

  const bomb = createEntityFromTemplate("MONSTER_SLIME_BOMB", {
    pos: entity.pos,
  });
  state.act.addEntity(bomb);
  state.act.updateEntity({
    id: bomb.id,
    pos: target,
  });
};

abilityTargetingFuncs.SLIME_EXPLOSION = (state, entity) => entity.pos;

abilityFuncs.SLIME_EXPLOSION = (state, entity, target) => {
  let playerPoisoned = false;

  const positions = [entity.pos, ...getAdjacentPositions(entity.pos)];
  for (const pos of positions) {
    for (const e of state.select.entitiesAtPosition(pos)) {
      if (e.health) {
        state.act.statusEffectAdd({
          entityId: e.id,
          type: "POISONED",
          value: 1,
        });
      }
      if (e.wyrm) playerPoisoned = true;
      if (e.ground && !e.ground.slimy) {
        state.act.removeEntity(e.id);
        state.act.addEntity(
          createEntityFromTemplate("TERRAIN_SLIME", { pos: e.pos }),
        );
      }
    }
  }

  state.act.logMessage({
    message: `${state.select.name(entity.id)} explodes, poisoning ${
      playerPoisoned ? "Player and other creatures" : "all nearby creatures"
    } and covering the area in slime.`,
    type: playerPoisoned ? "debuff" : "enemy",
  });
};

abilityTargetingFuncs.STRENGTHEN = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const inRange3 = (pos: Pos) =>
    playerDijkstra.dist[getPosKey(pos)] || Infinity <= 3;
  if (!inRange3(entity.pos)) return null;
  const targetEntity = state.select
    .entitiesWithComps("monster", "pos")
    .filter(
      (e) =>
        inRange3(e.pos) &&
        (e.monster.meleeDamage || e.monster.rangedDamage) &&
        !(e.statusEffects && e.statusEffects.STRENGTHENED),
    )
    .sort(
      (a, b) =>
        Math.max(b.monster.meleeDamage, b.monster.rangedDamage) -
        Math.max(a.monster.meleeDamage, b.monster.rangedDamage),
    )[0];
  if (targetEntity) {
    return targetEntity.pos;
  }
  return null;
};

abilityFuncs.STRENGTHEN = (state, entity, targetPos, tookTurn) => {
  const target = state.select
    .entitiesAtPosition(targetPos)
    .find((e) => e.monster);
  if (!target) return;
  state.act.statusEffectAdd({
    entityId: target.id,
    type: "STRENGTHENED",
    expiresIn: tookTurn.includes(target.id) ? 2 : 1,
  });

  state.act.logMessage({
    message: `${state.select.name(entity.id)} strengthens ${state.select.name(
      target.id,
    )}, doubling their attack.`,
    type: "enemy",
  });
};

abilityTargetingFuncs.ANTIDOTE = (state, entity) => {
  const playerDijkstra = state.raw.playerDijkstra;
  const inRange3 = (pos: Pos) =>
    playerDijkstra.dist[getPosKey(pos)] || Infinity <= 3;
  if (!inRange3(entity.pos)) return null;
  const targetEntity = state.select
    .entitiesWithComps("monster", "pos", "statusEffects")
    .filter((e) => inRange3(e.pos) && e.statusEffects.POISONED)
    .sort(
      (a, b) =>
        ((b.statusEffects.POISONED && b.statusEffects.POISONED.value) || 1) -
        ((a.statusEffects.POISONED && a.statusEffects.POISONED.value) || 1),
    )[0];
  if (targetEntity) {
    return targetEntity.pos;
  }
  return null;
};

abilityFuncs.ANTIDOTE = (state, entity, targetPos) => {
  const target = state.select
    .entitiesAtPosition(targetPos)
    .find((e) => e.statusEffects && e.statusEffects.POISONED);
  if (!target) return;
  state.act.statusEffectRemove({ entityId: target.id, type: "POISONED" });

  renderer.flashStatusEffect(target.id, "icon-healed");

  state.act.logMessage({
    message: `${state.select.name(entity.id)} cures all of ${state.select.name(
      target.id,
    )}'s poison.`,
    type: "enemy",
  });
};
