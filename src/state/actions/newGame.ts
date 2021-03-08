import { createStandardAction } from "typesafe-actions";
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_ID } from "~constants";
import { createEntityFromTemplate } from "~lib/entities";
import { getPositionToDirection } from "~lib/geometry";
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
  makeLevel(state);

  const middle = { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
  const head = createEntityFromTemplate("WYRM", { pos: middle });
  head.id = PLAYER_ID;
  state.act.addEntity(head);
  const body = createEntityFromTemplate("WYRM", {
    wyrm: { connectsTo: head.id, variant: "purple" },
    pos: getPositionToDirection(middle, "N"),
  });
  state.act.addEntity(body);
  const body2 = createEntityFromTemplate("WYRM", {
    wyrm: { connectsTo: body.id, variant: "blue" },
    pos: getPositionToDirection(getPositionToDirection(middle, "N"), "N"),
  });
  state.act.addEntity(body2);
  const tail = createEntityFromTemplate("WYRM", {
    wyrm: { connectsTo: body2.id, variant: "green" },
    pos: getPositionToDirection(
      getPositionToDirection(getPositionToDirection(middle, "N"), "N"),
      "N",
    ),
  });
  state.act.addEntity(tail);

  state.act.loadGame({ state: state.raw });
}

registerHandler(newGameHandler, newGame);
