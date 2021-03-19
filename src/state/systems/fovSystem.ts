import { FOV } from "rot-js";
import colors from "~colors";
import { FOV_RANGE } from "~constants";
import {
  fromRotPos,
  getAdjacentPositions,
  getPosKey,
  parsePosKey,
  toRotPos,
} from "~lib/geometry";
import WrappedState from "~types/WrappedState";

const FOG_COLOR = colors.lightGray;

export default function fovSystem(state: WrappedState): void {
  const head = state.select.head();
  const origin = head && head.pos;
  if (!origin) return;

  const lightPasses: (x: number, y: number) => boolean = (x, y) =>
    state.select
      .entitiesAtPosition(fromRotPos([x, y]))
      .every((e) => !e.blocking || !e.blocking.fov);
  const fov = new FOV.PreciseShadowcasting(lightPasses, { topology: 6 });
  const visiblePositions = new Set<string>();
  const [rotX, rotY] = toRotPos(origin);
  fov.compute(rotX, rotY, FOV_RANGE, (x, y) =>
    visiblePositions.add(getPosKey(fromRotPos([x, y]))),
  );

  state.select.tailToHead().forEach(({ pos }) => {
    visiblePositions.add(getPosKey(pos));
    getAdjacentPositions(pos).forEach((adjacent) =>
      visiblePositions.add(getPosKey(adjacent)),
    );
  });

  for (const entity of state.select.entitiesWithComps(
    "pos",
    "display",
    "inFov",
  )) {
    if (!visiblePositions.has(getPosKey(entity.pos))) {
      if (entity.explorable) {
        state.act.updateEntity({
          id: entity.id,
          display: { ...entity.display, color: FOG_COLOR },
          inFov: undefined,
        });
      } else {
        state.act.updateEntity({
          id: entity.id,
          display: { ...entity.display, hidden: true },
          inFov: undefined,
        });
      }
    }
  }

  for (const pos of Array.from(visiblePositions).map(parsePosKey)) {
    for (const entity of state.select.entitiesAtPosition(pos)) {
      if (entity.display && !entity.inFov) {
        state.act.updateEntity({
          id: entity.id,
          display: { ...entity.display, hidden: false },
          inFov: {},
        });
      } else if (entity.display && entity.explorable) {
        state.act.updateEntity({
          id: entity.id,
          display: { ...entity.display, color: undefined },
          inFov: {},
        });
      }
    }
  }
}
