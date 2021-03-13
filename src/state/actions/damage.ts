import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";

const damage = createStandardAction("damage")<{
  entityId: string;
  amount: number;
  actorId?: string;
  ignoreArmor?: boolean;
  ignoreSpikes?: boolean;
}>();
export default damage;

function damageHandler(
  state: WrappedState,
  action: ReturnType<typeof damage>,
): void {
  const {
    entityId,
    actorId,
    amount,
    ignoreSpikes,
    ignoreArmor,
  } = action.payload;
  const entity = state.select.entityById(entityId);

  const strengthened = getStrengthened(state, actorId);
  const armor = getArmor(state, entity, ignoreArmor);
  const spikes = getSpikes(state, entity, ignoreSpikes);
  const adjustedAmount = Math.max(0, amount * strengthened - armor + spikes);

  if (actorId) {
    const actorName = state.select.name(actorId || "");
    const entityName = state.select.name(entityId);
    state.act.logMessage({
      message: `${actorName} attacks ${entityName} for ${
        amount * strengthened
      } damage${
        spikes
          ? `, and ${entityName} takes 1 more damage from the spiky crystal ground`
          : ""
      }${armor ? `, but armor blocks ${armor} damage.` : "."}`,
      type: entity.wyrm ? "damage" : "enemy",
    });
  }
  if (entity && entity.health) {
    if (entity.wyrm) {
      const head = state.select.head();
      if (head && head.health) {
        state.act.updateEntity({
          ...head,
          health: {
            ...head.health,
            current: head.health.current - adjustedAmount,
          },
        });
      }
    } else {
      const newHealth = entity.health.current - adjustedAmount;
      if (newHealth <= 0) {
        state.act.logMessage({
          message: `${state.select.name(entityId)} dies.`,
          type: "enemy",
        });
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
        if (getArmor(state, entity, ignoreArmor)) {
          renderer.flashStatusEffect(entity.id, "icon-armored");
        }
      }
    }
  }
}

function getArmor(state: WrappedState, entity: Entity, ignoreArmor?: boolean) {
  return !ignoreArmor && entity.statusEffects && entity.statusEffects.ARMORED
    ? entity.statusEffects.ARMORED.value || 1
    : 0;
}

function getSpikes(
  state: WrappedState,
  entity: Entity,
  ignoreSpikes?: boolean,
) {
  if (ignoreSpikes) return 0;
  if (!entity.pos) return 0;
  const positions = entity.wyrm
    ? state.select.entitiesWithComps("wyrm", "pos").map((e) => e.pos)
    : [entity.pos];
  return positions.some((pos) =>
    state.select
      .entitiesAtPosition(pos)
      .some((e) => e.ground && e.ground.spiky),
  )
    ? 1
    : 0;
}

function getStrengthened(state: WrappedState, actorId?: string) {
  if (!actorId) return 1;
  const entity = state.select.entityById(actorId);
  if (entity && entity.statusEffects && entity.statusEffects.STRENGTHENED)
    return 2;
  return 1;
}

registerHandler(damageHandler, damage);
