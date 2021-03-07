import WrappedState from "~types/WrappedState";

export default function timeSystem(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    turn: state.raw.turn + 1,
  });
}
