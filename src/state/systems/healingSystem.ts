import WrappedState from "~types/WrappedState";

export default function healingSystem(state: WrappedState): void {
  for (const { pos } of state.select
    .entitiesWithComps("ground", "pos")
    .filter((e) => e.ground.healing)) {
    for (const { id, health } of state.select.entitiesAtPosition(pos)) {
      if (health) state.act.heal({ entityId: id, amount: 1 });
    }
  }
}
