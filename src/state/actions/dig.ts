import { createStandardAction } from "typesafe-actions";
import { createEntityFromTemplate } from "~lib/entities";
import { getAdjacentPositions } from "~lib/geometry";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";

const dig = createStandardAction("dig")<Pos>();
export default dig;

function digHandler(state: WrappedState, action: ReturnType<typeof dig>): void {
  state.act.removeEntities(
    state.select
      .entitiesAtPosition(action.payload)
      .filter((e) => e.diggable)
      .map((e) => e.id),
  );
  state.act.addEntity(
    createEntityFromTemplate("TERRAIN_GROUND", { pos: action.payload }),
  );
  for (const pos of [...getAdjacentPositions(action.payload)]) {
    if (state.select.entitiesAtPosition(pos).length === 0) {
      state.act.addEntity(createEntityFromTemplate("TERRAIN_WALL", { pos }));
    }
  }
}

registerHandler(digHandler, dig);
