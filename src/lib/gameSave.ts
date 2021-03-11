/* global localStorage */
import { set, get } from "idb-keyval";
import { RawState } from "~types";
import WrappedState from "~types/WrappedState";

const SAVE_KEY = "serpentine-save";
export function save(state: RawState): void {
  try {
    set(SAVE_KEY, state);
  } catch {
    console.info("falling back to localStorage to save");
    localStorage.setItem(SAVE_KEY, toLocalStorage(state));
  }
}

export function load(): Promise<RawState | undefined> {
  try {
    return get(SAVE_KEY);
  } catch {
    console.info("falling back to localStorage to load");
    const item = localStorage.getItem(SAVE_KEY);
    return Promise.resolve(item ? fromLocalStorage(item) : undefined);
  }
}

export function prepareStateAndSave(state: WrappedState) {
  save(state.raw);
}

function toLocalStorage(state: RawState): string {
  return JSON.stringify({
    ...state,
    entitiesWithComps: {},
    entitiesAtPosition: {},
  });
}

function fromLocalStorage(item: string): RawState {
  return JSON.parse(item);
}
