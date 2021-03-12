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
renderer
  .getLoadPromise()
  .then(() =>
    renderer.configureSpriteSheet("spritesheet", [
      { id: "wall", x: 9, y: 3 },
      { id: "terrain-mushroom", x: 6, y: 0 },
      { id: "mushroom-wall", x: 7, y: 0 },
      { id: "terrain-crystal", x: 6, y: 3 },
      { id: "crystal-wall", x: 7, y: 3 },
      { id: "terrain-slime", x: 6, y: 6 },
      { id: "slime-wall", x: 7, y: 6 },
      { id: "ground", x: 6, y: 5 },
      { id: "crystal", x: 6, y: 10 },
      { id: "mushroom", x: 5, y: 10 },
      { id: "slime", x: 7, y: 10 },
      { id: "mushroomman-bandit", x: 0, y: 17 },
      { id: "mad-crystalman", x: 1, y: 17 },
      { id: "feral-slime", x: 2, y: 17 },
      { id: "shroom-chemist", x: 3, y: 17 },
      { id: "crystal-legionnaire", x: 4, y: 17 },
      { id: "slime-engineer", x: 5, y: 17 },
      { id: "slime-bomb", x: 5, y: 16 },
      { id: "shroom-doctor", x: 3, y: 18 },
      { id: "crystalbow-scout", x: 4, y: 18 },
      { id: "slime-tamer", x: 5, y: 18 },
      { id: "trained-slime", x: 5, y: 19 },
      { id: "laborer", x: 7, y: 18 },
      { id: "corpse", x: 8, y: 18 },
      { id: "king", x: 8, y: 19 },
      { id: "royal-guard", x: 7, y: 19 },
      { id: "stairs", x: 7, y: 9 },
      { id: "wooden-floor", x: 8, y: 8 },
      { id: "wooden-wall", x: 9, y: 8 },
      { id: "brick-floor", x: 6, y: 8 },
      { id: "brick-wall", x: 7, y: 8 },
      { id: "marble-floor", x: 5, y: 7 },
      { id: "marble-wall", x: 7, y: 7 },
      { id: "royal-carpet", x: 8, y: 7 },
      { id: "carpet", x: 9, y: 7 },
      { id: "stone-door", x: 8, y: 5 },
      { id: "wooden-door", x: 9, y: 5 },
      { id: "chalice", x: 8, y: 10 },
      { id: "track-vertical", x: 5, y: 12 },
      { id: "track-turn", x: 5, y: 13 },
      { id: "track-horizontal-bottom", x: 6, y: 12 },
      { id: "track-horizontal-top", x: 6, y: 13 },
      { id: "track-horizontal", x: 7, y: 13 },
      { id: "track-t-horizontal", x: 7, y: 12 },
      { id: "track-t-vertical", x: 8, y: 12 },
      { id: "track-cross", x: 8, y: 13 },
      { id: "cart", x: 6, y: 14 },
      { id: "cart-loaded", x: 7, y: 14 },
      { id: "pickax", x: 8, y: 14 },
      { id: "shovel", x: 9, y: 14 },
      { id: "mushroom-field", x: 8, y: 0 },
      { id: "field", x: 8, y: 1 },
      ...getWyrmSpriteConfig("purple", 0),
      ...getWyrmSpriteConfig("blue", 3),
      ...getWyrmSpriteConfig("green", 6),
      ...getWyrmSpriteConfig("red", 9),
      ...getWyrmSpriteConfig("skeletal", 12),
    ]),
  );
renderer.start();

function getWyrmSpriteConfig(variant: string, yOffset: number) {
  return [
    { id: `${variant}-tail-vertical`, x: 0, y: 0 + yOffset },
    { id: `${variant}-straight-vertical`, x: 0, y: 1 + yOffset },
    { id: `${variant}-head-vertical`, x: 0, y: 2 + yOffset },
    { id: `${variant}-tail-diagonal`, x: 1, y: 0 + yOffset },
    { id: `${variant}-wide-vertical-to-diagonal`, x: 1, y: 1 + yOffset },
    { id: `${variant}-wide-vertical-to-diagonal-alt`, x: 2, y: 2 + yOffset },
    { id: `${variant}-tight-diagonal-to-diagonal`, x: 1, y: 2 + yOffset },
    { id: `${variant}-straight-diagonal`, x: 2, y: 0 + yOffset },
    { id: `${variant}-tight-vertical-to-diagonal`, x: 2, y: 1 + yOffset },
    { id: `${variant}-tight-vertical-to-diagonal-alt`, x: 3, y: 2 + yOffset },
    { id: `${variant}-head-diagonal`, x: 3, y: 0 + yOffset },
    { id: `${variant}-wide-diagonal-to-diagonal`, x: 3, y: 1 + yOffset },
    { id: `${variant}-egg`, x: 4, y: 0 + yOffset },
    { id: `${variant}-egg-hatched`, x: 4, y: 1 + yOffset },
  ];
}

export default renderer;
