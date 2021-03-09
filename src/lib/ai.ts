/* eslint-disable import/prefer-default-export */
import { Action, Entity } from "~/types";
import WrappedState from "~types/WrappedState";

export function getAIActions(entity: Entity, state: WrappedState): Action[] {
  const { ai } = entity;
  if (!ai) return [];

  return [];
}
