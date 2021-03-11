import { Map, RNG } from "rot-js";
import { MAP_HEIGHT, MAP_WIDTH } from "~/constants";
import { Entity, Pos } from "~/types/Entity";
import { Level, Room } from "~data/levels";
import { createEntityFromTemplate } from "./entities";
import {
  fromRotPos,
  getAdjacentPositions,
  getPosKey,
  parsePosKey,
} from "./geometry";
import { rangeTo } from "./math";

export default function generateMap(level: Level): Entity[] {
  const rotWidth = MAP_HEIGHT * 2;
  const rotHeight = MAP_WIDTH;
  const map = new Map.Cellular(rotWidth, rotHeight, {
    topology: 6,
    born: [4, 5, 6],
    survive: [3, 4, 5, 6],
  });

  for (const i of rangeTo(rotWidth)) {
    for (const j of rangeTo(rotHeight)) {
      const dx = i / rotWidth - 0.5;
      const dy = j / rotHeight - 0.5;
      const dist = (dx * dx + dy * dy) ** 0.25;
      if (Math.random() < dist) {
        map.set(i, j, 1);
      }
    }
  }

  const caverns: Set<string>[] = [];
  map.create();
  map.create();
  map.create();
  map.create((x, y, contents) => {
    if (!contents) {
      const pos = fromRotPos([x, y]);
      const posKey = getPosKey(pos);

      const adjacentCaverns = findAdjacentCaverns(caverns, pos);
      if (!adjacentCaverns.length) {
        caverns.push(new Set([posKey]));
      } else if (adjacentCaverns.length === 1) {
        adjacentCaverns[0].add(posKey);
      } else {
        const [first, ...others] = adjacentCaverns;
        for (const other of others) {
          mergeCaverns(first, other);
          caverns.splice(caverns.indexOf(other), 1);
        }
      }
    }
  });

  const hallways: Set<string> = new Set();
  caverns.push(hallways);
  map.connect((x, y, contents) => {
    if (!contents) {
      const pos = fromRotPos([x, y]);
      const posKey = getPosKey(pos);
      if (!caverns.some((c) => c.has(posKey))) {
        hallways.add(posKey);
      }
    }
  }, 0);

  const results: Entity[] = [];
  const wallPositions: Set<string> = new Set();

  const GENERIC_ROOM = {
    minSize: 0,
    maxSize: Infinity,
    enemyChance: 0,
    enemyWeights: {},
    wallWeights: { TERRAIN_WALL: 1 },
    groundWeights: { TERRAIN_GROUND: 1 },
  };
  for (const cavern of caverns) {
    const room: Room =
      cavern === hallways
        ? GENERIC_ROOM
        : RNG.getItem(findValidRooms(level, cavern.size)) || GENERIC_ROOM;
    for (const pos of Array.from(cavern).map(parsePosKey)) {
      const groundTemplate =
        RNG.getWeightedValue(room.groundWeights) || "TERRAIN_GROUND";
      results.push(createEntityFromTemplate(groundTemplate, { pos }));

      if (Math.random() < room.enemyChance) {
        const enemyTemplate = RNG.getWeightedValue(room.enemyWeights);
        if (enemyTemplate)
          results.push(createEntityFromTemplate(enemyTemplate, { pos }));
      }

      for (const adjacent of getAdjacentPositions(pos)) {
        const key = getPosKey(adjacent);
        if (!caverns.some((c) => c.has(key)) && !wallPositions.has(key)) {
          wallPositions.add(key);
          const wallTemplate =
            RNG.getWeightedValue(room.wallWeights) || "TERRAIN_WALL";
          results.push(
            createEntityFromTemplate(wallTemplate, { pos: adjacent }),
          );
        }
      }
    }
  }

  return results;
}

function mergeCaverns(r1: Set<string>, r2: Set<string>): void {
  for (const pos of r2) {
    r1.add(pos);
  }
}

function findAdjacentCaverns(rooms: Set<string>[], pos: Pos) {
  const adjacentPositions = getAdjacentPositions(pos).map(getPosKey);
  return rooms.filter((room) =>
    adjacentPositions.some((adjacent) => room.has(adjacent)),
  );
}

function findValidRooms(level: Level, size: number): Room[] {
  return level.rooms.filter((r) => size >= r.minSize && size <= r.maxSize);
}
