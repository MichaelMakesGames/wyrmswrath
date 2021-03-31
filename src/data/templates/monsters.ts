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
    name: "Mushroomman Bandit",
    description:
      "A citizen of the former Fungal Fellowship, now driven to banditry. Attacks from range and tries to keep its distance.",
    parentTemplate: "MONSTER_MUSHROOM_BASE",
    display: makeDisplay("mushroomman-bandit"),
    health: makeHealth(2),
    monster: {
      attackSfx: "sfx-ranged",
      meleeDamage: 0,
      rangedDamage: 1,
      range: 3,
      projectileColor: colors.purple,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [],
    },
  },
  MONSTER_MAD_CRYSTALMAN: {
    name: "Mad Crystalman",
    description:
      "Once a proud warrior, driven insane by the shattering of the Crystal Cavedom. Rushes forward with little regard for its life.",
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("mad-crystalman"),
    health: makeHealth(1),
    monster: {
      attackSfx: "sfx-crystal-melee",
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
    description:
      "All the weaker slimes have been captured or killed. This one wanders the caves aimlessly.",
    display: makeDisplay("feral-slime"),
    health: makeHealth(3),
    name: "Feral Slime",
    monster: {
      attackSfx: "sfx-slime",
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
    name: "Laborer",
    description: "What a juicy-looking peasant.",
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
    name: "Crystalbow Scout",
    description:
      "A human equipped with dangerous crystal shard arrows. Keeps its distance.",
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("crystalbow-scout"),
    health: makeHealth(3),
    monster: {
      attackSfx: "sfx-crystal-ranged",
      meleeDamage: 0,
      rangedDamage: 2,
      range: 3,
      projectileColor: colors.blue,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [],
    },
  },
  MONSTER_SHROOM_DOCTOR: {
    name: "Shroom Doctor",
    description:
      "A human who has mastered the healing properties of mushrooms.",
    parentTemplate: "MONSTER_MUSHROOM_BASE",
    display: makeDisplay("shroom-doctor"),
    health: makeHealth(3),
    monster: {
      attackSfx: "sfx-mushroom",
      meleeDamage: 0,
      rangedDamage: 1,
      range: 2,
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
    name: "Slime Tamer",
    description: "Summons poisonous Trained Slimes to fight for it.",
    parentTemplate: "MONSTER_SLIME_BASE",
    display: makeDisplay("slime-tamer"),
    health: makeHealth(3),
    monster: {
      attackSfx: "sfx-slime-whip",
      meleeDamage: 2,
      rangedDamage: 0,
      range: 0,
      idealDistance: 2,
      prioritizeDistance: false,
      abilities: [
        {
          code: "SPAWN_SLIME",
          coolDown: 3,
          readyIn: 0,
        },
      ],
    },
  },
  MONSTER_TRAINED_SLIME: {
    name: "Trained Slime",
    description:
      "A poisonous slime that has been trained to fight for the humans.",
    parentTemplate: "MONSTER_SPAWN_BASE",
    display: makeDisplay("trained-slime"),
    health: makeHealth(2),
    monster: {
      attackSfx: "sfx-slime",
      meleeDamage: 1,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: false,
      abilities: [{ code: "POISON", coolDown: 2, readyIn: 2 }],
    },
    statusEffects: {
      SLIME_WALK: { type: "SLIME_WALK" },
    },
  },
  MONSTER_CRYSTAL_LEGIONNAIRE: {
    name: "Crystal Legionnare",
    description:
      "An expert human warrior, wearing armor made from fallen Crystalmen. It can charge, covering great distances quickly.",
    parentTemplate: "MONSTER_CRYSTAL_BASE",
    display: makeDisplay("crystal-legionnaire"),
    health: makeHealth(3),
    monster: {
      attackSfx: "sfx-crystal-melee",
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
    name: "Slime Engineer",
    description:
      "Throws poisonous slime bombs. Even the untrainable slimes have their uses.",
    parentTemplate: "MONSTER_SLIME_BASE",
    display: makeDisplay("slime-engineer"),
    health: makeHealth(5),
    monster: {
      attackSfx: "sfx-slime-melee",
      meleeDamage: 2,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: false,
      abilities: [{ code: "SLIME_BOMB", coolDown: 1, readyIn: 0 }],
    },
  },
  MONSTER_SLIME_BOMB: {
    name: "Slime Bomb",
    description:
      "Will explode, turning the area to slime and poisoning anything next to it.",
    parentTemplate: "MONSTER_SPAWN_BASE",
    display: makeDisplay("slime-bomb"),
    health: makeHealth(1),
    monster: {
      meleeDamage: 0,
      rangedDamage: 0,
      range: 0,
      idealDistance: Infinity,
      prioritizeDistance: false,
      alwaysTryAbility: true,
      abilities: [{ code: "SLIME_EXPLOSION", coolDown: 0, readyIn: 0 }],
    },
    statusEffects: {
      PARALYZED: { type: "PARALYZED" },
    },
  },
  MONSTER_SHROOM_CHEMIST: {
    name: "Shroom Chemist",
    description:
      "A human who has learned how to use mushrooms both to heal and strengthen.",
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
    name: "King",
    description: "Thief. Murderer. Rogue.",
    parentTemplate: "MONSTER_SUITLESS_BASE",
    consumable: { victory: true, energy: 10 },
    drops: { template: "CHALICE" },
    display: makeDisplay("king"),
    health: makeHealth(8),
    monster: {
      attackSfx: "sfx-melee",
      meleeDamage: 5,
      rangedDamage: 0,
      range: 0,
      idealDistance: 3,
      prioritizeDistance: true,
      abilities: [{ code: "STRENGTHEN", coolDown: 2, readyIn: 0 }],
    },
  },
  MONSTER_ROYAL_GUARD: {
    name: "Royal Guard",
    description:
      "Humans sworn to defend their King, even if it means becoming dinner.",
    parentTemplate: "MONSTER_SUITLESS_BASE",
    display: makeDisplay("royal-guard"),
    health: makeHealth(5),
    monster: {
      attackSfx: "sfx-melee",
      meleeDamage: 3,
      rangedDamage: 0,
      range: 0,
      idealDistance: 1,
      prioritizeDistance: true,
      abilities: [],
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
