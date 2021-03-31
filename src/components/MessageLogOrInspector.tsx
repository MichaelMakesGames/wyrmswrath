import React from "react";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";
import Inspector from "./Inspector";
import MessageLog from "./MessageLog";

export default function MessageLogOrInspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  if (
    entitiesAtCursor &&
    entitiesAtCursor.some((e) => e.display && !e.display.hidden && !e.cursor)
  ) {
    return <Inspector />;
  } else {
    return <MessageLog />;
  }
}
