import { createStandardAction } from "typesafe-actions";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";

const heal = createStandardAction("heal")<{
  entityId: string;
  amount: number;
}>();
export default heal;

function healHandler(
  state: WrappedState,
  action: ReturnType<typeof heal>,
): void {
  const { entityId, amount } = action.payload;
  const targetEntity: Entity = state.select.entityById(entityId);
  let entity: Entity | undefined = targetEntity;
  const isPlayer = entity.wyrm && entity.wyrm.isPlayer;
  if (isPlayer) {
    entity = state.select.head();
  }
  if (!entity || !entity.health) return;

  const maxHealth = isPlayer
    ? state.select.playerMaxHealth()
    : entity.health.max;
  const currentHealth = isPlayer
    ? state.select.playerHealth()
    : entity.health.current;
  const segmentHealth = entity.health.current;
  const overMax = Math.max(currentHealth + amount - maxHealth, 0);
  const targetHealth = segmentHealth + amount - overMax;

  state.act.updateEntity({
    id: entity.id,
    health: {
      ...entity.health,
      current: targetHealth,
    },
  });

  if (targetHealth !== segmentHealth)
    renderer.flashStatusEffect(targetEntity.id, "icon-healed");
}

registerHandler(healHandler, heal);
