import prefabs, { Prefab } from "./prefabs";

export interface Room {
  minSize: number;
  maxSize: number;
  groundWeights: Record<string, number>;
  wallWeights: Record<string, number>;
  enemiesPerTile: number;
  enemyWeights: Record<string, number>;
  prefabs: { prefab: Prefab; attempts: number }[];
}

function makeRoom({
  minSize = 5,
  maxSize = Infinity,
  groundWeights = { TERRAIN_GROUND: 1 },
  wallWeights = { TERRAIN_WALL: 1 },
  enemiesPerTile = 0,
  enemyWeights = {},
  // eslint-disable-next-line no-shadow
  prefabs = [],
}: Partial<Room>): Room {
  return {
    minSize,
    maxSize,
    groundWeights,
    wallWeights,
    enemiesPerTile,
    enemyWeights,
    prefabs,
  };
}

export default {
  LAIR_MIXED: makeRoom({
    groundWeights: {
      TERRAIN_CRYSTAL: 1,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_SLIME: 1,
      TERRAIN_GROUND: 10,
    },
    enemiesPerTile: 0.01,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 1,
      MONSTER_MUSHROOMMAN_BANDIT: 1,
      MONSTER_FERAL_SLIME: 1,
    },
  }),
  LAIR_CRYSTAL: makeRoom({
    groundWeights: {
      TERRAIN_CRYSTAL: 1,
      TERRAIN_GROUND: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 5,
      MONSTER_MUSHROOMMAN_BANDIT: 1,
      MONSTER_FERAL_SLIME: 1,
    },
    prefabs: [{ prefab: prefabs.CRYSTAL_HOARD_SMALL, attempts: 3 }],
  }),
  LAIR_MUSHROOM: makeRoom({
    groundWeights: {
      TERRAIN_MUSHROOM: 1,
      TERRAIN_GROUND: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 1,
      MONSTER_MUSHROOMMAN_BANDIT: 5,
      MONSTER_FERAL_SLIME: 1,
    },
    prefabs: [{ prefab: prefabs.MUSHROOM_HOARD_SMALL, attempts: 3 }],
  }),
  LAIR_SLIME: makeRoom({
    groundWeights: {
      TERRAIN_SLIME: 1,
      TERRAIN_GROUND: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 1,
      MONSTER_MUSHROOMMAN_BANDIT: 1,
      MONSTER_FERAL_SLIME: 5,
    },
    prefabs: [{ prefab: prefabs.SLIME_HOARD_SMALL, attempts: 3 }],
  }),
};
