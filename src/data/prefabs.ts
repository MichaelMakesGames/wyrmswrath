import { DIRECTIONS } from "~constants";
import { Direction } from "~types";

export interface Prefab {
  tiles: {
    directions: Direction[];
    templates: (TemplateName | TemplateName[])[];
  }[];
}

function makePrefab(
  tiles: Record<string, (TemplateName | TemplateName[])[]>,
): Prefab {
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
  WOODEN_BUILDING_SMALL: makePrefab({
    "": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "N": ["TERRAIN_WOODEN_WALL"],
    "NE": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
    "SE": ["TERRAIN_WOODEN_WALL"],
    "S": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
    "SW": ["TERRAIN_WOODEN_WALL"],
    "NW": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
  }),
  WOODEN_BUILDING_MEDIUM: makePrefab({
    "": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "N": ["TERRAIN_WOODEN_FLOOR"],
    "NE": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "S": ["TERRAIN_WOODEN_WALL"],
    "SW": ["TERRAIN_WOODEN_WALL"],
    "NW": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
    "NW,N": ["TERRAIN_WOODEN_WALL"],
    "N,N": ["TERRAIN_WOODEN_WALL"],
    "N,NE": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
    "NE,NE": ["TERRAIN_WOODEN_WALL"],
    "NE,SE": ["TERRAIN_WOODEN_WALL"],
    "SE": ["TERRAIN_WOODEN_WALL", ["NONE", "DECORATION_WOODEN_DOOR"]],
  }),
  BRICK_BUILDING_SMALL: makePrefab({
    "": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "N": ["TERRAIN_BRICK_WALL"],
    "NE": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
    "SE": ["TERRAIN_BRICK_WALL"],
    "S": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
    "SW": ["TERRAIN_BRICK_WALL"],
    "NW": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
  }),
  BRICK_BUILDING_MEDIUM: makePrefab({
    "": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "N": ["TERRAIN_WOODEN_FLOOR"],
    "NE": ["TERRAIN_WOODEN_FLOOR", "MONSTER_LABORER"],
    "S": ["TERRAIN_BRICK_WALL"],
    "SW": ["TERRAIN_BRICK_WALL"],
    "NW": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
    "NW,N": ["TERRAIN_BRICK_WALL"],
    "N,N": ["TERRAIN_BRICK_WALL"],
    "N,NE": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
    "NE,NE": ["TERRAIN_BRICK_WALL"],
    "NE,SE": ["TERRAIN_BRICK_WALL"],
    "SE": ["TERRAIN_BRICK_WALL", ["NONE", "DECORATION_STONE_DOOR"]],
  }),
  PICKAX: makePrefab({
    "": ["TERRAIN_GROUND", "DECORATION_PICKAX"],
  }),
  SHOVEL: makePrefab({
    "": ["TERRAIN_GROUND", "DECORATION_SHOVEL"],
  }),
  TRACK_1: makePrefab({
    "": ["TERRAIN_GROUND", "DECORATION_TRACK_TURN_N_E"],
    "N": ["TERRAIN_GROUND", "DECORATION_TRACK_VERTICAL"],
    "NE": [
      "TERRAIN_GROUND",
      "DECORATION_TRACK_HORIZONTAL_BOTTOM_HALF",
      "DECORATION_CART_LOADED",
    ],
    "SE": ["TERRAIN_GROUND", "DECORATION_TRACK_HORIZONTAL_TOP_HALF"],
    "NE,SE": ["TERRAIN_GROUND", "DECORATION_TRACK_CROSS"],
    "NE,SE,N": ["TERRAIN_GROUND", "DECORATION_TRACK_VERTICAL"],
    "NE,SE,N,N": ["TERRAIN_GROUND", "DECORATION_TRACK_VERTICAL_T_E"],
  }),
  TRACK_2: makePrefab({
    "": ["TERRAIN_GROUND", "DECORATION_TRACK_TURN_S_E"],
    "NE": ["TERRAIN_GROUND", "DECORATION_TRACK_HORIZONTAL_BOTTOM_HALF"],
    "SE": ["TERRAIN_GROUND", "DECORATION_TRACK_HORIZONTAL_TOP_HALF"],
    "NE,SE": [
      "TERRAIN_GROUND",
      "DECORATION_TRACK_HORIZONTAL",
      "DECORATION_CART",
    ],
    "S": ["TERRAIN_GROUND", "DECORATION_TRACK_VERTICAL"],
    "S,S": ["TERRAIN_GROUND", "DECORATION_TRACK_VERTICAL"],
  }),
  CAMPSITE_1: makePrefab({
    "": ["TERRAIN_GROUND", "DECORATION_TENT_CENTRAL"],
    "N": ["TERRAIN_GROUND", "DECORATION_TENT_N"],
    "NE": ["TERRAIN_GROUND", "DECORATION_TENT_NE"],
    "SE": [
      "TERRAIN_GROUND",
      "DECORATION_TENT_SE",
      ["NONE", "DECORATION_BARREL"],
    ],
    "NW": ["TERRAIN_GROUND", "DECORATION_TENT_NW"],
    "SW": [
      "TERRAIN_GROUND",
      "DECORATION_TENT_SW",
      ["NONE", "DECORATION_SHOVEL"],
    ],
    "S": ["TERRAIN_GROUND", ["NONE", "DECORATION_CAMPFIRE"]],
  }),
};

export default prefabs;
