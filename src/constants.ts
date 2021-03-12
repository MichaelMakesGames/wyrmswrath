import { Direction } from "~types";

export const VERSION = "0.0.0-unstable";
export const PLAYER_ID = "PLAYER";
export const CURSOR_ID = "CURSOR";

export const MAP_WIDTH = 60;
export const MAP_HEIGHT = 40;
export const HEX_WIDTH = 24;
export const HEX_BASE_WIDTH = 12;
export const HEX_HEIGHT = 24;

export const HAND_SIZE = 3;
export const CARD_CHOICES_PER_UNLOCK = 3;
export const MAX_ENERGY_PER_SIZE = 20;
export const MAX_HEALTH_PER_SIZE = 10;

export const FOV_RANGE = 10;
export const DIJKSTRA_RANGE = 12;

export const PRIORITY_MARKER = 30;
export const PRIORITY_LASER = 25;
export const PRIORITY_BUILDING_DETAIL = 20;
export const PRIORITY_BUILDING_HIGH = 15;
export const PRIORITY_UNIT = 10;
export const PRIORITY_BUILDING_LOW = 5;
export const PRIORITY_TERRAIN = 0;

export const TRANSPARENT = "transparent";

export const N = "N";
export const NE = "NE";
export const SE = "SE";
export const S = "S";
export const SW = "SW";
export const NW = "NW";
export const DIRECTIONS: Direction[] = [N, NE, SE, S, SW, NW];
