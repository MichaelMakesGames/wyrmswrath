import React from "react";
import Menu from "./Menu";

export default function Header() {
  return (
    <header className="flex-none bg-darkGray border-b border-gray">
      <div className="mx-auto py-1 px-2 flex flex-row">
        <h1 className="font-bold flex-1">Serpentine 7DRL</h1>
        <Menu />
      </div>
    </header>
  );
}
