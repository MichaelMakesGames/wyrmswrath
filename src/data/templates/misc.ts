import { PLAYER_ID, PRIORITY_MARKER, PRIORITY_UNIT } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  WYRM: {
    wyrm: {},
    blocking: { moving: true },
  },
  CURSOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
      discreteMovement: true,
    },
    cursor: {},
  },
  NONE: {},
};

export default templates;
