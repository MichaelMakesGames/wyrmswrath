import { PRIORITY_BUILDING_LOW, PRIORITY_UNIT } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  MONSTER_MUSHROOMMAN_BANDIT: {
    display: {
      tile: "mushroomman-bandit",
      priority: PRIORITY_UNIT,
      hidden: true,
    },
    monster: {
      meleeDamage: 0,
      rangedDamage: 1,
      range: 3,
      projectileColor: colors.enemyUnit,
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
    blocking: { moving: true, fov: false },
  },
  MONSTER_MAD_CRYSTALMAN: {
    display: {
      tile: "mad-crystalman",
      priority: PRIORITY_UNIT,
      hidden: true,
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
    blocking: { moving: true, fov: false },
    statusEffects: {
      ARMORED: { type: "ARMORED", value: 1 },
    },
  },
  MONSTER_FERAL_SLIME: {
    display: {
      tile: "feral-slime",
      priority: PRIORITY_UNIT,
      hidden: true,
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
    blocking: { moving: true, fov: false },
    statusEffects: {
      SLIME_WALK: { type: "SLIME_WALK" },
      CONFUSED: { type: "CONFUSED" },
    },
  },
};

export default templates;
