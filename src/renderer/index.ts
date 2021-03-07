import * as PIXI from "pixi.js";
import colors from "~colors";
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
  backgroundColor: colors.background,
});

renderer.load(tiles);
renderer.getLoadPromise().then(() =>
  renderer.configureSpriteSheet("spritesheet", [
    { id: "wall", x: 9, y: 0 },
    { id: "ground", x: 9, y: 1 },
    { id: "wyrm-tail-vertical", x: 0, y: 0 },
    { id: "wyrm-straight-vertical", x: 0, y: 1 },
    { id: "wyrm-head-vertical", x: 0, y: 2 },
    { id: "wyrm-tail-diagonal", x: 1, y: 0 },
    { id: "wyrm-wide-vertical-to-diagonal", x: 1, y: 1 },
    { id: "wyrm-tight-diagonal-to-diagonal", x: 1, y: 2 },
    { id: "wyrm-straight-diagonal", x: 2, y: 0 },
    { id: "wyrm-tight-vertical-to-diagonal", x: 2, y: 1 },
    { id: "wyrm-head-diagonal", x: 3, y: 0 },
    { id: "wyrm-wide-diagonal-to-diagonal", x: 3, y: 1 },
  ]),
);
renderer.start();

export default renderer;
