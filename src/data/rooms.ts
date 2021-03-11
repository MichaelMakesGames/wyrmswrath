export interface Room {
  minSize: number;
  maxSize: number;
  groundWeights: Record<string, number>;
  wallWeights: Record<string, number>;
  enemyWeights: Record<string, number>;
  enemyChance: number;
}

function makeRoom({
  minSize = 5,
  maxSize = Infinity,
  groundWeights = { TERRAIN_GROUND: 1 },
  wallWeights = { TERRAIN_WALL: 1 },
  enemyWeights = {},
  enemyChance = 0.05,
}: Partial<Room>): Room {
  return {
    minSize,
    maxSize,
    groundWeights,
    wallWeights,
    enemyChance,
    enemyWeights,
  };
}

export default {
  LAIR_MIXED: makeRoom({
    minSize: 25,
    groundWeights: {
      TERRAIN_CRYSTAL: 1,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_SLIME: 1,
      TERRAIN_GROUND: 10,
    },
    enemyChance: 0.01,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 1,
      MONSTER_MUSHROOMMAN_BANDIT: 1,
      MONSTER_FERAL_SLIME: 1,
    },
  }),
  LAIR_CRYSTAL: makeRoom({
    maxSize: 25,
    groundWeights: {
      TERRAIN_CRYSTAL: 1,
      TERRAIN_GROUND: 2,
    },
    enemyChance: 0.1,
    enemyWeights: {
      MONSTER_MAD_CRYSTALMAN: 1,
    },
  }),
  LAIR_MUSHROOM: makeRoom({
    maxSize: 25,
    groundWeights: {
      TERRAIN_MUSHROOM: 1,
      TERRAIN_GROUND: 1,
    },
    enemyChance: 0.1,
    enemyWeights: {
      MONSTER_MUSHROOMMAN_BANDIT: 1,
    },
  }),
  LAIR_SLIME: makeRoom({
    maxSize: 25,
    groundWeights: {
      TERRAIN_SLIME: 1,
      TERRAIN_GROUND: 2,
    },
    enemyChance: 0.1,
    enemyWeights: {
      MONSTER_FERAL_SLIME: 1,
    },
  }),
};
