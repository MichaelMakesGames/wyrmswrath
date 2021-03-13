import WrappedState from "~types/WrappedState";

export default function gameOverSystem(state: WrappedState): void {
  const starvation = state.select.playerEnergy() <= 0;
  const slain = state.select.playerHealth() <= 0;
  if (starvation || slain) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: false,
    });
  }
  if (slain) {
    state.act.logMessage({ message: "You have been slain!", type: "debuff" });
  }
  if (starvation) {
    state.act.logMessage({
      message: "You have starved to death!",
      type: "debuff",
    });
  }
}
