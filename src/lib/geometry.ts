import { DIRECTIONS, MAP_HEIGHT, MAP_WIDTH } from "~/constants";
import { Direction, Pos } from "~/types";
import { rangeTo } from "./math";

export function getPosKey(pos: Pos) {
  return `${pos.x},${pos.y}`;
}

export function toRotPos({ x, y }: Pos): [number, number] {
  const even = x % 2 === 0;
  return [even ? y * 2 : y * 2 + 1, x];
}

export function fromRotPos([x, y]: [number, number]): Pos {
  return {
    x: y,
    y: Math.floor(x / 2),
  };
}

export function parsePosKey(posKey: string): Pos {
  const [x, y] = posKey.split(",").map(parseFloat);
  return { x, y };
}

export function arePositionsEqual(pos1: Pos, pos2: Pos) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getDistance(from: Pos, to: Pos) {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

export function getClosestPosition(options: Pos[], to: Pos): Pos | null {
  return (
    [...options].sort((a, b) => {
      const aDistance = getDistance(a, to);
      const bDistance = getDistance(b, to);
      return aDistance - bDistance;
    })[0] || null
  );
}

export function getAdjacentPositions(pos: Pos): Pos[] {
  return DIRECTIONS.map((d) => getPositionToDirection(pos, d));
}

export function getPositionToDirection(pos: Pos, direction: Direction) {
  const shiftDown = pos.x % 2 === 0 ? 1 : 0;
  if (direction === "N") {
    return { x: pos.x, y: pos.y - 1 };
  } else if (direction === "S") {
    return { x: pos.x, y: pos.y + 1 };
  } else if (direction === "SE") {
    return { x: pos.x + 1, y: pos.y + 1 - shiftDown };
  } else if (direction === "NE") {
    return { x: pos.x + 1, y: pos.y - shiftDown };
  } else if (direction === "SW") {
    return { x: pos.x - 1, y: pos.y + 1 - shiftDown };
  } else if (direction === "NW") {
    return { x: pos.x - 1, y: pos.y - shiftDown };
  }
  return pos;
}

export function getRelativePosition(origin: Pos, directions: Direction[]) {
  return directions.reduce(getPositionToDirection, origin);
}

export function getRing(origin: Pos, radius: number): Pos[] {
  if (radius === 0) return [origin];
  let pos = getRelativePosition(
    origin,
    rangeTo(radius).map(() => "N"),
  );
  const results: Pos[] = [pos];
  (["SE", "S", "SW", "NW", "N", "NE"] as Direction[]).forEach((d) =>
    rangeTo(radius).forEach(() => {
      pos = getPositionToDirection(pos, d);
      results.push(pos);
    }),
  );
  return results;
}

export function getDirectionToPosition(from: Pos, to?: Pos): Direction | null {
  if (!to) return null;
  for (const d of DIRECTIONS) {
    if (arePositionsEqual(getPositionToDirection(from, d), to)) {
      return d;
    }
  }
  return null;
}

export function getNonTightDirections(direction: Direction | null) {
  if (direction === "N") return ["NW", "N", "NE"];
  if (direction === "NE") return ["N", "NE", "SE"];
  if (direction === "SE") return ["NE", "SE", "S"];
  if (direction === "S") return ["SE", "S", "SW"];
  if (direction === "SW") return ["S", "SW", "NW"];
  if (direction === "NW") return ["SW", "NW", "N"];
  return [];
}

export function getTightDirections(direction: Direction | null) {
  if (direction === "N") return ["SE", "SW"];
  if (direction === "NE") return ["NW", "S"];
  if (direction === "SE") return ["N", "SW"];
  if (direction === "S") return ["NE", "NW"];
  if (direction === "SW") return ["SE", "N"];
  if (direction === "NW") return ["NE", "S"];
  return [];
}

export function getConstDir(direction: Direction) {
  for (const constDir of DIRECTIONS) {
    if (areDirectionsEqual(direction, constDir)) return constDir;
  }
  return direction;
}

export function areDirectionsEqual(d1: Direction, d2: Direction) {
  return d1 === d2;
}

export function isPositionInMap(position: Pos) {
  return (
    position.x >= 0 &&
    position.x < MAP_WIDTH &&
    position.y >= 0 &&
    position.y < MAP_HEIGHT
  );
}

export function getClosest<T extends { pos: Pos }>(
  choices: T[],
  position: Pos,
): T {
  return [...choices].sort(
    (a, b) => getDistance(a.pos, position) - getDistance(b.pos, position),
  )[0];
}

export function getHumanReadablePosition(pos: Pos) {
  const northSouth =
    pos.y < MAP_HEIGHT / 2
      ? `${Math.abs(pos.y - MAP_HEIGHT / 2)}N`
      : `${pos.y - MAP_HEIGHT / 2 + 1}S`;
  const eastWest =
    pos.x < MAP_WIDTH / 2
      ? `${Math.abs(pos.x - MAP_WIDTH / 2)}W`
      : `${pos.x - MAP_WIDTH / 2 + 1}E`;
  return `${northSouth}, ${eastWest}`;
}
