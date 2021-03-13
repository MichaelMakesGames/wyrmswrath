import { Notyf } from "notyf";
import colors from "~colors";

const notifications = new Notyf({
  position: { x: "right", y: "top" },
  types: [{ type: "error", background: colors.red }],
  duration: 3000,
  dismissible: true,
});

export default notifications;
