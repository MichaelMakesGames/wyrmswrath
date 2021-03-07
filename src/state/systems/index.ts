import WrappedState from "~types/WrappedState";
import aiSystem from "./aiSystem";
import animationToggleSystem from "./animationToggleSystem";
import colorToggleSystem from "./colorToggleSystem";
import eventSystem from "./eventSystem";
import gameOverSystem from "./gameOverSystem";
import timeSystem from "./timeSystem";
import wyrmDisplaySystem from "./wyrmDisplaySystem";

const systems: ((state: WrappedState) => void)[] = [
  aiSystem,
  eventSystem,
  timeSystem,
  gameOverSystem,
  colorToggleSystem,
  animationToggleSystem,
  wyrmDisplaySystem,
];

export default systems;
