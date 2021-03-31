import React from "react";
import { HEX_HEIGHT, HEX_WIDTH } from "~constants";
import spriteSheetData from "~data/spriteSheetData";
import { Entity } from "~types";
// @ts-ignore
import tiles from "../assets/tiles/*.png";

interface Props {
  entity: Entity;
  style?: React.CSSProperties;
}
export default function EntityPreview({ entity, style = {} }: Props) {
  if (!entity.display) return null;

  const tile = Array.isArray(entity.display.tile)
    ? entity.display.tile[0]
    : entity.display.tile;
  const spriteSheetConfig = spriteSheetData.find((d) => d.id === tile);

  const backgroundImage = `url(${
    tiles[spriteSheetConfig ? "spritesheet" : tile]
  })`;

  const backgroundPosition =
    spriteSheetConfig &&
    `${HEX_WIDTH * -spriteSheetConfig.x}px ${
      HEX_HEIGHT * -spriteSheetConfig.y
    }px`;

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        bottom: "8px",
        margin: "-12px 0",
        height: 24,
        width: 24,
        backgroundImage,
        backgroundPosition,
        backgroundOrigin: "0px 0px",
        ...style,
      }}
    />
  );
}
