import { createStandardAction } from "typesafe-actions";
import { VERSION } from "~constants";
import { resetEntitiesByCompAndPos } from "~lib/entities";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import animationToggleSystem from "~state/systems/animationToggleSystem";
import wyrmDisplaySystem from "~state/systems/wyrmDisplaySystem";
import { RawState } from "~types";
import WrappedState from "~types/WrappedState";

const loadGame = createStandardAction("LOAD_GAME")<{
  state: RawState;
}>();
export default loadGame;

function loadGameHandler(
  state: WrappedState,
  action: ReturnType<typeof loadGame>,
): void {
  const { state: loadedState } = action.payload;
  state.setRaw({
    ...loadedState,
    version: VERSION,
  });
  resetEntitiesByCompAndPos(state);
  state.act.setCursorPos(null);
  renderer.clear();
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => renderer.addEntity(entity));
  animationToggleSystem(state);
  wyrmDisplaySystem(state);
}

registerHandler(loadGameHandler, loadGame);
