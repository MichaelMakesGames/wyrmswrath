import { createStandardAction } from "typesafe-actions";
import { arePositionsEqual } from "~lib/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const consume = createStandardAction("consume")();
export default consume;

function consumeHandler(
  state: WrappedState,
  action: ReturnType<typeof consume>,
): void {
  const head = state.select.head();
  if (!head) return;
  const { pos } = head;
  const consumables = state.select
    .entitiesWithComps("consumable", "pos")
    .filter((e) => arePositionsEqual(e.pos, pos));
  for (const { consumable } of consumables) {
    state.setRaw({
      ...state.raw,
      energy: state.raw.energy + consumable.energy,
      crystalProgress: state.raw.crystalProgress + (consumable.crystal ? 1 : 0),
      mushroomProgress:
        state.raw.mushroomProgress + (consumable.mushroom ? 1 : 0),
      slimeProgress: state.raw.slimeProgress + (consumable.slime ? 1 : 0),
    });
  }
  state.act.removeEntities(consumables.map((e) => e.id));
}

registerHandler(consumeHandler, consume);
