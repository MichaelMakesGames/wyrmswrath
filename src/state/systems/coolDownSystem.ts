import { Required } from "Object/_api";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";

export default function coolDownSystem(state: WrappedState): void {
  state.select
    .entitiesWithComps("monster")
    .forEach((entity) => coolDownAbilities(state, entity));
}

function coolDownAbilities(
  state: WrappedState,
  entity: Required<Entity, "monster">,
) {
  if (entity.monster.abilities.some((a) => a.readyIn > 0)) {
    state.act.updateEntity({
      id: entity.id,
      monster: {
        ...entity.monster,
        abilities: entity.monster.abilities.map((a) =>
          a.readyIn > 0 ? { ...a, readyIn: a.readyIn - 1 } : a,
        ),
      },
    });
  }
}
