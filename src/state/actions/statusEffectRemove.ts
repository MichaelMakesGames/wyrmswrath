import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
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

  if (entity.wyrm && entity.wyrm.isPlayer && entity.id !== PLAYER_ID) {
    state.act.statusEffectRemove({ entityId: PLAYER_ID, type, value });
    return;
  }

  const statusEffects: StatusEffects = { ...(entity.statusEffects || {}) };
  const existing = statusEffects[type];
  if (!existing) return;

  if (value && existing.value) {
    if (value >= existing.value) {
      delete statusEffects[type];
      state.act.logMessage({
        message: getMessage(state.select.name(entityId), type),
        type: getMessageType(entityId === PLAYER_ID, type),
      });
    } else {
      statusEffects[type] = {
        ...existing,
        value: existing.value - value,
      };
    }
  } else {
    delete statusEffects[type];
    state.act.logMessage({
      message: getMessage(state.select.name(entityId), type),
      type: getMessageType(entityId === PLAYER_ID, type),
    });
  }

  state.act.updateEntity({
    ...entity,
    statusEffects,
  });
}

function getMessage(name: string, statusType: StatusEffectType) {
  switch (statusType) {
    case "ARMORED":
      return `${name} is no longer armored.`;
    case "CONFUSED":
      return `${name} is no longer confused.`;
    case "PARALYZED":
      return `${name} is no longer paralyzed.`;
    case "POISONED":
      return `${name} is no longer poisoned.`;
    case "SLIMED":
      return `${name} is no longer slimed.`;
    case "SLIME_WALK":
      return `${name} can no longer slime walk.`;
    case "STRENGTHENED":
      return `${name} is no longer poisoned.`;
    default:
      return `${name} is no longer ${statusType}.`;
  }
}

function getMessageType(
  isPlayer: boolean,
  statusType: StatusEffectType,
): "debuff" | "buff" | "enemy" {
  if (isPlayer)
    return ["ARMORED", "SLIME_WALK", "STRENGTHENED"].includes(statusType)
      ? "debuff"
      : "buff";
  return "enemy";
}

registerHandler(statusEffectRemoveHandler, statusEffectRemove);
