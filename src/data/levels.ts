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
    rooms: [rooms.LAIR_CRYSTAL, rooms.LAIR_MUSHROOM, rooms.LAIR_SLIME],
  },
  {
    name: "Frontier",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: true,
    rooms: [],
  },
  {
    name: "Outskirts",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: true,
    rooms: [],
  },
  {
    name: "City",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: true,
    rooms: [],
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
