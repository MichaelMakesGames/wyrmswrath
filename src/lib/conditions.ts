import { MAP_HEIGHT, MAP_WIDTH } from "~constants";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";

const conditions: Record<
  ConditionName,
  (state: WrappedState, entity: Entity) => boolean
> = {
  isNotBlocked(state, entity) {
    if (!entity.pos) return true;
    return !state.select.isPositionBlocked(entity.pos, [entity]);
  },

  isNotOnEdgeOfMap(state, entity) {
    if (!entity.pos) return true;
    return (
      entity.pos.x > 0 &&
      entity.pos.y > 0 &&
      entity.pos.x < MAP_WIDTH - 1 &&
      entity.pos.y < MAP_HEIGHT - 1
    );
  },
};

export function areConditionsMet(
  state: WrappedState,
  entity: Entity,
  ...conditionNames: (ConditionName | null)[]
) {
  return conditionNames.every(
    (name) => !name || conditions[name](state, entity),
  );
}
