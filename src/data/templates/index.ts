import { Entity } from "~types";
import misc from "./misc";
import terrain from "./terrain";

const templates = {
  ...misc,
  ...terrain,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
