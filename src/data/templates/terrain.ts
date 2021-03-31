import { PRIORITY_BUILDING_LOW, PRIORITY_TERRAIN } from "~/constants";
import { Display, Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  TERRAIN_WALL_BASE: {
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_GROUND: {
    display: makeDisplay("ground"),
    name: "Ground",
    ground: {},
    explorable: {},
  },
  TERRAIN_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Wall",
    display: makeDisplay("wall"),
  },
  TERRAIN_CRYSTAL_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Crystal Wall",
    display: makeDisplay("crystal-wall"),
  },
  TERRAIN_MUSHROOM_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Mushroom Wall",
    display: makeDisplay("mushroom-wall"),
  },
  TERRAIN_SLIME_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Slime Wall",
    display: makeDisplay("slime-wall"),
  },
  TERRAIN_WOODEN_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Wooden Wall",
    display: makeDisplay("wooden-wall"),
  },
  TERRAIN_WOODEN_FLOOR: {
    display: makeDisplay("wooden-floor"),
    name: "Wooden Floor",
    ground: {},
    explorable: {},
  },
  TERRAIN_BRICK_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Brick Wall",
    display: makeDisplay("brick-wall"),
  },
  TERRAIN_BRICK_FLOOR: {
    display: makeDisplay("brick-floor"),
    name: "Brick Floor",
    ground: {},
    explorable: {},
  },
  TERRAIN_MARBLE_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    name: "Marble Wall",
    display: makeDisplay("marble-wall"),
  },
  TERRAIN_MARBLE_FLOOR: {
    display: makeDisplay("marble-floor"),
    name: "Marble Floor",
    ground: {},
    explorable: {},
  },
  TERRAIN_CARPET: {
    display: makeDisplay("carpet"),
    name: "Carpet",
    ground: {},
    explorable: {},
  },
  TERRAIN_ROYAL_CARPET: {
    display: makeDisplay("royal-carpet"),
    name: "Royal Carpet",
    ground: {},
    explorable: {},
  },
  TERRAIN_FIELD: {
    display: makeDisplay("field"),
    name: "Field",
    ground: {},
    explorable: {},
  },
  TERRAIN_MUSHROOM_FIELD: {
    display: makeDisplay("mushroom-field"),
    name: "Field",
    ground: {},
    explorable: {},
  },
  TERRAIN_SLIME: {
    display: makeDisplay("terrain-slime"),
    name: "Slime Terrain",
    description: "Spend an extra turn moving in if you don't have Slime Walk.",
    ground: { slimy: true },
    explorable: {},
  },
  TERRAIN_CRYSTAL: {
    display: makeDisplay("terrain-crystal"),
    name: "Crystal Terrain",
    description: "Take extra damage when attacked.",
    ground: { spiky: true },
    explorable: {},
  },
  TERRAIN_MUSHROOM: {
    display: makeDisplay("terrain-mushroom"),
    name: "Mushroom Terrain",
    description: "Heals whoever is on it every turn.",
    ground: { healing: true },
    explorable: {},
  },
  TERRAIN_STAIRS: {
    display: makeDisplay("stairs", PRIORITY_BUILDING_LOW),
    name: "Stairs",
    description: "Ascend to the next level!",
    stairs: {},
    explorable: {},
  },
  DECORATION_SHOVEL: {
    display: makeDisplay("shovel", PRIORITY_BUILDING_LOW),
    name: "Shovel",
    explorable: {},
  },
  DECORATION_PICKAX: {
    display: makeDisplay("pickax", PRIORITY_BUILDING_LOW),
    name: "Pickax",
    explorable: {},
  },
  DECORATION_CART: {
    display: makeDisplay("cart", PRIORITY_BUILDING_LOW),
    name: "Mine Cart",
    explorable: {},
  },
  DECORATION_CART_LOADED: {
    display: makeDisplay("cart-loaded", PRIORITY_BUILDING_LOW),
    name: "Loaded Mine Cart",
    description: "Looks like something tasty inside.",
    explorable: {},
    consumable: {
      energy: 20,
      crystal: true,
    },
  },
  DECORATION_TRACK_VERTICAL: {
    display: makeDisplay("track-vertical", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_VERTICAL_T_E: {
    display: makeDisplay("track-t-vertical", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_VERTICAL_T_W: {
    display: {
      ...makeDisplay("track-t-vertical", PRIORITY_BUILDING_LOW),
      flipX: true,
    },
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_T_S: {
    display: {
      ...makeDisplay("track-t-horizontal", PRIORITY_BUILDING_LOW),
      flipY: true,
    },
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_T_N: {
    display: makeDisplay("track-t-horizontal", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL: {
    display: makeDisplay("track-horizontal", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_TOP_HALF: {
    display: makeDisplay("track-horizontal-top", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_BOTTOM_HALF: {
    display: makeDisplay("track-horizontal-bottom", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_CROSS: {
    display: makeDisplay("track-cross", PRIORITY_BUILDING_LOW),
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_TURN_N_E: {
    display: { ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW) },
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_TURN_N_W: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipX: true,
    },
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_TURN_S_E: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipY: true,
    },
    name: "Track",
    explorable: {},
  },
  DECORATION_TRACK_TURN_S_W: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipX: true,
      flipY: true,
    },
    name: "Track",
    explorable: {},
  },
  DECORATION_EGG_HATCHED: {
    display: makeDisplay("red-egg-hatched", PRIORITY_BUILDING_LOW),
    name: "Hatched Egg",
    explorable: true,
  },
  DECORATION_STONE_DOOR: {
    display: makeDisplay("stone-door", PRIORITY_BUILDING_LOW),
    name: "Door",
    explorable: true,
    consumable: { energy: 0 },
    diggable: {},
  },
  DECORATION_WOODEN_DOOR: {
    display: makeDisplay("wooden-door", PRIORITY_BUILDING_LOW),
    name: "Door",
    explorable: true,
    consumable: { energy: 0 },
    diggable: {},
  },
  DECORATION_TENT_CENTRAL: {
    display: makeDisplay("tent-central", PRIORITY_BUILDING_LOW),
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_TENT_N: {
    display: makeDisplay("tent-n", PRIORITY_BUILDING_LOW),
    name: "Tent",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_TENT_NE: {
    display: makeDisplay("tent-ne", PRIORITY_BUILDING_LOW),
    name: "Tent",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_TENT_SE: {
    display: makeDisplay("tent-se", PRIORITY_BUILDING_LOW),
    name: "Tent",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_TENT_NW: {
    display: makeDisplay("tent-nw", PRIORITY_BUILDING_LOW),
    name: "Tent",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_TENT_SW: {
    display: makeDisplay("tent-sw", PRIORITY_BUILDING_LOW),
    name: "Tent",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_BARREL: {
    display: makeDisplay("barrel", PRIORITY_BUILDING_LOW),
    name: "Barrel",
    explorable: true,
    consumable: { energy: 0 },
  },
  DECORATION_CAMPFIRE: {
    display: makeDisplay("campfire", PRIORITY_BUILDING_LOW),
    name: "Campfire",
    explorable: true,
    consumable: { energy: 0 },
  },
};

function makeDisplay(tile: string, priority = PRIORITY_TERRAIN): Display {
  return {
    tile,
    priority,
    hidden: true,
  };
}

export default templates;
