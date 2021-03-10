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
  color?: string;
  priority: number;
  hasBackground?: boolean;
  flashWhenVisible?: boolean;
  discreteMovement?: boolean;
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
  abilities: {
    abilityName: string;
    coolDown: number;
    readyIn: number;
  }[];
}

export interface Blocking {
  moving: boolean;
}
export interface Description {
  name: string;
  description: string;
  shortDescription?: string;
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
export interface Entity {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;

  monster?: Monster;
  animationToggle?: AnimationToggle;
  blocking?: Blocking;
  colorToggle?: ColorToggle;
  consumable?: Consumable;
  cursor?: Cursor;
  description?: Description;
  diggable?: Diggable;
  display?: Display;
  drops?: Drops;
  health?: Health;
  pos?: Pos;
  wyrm?: Wyrm;
  ground?: Ground;
  statusEffects?: StatusEffects;
}
