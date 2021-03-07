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
    deck: [],
    hand: [],
    discard: [],
  };

  return initialState;
}
