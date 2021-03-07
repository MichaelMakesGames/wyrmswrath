import { Direction } from "~types";
import type WrappedState from "~types/WrappedState";

export type CardCode =
  | "FAST_CARD"
  | "BORING_CARD"
  | "DIRECTIONAL_CARD"
  | "NORTH_ONLY";

export interface Card {
  code: CardCode;
  name: string;
  type: "mushroom" | "crystal" | "slime";
  description: string;
  validator?: (
    state: WrappedState,
    direction?: Direction,
  ) => { valid: boolean; message?: string };
  effect: (state: WrappedState, direction?: Direction) => void;
  fast?: boolean;
  directional?: boolean;
}

const cards: Record<CardCode, Card> = {
  FAST_CARD: {
    code: "FAST_CARD",
    name: "Fast Card",
    type: "crystal",
    description: "This card doesn't take a turn.",
    fast: true,
    effect: (state) =>
      state.act.logMessage({ message: "Speedy", type: "success" }),
  },
  BORING_CARD: {
    code: "BORING_CARD",
    name: "Boring Card",
    type: "slime",
    description: "This card doesn't take a turn",
    effect: (state) =>
      state.act.logMessage({ message: "Fun fun fun", type: "success" }),
  },
  DIRECTIONAL_CARD: {
    code: "DIRECTIONAL_CARD",
    name: "Directional Card",
    type: "mushroom",
    description: "You need to specify a direction for this one.",
    directional: true,
    effect: (state, direction) =>
      state.act.logMessage({
        message: `You did nothing to the ${direction} of you`,
        type: "success",
      }),
  },
  NORTH_ONLY: {
    code: "NORTH_ONLY",
    name: "North Only",
    type: "slime",
    description: "This card can only be played to the north",
    directional: true,
    validator: (state, direction) => {
      if (direction !== "N")
        return { valid: false, message: "Gotta play North!" };
      return { valid: true };
    },
    effect: (state, direction) =>
      state.act.logMessage({ message: "North!", type: "success" }),
  },
};

export default cards;
