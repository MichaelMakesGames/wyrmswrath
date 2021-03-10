export type StatusEffectType =
  | "ARMORED"
  | "CONFUSED"
  | "PARALYZED"
  | "POISONED"
  | "STRENGTHENED"
  | "SLIMED"
  | "SLIME_WALK";

const statusEffectTypes: Record<
  StatusEffectType,
  { type: StatusEffectType; name: string }
> = {
  ARMORED: { type: "ARMORED", name: "Armored" },
  CONFUSED: { type: "CONFUSED", name: "Confused" },
  PARALYZED: { type: "PARALYZED", name: "Paralyzed" },
  POISONED: { type: "POISONED", name: "Poisoned" },
  STRENGTHENED: { type: "STRENGTHENED", name: "Strengthened" },
  SLIMED: { type: "SLIMED", name: "Slimed" },
  SLIME_WALK: { type: "SLIME_WALK", name: "Slime Walk" },
};

export default statusEffectTypes;
