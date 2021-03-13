/* global document */
import React, { useEffect } from "react";
import colors from "~colors";
import BottomMenu from "./BottomMenu";
import CardGain from "./CardGain";
import GameMap from "./GameMap";
import GameOver from "./GameOver";
import Header from "./Header";
import HotkeysProvider from "./HotkeysProvider";
import Introduction from "./Introduction";
import LoadGame from "./LoadGame";
import MessageLog from "./MessageLog";
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
        <LoadGame />
        <div
          className="flex flex-row flex-1 w-full"
          style={{ height: "calc(100% - 275px)" }}
        >
          <div className="flex-none w-64 h-full flex flex-col border-r border-gray z-10">
            <Header />
            <Status />
            <MessageLog />
          </div>
          <div className="flex-1 h-full w-full">
            <GameMap />
          </div>
        </div>
        <div className="w-full">
          <BottomMenu />
        </div>
        <Introduction />
        <CardGain />
        <GameOver />
      </main>
    </HotkeysProvider>
  );
}
