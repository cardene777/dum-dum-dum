import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import guns from "../../public/json/gun.json";
import { IGun } from "../types/type";
import { Header } from "../components/Header";

const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

const PackDetails: React.FC = () => {
  const location = useLocation();
  const [cards, setCards] = useState<IGun[]>([]);
  const [sortBy, setSortBy] = useState<string>("rarity");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    // クエリパラメータから id を取得
    const queryParams = new URLSearchParams(location.search);
    const ids = queryParams.getAll("id").map(Number); // idの配列を取得

    // gun.json から該当する id のカードを取得 (重複を許可)
    const filteredGuns = ids
      .map((id) => guns.find((gun) => gun.id === id))
      .filter(Boolean);
    setCards(filteredGuns as IGun[]); // 存在するカードのみセット
  }, [location.search]);

  // ソートとフィルタリング処理
  const sortedAndFilteredCards = React.useMemo(() => {
    let filteredCards = [...cards];

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

    return filteredCards;
  }, [cards, sortBy, filterRarity, filterType]); // 依存関係を正しく設定

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Pack Result
        </h1>

        {/* フィルタとソートのためのUI */}
        <div className="mb-4 flex justify-center space-x-4">
          {/* レア度フィルタ */}
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="all">All Rarities</option>
            {rarityOrder.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>

          {/* レベルフィルタ */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="all">All Levels</option>
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>

          {/* ソート */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
          >
            <option value="rarity">Sort by Rarity</option>
            <option value="name">Sort by Name</option>
            <option value="level">Sort by Level</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`} // インデックスをキーに含めて重複を防ぐ
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
                <span className="text-sm text-[#1a0b2e] font-bold">Lv.1</span>
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
