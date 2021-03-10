import colors from "~colors";
import { PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import {
  getAdjacentPositions,
  getNonTightDirections,
  getPositionToDirection,
  getPosKey,
} from "~lib/geometry";
import { rangeTo } from "~lib/math";
import { choose } from "~lib/rng";
import renderer from "~renderer";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import { Direction } from "~types";
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
  type: "mushroom" | "crystal" | "slime";
  description: string;
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
    description:
      "Rush forward into the first enemy, consuming them, or until you make you reach a wall.",
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
      const needsSlimeWalk = !(
        head &&
        head.statusEffects &&
        head.statusEffects.SLIME_WALK
      );
      if (needsSlimeWalk)
        state.act.statusEffectAdd({
          entityId: PLAYER_ID,
          type: "SLIME_WALK",
          expiresIn: 1,
        });
      rangeTo(distance).forEach(() =>
        state.act.moveWyrm({ direction, fast: true }),
      );
    },
  },
  CRYSTAL_CRYSTALIZE: {
    code: "CRYSTAL_CRYSTALIZE",
    name: "Crystalize",
    type: "crystal",
    description:
      "Turn a line of SIZE tiles into sharp Crystal terrain, which increases damage received.",
    directional: true,
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
    description: "Permanently lose a random card from your hand.",
    fast: true,
    effect: (state) => {
      const currentHandSize = state.raw.hand.length;
      if (currentHandSize) {
        // played card is discarded before resolving the effect
        state.act.cardRemoveFromHand(choose(rangeTo(currentHandSize)));
      }
    },
  },
  CRYSTAL_FLASH: {
    code: "CRYSTAL_FLASH",
    name: "Flash",
    type: "crystal",
    description: "Make a move without taking a turn.",
    fast: true,
    directional: true,
    validator: wideAngleNotBlocked,
    effect: (state, direction) => {
      if (direction) {
        state.act.moveWyrm({ direction, fast: true });
        wyrmDisplaySystem(state);
      }
    },
  },
  CRYSTAL_JAVELIN: {
    code: "CRYSTAL_JAVELIN",
    name: "Javelin",
    type: "crystal",
    description:
      "Launch a crystal that hits all enemies in it's path for SIZE-1 damage.",
    directional: true,
    validator: wideAngleOnly,
    effect: (state, direction) => {
      const head = state.select.head();
      const origin = head && head.pos;
      if (!origin || !direction) return;

      const damage = state.select.playerSize() - 1;
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
          renderer.projectile(origin, pos, colors.water, speed);
          break;
        }
      }
    },
  },
  CRYSTAL_RAZOR_SKIN: {
    code: "CRYSTAL_RAZOR_SKIN",
    name: "Razor Skin",
    type: "crystal",
    description: "Deal 1 damage to all adjacent enemies.",
    effect: (state) =>
      getAdjacentMonsters(state).forEach((e) =>
        state.act.damage({ entityId: e.id, amount: 1, actorId: PLAYER_ID }),
      ),
  },
  CRYSTAL_ROCK_HARD: {
    code: "CRYSTAL_ROCK_HARD",
    name: "Rock Hard",
    type: "crystal",
    description: "Gain 1 Armor for SIZE turns",
    effect: (state: WrappedState) =>
      state.act.statusEffectAdd({
        entityId: PLAYER_ID,
        type: "ARMORED",
        value: 1,
        expiresIn: state.select.playerSize(),
      }),
  },
  CRYSTAL_SPIKED_TAIL: {
    code: "CRYSTAL_SPIKED_TAIL",
    name: "Spiked Tail",
    type: "crystal",
    description: "Deal SIZE damage to all enemies adjacent to your tail.",
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
    description: "Cure all Poison.",
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
    description: "Increase your size, gaining health and maximum energy.",
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
    name: "Hallucinogenic Spores",
    type: "mushroom",
    description:
      "Confuse all enemies within 2 tiles for 3 turns, so they randomly move and attack.",
    effect: (state) =>
      getMonstersWithinRange(state, 2).forEach((e) =>
        state.act.statusEffectAdd({
          entityId: e.id,
          type: "CONFUSED",
          expiresIn: 3,
        }),
      ),
  },
  MUSHROOM_HEAL: {
    code: "MUSHROOM_HEAL",
    name: "Heal",
    type: "mushroom",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_OPEN_YOUR_MIND: {
    code: "MUSHROOM_OPEN_YOUR_MIND",
    name: "Open Your Mind",
    type: "mushroom",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_PARALYZING_SPORES: {
    code: "MUSHROOM_PARALYZING_SPORES",
    name: "Paralyzing Spores",
    type: "mushroom",
    description:
      "Paralyze all enemies within 2 tiles for 3 turns, so they can't move (but can still attack).",
    effect: (state) =>
      getMonstersWithinRange(state, 2).forEach((e) =>
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
    description: "Turn a line of SIZE tiles into healing Mushroom terrain.",
    directional: true,
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
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_MALLEABLE: {
    code: "SLIME_MALLEABLE",
    name: "Malleable",
    type: "slime",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_MUTATE: {
    code: "SLIME_MUTATE",
    name: "Mutate",
    type: "slime",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_OOZE: {
    code: "SLIME_OOZE",
    name: "Ooze",
    type: "slime",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_POISON_SKIN: {
    code: "SLIME_POISON_SKIN",
    name: "Poison Skin",
    type: "slime",
    description: "Poison all adjacent enemies",
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
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_SLIME_WALK: {
    code: "SLIME_SLIME_WALK",
    name: "Slime Walk",
    type: "slime",
    description:
      "Gain Slime Walk (do not lose a turn moving into Slime) for 10 turns",
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
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_VOMIT: {
    code: "SLIME_VOMIT",
    name: "Vomit",
    type: "slime",
    description: "TODO",
    effect: (state) => state.act.logMessage({ message: "TODO" }),
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

function getAdjacentMonsters(state: WrappedState) {
  const positions = new Set<string>();
  for (const segment of state.select
    .entitiesWithComps("pos", "wyrm")
    .filter((e) => e.wyrm)) {
    for (const adjacent of getAdjacentPositions(segment.pos)) {
      positions.add(getPosKey(adjacent));
    }
  }

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
