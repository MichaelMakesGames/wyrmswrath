import { Required } from "Object/_api";
import React, { useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HotkeyGroup, useControl } from "~components/HotkeysProvider";
import { SettingsContext } from "~contexts";
import {
  ActionControl,
  getActionsAvailableAtPos,
  getQuickAction,
} from "~lib/controls";
import { getHumanReadablePosition } from "~lib/geometry";
import selectors from "~state/selectors";
import { Entity } from "~types";

export default function Inspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  const entitiesWithDescription =
    entitiesAtCursor &&
    (entitiesAtCursor.filter((e) => e.description) as Required<
      Entity,
      "description"
    >[]).sort((a, b) => {
      const aSortValue = a.display ? a.display.priority : Infinity;
      const bSortValue = b.display ? b.display.priority : Infinity;
      return bSortValue - aSortValue;
    });
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const actions = useMemo(
    () => (cursorPos ? getActionsAvailableAtPos(state, cursorPos) : []),
    [state, cursorPos],
  );
  const quickAction = getQuickAction(state, cursorPos);

  return (
    <section className="p-2" data-section="INSPECTOR">
      {cursorPos ? (
        <h2 className="text-sm text-lightGray">
          {getHumanReadablePosition(cursorPos)}
          {quickAction ? " - Click or press space to" : " - No quick action"}
        </h2>
      ) : (
        <h2 className="text-xl">Move cursor over a location to see details</h2>
      )}

      {quickAction && <div className="text-2xl">{quickAction.label}</div>}

      {cursorPos && (
        <div className="mt-3">
          <h3 className="text-lg">Contents</h3>
          <ul className="ml-3">
            {entitiesWithDescription && entitiesWithDescription.length ? (
              entitiesWithDescription.map((e) => (
                <InspectorEntity entity={e} key={e.id} />
              ))
            ) : (
              <li>Nothing here</li>
            )}
          </ul>
        </div>
      )}

      {cursorPos && (
        <div className="mt-3">
          <h3 className="text-lg">Other Actions</h3>
          {actions.length > 0 && (
            <div className="text-lightGray text-sm mb-2">
              Right click map or use shortcuts
            </div>
          )}
          <ul className="ml-3">
            {actions.length === 0 && <li>None</li>}
            {actions.map((action) => (
              <li key={action.label} className="mb-1">
                <InspectorAction action={action} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function InspectorAction({ action }: { action: ActionControl }) {
  const settings = useContext(SettingsContext);
  const dispatch = useDispatch();
  const callback = useCallback(() => dispatch(action.action), [action]);
  useControl({
    code: action.code,
    group: HotkeyGroup.Main,
    callback,
    disabled: action.doNotRegisterShortcut,
  });
  return (
    <button type="button" className="font-normal">
      {settings.keyboardShortcuts[action.code].map((key, index) => (
        <React.Fragment key={key}>
          {index !== 0 ? (
            <span className="text-lightGray text-xs mr-1">or</span>
          ) : null}
          <kbd className="font-mono bg-darkGray rounded p-1 mr-1">{key}</kbd>
        </React.Fragment>
      ))}
      {action.label}
    </button>
  );
}

function InspectorEntity({
  entity,
}: {
  entity: Required<Entity, "description">;
}) {
  return (
    <li>
      <div>
        {entity.description.name}
        {entity.description && entity.description.shortDescription && (
          <span className="text-lightGray text-sm">
            {" - "}
            {entity.description.shortDescription}
          </span>
        )}
      </div>
    </li>
  );
}
