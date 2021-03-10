import { PRIORITY_TERRAIN } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  TERRAIN_GROUND: {
    display: {
      tile: "ground",
      priority: PRIORITY_TERRAIN,
    },
    ground: {},
  },
  TERRAIN_WALL: {
    display: {
      tile: "wall",
      priority: PRIORITY_TERRAIN,
    },
    blocking: {
      moving: true,
    },
    diggable: {},
  },
  TERRAIN_SLIME: {
    display: {
      tile: "terrain-slime",
      priority: PRIORITY_TERRAIN,
    },
    ground: { slimy: true },
  },
  TERRAIN_CRYSTAL: {
    display: {
      tile: "terrain-crystal",
      priority: PRIORITY_TERRAIN,
    },
    ground: { spiky: true },
  },
  TERRAIN_MUSHROOM: {
    display: {
      tile: "terrain-mushroom",
      priority: PRIORITY_TERRAIN,
    },
    ground: { healing: true },
  },
};

export default templates;
