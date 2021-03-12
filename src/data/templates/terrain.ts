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
    ground: {},
    explorable: {},
  },
  TERRAIN_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("wall"),
  },
  TERRAIN_CRYSTAL_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("crystal-wall"),
  },
  TERRAIN_MUSHROOM_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("mushroom-wall"),
  },
  TERRAIN_SLIME_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("slime-wall"),
  },
  TERRAIN_WOODEN_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("wooden-wall"),
  },
  TERRAIN_WOODEN_FLOOR: {
    display: makeDisplay("wooden-floor"),
    ground: {},
    explorable: {},
  },
  TERRAIN_BRICK_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("brick-wall"),
  },
  TERRAIN_BRICK_FLOOR: {
    display: makeDisplay("brick-floor"),
    ground: {},
    explorable: {},
  },
  TERRAIN_MARBLE_WALL: {
    parentTemplate: "TERRAIN_WALL_BASE",
    display: makeDisplay("marble-wall"),
  },
  TERRAIN_MARBLE_FLOOR: {
    display: makeDisplay("marble-floor"),
    ground: {},
    explorable: {},
  },
  TERRAIN_CARPET: {
    display: makeDisplay("carpet"),
    ground: {},
    explorable: {},
  },
  TERRAIN_ROYAL_CARPET: {
    display: makeDisplay("royal-carpet"),
    ground: {},
    explorable: {},
  },
  TERRAIN_FIELD: {
    display: makeDisplay("field"),
    ground: {},
    explorable: {},
  },
  TERRAIN_MUSHROOM_FIELD: {
    display: makeDisplay("mushroom-field"),
    ground: {},
    explorable: {},
  },
  TERRAIN_SLIME: {
    display: makeDisplay("terrain-slime"),
    ground: { slimy: true },
    explorable: {},
  },
  TERRAIN_CRYSTAL: {
    display: makeDisplay("terrain-crystal"),
    ground: { spiky: true },
    explorable: {},
  },
  TERRAIN_MUSHROOM: {
    display: makeDisplay("terrain-mushroom"),
    ground: { healing: true },
    explorable: {},
  },
  TERRAIN_STAIRS: {
    display: makeDisplay("stairs", PRIORITY_BUILDING_LOW),
    stairs: {},
    explorable: {},
  },
  DECORATION_SHOVEL: {
    display: makeDisplay("shovel", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_PICKAX: {
    display: makeDisplay("pickax", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_CART: {
    display: makeDisplay("cart", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_CART_LOADED: {
    display: makeDisplay("cart-loaded", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_VERTICAL: {
    display: makeDisplay("track-vertical", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_VERTICAL_T_E: {
    display: makeDisplay("track-t-vertical", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_VERTICAL_T_W: {
    display: {
      ...makeDisplay("track-t-vertical", PRIORITY_BUILDING_LOW),
      flipX: true,
    },
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_T_S: {
    display: {
      ...makeDisplay("track-t-horizontal", PRIORITY_BUILDING_LOW),
      flipY: true,
    },
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_T_N: {
    display: makeDisplay("track-t-horizontal", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL: {
    display: makeDisplay("track-horizontal", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_TOP_HALF: {
    display: makeDisplay("track-horizontal-top", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_HORIZONTAL_BOTTOM_HALF: {
    display: makeDisplay("track-horizontal-bottom", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_CROSS: {
    display: makeDisplay("track-cross", PRIORITY_BUILDING_LOW),
    explorable: {},
  },
  DECORATION_TRACK_TURN_N_E: {
    display: { ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW) },
    explorable: {},
  },
  DECORATION_TRACK_TURN_N_W: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipX: true,
    },
    explorable: {},
  },
  DECORATION_TRACK_TURN_S_E: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipY: true,
    },
    explorable: {},
  },
  DECORATION_TRACK_TURN_S_W: {
    display: {
      ...makeDisplay("track-turn", PRIORITY_BUILDING_LOW),
      flipX: true,
      flipY: true,
    },
    explorable: {},
  },
  DECORATION_EGG_HATCHED: {
    display: makeDisplay("red-egg-hatched", PRIORITY_BUILDING_LOW),
    explorable: true,
  },
  DECORATION_STONE_DOOR: {
    display: makeDisplay("stone-door", PRIORITY_BUILDING_LOW),
    explorable: true,
    consumable: { energy: 0 },
    diggable: {},
  },
  DECORATION_WOODEN_DOOR: {
    display: makeDisplay("wooden-door", PRIORITY_BUILDING_LOW),
    explorable: true,
    consumable: { energy: 0 },
    diggable: {},
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
