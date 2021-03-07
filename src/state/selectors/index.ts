import * as entitySelectors from "./entitySelectors";
import * as statusSelectors from "./statusSelectors";
import { RawState } from "~types";

export default {
  ...entitySelectors,
  ...statusSelectors,
  state: (s: RawState) => s,
  nothing: () => null,
};
