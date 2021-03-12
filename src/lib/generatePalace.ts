import { Direction, Pos } from "~types";
import { S, N, SE, NE, SW, NW } from "~constants";
import WrappedState from "~types/WrappedState";
import {
  getPositionToDirection,
  getRelativePosition,
  getRing,
} from "./geometry";
import { rangeFromTo, rangeTo } from "./math";
import { createEntityFromTemplate } from "./entities";

const HALLWAY_LENGTH = 11;
const THRONE_ROOM_RADIUS = 7;

export default function generatePalace(state: WrappedState): void {
  generateHallway(state);
  generateThroneRoom(state);
}

function generateThroneRoom(state: WrappedState) {
  const origin = getRelativePosition(
    { x: 0, y: 0 },
    rangeTo(HALLWAY_LENGTH + THRONE_ROOM_RADIUS).map(() => N),
  );
  getRing(origin, 0).forEach((pos) => {
    state.act.addEntity(createEntityFromTemplate("TERRAIN_CARPET", { pos }));
    state.act.addEntity(createEntityFromTemplate("MONSTER_KING", { pos }));
  });
  getRing(origin, 1).forEach((pos) => {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_ROYAL_CARPET", { pos }),
    );
  });
  getRing(origin, 2).forEach((pos, i) => {
    const even = Boolean(i % 2);
    state.act.addEntity(
      createEntityFromTemplate(
        even ? "TERRAIN_MARBLE_WALL" : "TERRAIN_CARPET",
        {
          pos,
        },
      ),
    );
    if (!even)
      state.act.addEntity(
        createEntityFromTemplate("MONSTER_CRYSTAL_LEGIONNAIRE", { pos }),
      );
  });
  rangeFromTo(3, THRONE_ROOM_RADIUS + 1).forEach((r) =>
    getRing(origin, r).forEach((pos, i) => {
      let template = "TERRAIN_MARBLE_FLOOR";
      if (r === 3 || (pos.x === 0 && pos.y > origin.y))
        template = "TERRAIN_CARPET";
      if (r === THRONE_ROOM_RADIUS) template = "TERRAIN_MARBLE_WALL";
      state.act.addEntity(createEntityFromTemplate(template, { pos }));
      if (r === 6) {
        template = "";
        if (i % 6 === 0) {
          template = "MONSTER_SHROOM_DOCTOR";
        } else if (i % 3 === 0) {
          template = "MONSTER_SLIME_ENGINEER";
        }
        if (template) {
          state.act.addEntity(createEntityFromTemplate(template, { pos }));
        }
      }
    }),
  );
}

function generateHallway(state: WrappedState) {
  const origin: Pos = { x: 0, y: 0 };

  state.act.addEntity(
    createEntityFromTemplate("TERRAIN_WALL", {
      pos: getRelativePosition(origin, [S, S]),
    }),
  );
  [...state.select.tailToHead()].reverse().forEach((segment, i) => {
    const pos = getRelativePosition(
      origin,
      rangeTo(i + 2).map(() => S),
    );
    state.act.dig(pos);
    state.act.updateEntity({
      id: segment.id,
      pos,
    });
  });

  const relativePositionMapper = (pos: Pos) => (dirs: Direction[]) =>
    getRelativePosition(pos, dirs);

  const bottomWallOrigin = getPositionToDirection(origin, "S");
  const topWallOrigin = getRelativePosition(
    origin,
    rangeTo(HALLWAY_LENGTH).map(() => N),
  );
  const bottomWallRelativePositions: Direction[][] = [
    [NW, SW, NW],
    [NW, SW],
    [NW],
    [],
    [NE],
    [NE, SE],
    [NE, SE, NE],
  ];
  const bottomWallPositions = bottomWallRelativePositions.map(
    relativePositionMapper(bottomWallOrigin),
  );
  const topWallPositions = bottomWallRelativePositions.map(
    relativePositionMapper(topWallOrigin),
  );

  const leftWallOrigin = getRelativePosition(origin, [NW, SW, NW, SW]);
  const rightWallOrigin = getRelativePosition(origin, [NE, SE, NE, SE]);
  const sideWallRelativePositions: Direction[][] = rangeTo(
    HALLWAY_LENGTH + 1,
  ).map((i) => rangeTo(i).map(() => N));
  const leftWallPositions = sideWallRelativePositions.map(
    relativePositionMapper(leftWallOrigin),
  );
  const rightWallPositions = sideWallRelativePositions.map(
    relativePositionMapper(rightWallOrigin),
  );

  for (const pos of [
    ...bottomWallPositions,
    ...topWallPositions,
    ...leftWallPositions,
    ...rightWallPositions,
  ]) {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_MARBLE_WALL", { pos }),
    );
  }
  for (const pos of [bottomWallOrigin, topWallOrigin]) {
    state.act.addEntity(
      createEntityFromTemplate("DECORATION_STONE_DOOR", { pos }),
    );
  }

  const floorRelativePositions = sideWallRelativePositions.slice(
    0,
    HALLWAY_LENGTH,
  );
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(origin),
  )) {
    state.act.addEntity(createEntityFromTemplate("TERRAIN_CARPET", { pos }));
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getPositionToDirection(origin, NE)),
  )) {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_MARBLE_FLOOR", { pos }),
    );
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getPositionToDirection(origin, NW)),
  )) {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_MARBLE_FLOOR", { pos }),
    );
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getRelativePosition(origin, [NE, SE])),
  )) {
    state.act.addEntity(
      createEntityFromTemplate(
        pos.y % 2 === 0 ? "TERRAIN_MARBLE_FLOOR" : "TERRAIN_MARBLE_WALL",
        { pos },
      ),
    );
    if (pos.y % 2 === 0) {
      state.act.addEntity(
        createEntityFromTemplate("MONSTER_ROYAL_GUARD", { pos }),
      );
    }
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getRelativePosition(origin, [NW, SW])),
  )) {
    state.act.addEntity(
      createEntityFromTemplate(
        pos.y % 2 === 0 ? "TERRAIN_MARBLE_FLOOR" : "TERRAIN_MARBLE_WALL",
        { pos },
      ),
    );
    if (pos.y % 2 === 0) {
      state.act.addEntity(
        createEntityFromTemplate("MONSTER_ROYAL_GUARD", { pos }),
      );
    }
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getRelativePosition(origin, [NE, SE, NE])),
  )) {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_MARBLE_FLOOR", { pos }),
    );
  }
  for (const pos of floorRelativePositions.map(
    relativePositionMapper(getRelativePosition(origin, [NW, SW, NW])),
  )) {
    state.act.addEntity(
      createEntityFromTemplate("TERRAIN_MARBLE_FLOOR", { pos }),
    );
  }
}
