import { createStandardAction } from "typesafe-actions";
import audio from "~lib/audio";
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

  for (const { id, consumable } of consumables) {
    state.setRaw({
      ...state.raw,
      energy: state.raw.energy + consumable.energy,
      crystalProgress: state.raw.crystalProgress + (consumable.crystal ? 1 : 0),
      mushroomProgress:
        state.raw.mushroomProgress + (consumable.mushroom ? 1 : 0),
      slimeProgress: state.raw.slimeProgress + (consumable.slime ? 1 : 0),
    });

    if (
      consumable.victory ||
      consumable.energy ||
      consumable.crystal ||
      consumable.mushroom ||
      consumable.slime
    ) {
      state.act.logMessage({
        message: `Player consumes the ${state.select.name(id)}`,
        type: "buff",
      });
    }

    if (consumable.victory) {
      state.setRaw({
        ...state.raw,
        gameOver: true,
        victory: true,
      });
      state.act.logMessage({
        message: "VICTORY!",
        type: "buff",
      });
    }
  }

  state.act.removeEntities(consumables.map((e) => e.id));

  if (consumables.length) audio.play("sfx-consume");
}

registerHandler(consumeHandler, consume);
