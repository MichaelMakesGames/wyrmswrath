import { MAX_HAND_SIZE } from "~constants";
import { getNonTightDirections } from "~lib/geometry";
import { Direction, RawState } from "~types";
import { player, playerDirection, playerSize } from "./entitySelectors";

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

export function handSize(state: RawState) {
  return Math.min(MAX_HAND_SIZE, playerSize(state) + 1);
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
  return allCards(state).filter((code) => code.startsWith("SLIME")).length + 2;
}

export function crystalProgress(state: RawState): number {
  return state.crystalProgress;
}

export function crystalUnlock(state: RawState): number {
  return (
    allCards(state).filter((code) => code.startsWith("CRYSTAL")).length + 2
  );
}

export function mushroomProgress(state: RawState): number {
  return state.mushroomProgress;
}

export function mushroomUnlock(state: RawState): number {
  return (
    allCards(state).filter((code) => code.startsWith("MUSHROOM")).length + 2
  );
}

export function level(state: RawState): number {
  return state.level;
}

export function playerStatusEffects(state: RawState) {
  const p = player(state);
  return p ? p.statusEffects || {} : {};
}

export function wyrmCanMove(state: RawState, direction: Direction) {
  return (
    getNonTightDirections(playerDirection(state)).includes(direction) ||
    playerDirection(state) === null
  );
}
