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

export function deck(state: RawState) {
  return state.deck;
}

export function hand(state: RawState) {
  return state.hand;
}

export function discard(state: RawState) {
  return state.discard;
}

export function allCards(state: RawState) {
  return [...deck(state), ...hand(state), ...discard(state)];
}

export function playing(state: RawState) {
  return state.playing;
}

export function isPlayingCard(state: RawState) {
  return state.playing !== null;
}

export function slimeProgress(state: RawState): number {
  return state.slimeProgress;
}

export function slimeUnlock(state: RawState): number {
  return 2 ** allCards(state).filter((code) => code.startsWith("SLIME")).length;
}

export function crystalProgress(state: RawState): number {
  return state.crystalProgress;
}

export function crystalUnlock(state: RawState): number {
  return (
    2 ** allCards(state).filter((code) => code.startsWith("CRYSTAL")).length
  );
}

export function mushroomProgress(state: RawState): number {
  return state.mushroomProgress;
}

export function mushroomUnlock(state: RawState): number {
  return (
    2 ** allCards(state).filter((code) => code.startsWith("MUSHROOM")).length
  );
}
