import { PRIORITY_BUILDING_LOW, PRIORITY_TERRAIN } from "~/constants";
import { Display, Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  TERRAIN_GROUND: {
    display: makeDisplay("ground"),
    ground: {},
    explorable: {},
  },
  TERRAIN_WALL: {
    display: makeDisplay("wall"),
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_CRYSTAL_WALL: {
    display: makeDisplay("crystal-wall"),
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_MUSHROOM_WALL: {
    display: makeDisplay("mushroom-wall"),
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
    explorable: {},
  },
  TERRAIN_SLIME_WALL: {
    display: makeDisplay("slime-wall"),
    blocking: {
      moving: true,
      fov: true,
    },
    diggable: {},
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
};

function makeDisplay(tile: string, priority = PRIORITY_TERRAIN): Display {
  return {
    tile,
    priority,
    hidden: true,
  };
}

export default templates;
