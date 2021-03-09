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
    const playerVariant = getPlayerWyrmVariant(state);
    const nonPlayerVariant = "skeletal";
    state.act.updateEntity({
      ...segment,
      display: getWyrmDisplay(
        previous && previous.pos,
        segment.pos,
        next && next.pos,
        segment.wyrm.isPlayer ? playerVariant : nonPlayerVariant,
      ),
    });
  }
}

function getPlayerWyrmVariant(state: WrappedState) {
  if (state.select.playerHealth() <= 0 || state.select.playerEnergy() <= 0)
    return "skeletal";
  let crystalCount = 0;
  let mushroomCount = 0;
  let slimeCount = 0;
  for (const code of state.select.allCards()) {
    if (code.startsWith("CRYSTAL")) crystalCount++;
    if (code.startsWith("MUSHROOM")) mushroomCount++;
    if (code.startsWith("SLIME")) slimeCount++;
  }
  if (crystalCount > mushroomCount && crystalCount > slimeCount) return "blue";
  if (mushroomCount > crystalCount && mushroomCount > slimeCount)
    return "purple";
  if (slimeCount > crystalCount && slimeCount > mushroomCount) return "green";
  return "red";
}

function getWyrmDisplay(
  previous: Pos | undefined,
  current: Pos,
  next: Pos | undefined,
  variant: string,
): Display | undefined {
  const dirToPrev = getDirectionToPosition(current, previous);
  const dirToNext = getDirectionToPosition(current, next);
  const dirStr = `${dirToPrev}-${dirToNext}`;
  const common = { priority: PRIORITY_UNIT, discreteMovement: true };
  switch (dirStr) {
    // tails
    case "null-N":
      return {
        tile: `${variant}-tail-vertical`,
        flipY: true,
        ...common,
      };
    case "null-NE":
      return {
        tile: `${variant}-tail-diagonal`,
        flipY: true,
        ...common,
      };
    case "null-SE":
      return {
        tile: `${variant}-tail-diagonal`,
        ...common,
      };
    case "null-S":
      return {
        tile: `${variant}-tail-vertical`,
        ...common,
      };
    case "null-SW":
      return {
        tile: `${variant}-tail-diagonal`,
        flipX: true,
        ...common,
      };
    case "null-NW":
      return {
        tile: `${variant}-tail-diagonal`,
        flipY: true,
        flipX: true,
        ...common,
      };

    // heads
    case "N-null":
      return {
        tile: `${variant}-head-vertical`,
        ...common,
      };
    case "NE-null":
      return {
        tile: `${variant}-head-diagonal`,
        flipX: true,
        ...common,
      };
    case "SE-null":
      return {
        tile: `${variant}-head-diagonal`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "S-null":
      return {
        tile: `${variant}-head-vertical`,
        flipY: true,
        ...common,
      };
    case "SW-null":
      return {
        tile: `${variant}-head-diagonal`,
        flipY: true,
        ...common,
      };
    case "NW-null":
      return {
        tile: `${variant}-head-diagonal`,
        ...common,
      };

    // straight
    case "N-S":
      return {
        tile: `${variant}-straight-vertical`,
        ...common,
      };
    case "S-N":
      return {
        tile: `${variant}-straight-vertical`,
        flipY: true,
        ...common,
      };
    case "NW-SE":
      return {
        tile: `${variant}-straight-diagonal`,
        ...common,
      };
    case "SE-NW":
      return {
        tile: `${variant}-straight-diagonal`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "NE-SW":
      return {
        tile: `${variant}-straight-diagonal`,
        flipX: true,
        ...common,
      };
    case "SW-NE":
      return {
        tile: `${variant}-straight-diagonal`,
        flipY: true,
        ...common,
      };

    // wide
    case "N-SE":
      return {
        tile: `${variant}-wide-vertical-to-diagonal`,
        ...common,
      };
    case "SE-N":
      return {
        tile: `${variant}-wide-vertical-to-diagonal-alt`,
        ...common,
      };
    case "N-SW":
      return {
        tile: `${variant}-wide-vertical-to-diagonal`,
        flipX: true,
        ...common,
      };
    case "SW-N":
      return {
        tile: `${variant}-wide-vertical-to-diagonal-alt`,
        flipX: true,
        ...common,
      };
    case "S-NE":
      return {
        tile: `${variant}-wide-vertical-to-diagonal`,
        flipY: true,
        ...common,
      };
    case "NE-S":
      return {
        tile: `${variant}-wide-vertical-to-diagonal-alt`,
        flipY: true,
        ...common,
      };
    case "S-NW":
      return {
        tile: `${variant}-wide-vertical-to-diagonal`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "NW-S":
      return {
        tile: `${variant}-wide-vertical-to-diagonal-alt`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "SW-SE":
      return {
        tile: `${variant}-wide-diagonal-to-diagonal`,
        ...common,
      };
    case "SE-SW":
      return {
        tile: `${variant}-wide-diagonal-to-diagonal`,
        flipX: true,
        ...common,
      };
    case "NW-NE":
      return {
        tile: `${variant}-wide-diagonal-to-diagonal`,
        flipY: true,
        ...common,
      };
    case "NE-NW":
      return {
        tile: `${variant}-wide-diagonal-to-diagonal`,
        flipY: true,
        flipX: true,
        ...common,
      };

    // tight
    case "N-NE":
      return {
        tile: `${variant}-tight-vertical-to-diagonal`,
        ...common,
      };
    case "NE-N":
      return {
        tile: `${variant}-tight-vertical-to-diagonal-alt`,
        ...common,
      };
    case "NE-SE":
      return {
        tile: `${variant}-tight-diagonal-to-diagonal`,
        ...common,
      };
    case "SE-NE":
      return {
        tile: `${variant}-tight-diagonal-to-diagonal`,
        flipY: true,
        ...common,
      };
    case "S-SE":
      return {
        tile: `${variant}-tight-vertical-to-diagonal`,
        flipY: true,
        ...common,
      };
    case "SE-S":
      return {
        tile: `${variant}-tight-vertical-to-diagonal-alt`,
        flipY: true,
        ...common,
      };
    case "S-SW":
      return {
        tile: `${variant}-tight-vertical-to-diagonal`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "SW-S":
      return {
        tile: `${variant}-tight-vertical-to-diagonal-alt`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "NW-SW":
      return {
        tile: `${variant}-tight-diagonal-to-diagonal`,
        flipX: true,
        ...common,
      };
    case "SW-NW":
      return {
        tile: `${variant}-tight-diagonal-to-diagonal`,
        flipX: true,
        flipY: true,
        ...common,
      };
    case "N-NW":
      return {
        tile: `${variant}-tight-vertical-to-diagonal`,
        flipX: true,
        ...common,
      };
    case "NW-N":
      return {
        tile: `${variant}-tight-vertical-to-diagonal-alt`,
        flipX: true,
        ...common,
      };

    default:
      return undefined;
  }
}
