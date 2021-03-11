import WrappedState from "~types/WrappedState";
import aiSystem from "./aiSystem";
import animationToggleSystem from "./animationToggleSystem";
import colorToggleSystem from "./colorToggleSystem";
import coolDownSystem from "./coolDownSystem";
import energySystem from "./energySystem";
import eventSystem from "./eventSystem";
import fovSystem from "./fovSystem";
import gameOverSystem from "./gameOverSystem";
import healingSystem from "./healingSystem";
import poisonSystem from "./poisonSystem";
import statusEffectSystem from "./statusEffectSystem";
import timeSystem from "./timeSystem";
import wyrmDisplaySystem from "./wyrmDisplaySystem";

const systems: ((state: WrappedState) => void)[] = [
  energySystem,
  aiSystem,
  coolDownSystem,
  poisonSystem,
  healingSystem,
  statusEffectSystem,
  eventSystem,
  timeSystem,
  gameOverSystem,
  colorToggleSystem,
  animationToggleSystem,
  fovSystem,
  wyrmDisplaySystem,
];

export default systems;
