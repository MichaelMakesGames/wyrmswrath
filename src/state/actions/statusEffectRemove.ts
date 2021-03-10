import { createStandardAction } from "typesafe-actions";
import { StatusEffectType } from "~data/statusEffectTypes";
import { registerHandler } from "~state/handleAction";
import { StatusEffects } from "~types";
import WrappedState from "~types/WrappedState";

const statusEffectRemove = createStandardAction("statusEffectRemove")<{
  entityId: string;
  type: StatusEffectType;
  value?: number;
}>();
export default statusEffectRemove;

function statusEffectRemoveHandler(
  state: WrappedState,
  action: ReturnType<typeof statusEffectRemove>,
): void {
  const { entityId, type, value } = action.payload;
  const entity = state.select.entityById(entityId);
  if (!entity) return;

  if (entity.wyrm && entity.wyrm.isPlayer && entity !== state.select.head()) {
    state.act.statusEffectRemove({ entityId, type, value });
  }

  const statusEffects: StatusEffects = { ...(entity.statusEffects || {}) };
  const existing = statusEffects[type];
  if (!existing) return;

  if (value && existing.value) {
    if (value >= existing.value) {
      delete statusEffects[type];
    } else {
      statusEffects[type] = {
        ...existing,
        value: existing.value - value,
      };
    }
  } else {
    delete statusEffects[type];
  }

  state.act.updateEntity({
    ...entity,
    statusEffects,
  });
}

registerHandler(statusEffectRemoveHandler, statusEffectRemove);
