import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mockGuns from "../../public/json/gun.json";
import { IGun } from "../types/type";
import { Header } from "../components/Header";
import { WeaponCard } from "../components/WeaponCard";

const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

const PackDetails: React.FC = () => {
  const { packId } = useParams<{ packId: string }>();
  const [cards, setCards] = useState<IGun[]>(mockGuns);
  const [sortBy, setSortBy] = useState<string>("rarity");
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
          パック詳細
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

        <div className="mb-8 flex justify-between items-center">
          {/* Rarity Filter */}
          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setFilterRarity(e.target.value)}
            value={filterRarity}
          >
            <option value="all">All</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>

          {/* Type Filter */}
          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
          >
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            className="w-[180px] bg-[#1a0b2e] text-[#b19cd9] p-2 rounded-md"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="rarity">Sort by Rarity</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <WeaponCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PackDetails;
