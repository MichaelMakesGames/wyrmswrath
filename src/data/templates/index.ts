import { Entity } from "~types";
import misc from "./misc";
import terrain from "./terrain";
import consumables from "./consumables";

const templates = {
  ...consumables,
  ...misc,
  ...terrain,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
