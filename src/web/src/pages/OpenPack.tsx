import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IGun } from "../types/type";
import { useNavigate, useLocation } from "react-router-dom";
import guns from "../../public/json/gun.json";
import weapons from "../../public/json/weapon.json";

const Pack: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState(0);
  const [openedPacks, setOpenedPacks] = useState<Record<number, IGun[]>>({});
  const [isOpening, setIsOpening] = useState(false);
  const [openedPackCount, setOpenedPackCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // クエリパラメータからパック情報を取得
  const queryParams = new URLSearchParams(location.search);
  const packData = Array.from(queryParams.entries()).flatMap(([key, value]) => {
    const id = parseInt(key.replace("pack-", ""));
    const quantity = parseInt(value);
    // パックの個数分だけ配列に追加
    return Array(quantity).fill({ id });
  });

  // パックの総数を取得
  const totalPacks = packData.length;

  // 全パックが開封されたら自動的に pack-result に遷移する
  useEffect(() => {
    if (openedPackCount === totalPacks) {
      alert("全てのパックを開封しました！");
      console.log(`openedPacks: ${JSON.stringify(openedPacks)}`);

      // 開封したカードのIDだけをクエリパラメータに追加する
      const openedPacksIds = Object.values(openedPacks)
        .flat()
        .map((card) => `id=${card.id}`)
        .join("&");
        console.log(`openedPacksIds: ${JSON.stringify(openedPacksIds)}`);
      navigate(`/pack-result?${openedPacksIds}`);
    }
  }, [openedPackCount, navigate, totalPacks, openedPacks]);

  const handlePrevPack = () => {
    if (selectedPack > 0) {
      setSelectedPack((prev) => prev - 1);
    }
  };

  const handleNextPack = () => {
    if (selectedPack < totalPacks - 1) {
      setSelectedPack((prev) => prev + 1);
    }
  };

  const openPack = () => {
    if (isOpening || openedPacks[selectedPack]) return;

    setIsOpening(true);
    const newCards: IGun[] = [];
    for (let i = 0; i < 3; i++) {
      const randomCard = guns[Math.floor(Math.random() * guns.length)];
      console.log(`randomCard: ${JSON.stringify(randomCard)}`);
      newCards.push({ ...randomCard, id: randomCard.id });
    }

    console.log(`newCards: ${JSON.stringify(newCards)}`);

    setTimeout(() => {
      setOpenedPacks((prev) => ({ ...prev, [selectedPack]: newCards }));
      setOpenedPackCount((prevCount) => prevCount + 1);
      setIsOpening(false);
    }, 1000);
  };

  const renderPack = (index: number, size: "small" | "large") => {
    const pack = weapons.find((weapon) => weapon.id === packData[index].id);
    const sizeClass = size === "large" ? "w-64 h-96" : "w-32 h-48";

    if (!pack) return null;

    return (
      <div className={`${sizeClass} mx-2 p-2 border-2 border-gray-400`}>
        <img
          src={pack.image}
          alt={pack.name}
          className="w-full h-full object-cover"
        />
        <p className="text-center">{pack.name}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">
        Open Pack
      </h1>

      <p className="text-center mb-4 text-xl text-gray-300">
        Opened Pack: {openedPackCount} / {totalPacks}
      </p>

      <div className="flex justify-center items-center mb-8 space-x-4">
        <button
          onClick={handlePrevPack}
          disabled={selectedPack === 0}
          className={`text-white w-10 h-10 ${
            selectedPack === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft />
        </button>

        <div className="flex justify-center items-center space-x-4">
          {totalPacks === 1 && (
            <div className="flex justify-center items-center">
              {renderPack(selectedPack, "large")}
            </div>
          )}

          {totalPacks === 2 && (
            <div className="flex justify-center items-center">
              {selectedPack === 0 && (
                <>
                  <div className="w-32 px-6" />
                  {renderPack(selectedPack, "large")}
                  {renderPack(selectedPack + 1, "small")}
                </>
              )}
              {selectedPack === 1 && (
                <>
                  {renderPack(selectedPack - 1, "small")}
                  {renderPack(selectedPack, "large")}
                  <div className="w-32" />
                </>
              )}
            </div>
          )}

          {totalPacks >= 3 && (
            <div className="flex justify-center items-center">
              {selectedPack > 0 ? (
                renderPack(selectedPack - 1, "small")
              ) : (
                <div className="w-32" />
              )}
              {renderPack(selectedPack, "large")}
              {selectedPack < totalPacks - 1 ? (
                renderPack(selectedPack + 1, "small")
              ) : (
                <div className="w-32" />
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleNextPack}
          disabled={selectedPack === totalPacks - 1}
          className={`text-white w-10 h-10 ${
            selectedPack === totalPacks - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <ChevronRight />
        </button>
      </div>

      <div className="text-center mb-4">
        <button
          onClick={openPack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          開封する
        </button>
      </div>

      {openedPacks[selectedPack] && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {openedPacks[selectedPack].map((card) => (
            <div key={card.id} className="bg-gray-700 p-4 text-center">
              <img
                src={card.image}
                alt={card.name}
                className="w-full object-cover mb-2"
              />
              <p>{card.name}</p>
              <p>{card.rarity}</p>
              <p>Attack: {card.attack}</p>
              <p>Level: 1</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pack;
