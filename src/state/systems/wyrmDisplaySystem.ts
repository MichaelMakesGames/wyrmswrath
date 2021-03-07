import { PRIORITY_UNIT } from "~constants";
import { getDirectionToPosition } from "~lib/geometry";
import { Display, Pos } from "~types";
import WrappedState from "~types/WrappedState";

export default function wyrmDisplaySystem(state: WrappedState): void {
  const segments = state.select.entitiesWithComps("pos", "wyrm");
  for (const segment of segments) {
    const next = segments.find((other) => other.id === segment.wyrm.connectsTo);
    const previous = segments.find(
      (other) => other.wyrm.connectsTo === segment.id,
    );
    state.act.updateEntity({
      ...segment,
      display: getWyrmDisplay(
        previous && previous.pos,
        segment.pos,
        next && next.pos,
      ),
    });
  }
}

function getWyrmDisplay(
  previous: Pos | undefined,
  current: Pos,
  next: Pos | undefined,
): Display | undefined {
  const dirToPrev = getDirectionToPosition(current, previous);
  const dirToNext = getDirectionToPosition(current, next);
  const dirStr = `${dirToPrev}-${dirToNext}`;
  const common = { priority: PRIORITY_UNIT, discreteMovement: true };
  switch (dirStr) {
    // tails
    case "null-N":
      return {
        tile: "wyrm-tail-vertical",
        flipY: true,
        ...common,
      };
    case "null-NE":
      return {
        tile: "wyrm-tail-diagonal",
        flipY: true,
        ...common,
      };
    case "null-SE":
      return {
        tile: "wyrm-tail-diagonal",
        ...common,
      };
    case "null-S":
      return {
        tile: "wyrm-tail-vertical",
        ...common,
      };
    case "null-SW":
      return {
        tile: "wyrm-tail-diagonal",
        flipX: true,
        ...common,
      };
    case "null-NW":
      return {
        tile: "wyrm-tail-diagonal",
        flipY: true,
        flipX: true,
        ...common,
      };

    // heads
    case "N-null":
      return {
        tile: "wyrm-head-vertical",
        ...common,
      };
    case "NE-null":
      return {
        tile: "wyrm-head-diagonal",
        flipX: true,
        ...common,
      };
    case "SE-null":
      return {
        tile: "wyrm-head-diagonal",
        flipX: true,
        flipY: true,
        ...common,
      };
    case "S-null":
      return {
        tile: "wyrm-head-vertical",
        flipY: true,
        ...common,
      };
    case "SW-null":
      return {
        tile: "wyrm-head-diagonal",
        flipY: true,
        ...common,
      };
    case "NW-null":
      return {
        tile: "wyrm-head-diagonal",
        ...common,
      };

    // straight
    case "S-N":
    case "N-S":
      return {
        tile: "wyrm-straight-vertical",
        ...common,
      };
    case "NW-SE":
    case "SE-NW":
      return {
        tile: "wyrm-straight-diagonal",
        ...common,
      };
    case "NE-SW":
    case "SW-NE":
      return {
        tile: "wyrm-straight-diagonal",
        flipX: true,
        ...common,
      };

    // wide
    case "N-SE":
    case "SE-N":
      return {
        tile: "wyrm-wide-vertical-to-diagonal",
        ...common,
      };
    case "N-SW":
    case "SW-N":
      return {
        tile: "wyrm-wide-vertical-to-diagonal",
        flipX: true,
        ...common,
      };
    case "S-NE":
    case "NE-S":
      return {
        tile: "wyrm-wide-vertical-to-diagonal",
        flipY: true,
        ...common,
      };
    case "S-NW":
    case "NW-S":
      return {
        tile: "wyrm-wide-vertical-to-diagonal",
        flipX: true,
        flipY: true,
        ...common,
      };
    case "SW-SE":
    case "SE-SW":
      return {
        tile: "wyrm-wide-diagonal-to-diagonal",
        ...common,
      };
    case "NW-NE":
    case "NE-NW":
      return {
        tile: "wyrm-wide-diagonal-to-diagonal",
        flipY: true,
        ...common,
      };

    // tight
    case "N-NE":
    case "NE-N":
      return {
        tile: "wyrm-tight-vertical-to-diagonal",
        ...common,
      };
    case "NE-SE":
    case "SE-NE":
      return {
        tile: "wyrm-tight-diagonal-to-diagonal",
        ...common,
      };
    case "SE-S":
    case "S-SE":
      return {
        tile: "wyrm-tight-vertical-to-diagonal",
        flipY: true,
        ...common,
      };
    case "S-SW":
    case "SW-S":
      return {
        tile: "wyrm-tight-vertical-to-diagonal",
        flipX: true,
        flipY: true,
        ...common,
      };
    case "SW-NW":
    case "NW-SW":
      return {
        tile: "wyrm-tight-diagonal-to-diagonal",
        flipX: true,
        ...common,
      };
    case "NW-N":
    case "N-NW":
      return {
        tile: "wyrm-tight-vertical-to-diagonal",
        flipX: true,
        ...common,
      };

    default:
      return undefined;
  }
}
