import { createStandardAction } from "typesafe-actions";
import { createEntityFromTemplate } from "~lib/entities";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const damage = createStandardAction("damage")<{
  entityId: string;
  amount: number;
}>();
export default damage;

function damageHandler(
  state: WrappedState,
  action: ReturnType<typeof damage>,
): void {
  const { entityId, amount } = action.payload;
  const entity = state.select.entityById(entityId);
  if (entity && entity.health) {
    if (entity.wyrm && entity.wyrm.isPlayer) {
      const head = state.select.head();
      if (head && head.health) {
        state.act.updateEntity({
          ...head,
          health: {
            ...head.health,
            current: head.health.current - amount,
          },
        });
      }
    } else {
      const newHealth = Math.max(0, entity.health.current - amount);
      if (newHealth === 0) {
        state.act.removeEntity(entityId);
        if (entity.pos && entity.drops) {
          state.act.addEntity(
            createEntityFromTemplate(entity.drops.template, {
              pos: entity.pos,
            }),
          );
        }
      } else {
        state.act.updateEntity({
          ...entity,
          health: { ...entity.health, current: newHealth },
        });
      }
    }
  }
}

registerHandler(damageHandler, damage);
