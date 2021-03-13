import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import notifications from "~lib/notifications";
import audio from "~lib/audio";

const logMessage = createStandardAction("LOG_MESSAGE")<{
  message: string;
  type: "buff" | "debuff" | "enemy" | "damage" | "error";
}>();
export default logMessage;

function logMessageHandler(
  state: WrappedState,
  action: ReturnType<typeof logMessage>,
): void {
  const { message, type } = action.payload;
  const turn = state.select.turn();
  state.setRaw({
    ...state.raw,
    messageLog: {
      ...state.raw.messageLog,
      [turn]: [
        ...(state.raw.messageLog[turn] || []),
        {
          message,
          type,
        },
      ],
    },
  });

  // should probably find a better solution to this
  // perhaps the same subscription system I'm planning for rendering
  if (type === "error") {
    notifications.open({
      type: type || "error",
      message,
    });
    audio.play("kenney-error");
  }
}

registerHandler(logMessageHandler, logMessage);
