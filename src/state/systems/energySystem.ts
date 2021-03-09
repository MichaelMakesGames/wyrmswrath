import WrappedState from "~types/WrappedState";

export default function energySystem(state: WrappedState): void {
  const oldEnergy = state.select.playerEnergy();
  const newEnergy = Math.min(
    state.select.playerMaxEnergy(),
    oldEnergy - state.select.playerSize() / 2,
  );
  state.setRaw({
    ...state.raw,
    energy: newEnergy,
  });
}
