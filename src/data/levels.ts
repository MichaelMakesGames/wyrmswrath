import rooms, { Room } from "./rooms";

export interface Level {
  name: string;
  groundChance: number;
  iterations: number;
  hasStairs: boolean;
  rooms: Room[];
}

const levels: Level[] = [
  {
    name: "Lair",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: true,
    rooms: [
      rooms.LAIR_MIXED,
      rooms.LAIR_CRYSTAL,
      rooms.LAIR_MUSHROOM,
      rooms.LAIR_SLIME,
    ],
  },
  {
    name: "Frontier",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: true,
    rooms: [
      rooms.FRONTIER_MIXED,
      rooms.FRONTIER_NON_HUMAN,
      rooms.FRONTIER_CRYSTAL,
      rooms.FRONTIER_SLIME,
    ],
  },
  {
    name: "Outskirts",
    groundChance: 0.4,
    iterations: 3,
    hasStairs: true,
    rooms: [
      rooms.OUTSKIRTS_MAIN,
      rooms.OUTSKIRTS_CRYSTAL_MINE,
      rooms.OUTSKIRTS_SLIME_PIT,
      rooms.OUTSKIRTS_MUSHROOM_FARM,
    ],
  },
  {
    name: "City",
    groundChance: 0.5,
    iterations: 4,
    hasStairs: true,
    rooms: [
      rooms.CITY_MAIN,
      rooms.OUTSKIRTS_CRYSTAL_MINE,
      rooms.OUTSKIRTS_SLIME_PIT,
      rooms.OUTSKIRTS_MUSHROOM_FARM,
    ],
  },
  {
    name: "Palace",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: false,
    rooms: [],
  },
];

export default levels;
