import type { CardCode } from "~data/cards";
import type { Entity, Pos } from "./Entity";

export interface RawState {
  version: string;
  entities: Record<string, Entity>;
  entitiesByPosition: Record<string, Set<string>>;
  entitiesByComp: Record<string, Set<string>>;
  energy: number;
  crystalProgress: number;
  mushroomProgress: number;
  slimeProgress: number;
  messageLog: Record<number, { type?: string; message: string }[]>;
  gameOver: boolean;
  victory: boolean;
  turn: number;
  cursorPos: Pos | null;
  isAutoMoving: boolean;
  events: Record<string, number>;
  deck: CardCode[];
  hand: CardCode[];
  discard: CardCode[];
  playing: null | number;
}
