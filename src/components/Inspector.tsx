import React from "react";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";
import { Entity } from "~types";
import EntityPreview from "./EntityPreview";

export default function Inspector() {
  const visibleEntitiesAtCursor = (
    useSelector(selectors.entitiesAtCursor) || []
  )
    .filter((e) => e.display && !e.display.hidden && !e.cursor)
    .filter(
      (e, index, array) =>
        e.name !== "Hatched Egg" ||
        array.filter((other) => other.wyrm).length <= 1,
    )
    .filter(
      (e, index, array) =>
        !e.wyrm ||
        !e.wyrm.connectsTo ||
        !array.some((other) => other.wyrm && !other.wyrm.connectsTo),
    );

  return (
    <section className="p-2" data-section="INSPECTOR">
      <h2 className="text-xl">Inspector</h2>
      <ul>
        {visibleEntitiesAtCursor && visibleEntitiesAtCursor.length ? (
          visibleEntitiesAtCursor.map((e) => (
            <InspectorEntity entity={e} key={e.id} />
          ))
        ) : (
          <li>Mystery</li>
        )}
      </ul>
    </section>
  );
}

function InspectorEntity({ entity }: { entity: Entity }) {
  return (
    <li className="my-3">
      <div>
        <EntityPreview entity={entity} /> {entity.name || "Unknown"}
      </div>
      {entity.description && (
        <div className="ml-3 text-sm text-lightGray">{entity.description}</div>
      )}
    </li>
  );
}
