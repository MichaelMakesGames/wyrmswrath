import { DIRECTIONS } from "~constants";
import { Direction } from "~types";

export interface Prefab {
  tiles: {
    directions: Direction[];
    templates: TemplateName[];
  }[];
}

function makePrefab(tiles: Record<string, TemplateName[]>): Prefab {
  return {
    tiles: Object.entries(tiles).map((t) => ({
      directions: convertStringToDirectionArray(t[0]),
      templates: t[1],
    })),
  };
}

function convertStringToDirectionArray(s: string) {
  if (!s) return [];
  const directions = s.split(",");
  directions.forEach((d) => {
    if (!DIRECTIONS.includes(d as Direction))
      throw new Error(`Invalid direction "${d}" in string "${s}"`);
  });
  return directions as Direction[];
}

const prefabs = {
  CRYSTAL_HOARD_SMALL: makePrefab({
    "": ["TERRAIN_CRYSTAL", "CRYSTAL", "MONSTER_MAD_CRYSTALMAN"],
    "N": ["TERRAIN_CRYSTAL_WALL"],
    "NE": ["TERRAIN_CRYSTAL_WALL"],
    "SE": ["TERRAIN_CRYSTAL_WALL"],
    "S": ["TERRAIN_CRYSTAL_WALL"],
    "SW": ["TERRAIN_CRYSTAL_WALL"],
    "NW": ["TERRAIN_CRYSTAL_WALL"],
  }),
  MUSHROOM_HOARD_SMALL: makePrefab({
    "": ["TERRAIN_MUSHROOM", "MUSHROOM", "MONSTER_MUSHROOMMAN_BANDIT"],
    "N": ["TERRAIN_MUSHROOM_WALL"],
    "NE": ["TERRAIN_MUSHROOM_WALL"],
    "SE": ["TERRAIN_MUSHROOM_WALL"],
    "S": ["TERRAIN_MUSHROOM_WALL"],
    "SW": ["TERRAIN_MUSHROOM_WALL"],
    "NW": ["TERRAIN_MUSHROOM_WALL"],
  }),
  SLIME_HOARD_SMALL: makePrefab({
    "": ["TERRAIN_SLIME", "SLIME", "MONSTER_FERAL_SLIME"],
    "N": ["TERRAIN_SLIME_WALL"],
    "NE": ["TERRAIN_SLIME_WALL"],
    "SE": ["TERRAIN_SLIME_WALL"],
    "S": ["TERRAIN_SLIME_WALL"],
    "SW": ["TERRAIN_SLIME_WALL"],
    "NW": ["TERRAIN_SLIME_WALL"],
  }),
};

export default prefabs;
