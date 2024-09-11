import { useState } from "react";
import {Header} from "../components/Header";

const mockCards = [
  {
    id: 1,
    name: "Kendrick Lamar",
    rarity: "Legendary",
    level: 5,
    flow: 95,
    rhyme: 92,
    fashion: 88,
    passion: 90,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "J. Cole",
    rarity: "Epic",
    level: 4,
    flow: 90,
    rhyme: 93,
    fashion: 85,
    passion: 89,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Drake",
    rarity: "Epic",
    level: 4,
    flow: 88,
    rhyme: 90,
    fashion: 92,
    passion: 91,
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Megan Thee Stallion",
    rarity: "Rare",
    level: 3,
    flow: 87,
    rhyme: 85,
    fashion: 93,
    passion: 90,
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Tyler, The Creator",
    rarity: "Epic",
    level: 4,
    flow: 89,
    rhyme: 91,
    fashion: 94,
    passion: 92,
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Cardi B",
    rarity: "Rare",
    level: 3,
    flow: 86,
    rhyme: 84,
    fashion: 95,
    passion: 89,
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Eminem",
    rarity: "Legendary",
    level: 5,
    flow: 98,
    rhyme: 97,
    fashion: 85,
    passion: 93,
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Nicki Minaj",
    rarity: "Epic",
    level: 4,
    flow: 91,
    rhyme: 89,
    fashion: 94,
    passion: 90,
    image: "/placeholder.svg",
  },
];

const UserCardCollection = () => {
  const [cards, setCards] = useState(mockCards);
  const [sortBy, setSortBy] = useState<"flow" | "rhyme" | "fashion" | "passion" | "">("");
  const [filterRarity, setFilterRarity] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const handleSort = (value: "flow" | "rhyme" | "fashion" | "passion") => {
    setSortBy(value);
    const sortedCards = [...cards].sort((a, b) => b[value] - a[value]);
    setCards(sortedCards);
  };

  const handleFilter = () => {
    let filteredCards = [...mockCards];
    if (filterRarity && filterRarity !== 'all') {
      filteredCards = filteredCards.filter(
        (card) => card.rarity === filterRarity
      );
    }
    if (filterLevel && filterLevel !== 'all') {
      filteredCards = filteredCards.filter(
        (card) => card.level === parseInt(filterLevel)
      );
    }
    setCards(filteredCards);
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-[#1a0b2e] to-[#eee5fb] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
        Card Collection
      </h1>

      <div className="mb-8 flex items-center justify-center">
        <div className="flex space-x-4">
          <select
            onChange={(e) => handleSort(e.target.value as "flow" | "rhyme" | "fashion" | "passion")}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="">ソート</option>
            <option value="flow">フロウ</option>
            <option value="rhyme">ライム</option>
            <option value="fashion">ファッション</option>
            <option value="passion">パッション</option>
          </select>
          <select
            onChange={(e) => setFilterRarity(e.target.value)}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="">レア度フィルター</option>
            <option value="Legendary">Legendary</option>
            <option value="Epic">Epic</option>
            <option value="Rare">Rare</option>
          </select>
          <select
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="">レベルフィルター</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button
            onClick={handleFilter}
            className="bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold py-2 px-4 rounded"
          >
            フィルター適用
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-4"
          >
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-[#7fffd4]">
              {card.name}
            </h3>
            <p className="text-sm text-[#b19cd9] mb-1">レア度: {card.rarity}</p>
            <p className="text-sm text-[#b19cd9] mb-2">レベル: {card.level}</p>
            <div className="space-y-2">
              <label className="text-[#b19cd9]">フロウ: {card.flow}</label>
              <input
                type="range"
                value={card.flow}
                max={100}
                className="w-full bg-[#1a0b2e] border-[#b19cd9] cursor-not-allowed"
                readOnly
              />
              <label className="text-[#b19cd9]">ライム: {card.rhyme}</label>
              <input
                type="range"
                value={card.rhyme}
                max={100}
                className="w-full bg-[#1a0b2e] border-[#b19cd9] cursor-not-allowed"
                readOnly
              />
              <label className="text-[#b19cd9]">
                ファッション: {card.fashion}
              </label>
              <input
                type="range"
                value={card.fashion}
                max={100}
                className="w-full bg-[#1a0b2e] border-[#b19cd9] cursor-not-allowed"
                readOnly
              />
              <label className="text-[#b19cd9]">
                パッション: {card.passion}
              </label>
              <input
                type="range"
                value={card.passion}
                max={100}
                className="w-full bg-[#1a0b2e] border-[#b19cd9] cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default UserCardCollection;
