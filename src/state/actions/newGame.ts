import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import makeLevel from "~lib/makeLevel";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { createInitialState } from "~state/initialState";
import WrappedState from "~types/WrappedState";

const newGame = createStandardAction("NEW_GAME")();
export default newGame;

function newGameHandler(
  state: WrappedState,
  action: ReturnType<typeof newGame>,
): void {
  state.setRaw(createInitialState());
  renderer.clear();

  const head = createEntityFromTemplate("WYRM", { pos: { x: 0, y: 0 } });
  head.id = PLAYER_ID;
  state.act.addEntity(head);
  const body = createEntityFromTemplate("WYRM", {
    wyrm: { connectsTo: head.id, isPlayer: true },
    pos: { x: 0, y: 0 },
  });
  state.act.addEntity(body);

  makeLevel(state);
  // const body2 = createEntityFromTemplate("WYRM", {
  //   wyrm: { connectsTo: body.id, isPlayer: true },
  //   pos: getPositionToDirection(getPositionToDirection(middle, "N"), "N"),
  // });
  // state.act.addEntity(body2);
  // const tail = createEntityFromTemplate("WYRM", {
  //   wyrm: { connectsTo: body2.id, isPlayer: true },
  //   pos: getPositionToDirection(
  //     getPositionToDirection(getPositionToDirection(middle, "N"), "N"),
  //     "N",
  //   ),
  // });
  // state.act.addEntity(tail);

  state.act.loadGame({ state: state.raw });
}

registerHandler(newGameHandler, newGame);
