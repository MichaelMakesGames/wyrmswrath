import { Action, Entity } from "~types";
import WrappedState from "~types/WrappedState";

const onDestroyEffects: {
  [id: string]: (state: WrappedState, entity: Entity) => Action[];
} = {};

export default onDestroyEffects;
