import WrappedState from "~types/WrappedState";

export default function gameOverSystem(state: WrappedState): void {
  if (state.select.playerEnergy() <= 0 || state.select.playerHealth() <= 0) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: false,
    });
    state.act.logMessage({
      message:
        "Defeat! Keep an eye on your health and energy. Press N to start a new game.",
    });
  }
}
