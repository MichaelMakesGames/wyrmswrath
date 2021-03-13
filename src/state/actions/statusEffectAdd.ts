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

  state.act.logMessage({
    message: getMessage(
      state.select.name(entityId),
      type,
      (statusEffects[type] || {}).value,
    ),
    type: getMessageType(entityId === PLAYER_ID, type),
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

function getMessage(
  name: string,
  statusType: StatusEffectType,
  value: number | undefined,
) {
  switch (statusType) {
    case "ARMORED":
      return `${name} is now armored${value ? ` (${value})` : ""}.`;
    case "CONFUSED":
      return `${name} is now confused${value ? ` (${value})` : ""}.`;
    case "PARALYZED":
      return `${name} is now paralyzed${value ? ` (${value})` : ""}.`;
    case "POISONED":
      return `${name} is now poisoned${value ? ` (${value})` : ""}.`;
    case "SLIMED":
      return `${name} is now slimed${value ? ` (${value})` : ""}.`;
    case "SLIME_WALK":
      return `${name} can now slime walk${value ? ` (${value})` : ""}.`;
    case "STRENGTHENED":
      return `${name} is now poisoned${value ? ` (${value})` : ""}.`;
    default:
      return `${name} is now ${statusType}${value ? ` (${value})` : ""}.`;
  }
}

function getMessageType(
  isPlayer: boolean,
  statusType: StatusEffectType,
): "debuff" | "buff" | "enemy" {
  if (isPlayer)
    return !["ARMORED", "SLIME_WALK", "STRENGTHENED"].includes(statusType)
      ? "debuff"
      : "buff";
  return "enemy";
}

registerHandler(statueEffectAddHandler, statueEffectAdd);
