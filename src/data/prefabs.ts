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
  SLIME_HOARD_LARGE: makePrefab({
    "": ["TERRAIN_SLIME", "SLIME"],
    "N": ["TERRAIN_SLIME", "SLIME"],
    "NE": ["TERRAIN_SLIME", "SLIME"],
    "N,N": ["TERRAIN_SLIME_WALL"],
    "N,NE": ["TERRAIN_SLIME_WALL"],
    "NE,NE": ["TERRAIN_SLIME_WALL"],
    "NE,SE": ["TERRAIN_SLIME_WALL"],
    "SE": ["TERRAIN_SLIME_WALL"],
    "S": ["TERRAIN_SLIME_WALL"],
    "SW": ["TERRAIN_SLIME_WALL"],
    "NW": ["TERRAIN_SLIME_WALL"],
    "N,NW": ["TERRAIN_SLIME_WALL"],
  }),
};

export default prefabs;
