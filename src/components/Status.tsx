import React from "react";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";

export default function Status() {
  const turn = useSelector(selectors.turn);
  return (
    <section className="p-2 border-b border-gray" data-section="STATUS">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col">
          <p className="text-xl">Turn {turn + 1}</p>
        </div>
      </div>
    </section>
  );
}
