import { Map, RNG } from "rot-js";
import { MAP_HEIGHT, MAP_WIDTH } from "~/constants";
import { Entity, Pos } from "~/types/Entity";
import { Level } from "~data/levels";
import { Prefab } from "~data/prefabs";
import { Room } from "~data/rooms";
import { createEntityFromTemplate } from "./entities";
import {
  fromRotPos,
  getAdjacentPositions,
  getPosKey,
  getRelativePosition,
  parsePosKey,
  toRotPos,
} from "./geometry";
import { rangeTo } from "./math";

export default function generateMap(
  level: Level,
): { start: null | Pos; end: null | Pos; entities: Entity[] } {
  // RNG.setSeed(0);
  const rotWidth = MAP_HEIGHT * 2;
  const rotHeight = MAP_WIDTH;
  const map = new Map.Cellular(rotWidth, rotHeight, {
    topology: 6,
    born: [4, 5, 6],
    survive: [3, 4, 5, 6],
  });

  map.randomize(level.groundChance);

  let caverns: Set<string>[] = [];

  rangeTo(level.iterations - 1).forEach(() => map.create());
  map.create((x, y, contents) => {
    if (contents) {
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

  console.warn(
    caverns
      .filter((c) => c.size >= 10)
      .map((s) => s.size)
      .sort((a, b) => b - a),
    caverns.filter((c) => c.size >= 10).length,
    caverns.length,
  );

  caverns
    .filter((c) => c.size < 10)
    .forEach((c) =>
      Array.from(c)
        .map(parsePosKey)
        .map(toRotPos)
        .forEach(([x, y]) => map.set(x, y, 0)),
    );
  caverns = caverns.filter((c) => c.size >= 10);

  const [start, ...tail] = caverns
    .flatMap((c) => Array.from(c))
    .map(parsePosKey)
    .sort((a, b) => a.x + a.y - (b.x + b.y));
  const end = tail.pop() || null;

  const hallways: Set<string> = new Set();
  caverns.push(hallways);
  map.connect((x, y, contents) => {
    if (contents) {
      const pos = fromRotPos([x, y]);
      const posKey = getPosKey(pos);
      if (!caverns.some((c) => c.has(posKey))) {
        hallways.add(posKey);
      }
    }
  }, 1);

  const results: Entity[] = [];
  const wallPositions: Set<string> = new Set();

  const GENERIC_ROOM = {
    minSize: 0,
    maxSize: Infinity,
    enemiesPerTile: 0,
    enemyWeights: {},
    wallWeights: { TERRAIN_WALL: 1 },
    groundWeights: { TERRAIN_GROUND: 1 },
    prefabs: [],
  };
  for (const cavern of caverns) {
    const room: Room =
      cavern === hallways
        ? GENERIC_ROOM
        : RNG.getItem(findValidRooms(level, cavern.size)) || GENERIC_ROOM;

    const prefabPositions = new Set<string>();
    for (const { prefab, attempts } of room.prefabs) {
      rangeTo(attempts).forEach(() => {
        const origin = RNG.getItem(
          Array.from(cavern).filter((p) => !prefabPositions.has(p)),
        );
        if (origin && canPlacePrefab(origin, prefab, cavern, prefabPositions)) {
          console.warn("CAN PLACE!");
          placePrefab(origin, prefab, prefabPositions, results);
        } else {
          console.warn("cannot place");
        }
      });
    }

    const nonPrefabPositions = RNG.shuffle(
      Array.from(cavern)
        .filter((p) => !prefabPositions.has(p))
        .map(parsePosKey),
    );

    // calc num enemies
    let numEnemies = cavern.size * room.enemiesPerTile;
    numEnemies =
      Math.floor(numEnemies) + (RNG.getUniform() < numEnemies % 1 ? 1 : 0);

    // create enemies
    for (const pos of nonPrefabPositions.slice(
      0,
      Math.min(numEnemies, nonPrefabPositions.length),
    )) {
      const enemyTemplate = RNG.getWeightedValue(room.enemyWeights);
      if (enemyTemplate)
        results.push(createEntityFromTemplate(enemyTemplate, { pos }));
    }

    // create floors
    for (const pos of nonPrefabPositions) {
      const groundTemplate =
        RNG.getWeightedValue(room.groundWeights) || "TERRAIN_GROUND";
      results.push(createEntityFromTemplate(groundTemplate, { pos }));
    }

    // create surrounding walls
    for (const pos of Array.from(cavern).map(parsePosKey)) {
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

  if (end) {
    if (level.hasStairs) {
      results.push(createEntityFromTemplate("TERRAIN_STAIRS", { pos: end }));
    } else {
      results.push(createEntityFromTemplate("MONSTER_KING", { pos: end }));
    }
  }

  return {
    start,
    end,
    entities: results,
  };
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
  return level.rooms.filter((r) => size >= r.minSize && size < r.maxSize);
}

function canPlacePrefab(
  origin: string,
  prefab: Prefab,
  cavern: Set<string>,
  prefabPositions: Set<string>,
) {
  return prefab.tiles
    .map(({ directions }) =>
      getPosKey(getRelativePosition(parsePosKey(origin), directions)),
    )
    .every((pos) => cavern.has(pos) && !prefabPositions.has(pos));
}

function placePrefab(
  origin: string,
  prefab: Prefab,
  prefabPositions: Set<string>,
  results: Entity[],
) {
  for (const { directions, templates } of prefab.tiles) {
    const pos = getRelativePosition(parsePosKey(origin), directions);
    if (templates.length) prefabPositions.add(getPosKey(pos));
    results.push(...templates.map((t) => createEntityFromTemplate(t, { pos })));
  }
}
