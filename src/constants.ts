import { Direction } from "~types";

export const VERSION = "0.0.0-unstable";
export const PLAYER_ID = "PLAYER";
export const CURSOR_ID = "CURSOR";

export const MAP_WIDTH = 32;
export const MAP_HEIGHT = 24;
export const HEX_WIDTH = 24;
export const HEX_BASE_WIDTH = 12;
export const HEX_HEIGHT = 24;
export const SIDE_BAR_CSS_WIDTH = "256px";
export const HEADER_CSS_HEIGHT = "33px";
export const BUILD_MENU_CSS_HEIGHT = "34px";
export const MAP_CSS_WIDTH = `min(calc(100vw - ${SIDE_BAR_CSS_WIDTH} - ${SIDE_BAR_CSS_WIDTH}), calc(100vh - ${BUILD_MENU_CSS_HEIGHT} - ${HEADER_CSS_HEIGHT}), ${
  ((HEX_WIDTH + HEX_BASE_WIDTH) / 2) * MAP_WIDTH +
  (HEX_WIDTH - HEX_BASE_WIDTH) / 2
}px)`;
export const HEADER_CSS_WIDTH = `calc(${MAP_CSS_WIDTH} + ${SIDE_BAR_CSS_WIDTH} + ${SIDE_BAR_CSS_WIDTH})`;

export const HAND_SIZE = 3;

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
