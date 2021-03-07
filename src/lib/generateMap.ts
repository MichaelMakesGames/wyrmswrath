import { DIRECTIONS, MAP_HEIGHT, MAP_WIDTH } from "~/constants";
import { Entity, Pos } from "~/types/Entity";
import { createEntityFromTemplate } from "./entities";
import {
  getAdjacentPositions,
  getPositionToDirection,
  getPosKey,
} from "./geometry";
import { choose } from "./rng";

export default function generateMap(): Entity[] {
  const results: Entity[] = [];

  const NUM_GROUND = (MAP_WIDTH * MAP_HEIGHT) / 3;

  const groundPositions: Record<string, Pos> = {};
  const wallPositions: Record<string, Pos> = {};

  let currentPos: Pos = { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
  while (Object.keys(groundPositions).length < NUM_GROUND) {
    const key = getPosKey(currentPos);
    if (!groundPositions[key]) {
      groundPositions[key] = currentPos;
    }
    const newPos = getPositionToDirection(currentPos, choose(DIRECTIONS));
    if (
      newPos.x >= 1 &&
      newPos.y >= 1 &&
      newPos.x < MAP_WIDTH - 1 &&
      newPos.y < MAP_HEIGHT - 1
    ) {
      currentPos = newPos;
    }
  }

  for (const pos of Object.values(groundPositions)) {
    results.push(createEntityFromTemplate("TERRAIN_GROUND", { pos }));
    for (const adjacent of getAdjacentPositions(pos)) {
      const key = getPosKey(adjacent);
      if (!groundPositions[key] && !wallPositions[key]) {
        wallPositions[key] = adjacent;
      }
    }
  }

  for (const pos of Object.values(wallPositions)) {
    results.push(createEntityFromTemplate("TERRAIN_WALL", { pos }));
  }

  return results;
}
