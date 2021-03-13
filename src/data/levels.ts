import rooms, { Room } from "./rooms";

export interface Level {
  name: string;
  message: string;
  song: string;
  groundChance: number;
  iterations: number;
  hasStairs: boolean;
  rooms: Room[];
}

const levels: Level[] = [
  {
    name: "Lair",
    message: "",
    song: "song-lair",
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
    message: "You enter the Frontier. Beware the Rogue-King's scouts.",
    song: "song-frontier",
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
    message: "You have entered the Kingdom proper. Time to feast.",
    song: "song-outskirts",
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
    message: "The heart of the Kingdom. Let's tear it out.",
    song: "song-city",
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
    message: "It is time. Take back what is rightfully yours.",
    song: "song-palace",
    groundChance: 0.4,
    iterations: 1,
    hasStairs: false,
    rooms: [],
  },
];

export default levels;
