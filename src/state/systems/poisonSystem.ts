import WrappedState from "~types/WrappedState";

export default function poisonSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps(
    "health",
    "statusEffects",
  )) {
    if (entity.statusEffects.POISONED) {
      state.act.damage({
        entityId: entity.id,
        amount: entity.statusEffects.POISONED.value || 1,
        ignoreArmor: true,
        ignoreSpikes: true,
      });
    }
  }
}
