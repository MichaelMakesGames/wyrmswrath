import { RawState } from "~types";

export function gameOver(state: RawState) {
  return state.gameOver;
}

export function victory(state: RawState) {
  return state.victory;
}

export function version(state: RawState) {
  return state.version;
}

export function messageLog(state: RawState) {
  return state.messageLog;
}

export function cursorPos(state: RawState) {
  return state.cursorPos;
}

export function turn(state: RawState) {
  return state.turn;
}
