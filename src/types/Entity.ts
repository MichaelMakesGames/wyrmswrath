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

export type AIType = "DRONE";
export interface AI {
  type: AIType;
}

export interface Blocking {
  moving: boolean;
}

export interface Destructible {
  onDestroy?: string;
}
export interface Description {
  name: string;
  description: string;
  shortDescription?: string;
}

export interface Wyrm {
  connectsTo?: string;
}

export interface Cursor {}
export interface Entity {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;

  ai?: AI;
  animationToggle?: AnimationToggle;
  blocking?: Blocking;
  colorToggle?: ColorToggle;
  cursor?: Cursor;
  description?: Description;
  destructible?: Destructible;
  display?: Display;
  pos?: Pos;
  wyrm?: Wyrm;
}
