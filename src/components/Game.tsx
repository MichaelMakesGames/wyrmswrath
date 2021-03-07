/* global document */
import React, { useEffect } from "react";
import colors from "~colors";
import { MAP_CSS_WIDTH } from "~constants";
import BottomMenu from "./BottomMenu";
import GameMap from "./GameMap";
import Header from "./Header";
import HotkeysProvider from "./HotkeysProvider";
import Inspector from "./Inspector";
import Introduction from "./Introduction";
import LoadGame from "./LoadGame";
import Status from "./Status";

export default function Game() {
  useEffect(() => {
    Object.entries(colors).forEach(([color, value]) =>
      document.body.style.setProperty(`--${color}`, value),
    );
  }, []);

  return (
    <HotkeysProvider>
      <main className="h-full flex flex-col">
        <Header />
        <LoadGame />
        <div className="flex flex-row flex-1 w-full max-w-screen-xl mx-auto">
          <div className="flex-none w-64 h-full flex flex-col border-l border-r border-gray z-10">
            <Status />
          </div>
          <div
            className="flex-none h-full border-gray"
            style={{
              width: MAP_CSS_WIDTH,
            }}
          >
            <GameMap />
            <BottomMenu />
          </div>
          <div className="flex-none w-64 h-full flex flex-col border-l border-r border-gray z-10">
            <Inspector />
          </div>
        </div>
        <Introduction />
      </main>
    </HotkeysProvider>
  );
}
