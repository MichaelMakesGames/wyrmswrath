import colors from "~colors";
import { PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import {
  getAdjacentPositions,
  getNonTightDirections,
  getTightDirections,
  getPositionToDirection,
  getPosKey,
  parsePosKey,
} from "~lib/geometry";
import { rangeTo } from "~lib/math";
import { choose } from "~lib/rng";
import renderer from "~renderer";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import { Direction, Entity } from "~types";
import type WrappedState from "~types/WrappedState";

export type CardCode =
  | "CRYSTAL_CHARGE"
  | "CRYSTAL_CRYSTALIZE"
  | "CRYSTAL_ELEGANCE"
  | "CRYSTAL_FLASH"
  | "CRYSTAL_JAVELIN"
  | "CRYSTAL_RAZOR_SKIN"
  | "CRYSTAL_ROCK_HARD"
  | "CRYSTAL_SPIKED_TAIL"
  | "MUSHROOM_ANTIDOTE"
  | "MUSHROOM_GROWTH"
  | "MUSHROOM_HALLUCINOGENIC_SPORES"
  | "MUSHROOM_HEAL"
  | "MUSHROOM_OPEN_YOUR_MIND"
  | "MUSHROOM_PARALYZING_SPORES"
  | "MUSHROOM_SEEDING_SPORES"
  | "MUSHROOM_STRENGTHEN"
  | "SLIME_MALLEABLE"
  | "SLIME_MUTATE"
  | "SLIME_OOZE"
  | "SLIME_POISON_SKIN"
  | "SLIME_SHAPE_SHIFTING"
  | "SLIME_SLIME_WALK"
  | "SLIME_TOXICITY"
  | "SLIME_VOMIT";

export interface Card {
  code: CardCode;
  name: string;
  sfx?: string;
  preDiscard?: boolean;
  type: "mushroom" | "crystal" | "slime";
  validator?: (
    state: WrappedState,
    direction?: Direction,
  ) => { valid: boolean; message?: string };
  effect: (state: WrappedState, direction?: Direction) => void;
  fast?: boolean;
  directional?: boolean;
}

const cards: Record<CardCode, Card> = {
  CRYSTAL_CHARGE: {
    code: "CRYSTAL_CHARGE",
    name: "Charge",
    type: "crystal",
    directional: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;
      let distance = 0;
      let pos = origin;
      while (true) {
        pos = getPositionToDirection(pos, direction);
        const entities = state.select.entitiesAtPosition(pos);
        if (entities.some((e) => e.monster)) {
          distance++;
          break;
        } else if (entities.some((e) => e.blocking)) {
          break;
        } else {
          distance++;
        }
      }
      rangeTo(distance).forEach(() =>
        state.act.moveWyrm({ direction, fast: true, ignoreSlime: true }),
      );
    },
  },
  CRYSTAL_CRYSTALIZE: {
    code: "CRYSTAL_CRYSTALIZE",
    name: "Crystalize",
    type: "crystal",
    directional: true,
    fast: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;
      let pos = origin;
      rangeTo(state.select.playerSize()).forEach(() => {
        pos = getPositionToDirection(pos, direction);
        const entitiesAtPosition = state.select.entitiesAtPosition(pos);

        entitiesAtPosition
          .filter((e) => e.monster)
          .forEach((e) =>
            state.act.statusEffectAdd({
              entityId: e.id,
              type: "PARALYZED",
              expiresIn: 2,
            }),
          );

        const groundAtPosition = entitiesAtPosition.find((e) => e.ground);
        if (groundAtPosition) {
          state.act.removeEntity(groundAtPosition.id);
          state.act.addEntity(
            createEntityFromTemplate("TERRAIN_CRYSTAL", { pos }),
          );
        }
      });
    },
  },
  CRYSTAL_ELEGANCE: {
    code: "CRYSTAL_ELEGANCE",
    name: "Elegance",
    type: "crystal",
    fast: true,
    effect: (state) => {
      const currentHandSize = state.raw.hand.length;
      if (currentHandSize) {
        // played card is discarded before resolving the effect
        state.act.cardRemoveFromHand(choose(rangeTo(currentHandSize)));
      }
      state.act.cardDraw(1);
    },
  },
  CRYSTAL_FLASH: {
    code: "CRYSTAL_FLASH",
    name: "Flash",
    type: "crystal",
    fast: true,
    directional: true,
    validator: (state, direction) =>
      direction && state.select.wyrmCanMove(direction)
        ? { valid: true }
        : { valid: false, message: "Must play in a wide-angled direction." },
    effect: (state, direction) => {
      if (direction) {
        state.act.moveWyrm({ direction, fast: true });
        wyrmDisplaySystem(state);
      }
    },
  },
  CRYSTAL_JAVELIN: {
    code: "CRYSTAL_JAVELIN",
    sfx: "sfx-crystal-ranged",
    name: "Javelin",
    type: "crystal",
    directional: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;

      const damage = state.select.playerSize();
      let pos = origin;
      let speed = 0;
      while (true) {
        pos = getPositionToDirection(pos, direction);
        speed++;
        const entitiesAtPosition = state.select.entitiesAtPosition(pos);
        entitiesAtPosition.forEach((e) => {
          if (e.health) {
            state.act.damage({
              entityId: e.id,
              amount: damage,
              actorId: PLAYER_ID,
            });
          }
        });
        if (entitiesAtPosition.some((e) => e.blocking && !e.health)) {
          renderer.projectile(origin, pos, colors.blue, speed);
          break;
        }
      }
    },
  },
  CRYSTAL_RAZOR_SKIN: {
    code: "CRYSTAL_RAZOR_SKIN",
    name: "Razor Skin",
    type: "crystal",
    effect: (state) =>
      getAdjacentMonsters(state).forEach((e) =>
        state.act.damage({
          entityId: e.id,
          amount: Math.round(state.select.playerSize() / 2),
          actorId: PLAYER_ID,
        }),
      ),
  },
  CRYSTAL_ROCK_HARD: {
    code: "CRYSTAL_ROCK_HARD",
    name: "Rock Hard",
    type: "crystal",
    fast: true,
    effect: (state: WrappedState) =>
      state.act.statusEffectAdd({
        entityId: PLAYER_ID,
        type: "ARMORED",
        value: state.select.playerSize(),
        expiresIn: 1,
      }),
  },
  CRYSTAL_SPIKED_TAIL: {
    code: "CRYSTAL_SPIKED_TAIL",
    name: "Spiked Tail",
    type: "crystal",
    effect: (state) => {
      const tail = state.select.tail();
      const pos = tail && tail.pos;
      if (!pos) return;
      for (const adjacent of getAdjacentPositions(pos)) {
        for (const entity of state.select
          .entitiesAtPosition(adjacent)
          .filter((e) => e.pos && e.health)) {
          state.act.damage({
            entityId: entity.id,
            amount: state.select.playerSize(),
            actorId: PLAYER_ID,
          });
        }
      }
    },
  },
  MUSHROOM_ANTIDOTE: {
    code: "MUSHROOM_ANTIDOTE",
    name: "Antidote",
    type: "mushroom",
    fast: true,
    effect: (state) =>
      state.act.statusEffectRemove({
        entityId: PLAYER_ID,
        type: "POISONED",
      }),
  },
  MUSHROOM_GROWTH: {
    code: "MUSHROOM_GROWTH",
    name: "Growth",
    type: "mushroom",
    directional: true,
    validator: (state, direction) =>
      wideAngleNotBlocked(state, direction, true),
    effect: (state, direction) => {
      const oldTail = state.select.tail();
      if (!oldTail || !direction) return;
      state.act.moveWyrm({ direction, fast: true });
      state.act.addEntity(
        createEntityFromTemplate("WYRM", {
          pos: oldTail.pos,
          wyrm: { isPlayer: true, connectsTo: oldTail.id },
        }),
      );
    },
  },
  MUSHROOM_HALLUCINOGENIC_SPORES: {
    code: "MUSHROOM_HALLUCINOGENIC_SPORES",
    name: "Dazing Spores",
    type: "mushroom",
    effect: (state) =>
      getMonstersWithinRange(state, 3).forEach((e) =>
        state.act.statusEffectAdd({
          entityId: e.id,
          type: "CONFUSED",
          expiresIn: 5,
        }),
      ),
  },
  MUSHROOM_HEAL: {
    code: "MUSHROOM_HEAL",
    name: "Heal",
    type: "mushroom",
    fast: true,
    effect: (state) => {
      state.act.heal({
        entityId: PLAYER_ID,
        amount: state.select.playerSize() * 2,
      });
      state.act.statusEffectRemove({
        entityId: PLAYER_ID,
        type: "POISONED",
        value: 1,
      });
    },
  },
  MUSHROOM_OPEN_YOUR_MIND: {
    code: "MUSHROOM_OPEN_YOUR_MIND",
    name: "Open Your Mind",
    type: "mushroom",
    fast: true,
    preDiscard: true,
    effect: (state) => state.act.cardDraw(2),
  },
  MUSHROOM_PARALYZING_SPORES: {
    code: "MUSHROOM_PARALYZING_SPORES",
    name: "Paralyzing Spores",
    type: "mushroom",
    effect: (state) =>
      getMonstersWithinRange(state, 5).forEach((e) =>
        state.act.statusEffectAdd({
          entityId: e.id,
          type: "PARALYZED",
          expiresIn: 3,
        }),
      ),
  },
  MUSHROOM_SEEDING_SPORES: {
    code: "MUSHROOM_SEEDING_SPORES",
    name: "Breath of Life",
    type: "mushroom",
    directional: true,
    fast: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;
      let pos = origin;
      rangeTo(state.select.playerSize()).forEach(() => {
        pos = getPositionToDirection(pos, direction);
        const groundAtPosition = state.select
          .entitiesAtPosition(pos)
          .find((e) => e.ground);
        if (groundAtPosition) {
          state.act.removeEntity(groundAtPosition.id);
          state.act.addEntity(
            createEntityFromTemplate("TERRAIN_MUSHROOM", { pos }),
          );
        }
      });
    },
  },
  MUSHROOM_STRENGTHEN: {
    code: "MUSHROOM_STRENGTHEN",
    name: "Strengthen",
    type: "mushroom",
    fast: true,
    effect: (state) =>
      state.act.statusEffectAdd({
        entityId: PLAYER_ID,
        type: "STRENGTHENED",
        expiresIn: 3,
      }),
  },
  SLIME_MALLEABLE: {
    code: "SLIME_MALLEABLE",
    name: "Malleable",
    type: "slime",
    directional: true,
    validator: tightAngleNotBlocked,
    effect: (state, direction) => {
      if (!direction) return;
      state.act.moveWyrm({ direction, fast: true, tightAllowed: true });
    },
  },
  SLIME_MUTATE: {
    code: "SLIME_MUTATE",
    name: "Mutate",
    type: "slime",
    fast: true,
    effect: (state) =>
      state.act.cardAddToHand({
        cardCode: choose(Object.values(cards)).code,
        clearProgress: false,
      }),
  },
  SLIME_OOZE: {
    code: "SLIME_OOZE",
    name: "Ooze",
    type: "slime",
    fast: true,
    effect: (state) =>
      getPlayerAdjacentPositions(state).forEach((pos) => {
        const ground = state.select
          .entitiesAtPosition(pos)
          .find((e) => e.ground);
        if (ground) {
          state.act.removeEntity(ground.id);
          state.act.addEntity(
            createEntityFromTemplate("TERRAIN_SLIME", { pos }),
          );
        }
        const monster = state.select
          .entitiesAtPosition(pos)
          .find((e) => e.monster);
        if (
          monster &&
          !(monster.statusEffects && monster.statusEffects.SLIME_WALK)
        ) {
          state.act.statusEffectAdd({
            entityId: monster.id,
            type: "SLIMED",
            expiresIn: 1,
          });
        }
      }),
  },
  SLIME_POISON_SKIN: {
    code: "SLIME_POISON_SKIN",
    name: "Poison Skin",
    type: "slime",
    effect: (state) =>
      getAdjacentMonsters(state).forEach((entity) =>
        state.act.statusEffectAdd({
          entityId: entity.id,
          type: "POISONED",
          value: 1,
        }),
      ),
  },
  SLIME_SHAPE_SHIFTING: {
    code: "SLIME_SHAPE_SHIFTING",
    name: "Shape Shifting",
    type: "slime",
    fast: true,
    effect: (state) => {
      const tail = state.select.tail();
      if (!tail) return;
      const segments: Entity[] = [tail];
      let done = false;
      while (!done) {
        const previous = segments[segments.length - 1];
        if (!previous.wyrm || !previous.wyrm.connectsTo) {
          done = true;
        } else {
          const next = state.select.entityById(previous.wyrm.connectsTo);
          segments.push(next);
        }
      }
      const positionsReversed = segments.map((s) => s.pos).reverse();
      segments.forEach((segment, i) => {
        state.act.updateEntity({
          ...segment,
          pos: positionsReversed[i],
        });
      });
      wyrmDisplaySystem(state);
    },
  },
  SLIME_SLIME_WALK: {
    code: "SLIME_SLIME_WALK",
    name: "Slime Walk",
    type: "slime",
    fast: true,
    effect: (state) =>
      state.act.statusEffectAdd({
        entityId: PLAYER_ID,
        type: "SLIME_WALK",
        expiresIn: 10,
      }),
  },
  SLIME_TOXICITY: {
    code: "SLIME_TOXICITY",
    name: "Toxicity",
    type: "slime",
    effect: (state) =>
      getMonstersWithinRange(state, 3)
        .filter((e) =>
          state.select
            .entitiesAtPosition(e.pos)
            .some((other) => other.ground && other.ground.slimy),
        )
        .forEach((e) =>
          state.act.statusEffectAdd({
            entityId: e.id,
            type: "POISONED",
            value: 1,
          }),
        ),
  },
  SLIME_VOMIT: {
    code: "SLIME_VOMIT",
    name: "Vomit",
    type: "slime",
    directional: true,
    fast: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;
      let pos = origin;
      rangeTo(state.select.playerSize()).forEach(() => {
        pos = getPositionToDirection(pos, direction);
        const entitiesAtPosition = state.select.entitiesAtPosition(pos);

        const groundAtPosition = entitiesAtPosition.find((e) => e.ground);
        if (groundAtPosition) {
          state.act.removeEntity(groundAtPosition.id);
          state.act.addEntity(
            createEntityFromTemplate("TERRAIN_SLIME", { pos }),
          );
        }

        entitiesAtPosition
          .filter((e) => e.monster)
          .forEach((e) =>
            state.act.statusEffectAdd({
              entityId: e.id,
              type: "POISONED",
              value: 1,
            }),
          );

        const nonSlimeWalkingMonsterAtPosition = entitiesAtPosition.find(
          (e) => e.monster && !(e.statusEffects && e.statusEffects.SLIME_WALK),
        );
        if (nonSlimeWalkingMonsterAtPosition) {
          state.act.statusEffectAdd({
            entityId: nonSlimeWalkingMonsterAtPosition.id,
            type: "SLIMED",
            expiresIn: 1,
          });
        }
      });
    },
  },
};

export default cards;

function wideAngleOnly(state: WrappedState, direction: Direction | undefined) {
  const validDirections = getNonTightDirections(state.select.playerDirection());
  if (validDirections.includes(direction || "")) {
    return { valid: true };
  } else {
    return {
      valid: false,
      message: `Must target a wide-angled direction (${validDirections.join(
        ", ",
      )}).`,
    };
  }
}

function tightAngleOnly(state: WrappedState, direction: Direction | undefined) {
  const validDirections = getTightDirections(state.select.playerDirection());
  if (validDirections.includes(direction || "")) {
    return { valid: true };
  } else {
    return {
      valid: false,
      message: `Must target a tight-angled direction (${validDirections.join(
        ", ",
      )}).`,
    };
  }
}

function notBlocked(
  state: WrappedState,
  direction: Direction | undefined,
  tailBlocks?: boolean,
) {
  const head = state.select.head();
  const tail = state.select.tail();
  const origin = head && head.pos;
  if (!origin || !direction || !tail) return { valid: false };
  const destination = getPositionToDirection(origin, direction);
  if (
    state.select.isPositionBlocked(destination, [
      ...(tailBlocks ? [] : [tail]),
      ...state.select.entitiesWithComps("consumable"),
    ])
  ) {
    return { valid: false, message: "Position is blocked." };
  } else {
    return { valid: true };
  }
}

function wideAngleNotBlocked(
  state: WrappedState,
  direction: Direction | undefined,
  tailBlocks?: boolean,
) {
  if (!wideAngleOnly(state, direction).valid)
    return wideAngleOnly(state, direction);
  return notBlocked(state, direction, tailBlocks);
}

function tightAngleNotBlocked(
  state: WrappedState,
  direction: Direction | undefined,
  tailBlocks?: boolean,
) {
  if (!tightAngleOnly(state, direction).valid)
    return tightAngleOnly(state, direction);
  return notBlocked(state, direction, tailBlocks);
}

function getPlayerAdjacentPositions(state: WrappedState) {
  const segments = state.select
    .entitiesWithComps("pos", "wyrm")
    .filter((e) => e.wyrm.isPlayer);
  const wyrmPositions = new Set<string>(
    segments.map((segment) => getPosKey(segment.pos)),
  );
  const positions = new Set<string>();
  for (const segment of segments) {
    for (const adjacent of getAdjacentPositions(segment.pos)) {
      const posKey = getPosKey(adjacent);
      if (!wyrmPositions.has(posKey)) {
        positions.add(getPosKey(adjacent));
      }
    }
  }
  return Array.from(positions).map(parsePosKey);
}

function getAdjacentMonsters(state: WrappedState) {
  const positions = new Set(getPlayerAdjacentPositions(state).map(getPosKey));
  return state.select
    .entitiesWithComps("monster", "pos")
    .filter((e) => positions.has(getPosKey(e.pos)));
}

function getMonstersWithinRange(state: WrappedState, range: number) {
  state.act.calcPlayerDijkstra();
  const positions = new Set(
    Object.entries(state.raw.playerDijkstra.dist)
      .filter(([posKey, distance]) => distance <= range)
      .map(([posKey]) => posKey),
  );
  return state.select
    .entitiesWithComps("pos", "monster")
    .filter((e) => positions.has(getPosKey(e.pos)));
}
