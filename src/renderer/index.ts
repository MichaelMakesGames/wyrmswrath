import * as PIXI from "pixi.js";
import colors from "~colors";
import spriteSheetData from "~data/spriteSheetData";
// @ts-ignore
import tiles from "../assets/tiles/*.png"; // eslint-disable-line import/no-unresolved
import {
  HEX_BASE_WIDTH,
  HEX_HEIGHT,
  HEX_WIDTH,
  MAP_HEIGHT,
  MAP_WIDTH,
} from "../constants";
import Renderer from "./Renderer";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new Renderer({
  gridWidth: MAP_WIDTH,
  gridHeight: MAP_HEIGHT,
  tileWidth: HEX_WIDTH,
  tileHeight: HEX_HEIGHT,
  hex: true,
  hexBaseWidth: HEX_BASE_WIDTH,
  backgroundColor: colors.black,
});

renderer.load(tiles);
renderer
  .getLoadPromise()
  .then(() => renderer.configureSpriteSheet("spritesheet", spriteSheetData));
renderer.start();

export default renderer;
