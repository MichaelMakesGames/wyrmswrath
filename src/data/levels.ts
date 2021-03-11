export interface Level {
  name: string;
  rooms: Room[];
}

export interface Room {
  minSize: number;
  maxSize: number;
  groundWeights: Record<string, number>;
  wallWeights: Record<string, number>;
  enemyWeights: Record<string, number>;
  enemyChance: number;
}

const levels: Level[] = [
  {
    name: "Lair",
    rooms: [
      {
        minSize: 15,
        maxSize: Infinity,
        groundWeights: {
          TERRAIN_CRYSTAL: 1,
          TERRAIN_MUSHROOM: 1,
          TERRAIN_SLIME: 1,
          TERRAIN_GROUND: 10,
        },
        wallWeights: {
          TERRAIN_WALL: 1,
        },
        enemyChance: 0.05,
        enemyWeights: {
          MONSTER_MAD_CRYSTALMAN: 1,
          MONSTER_MUSHROOMMAN_BANDIT: 1,
          MONSTER_FERAL_SLIME: 1,
        },
      },
    ],
  },
];

export default levels;
