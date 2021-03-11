import { PRIORITY_BUILDING_LOW, PRIORITY_UNIT } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  MONSTER_MUSHROOM_BASE: {
    drops: {
      template: "MUSHROOM",
    },
    consumable: {
      energy: 20,
      mushroom: true,
    },
    blocking: { moving: true, fov: false },
  },
  MONSTER_CRYSTAL_BASE: {
    drops: {
      template: "CRYSTAL",
    },
    consumable: {
      energy: 20,
      crystal: true,
    },
    blocking: { moving: true, fov: false },
  },
  MONSTER_SLIME_BASE: {
    drops: {
      template: "SLIME",
    },
    consumable: {
      energy: 20,
      slime: true,
    },
    blocking: { moving: true, fov: false },
  },
  MONSTER_SUITLESS_BASE: {
    drops: {
      template: "CORPSE",
    },
    consumable: {
      energy: 30,
    },
    blocking: { moving: true, fov: false },
  },
  MONSTER_SPAWN_BASE: {
    consumable: {
      energy: 10,
    },
    blocking: { moving: true, fov: false },
  },
  MONSTER_MUSHROOMMAN_BANDIT: {
    parentTemplate: "MONSTER_MUSHROOM_BASE",
    display: makeDisplay("mushroomman-bandit"),
    health: makeHealth(2),
    monster: {
      meleeDamage: 0,
      rangedDamage: 1,
      range: 3,
      projectileColor: colors.enemyUnit,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [],
    },
  },
  MONSTER_MAD_CRYSTALMAN: {
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("mad-crystalman"),
    health: makeHealth(1),
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [],
    },
    statusEffects: {
      ARMORED: { type: "ARMORED", value: 1 },
    },
  },
  MONSTER_FERAL_SLIME: {
    parentTemplate: "MONSTER_SLIME_BASE",
    display: makeDisplay("feral-slime"),
    health: makeHealth(3),
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [],
    },
    statusEffects: {
      SLIME_WALK: { type: "SLIME_WALK" },
      CONFUSED: { type: "CONFUSED" },
    },
  },
  MONSTER_LABORER: {
    parentTemplate: "MONSTER_SUITLESS_BASE",
    display: makeDisplay("laborer"),
    health: makeHealth(1),
    monster: {
      meleeDamage: 0,
      rangedDamage: 0,
      range: 0,
      idealDistance: 5,
      prioritizeDistance: true,
      abilities: [],
    },
  },
  MONSTER_CRYSTALBOW_SCOUT: {
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("crystalbow-scout"),
    health: makeHealth(3),
    monster: {
      meleeDamage: 0,
      rangedDamage: 2,
      range: 3,
      projectileColor: colors.water,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [],
    },
  },
  MONSTER_SHROOM_DOCTOR: {
    parentTemplate: "MONSTER_MUSHROOM_BASE",
    display: makeDisplay("shroom-doctor"),
    health: makeHealth(3),
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: false,
      abilities: [
        {
          code: "HEAL",
          coolDown: 2,
          readyIn: 0,
        },
      ],
    },
  },
  MONSTER_SLIME_TAMER: {
    parentTemplate: "MONSTER_SLIME_BASE",
    display: makeDisplay("slime-tamer"),
    health: makeHealth(3),
    monster: {
      meleeDamage: 2,
      rangedDamage: 0,
      range: 0,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [
        {
          code: "SPAWN_SLIME",
          coolDown: 2,
          readyIn: 0,
        },
      ],
    },
  },
  MONSTER_TRAINED_SLIME: {
    parentTemplate: "MONSTER_SPAWN_BASE",
    display: makeDisplay("trained-slime"),
    health: makeHealth(2),
    monster: {
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [{ code: "POISON", coolDown: 1, readyIn: 0 }],
    },
    statusEffects: {
      SLIME_WALK: { type: "SLIME_WALK" },
    },
  },
  MONSTER_CRYSTAL_LEGIONNAIRE: {
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("crystal-legionnaire"),
    health: makeHealth(3),
    monster: {
      meleeDamage: 3,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [
        {
          code: "CHARGE",
          coolDown: 3,
          readyIn: 0,
        },
      ],
    },
    statusEffects: {
      ARMORED: { type: "ARMORED", value: 3 },
    },
  },
  MONSTER_SLIME_ENGINEER: {
    parentTemplate: "MONSTER_SLIME_BASE",
    display: makeDisplay("slime-engineer"),
    health: makeHealth(5),
    monster: {
      meleeDamage: 0,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: false,
      abilities: [{ code: "SLIME_BOMB", coolDown: 1, readyIn: 0 }],
    },
  },
  MONSTER_SLIME_BOMB: {
    parentTemplate: "MONSTER_SPAWN_BASE",
    display: makeDisplay("slime-bomb"),
    health: makeHealth(1),
    monster: {
      meleeDamage: 0,
      rangedDamage: 0,
      range: 0,
      idealDistance: Infinity,
      prioritizeDistance: false,
      abilities: [{ code: "SLIME_EXPLOSION", coolDown: 0, readyIn: 0 }],
    },
    statusEffects: {
      PARALYZED: { type: "PARALYZED" },
    },
  },
  MONSTER_SHROOM_CHEMIST: {
    parentTemplate: "MONSTER_MUSHROOM_BASE",
    display: makeDisplay("shroom-chemist"),
    health: makeHealth(5),
    monster: {
      meleeDamage: 0,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: false,
      abilities: [
        {
          code: "STRENGTHEN",
          coolDown: 2,
          readyIn: 0,
        },
        { code: "HEAL", coolDown: 2, readyIn: 0 },
        { code: "ANTIDOTE", coolDown: 2, readyIn: 0 },
      ],
    },
  },
  MONSTER_KING: {
    parentTemplate: "MONSTER_SUITLESS_BASE",
    display: makeDisplay("king"),
    health: makeHealth(8),
    monster: {
      meleeDamage: 5,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: true,
      abilities: [{ code: "STRENGTHEN", coolDown: 2, readyIn: 0 }],
    },
  },
};

function makeDisplay(tile: string) {
  return {
    tile,
    priority: PRIORITY_UNIT,
    hidden: true,
    discreteMovement: true,
  };
}

function makeHealth(max: number) {
  return { current: max, max };
}

export default templates;
