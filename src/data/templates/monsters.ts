import { PRIORITY_BUILDING_LOW, PRIORITY_UNIT } from "~/constants";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  MONSTER_MUSHROOMMAN_BANDIT: {
    display: {
      tile: "mushroomman-bandit",
      priority: PRIORITY_UNIT,
    },
    monster: {
      meleeDamage: 0,
      rangedDamage: 1,
      range: 3,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [],
    },
    health: {
      current: 2,
      max: 2,
    },
    drops: {
      template: "MUSHROOM",
    },
    consumable: {
      energy: 20,
      mushroom: true,
    },
  },
  MONSTER_MAD_CRYSTALMAN: {
    display: {
      tile: "mad-crystalman",
      priority: PRIORITY_UNIT,
    },
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [],
    },
    health: {
      current: 1,
      max: 1,
    },
    drops: {
      template: "CRYSTAL",
    },
    consumable: {
      energy: 20,
      crystal: true,
    },
  },
  MONSTER_FERAL_SLIME: {
    display: {
      tile: "feral-slime",
      priority: PRIORITY_UNIT,
    },
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [],
    },
    health: {
      current: 3,
      max: 3,
    },
    drops: {
      template: "SLIME",
    },
    consumable: {
      energy: 20,
      slime: true,
    },
  },
};

export default templates;
