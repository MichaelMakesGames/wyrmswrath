import { MAX_ENERGY_PER_SIZE, VERSION } from "~constants";
import { RawState } from "~types";

export function createInitialState() {
  const initialState: RawState = {
    version: VERSION,
    level: 0,
    entities: {},
    entitiesByPosition: {},
    entitiesByComp: {},
    playerDijkstra: { dist: {}, prev: {} },
    messageLog: [],
    gameOver: false,
    victory: false,
    turn: 0,
    events: {},
    cursorPos: null,
    isAutoMoving: false,
    hand: ["CRYSTAL_JAVELIN", "CRYSTAL_SPIKED_TAIL", "CRYSTAL_JAVELIN"],
    deck: [],
    discard: [],
    playing: null,
    energy: MAX_ENERGY_PER_SIZE * 2,
    slimeProgress: 0,
    mushroomProgress: 0,
    crystalProgress: 0,
  };

  return initialState;
}
