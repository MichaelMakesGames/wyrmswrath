import { createStandardAction } from "typesafe-actions";
import { StatusEffectType } from "~data/statusEffectTypes";
import { registerHandler } from "~state/handleAction";
import { StatusEffects } from "~types";
import WrappedState from "~types/WrappedState";

const statueEffectAdd = createStandardAction("statueEffectAdd")<{
  entityId: string;
  type: StatusEffectType;
  value?: number;
  expiresIn?: number;
}>();
export default statueEffectAdd;

function statueEffectAddHandler(
  state: WrappedState,
  action: ReturnType<typeof statueEffectAdd>,
): void {
  const { entityId, type, value, expiresIn } = action.payload;
  const entity = state.select.entityById(entityId);
  if (!entity) return;

  if (entity.wyrm && entity.wyrm.isPlayer && entity !== state.select.head()) {
    state.act.statusEffectAdd({ entityId, type, value, expiresIn });
  }

  const statusEffects: StatusEffects = { ...(entity.statusEffects || {}) };
  const existing = statusEffects[type];
  if (existing) {
    statusEffects[type] = {
      type,
      expiresIn: existing.expiresIn
        ? Math.max(existing.expiresIn, expiresIn || 0)
        : undefined,
      value: existing.value ? existing.value + (value || 1) : undefined,
    };
  } else {
    statusEffects[type] = { type, value, expiresIn };
  }
  state.act.updateEntity({
    ...entity,
    statusEffects,
  });
}

registerHandler(statueEffectAddHandler, statueEffectAdd);
