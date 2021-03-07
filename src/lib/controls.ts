/* global navigator */
import { Action, Pos, RawState } from "~types";
import { ControlCode } from "~types/ControlCode";

export function getQuickAction(
  state: RawState,
  pos: Pos | null,
): null | { action: Action; label: string } {
  return null;
}

export interface ActionControl {
  label: string;
  code: ControlCode;
  doNotRegisterShortcut?: boolean;
  action: Action;
}

export function getActionsAvailableAtPos(
  state: RawState,
  pos: Pos,
): ActionControl[] {
  const results: ActionControl[] = [];
  return results;
}

export function isMac() {
  return navigator.platform.toUpperCase().includes("MAC");
}

export function noFocusOnClick(
  callback: (e: React.MouseEvent) => void,
): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement | null;
    if (target && target.blur) target.blur();
    callback(e);
  };
}
