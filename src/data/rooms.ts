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
      TERRAIN_GROUND: 6,
    },
    enemiesPerTile: 0.05,
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

  FRONTIER_SLIME: makeRoom({
    groundWeights: {
      TERRAIN_SLIME: 3,
      TERRAIN_GROUND: 3,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_CRYSTAL: 1,
    },
    enemiesPerTile: 0.05,
    enemyWeights: {
      MONSTER_SLIME_TAMER: 2,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [{ prefab: prefabs.SLIME_HOARD_SMALL, attempts: 2 }],
  }),
  FRONTIER_CRYSTAL: makeRoom({
    groundWeights: {
      TERRAIN_CRYSTAL: 3,
      TERRAIN_GROUND: 3,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_SLIME: 1,
    },
    enemiesPerTile: 0.05,
    enemyWeights: {
      MONSTER_CRYSTALBOW_SCOUT: 2,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [{ prefab: prefabs.CRYSTAL_HOARD_SMALL, attempts: 2 }],
  }),
  FRONTIER_NON_HUMAN: makeRoom({
    groundWeights: {
      TERRAIN_MUSHROOM: 1,
      TERRAIN_GROUND: 3,
      TERRAIN_CRYSTAL: 1,
      TERRAIN_SLIME: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_MUSHROOMMAN_BANDIT: 3,
      MONSTER_FERAL_SLIME: 1,
      MONSTER_MAD_CRYSTALMAN: 1,
    },
    prefabs: [{ prefab: prefabs.MUSHROOM_HOARD_SMALL, attempts: 3 }],
  }),
  FRONTIER_MIXED: makeRoom({
    groundWeights: {
      TERRAIN_MUSHROOM: 1,
      TERRAIN_GROUND: 3,
      TERRAIN_CRYSTAL: 1,
      TERRAIN_SLIME: 1,
    },
    enemiesPerTile: 0.05,
    enemyWeights: {
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [{ prefab: prefabs.CAMPSITE_1, attempts: 5 }],
  }),

  OUTSKIRTS_MAIN: makeRoom({
    minSize: 50,
    groundWeights: {
      TERRAIN_GROUND: 10,
      TERRAIN_CRYSTAL: 1,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_SLIME: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_LABORER: 1,
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [
      { prefab: prefabs.WOODEN_BUILDING_MEDIUM, attempts: 20 },
      { prefab: prefabs.WOODEN_BUILDING_SMALL, attempts: 20 },
      { prefab: prefabs.CAMPSITE_1, attempts: 5 },
    ],
  }),
  OUTSKIRTS_CRYSTAL_MINE: makeRoom({
    maxSize: 50,
    groundWeights: {
      TERRAIN_GROUND: 2,
      TERRAIN_CRYSTAL: 1,
    },
    wallWeights: {
      TERRAIN_WALL: 2,
      TERRAIN_CRYSTAL_WALL: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_LABORER: 1,
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [
      { prefab: prefabs.TRACK_1, attempts: 2 },
      { prefab: prefabs.TRACK_2, attempts: 2 },
      { prefab: prefabs.PICKAX, attempts: 1 },
      { prefab: prefabs.CAMPSITE_1, attempts: 5 },
    ],
  }),
  OUTSKIRTS_MUSHROOM_FARM: makeRoom({
    maxSize: 50,
    groundWeights: {
      TERRAIN_GROUND: 3,
      TERRAIN_MUSHROOM: 1,
      TERRAIN_FIELD: 2,
      TERRAIN_MUSHROOM_FIELD: 2,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_LABORER: 1,
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [
      {
        prefab: prefabs.SHOVEL,
        attempts: 1,
      },
    ],
  }),
  OUTSKIRTS_SLIME_PIT: makeRoom({
    maxSize: 50,
    groundWeights: {
      TERRAIN_GROUND: 1,
      TERRAIN_SLIME: 1,
    },
    wallWeights: {
      TERRAIN_WALL: 2,
      TERRAIN_SLIME_WALL: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_LABORER: 1,
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [
      { prefab: prefabs.SHOVEL, attempts: 1 },
      { prefab: prefabs.CAMPSITE_1, attempts: 5 },
      { prefab: prefabs.TRACK_2, attempts: 1 },
    ],
  }),

  CITY_MAIN: makeRoom({
    minSize: 50,
    groundWeights: {
      TERRAIN_BRICK_FLOOR: 1,
    },
    enemiesPerTile: 0.1,
    enemyWeights: {
      MONSTER_LABORER: 2,
      MONSTER_CRYSTAL_LEGIONNAIRE: 2,
      MONSTER_SHROOM_CHEMIST: 2,
      MONSTER_SLIME_ENGINEER: 2,
      MONSTER_CRYSTALBOW_SCOUT: 1,
      MONSTER_SLIME_TAMER: 1,
      MONSTER_SHROOM_DOCTOR: 1,
    },
    prefabs: [
      { prefab: prefabs.BRICK_BUILDING_MEDIUM, attempts: 40 },
      { prefab: prefabs.BRICK_BUILDING_SMALL, attempts: 30 },
    ],
  }),
};
