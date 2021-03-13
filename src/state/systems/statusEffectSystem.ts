import { StatusEffectType } from "~data/statusEffectTypes";
import { StatusEffect, StatusEffects } from "~types";
import WrappedState from "~types/WrappedState";

export default function statusEffectSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("statusEffects")) {
    const statusEffects: StatusEffects = { ...entity.statusEffects };
    const typesToRemove: StatusEffectType[] = [];
    for (const statusEffect of Object.values(statusEffects) as StatusEffect[]) {
      if (statusEffect.expiresIn !== undefined) {
        if (statusEffect.expiresIn <= 1) {
          typesToRemove.push(statusEffect.type);
        } else {
          statusEffects[statusEffect.type] = {
            ...statusEffect,
            expiresIn: statusEffect.expiresIn - 1,
          };
        }
      }
    }
    state.act.updateEntity({
      id: entity.id,
      statusEffects,
    });
    typesToRemove.forEach((type) =>
      state.act.statusEffectRemove({ entityId: entity.id, type }),
    );
  }
}
