import { createStandardAction } from "typesafe-actions";
import { CURSOR_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";

const setCursorPos = createStandardAction("SET_CURSOR_POS")<Pos | null>();
export default setCursorPos;

function setCursorPosHandler(
  state: WrappedState,
  action: ReturnType<typeof setCursorPos>,
): void {
  const newCursorPos = action.payload;
  state.setRaw({
    ...state.raw,
    cursorPos: newCursorPos,
  });

  const cursor = state.select.entityById(CURSOR_ID);
  if (newCursorPos) {
    if (cursor) {
      state.act.updateEntity({
        id: CURSOR_ID,
        pos: newCursorPos,
      });
    } else {
      state.act.addEntity({
        ...createEntityFromTemplate("CURSOR", { pos: newCursorPos }),
        id: CURSOR_ID,
      });
    }
  } else if (cursor) {
    state.act.removeEntity(CURSOR_ID);
  }
}

registerHandler(setCursorPosHandler, setCursorPos);
