import { Direction } from "~types";
import type WrappedState from "~types/WrappedState";

export type CardCode = "FAST_CARD" | "BORING_CARD" | "DIRECTIONAL_CARD";

export interface Card {
  code: CardCode;
  name: string;
  type: "mushroom" | "crystal" | "slime";
  description: string;
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
    effect: (state, direction) =>
      state.act.logMessage({
        message: `You did nothing to the ${direction} of you`,
        type: "success",
      }),
  },
};

export default cards;
