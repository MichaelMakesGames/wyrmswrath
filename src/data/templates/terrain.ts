import { PRIORITY_BUILDING_LOW, PRIORITY_TERRAIN } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  TERRAIN_GROUND: {
    display: {
      tile: "ground",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    ground: {},
    explorable: {},
  },
  TERRAIN_WALL: {
    display: {
      tile: "wall",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_SLIME_WALL: {
    display: {
      tile: "slime-wall",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_SLIME: {
    display: {
      tile: "terrain-slime",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    ground: { slimy: true },
    explorable: {},
  },
  TERRAIN_CRYSTAL: {
    display: {
      tile: "terrain-crystal",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    ground: { spiky: true },
    explorable: {},
  },
  TERRAIN_MUSHROOM: {
    display: {
      tile: "terrain-mushroom",
      priority: PRIORITY_TERRAIN,
      hidden: true,
    },
    ground: { healing: true },
    explorable: {},
  },
  TERRAIN_STAIRS: {
    display: {
      tile: "stairs",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    stairs: {},
    explorable: {},
  },
};

export default templates;
