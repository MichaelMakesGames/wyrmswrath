import { PRIORITY_BUILDING_LOW } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  MUSHROOM: {
    display: {
      tile: "mushroom",
      priority: PRIORITY_BUILDING_LOW,
    },
    consumable: {
      energy: 20,
      mushroom: true,
    },
  },
  CRYSTAL: {
    display: {
      tile: "crystal",
      priority: PRIORITY_BUILDING_LOW,
    },
    consumable: {
      energy: 20,
      crystal: true,
    },
  },
  SLIME: {
    display: {
      tile: "slime",
      priority: PRIORITY_BUILDING_LOW,
    },
    consumable: {
      energy: 20,
      slime: true,
    },
  },
  CORPSE: {
    display: {
      tile: "corpse",
      priority: PRIORITY_BUILDING_LOW,
    },
    consumable: {
      energy: 20,
    },
  },
};

export default templates;
