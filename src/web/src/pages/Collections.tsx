import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mockGuns from "../../public/json/gun-collection.json";
import { IGun } from "../types/type";
import { Header } from "../components/Header";

const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

const PackDetails: React.FC = () => {
  const { packId } = useParams<{ packId: string }>();
  const [cards, setCards] = useState<IGun[]>(mockGuns);
  const [sortBy, setSortBy] = useState<string>("");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    // In a real application, you would fetch the cards based on the packId
    console.log(`Fetching cards for pack ${packId}`);
  }, [packId]);

  useEffect(() => {
    let filteredCards = [...mockGuns];

    if (filterRarity !== "all") {
      filteredCards = filteredCards.filter(
        (card) => card.rarity === filterRarity
      );
    }

    if (filterType !== "all") {
      filteredCards = filteredCards.filter(
        (card) => card.level === Number(filterType)
      );
    }

    filteredCards.sort((a, b) => {
      if (sortBy === "rarity") {
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "level") {
        return (b.level || 0) - (a.level || 0);
      }
      return 0;
    });

    setCards(filteredCards);
  }, [sortBy, filterRarity, filterType]);

  const rarityDistribution = {
    Common: "40%",
    Uncommon: "30%",
    Rare: "20%",
    Epic: "8%",
    Legendary: "2%",
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Collection
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#7fffd4]">
            Rarity Distribution
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(rarityDistribution).map(([rarity, percentage]) => (
              <div key={rarity} className="text-center">
                <p className="font-bold text-[#b19cd9]">{rarity}</p>
                <p className="text-[#7fffd4]">{percentage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex justify-center items-center space-x-4">
          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setFilterRarity(e.target.value)}
            value={filterRarity}
          >
            <option value="all">Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>

          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
          >
            <option value="all">Level</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="">Sort</option>
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="level">Level</option> {/* レベルソートオプション */}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-4"
            >
              {/* 画像 */}
              <img
                src={card.image}
                alt={card.name}
                className="w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-[#7fffd4]">
                {card.name}
              </h3>

              {/* 左上のパラメーター（例：レア度を丸で囲んで表示） */}
              <div className="absolute top-2 left-2 flex items-center justify-center w-12 h-12 bg-[#1a0b2e] border-2 border-[#b19cd9] rounded-full text-center">
                <span className="text-sm text-white font-bold">
                  {card.rarity}
                </span>
              </div>

              {/* 右上のレベル表示 */}
              <div className="absolute top-2 right-2 flex items-center justify-center w-12 h-12 bg-[#b19cd9] rounded-full text-center">
                <span className="text-sm text-[#1a0b2e] font-bold">
                  Lv.{card.level || 1}
                </span>
              </div>

              {/* 攻撃力と防御力を六芒星で囲んで表示 */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
                {/* 攻撃力 */}
                <div className="flex items-center justify-center w-16 h-16 bg-transparent border-2 border-[#b19cd9] rounded-full relative">
                  <div className="absolute inset-0 flex justify-center items-center text-white">
                    <span className="text-lg font-bold">{card.attack}</span>
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                  >
                    <polygon
                      points="50,0 93,25 93,75 50,100 7,75 7,25"
                      className="stroke-[#b19cd9] fill-none"
                      strokeWidth="4"
                    />
                  </svg>
                </div>

                {/* 防御力 */}
                <div className="flex items-center justify-center w-16 h-16 bg-transparent border-2 border-[#b19cd9] rounded-full relative">
                  <div className="absolute inset-0 flex justify-center items-center text-white">
                    <span className="text-lg font-bold">0</span>
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                  >
                    <polygon
                      points="50,0 93,25 93,75 50,100 7,75 7,25"
                      className="stroke-[#b19cd9] fill-none"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PackDetails;
