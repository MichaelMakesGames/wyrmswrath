import { StatusEffect, StatusEffects } from "~types";
import WrappedState from "~types/WrappedState";

export default function statusEffectSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("statusEffects")) {
    const statusEffects: StatusEffects = { ...entity.statusEffects };
    for (const statusEffect of Object.values(statusEffects) as StatusEffect[]) {
      if (statusEffect.expiresIn !== undefined) {
        if (statusEffect.expiresIn <= 1) {
          delete statusEffects[statusEffect.type];
        } else {
          statusEffects[statusEffect.type] = {
            ...statusEffect,
            expiresIn: statusEffect.expiresIn - 1,
          };
        }
      }
    }
    state.act.updateEntity({
      ...entity,
      statusEffects,
    });
  }
}
