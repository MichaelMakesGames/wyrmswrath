import { Direction } from "~types";
import type WrappedState from "~types/WrappedState";

export type CardCode =
  | "CRYSTAL_CHARGE"
  | "CRYSTAL_CRYSTALIZE"
  | "CRYSTAL_ELEGANCE"
  | "CRYSTAL_FLASH"
  | "CRYSTAL_JAVELIN"
  | "CRYSTAL_RAZOR_SKIN"
  | "CRYSTAL_ROCK_HARD"
  | "CRYSTAL_SPIKED_TAIL"
  | "MUSHROOM_ANTIDOTE"
  | "MUSHROOM_GROWTH"
  | "MUSHROOM_HALLUCINOGENIC_SPORES"
  | "MUSHROOM_HEAL"
  | "MUSHROOM_OPEN_YOUR_MIND"
  | "MUSHROOM_PARALYZING_SPORES"
  | "MUSHROOM_SEEDING_SPORES"
  | "MUSHROOM_STRENGTHEN"
  | "SLIME_MALLEABLE"
  | "SLIME_MUTATE"
  | "SLIME_OOZE"
  | "SLIME_POISON_SKIN"
  | "SLIME_SHAPE_SHIFTING"
  | "SLIME_SLIME_WALK"
  | "SLIME_TOXICITY"
  | "SLIME_VOMIT";

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
  CRYSTAL_CHARGE: {
    code: "CRYSTAL_CHARGE",
    name: "Charge",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_CRYSTALIZE: {
    code: "CRYSTAL_CRYSTALIZE",
    name: "Crystalize",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_ELEGANCE: {
    code: "CRYSTAL_ELEGANCE",
    name: "Elegance",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_FLASH: {
    code: "CRYSTAL_FLASH",
    name: "Flash",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_JAVELIN: {
    code: "CRYSTAL_JAVELIN",
    name: "Javelin",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_RAZOR_SKIN: {
    code: "CRYSTAL_RAZOR_SKIN",
    name: "Razor Skin",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_ROCK_HARD: {
    code: "CRYSTAL_ROCK_HARD",
    name: "Rock Hard",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  CRYSTAL_SPIKED_TAIL: {
    code: "CRYSTAL_SPIKED_TAIL",
    name: "Spiked Tail",
    type: "crystal",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_ANTIDOTE: {
    code: "MUSHROOM_ANTIDOTE",
    name: "Antidote",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_GROWTH: {
    code: "MUSHROOM_GROWTH",
    name: "Growth",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_HALLUCINOGENIC_SPORES: {
    code: "MUSHROOM_HALLUCINOGENIC_SPORES",
    name: "Hallucinogenic Spores",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_HEAL: {
    code: "MUSHROOM_HEAL",
    name: "Heal",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_OPEN_YOUR_MIND: {
    code: "MUSHROOM_OPEN_YOUR_MIND",
    name: "Open Your Mind",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_PARALYZING_SPORES: {
    code: "MUSHROOM_PARALYZING_SPORES",
    name: "Paralyzing Spores",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_SEEDING_SPORES: {
    code: "MUSHROOM_SEEDING_SPORES",
    name: "Seeding Spores",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  MUSHROOM_STRENGTHEN: {
    code: "MUSHROOM_STRENGTHEN",
    name: "Strengthen",
    type: "mushroom",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_MALLEABLE: {
    code: "SLIME_MALLEABLE",
    name: "Malleable",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_MUTATE: {
    code: "SLIME_MUTATE",
    name: "Mutate",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_OOZE: {
    code: "SLIME_OOZE",
    name: "Ooze",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_POISON_SKIN: {
    code: "SLIME_POISON_SKIN",
    name: "Poison Skin",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_SHAPE_SHIFTING: {
    code: "SLIME_SHAPE_SHIFTING",
    name: "Shape Shifting",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_SLIME_WALK: {
    code: "SLIME_SLIME_WALK",
    name: "Slime Walk",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_TOXICITY: {
    code: "SLIME_TOXICITY",
    name: "Toxicity",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
  SLIME_VOMIT: {
    code: "SLIME_VOMIT",
    name: "Vomit",
    type: "slime",
    description: "TODO",
    effect: (state: WrappedState) => state.act.logMessage({ message: "TODO" }),
  },
};

export default cards;
