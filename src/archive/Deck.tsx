import React, { useState } from "react";
import { Check } from "lucide-react";

interface Card {
  id: number;
  name: string;
  power: number;
  image: string;
}

const Deck = () => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([
    { id: 1, name: "Kendrick Lamar", power: 95, image: "/placeholder.svg" },
    { id: 2, name: "J. Cole", power: 90, image: "/placeholder.svg" },
    { id: 3, name: "Drake", power: 92, image: "/placeholder.svg" },
    {
      id: 4,
      name: "Megan Thee Stallion",
      power: 88,
      image: "/placeholder.svg",
    },
    { id: 5, name: "Tyler, The Creator", power: 89, image: "/placeholder.svg" },
    { id: 6, name: "Cardi B", power: 87, image: "/placeholder.svg" },
    { id: 7, name: "Eminem", power: 96, image: "/placeholder.svg" },
    { id: 8, name: "Nicki Minaj", power: 91, image: "/placeholder.svg" },
  ]);

  const toggleCardSelection = (card: Card) => {
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = () => {
    if (selectedCards.length === 5) {
      console.log("Selected battle deck:", selectedCards);
      alert("バトルデッキが選択されました！");
    } else {
      alert("5枚のカードを選択してください。");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
        バトルデッキ選択
      </h1>
      <p className="text-center mb-8 text-xl text-[#7fffd4]">
        所持カード: {userCards.length} | 選択済み: {selectedCards.length}/5
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userCards.map((card) => (
          <div
            key={card.id}
            className={`bg-[#2a1b3d] border-2 cursor-pointer transition-all rounded-lg ${
              selectedCards.find((c) => c.id === card.id)
                ? "border-[#7fffd4] shadow-lg"
                : "border-[#b19cd9] hover:border-[#7fffd4]"
            }`}
            onClick={() => toggleCardSelection(card)}
          >
            <div className="p-4 flex flex-col items-center">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold mb-1 text-[#7fffd4]">
                {card.name}
              </h3>
              <p className="text-sm text-[#b19cd9]">パワー: {card.power}</p>
              {selectedCards.find((c) => c.id === card.id) && (
                <Check className="text-[#7fffd4] h-6 w-6 mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#b19cd9]">
          選択されたデッキ
        </h2>
        <div className="flex justify-center gap-4">
          {selectedCards.map((card) => (
            <div key={card.id} className="w-20 h-28 relative">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute top-0 right-0 bg-[#1a0b2e] text-[#7fffd4] px-1 rounded-bl-md">
                {card.power}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold px-8 py-3 text-lg rounded"
          disabled={selectedCards.length !== 5}
        >
          バトルデッキを確定
        </button>
      </div>
    </div>
  );
};

export default Deck;
