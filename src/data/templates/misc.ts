import {
  MAX_HEALTH_PER_SIZE,
  PLAYER_ID,
  PRIORITY_MARKER,
  PRIORITY_UNIT,
} from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  WYRM: {
    name: "Player",
    description: "This is you.",
    wyrm: { isPlayer: true },
    blocking: { moving: true, fov: false },
    health: {
      current: MAX_HEALTH_PER_SIZE,
      max: MAX_HEALTH_PER_SIZE,
    },
  },
  CURSOR: {
    display: {
      tile: "outline-solid",
      color: colors.white,
      priority: PRIORITY_MARKER,
      discreteMovement: true,
    },
    cursor: {},
  },
  NONE: {},
};

export default templates;
