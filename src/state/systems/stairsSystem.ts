import levels from "~data/levels";
import audio from "~lib/audio";
import { arePositionsEqual } from "~lib/geometry";
import makeLevel from "~lib/makeLevel";
import WrappedState from "~types/WrappedState";

export default function stairsSystem(state: WrappedState) {
  const stairs = state.select.entitiesWithComps("stairs", "pos")[0];
  const player = state.select
    .entitiesWithComps("wyrm", "pos")
    .filter((e) => e.wyrm.isPlayer);
  if (
    stairs &&
    player &&
    player.some((e) => arePositionsEqual(e.pos, stairs.pos))
  ) {
    state.setRaw({
      ...state.raw,
      level: state.raw.level + 1,
    });
    makeLevel(state);
    audio.playMusic(levels[state.raw.level].song);
  }
}
