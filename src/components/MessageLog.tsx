import React from "react";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";

export default function MessageLog() {
  const turn = useSelector(selectors.turn);
  const messageLog = useSelector(selectors.messageLog);

  const thisTurn = messageLog[turn] || [];
  const lastTurn = messageLog[turn - 1] || [];
  const turnBeforeLast = messageLog[turn - 2] || [];

  return (
    <section className="p-2 flex-1 overflow-y-auto">
      <h2 className="text-xl">Action Log</h2>
      {thisTurn.length > 0 && (
        <MessageLogSection label="This Turn" messages={thisTurn} />
      )}
      <MessageLogSection label="Last Turn" messages={lastTurn} />
      <MessageLogSection label="2 Turns Ago" messages={turnBeforeLast} />
    </section>
  );
}

function MessageLogSection({
  label,
  messages,
}: {
  label: string;
  messages: { message: string; type: string }[];
}) {
  return (
    <section>
      <h3 className="text-lightGray mt-2">{label}:</h3>
      {messages.length === 0 && (
        <div className="text-sm ml-2 mt-1 text-lightGray">Nothing</div>
      )}
      {messages.map(({ message, type }, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={`text-sm ml-2 mt-1 ${getColor(type)}`}
        >
          {message}
        </div>
      ))}
    </section>
  );
}

function getColor(type: string) {
  if (type === "buff") return "text-lighterBlue";
  if (type === "debuff") return "text-lighterBrown";
  if (type === "error") return "text-red";
  if (type === "damage") return "text-darkRed";
  return "text-lightGray";
}
