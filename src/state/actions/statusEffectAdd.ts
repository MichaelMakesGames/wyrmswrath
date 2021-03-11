import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
import { StatusEffectType } from "~data/statusEffectTypes";
import renderer from "~renderer";
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

  if (entity.wyrm && entity.wyrm.isPlayer && entity.id !== PLAYER_ID) {
    state.act.statusEffectAdd({ entityId: PLAYER_ID, type, value, expiresIn });
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
    id: entity.id,
    statusEffects,
  });

  if (type === "SLIMED") {
    renderer.flashStatusEffect(entityId, "icon-slimed");
  } else if (type === "CONFUSED") {
    renderer.flashStatusEffect(entityId, "icon-confused");
  } else if (type === "PARALYZED") {
    renderer.flashStatusEffect(entityId, "icon-paralyzed");
  } else if (type === "STRENGTHENED") {
    renderer.flashStatusEffect(entityId, "icon-strengthened");
  } else if (type === "SLIME_WALK") {
    renderer.flashStatusEffect(entityId, "icon-slime-walk");
  } else if (type === "ARMORED") {
    renderer.flashStatusEffect(entityId, "icon-armored");
  }
}

registerHandler(statueEffectAddHandler, statueEffectAdd);
