import { PLAYER_ID } from "~constants";
import renderer from "~renderer";
import WrappedState from "~types/WrappedState";

export default function poisonSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps(
    "health",
    "statusEffects",
  )) {
    if (entity.statusEffects.POISONED) {
      renderer.flashStatusEffect(entity.id, "icon-poisoned");
      const amount = entity.statusEffects.POISONED.value || 1;
      state.act.logMessage({
        message: `${state.select.name(
          entity.id,
        )} suffers ${amount} poison damage.`,
        type: entity.wyrm ? "damage" : "enemy",
      });
      state.act.damage({
        entityId: entity.id,
        ignoreArmor: true,
        ignoreSpikes: true,
        amount,
      });

      if (
        entity.wyrm &&
        entity.statusEffects &&
        entity.statusEffects.POISONED &&
        (entity.statusEffects.POISONED.value || 1) > 1
      ) {
        state.act.logMessage({
          message:
            "Since player has more than 1 poison, the poison level decays by 1.",
          type: "buff",
        });
        state.act.statusEffectRemove({
          entityId: PLAYER_ID,
          type: "POISONED",
          value: 1,
        });
      }
    }
  }
}
