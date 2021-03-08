import { PRIORITY_TERRAIN } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  TERRAIN_GROUND: {
    display: {
      tile: "ground",
      priority: PRIORITY_TERRAIN,
    },
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
};

export default templates;
