import WrappedState from "~types/WrappedState";

export default function eventSystem(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    events: {},
  });
}
