import WrappedState from "~types/WrappedState";

export default function healingSystem(state: WrappedState): void {
  for (const { pos } of state.select
    .entitiesWithComps("ground", "pos")
    .filter((e) => e.ground.healing)) {
    for (const { id, wyrm, health } of state.select.entitiesAtPosition(pos)) {
      if (
        (health && health.current < health.max) ||
        (wyrm && state.select.playerHealth() < state.select.playerMaxHealth())
      ) {
        state.act.heal({ entityId: id, amount: 1 });
        state.act.logMessage({
          message: `${state.select.name(
            id,
          )} is healed by the mushroom terrain.`,
          type: wyrm ? "buff" : "enemy",
        });
      }
    }
  }
}
