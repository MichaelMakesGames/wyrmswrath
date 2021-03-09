import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RNG } from "rot-js";
import cards, { Card } from "~data/cards";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import CardComponent from "./Card";
import { HotkeyGroup } from "./HotkeysProvider";
import Modal from "./Modal";

export default function CardGain() {
  const dispatch = useDispatch();

  const crystalProgress = useSelector(selectors.crystalProgress);
  const crystalUnlock = useSelector(selectors.crystalUnlock);
  const crystalUnlocked = crystalProgress >= crystalUnlock ? "Crystal" : null;
  const mushroomProgress = useSelector(selectors.mushroomProgress);
  const mushroomUnlock = useSelector(selectors.mushroomUnlock);
  const mushroomUnlocked =
    mushroomProgress >= mushroomUnlock ? "Mushroom" : null;
  const slimeProgress = useSelector(selectors.slimeProgress);
  const slimeUnlock = useSelector(selectors.slimeUnlock);
  const slimeUnlocked = slimeProgress >= slimeUnlock ? "Slime" : null;
  const unlocked = crystalUnlocked || mushroomUnlocked || slimeUnlocked;

  const [isOpen, open, close] = useBoolean(false);
  useEffect(() => {
    if (unlocked) {
      open();
    } else {
      close();
    }
  }, [unlocked]);

  const [choices, setChoices] = useState<Card[]>([]);
  useEffect(() => {
    if (!unlocked) {
      setChoices([]);
    } else {
      setChoices(
        RNG.shuffle(
          Object.values(cards).filter((card) =>
            card.code.startsWith(unlocked.toUpperCase()),
          ),
        ).slice(0, 3),
      );
    }
  }, [unlocked]);

  return (
    <Modal isOpen={isOpen} onRequestClose={() => {}}>
      <h2 className="text-2xl flex-grow">Choose a {unlocked} card</h2>
      <div className="flex flex-row">
        {choices.map((card, index) => (
          <CardComponent
            key={card.code}
            code={card.code}
            index={index}
            callback={() => dispatch(actions.cardAddToDeck(card.code))}
            hotkeyGroup={HotkeyGroup.CardGain}
          />
        ))}
      </div>
    </Modal>
  );
}
