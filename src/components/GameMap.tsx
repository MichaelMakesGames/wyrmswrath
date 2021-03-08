/* global document */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import renderer from "~/renderer";
import { HotkeyGroup, useControl } from "~components/HotkeysProvider";
import { getQuickAction, noFocusOnClick } from "~lib/controls";
import { arePositionsEqual } from "~lib/geometry";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Pos } from "~types";
import { ControlCode } from "~types/ControlCode";
import ContextMenu from "./ContextMenu";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      renderer.appendView(map);
    }
  }, []);

  const dispatch = useDispatch();
  const cursorPos = useSelector(selectors.cursorPos);
  const [contextMenuPos, setContextMenuPos] = useState<Pos | null>(null);
  const playerPos = useSelector(selectors.playerPos);
  const state = useSelector(selectors.state);
  const mousePosRef = useRef<Pos | null>(null);
  const isPlayingCard = useSelector(selectors.isPlayingCard);

  useEffect(() => setContextMenuPos(null), [playerPos]);

  const movementDisabled = isPlayingCard;
  useControl({
    code: ControlCode.N,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "N" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });
  useControl({
    code: ControlCode.NE,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "NE" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });
  useControl({
    code: ControlCode.SE,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "SE" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });
  useControl({
    code: ControlCode.S,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "S" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });
  useControl({
    code: ControlCode.SW,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "SW" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });
  useControl({
    code: ControlCode.NW,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.moveWyrm({ direction: "NW" })),
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
    disabled: movementDisabled,
  });

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Main,
    callback: () => {
      setContextMenuPos(null);
      if (cursorPos) dispatch(actions.setCursorPos(null));
    },
  });

  const performDefaultAction = (pos: Pos | null) => {
    const quickAction = getQuickAction(state, pos);
    if (quickAction) {
      dispatch(quickAction.action);
    }
  };
  useControl({
    code: ControlCode.QuickAction,
    group: HotkeyGroup.Main,
    callback: () => performDefaultAction(cursorPos),
  });

  const onMouseMoveOrEnter = (e: React.MouseEvent) => {
    const mousePos = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    mousePosRef.current = mousePos;
    const pos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
    if (!cursorPos || (!arePositionsEqual(cursorPos, pos) && !contextMenuPos)) {
      dispatch(actions.setCursorPos(pos));
    }
  };

  return (
    <ContextMenu pos={contextMenuPos} onClose={() => setContextMenuPos(null)}>
      <section className="relative">
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className="w-full h-full"
          id="map"
          onMouseMove={onMouseMoveOrEnter}
          onMouseEnter={onMouseMoveOrEnter}
          onMouseOut={() => {
            mousePosRef.current = null;
            if (!contextMenuPos && cursorPos) {
              dispatch(actions.setCursorPos(null));
            }
          }}
          onWheel={(e) => {
            if (e.nativeEvent.deltaY > 0) {
              renderer.zoomOut();
            } else if (e.nativeEvent.deltaY < 0 && playerPos) {
              renderer.zoomTo(playerPos);
            }
            if (mousePosRef.current) {
              const gamePos = renderer.getPosFromMouse(
                mousePosRef.current.x,
                mousePosRef.current.y,
              );
              if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
                dispatch(actions.setCursorPos(gamePos));
              }
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            const mousePos = {
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            };
            mousePosRef.current = mousePos;
            const gamePos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
            if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
              dispatch(actions.setCursorPos(gamePos));
            }
            if (!contextMenuPos) {
              setContextMenuPos(gamePos);
            } else {
              setContextMenuPos(null);
            }
          }}
          onClick={noFocusOnClick((e) => {
            if (contextMenuPos) {
              setContextMenuPos(null);
              return;
            }
            const mousePos = {
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            };
            mousePosRef.current = mousePos;
            const gamePos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
            if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
              dispatch(actions.setCursorPos(gamePos));
            }
            performDefaultAction(gamePos);
          })}
        />
      </section>
    </ContextMenu>
  );
}
