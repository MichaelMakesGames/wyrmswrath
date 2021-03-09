import { Entity } from "~types";
import consumables from "./consumables";
import misc from "./misc";
import monsters from "./monsters";
import terrain from "./terrain";

const templates = {
  ...consumables,
  ...misc,
  ...monsters,
  ...terrain,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
