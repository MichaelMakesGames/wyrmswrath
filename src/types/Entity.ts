import { StatusEffectType } from "~data/statusEffectTypes";

export interface Pos {
  x: number;
  y: number;
}

export interface Display {
  tile: string | string[];
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  speed?: number;
  scale?: number;
  color?: string;
  priority: number;
  hasBackground?: boolean;
  discreteMovement?: boolean;
  hidden?: boolean;
}

export interface AnimationToggle {
  conditions: ConditionName[];
}

export interface ColorToggle {
  conditions: ConditionName[];
  trueColor: string;
  falseColor: string;
}

export interface Monster {
  meleeDamage: number;
  rangedDamage: number;
  range: number;
  idealDistance: number;
  prioritizeDistance: boolean;
  projectileColor?: string;
  attackSfx?: string;
  alwaysTryAbility?: boolean;
  abilities: {
    code: string;
    coolDown: number;
    readyIn: number;
  }[];
}

export interface Blocking {
  moving: boolean;
  fov: boolean;
}
export interface Wyrm {
  connectsTo?: string;
  isPlayer: boolean;
}

export interface Diggable {}

export interface Health {
  current: number;
  max: number;
}

export interface Drops {
  template: TemplateName;
}

export interface Consumable {
  energy: number;
  slime?: boolean;
  crystal?: boolean;
  mushroom?: boolean;
  victory?: boolean;
}

export interface StatusEffect {
  type: StatusEffectType;
  value?: number;
  expiresIn?: number;
}
export interface StatusEffects
  extends Partial<Record<StatusEffectType, StatusEffect>> {}

export interface Ground {
  spiky?: boolean;
  slimy?: boolean;
  healing?: boolean;
}

export interface Cursor {}

export interface Explorable {}

export interface Stairs {}

export interface InFov {}
export interface Entity {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;

  animationToggle?: AnimationToggle;
  blocking?: Blocking;
  colorToggle?: ColorToggle;
  consumable?: Consumable;
  cursor?: Cursor;
  description?: string;
  diggable?: Diggable;
  display?: Display;
  drops?: Drops;
  explorable?: Explorable;
  ground?: Ground;
  health?: Health;
  inFov?: InFov;
  monster?: Monster;
  name?: string;
  pos?: Pos;
  stairs?: Stairs;
  statusEffects?: StatusEffects;
  wyrm?: Wyrm;
}
