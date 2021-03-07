import { createStandardAction } from "typesafe-actions";
import renderer from "~/renderer";
import { getPosKey } from "~lib/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const removeEntities = createStandardAction("REMOVE_ENTITIES")<string[]>();
export default removeEntities;

function removeEntitiesHandler(
  wrappedState: WrappedState,
  action: ReturnType<typeof removeEntities>,
): void {
  const { raw: state } = wrappedState;
  const entityIds = action.payload.filter((id) => state.entities[id]);

  const entities = {
    ...state.entities,
  };

  const { entitiesByPosition, entitiesByComp } = state;

  for (const id of entityIds) {
    const entity = entities[id];
    for (const key in entity) {
      if (key !== "id" && key !== "template" && key !== "parentTemplate") {
        entitiesByComp[key] = entitiesByComp[key] || new Set();
        entitiesByComp[key].delete(id);
      }
    }
    if (entity.pos) {
      entitiesByPosition[getPosKey(entity.pos)].delete(id);
    }
    if (entity.pos && entity.display) {
      renderer.removeEntity(id);
    }

    delete entities[id];
  }

  wrappedState.setRaw({
    ...state,
    entitiesByPosition,
    entities,
  });
}

registerHandler(removeEntitiesHandler, removeEntities);
