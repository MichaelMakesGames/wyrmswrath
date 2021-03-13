import { getType } from "typesafe-actions";
import { Action, RawState } from "~/types";
import actions from "./actions";
import { createInitialState } from "./initialState";
import wrapState from "./wrapState";

const GAME_OVER_ALLOW_LIST: string[] = [
  getType(actions.newGame),
  getType(actions.setCursorPos),
  getType(actions.moveCursor),
];

export default function reducer(
  state: RawState = createInitialState(),
  action: Action,
): RawState {
  const wrappedState = wrapState(state);
  if (state.gameOver && !GAME_OVER_ALLOW_LIST.includes(action.type)) {
    wrappedState.act.logMessage({
      message: "Game Over! Press N to start a new game.",
      type: "error",
    });
    return wrappedState.raw;
  }
  wrappedState.handle(action);
  return wrappedState.raw;
}
