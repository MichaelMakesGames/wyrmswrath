import { PRIORITY_BUILDING_LOW } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  MUSHROOM: {
    name: "Mushroom",
    description: "Tasty.",
    display: {
      tile: "mushroom",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    explorable: true,
    consumable: {
      energy: 20,
      mushroom: true,
    },
  },
  CRYSTAL: {
    name: "Crystal",
    description: "Scrumptious.",
    display: {
      tile: "crystal",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    explorable: true,
    consumable: {
      energy: 20,
      crystal: true,
    },
  },
  SLIME: {
    name: "Slime",
    description: "Yum.",
    display: {
      tile: "slime",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    explorable: true,
    consumable: {
      energy: 20,
      slime: true,
    },
  },
  CORPSE: {
    name: "Corpse",
    description: "Mouth-watering.",
    display: {
      tile: "corpse",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    explorable: true,
    consumable: {
      energy: 30,
    },
  },
  CHALICE: {
    name: "Chalice",
    description: "Smells like victory.",
    display: {
      tile: "corpse",
      priority: PRIORITY_BUILDING_LOW,
      hidden: true,
    },
    explorable: true,
    consumable: {
      energy: 10,
      victory: true,
    },
  },
};

export default templates;
