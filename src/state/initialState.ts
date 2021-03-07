import { VERSION } from "~constants";
import { RawState } from "~types";

export function createInitialState() {
  const initialState: RawState = {
    version: VERSION,
    entities: {},
    entitiesByPosition: {},
    entitiesByComp: {},
    messageLog: [],
    gameOver: false,
    victory: false,
    turn: 0,
    events: {},
    cursorPos: null,
    isAutoMoving: false,
    deck: ["NORTH_ONLY"],
    hand: ["BORING_CARD", "FAST_CARD", "DIRECTIONAL_CARD"],
    discard: [],
    playing: null,
  };

  return initialState;
}
