import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IGun, IPack } from "../types/type";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveAddress } from "arweave-wallet-kit";
import { toast } from "react-toastify";
import { postAsset } from "../lib/post";
import mockGuns from "../../public/json/gun.json";

const Pack: React.FC = () => {
  const address = useActiveAddress();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPack, setSelectedPack] = useState(0);
  const [openedPacks, setOpenedPacks] = useState<Record<number, IGun[]>>({});
  const [isOpening, setIsOpening] = useState(false);
  const [openedPackCount, setOpenedPackCount] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const packOpen = async () => {
    if (isOpening || openedPacks[selectedPack]) return;

    setIsOpening(true);
    setIsLoading(true);
    const newCards: IGun[] = [];

    try {
      for (let i = 0; i < 3; i++) {
        const randomGun = mockGuns[Math.floor(Math.random() * mockGuns.length)];

        const fileData = await fetch(randomGun.image);
        const blob = await fileData.blob();
        const file = new File([blob], randomGun.name, {
          type: fileData.headers.get("content-type") || "image/png",
        });

        const transactionId = await postAsset({
          file: file,
          title: randomGun.name,
          description: randomGun.description || "",
          license: "default",
          payment: "",
          tags: [
            { name: "Rarity", value: randomGun.rarity },
            { name: "Level", value: randomGun.level.toString() },
            { name: "Attack", value: randomGun.attack.toString() },
            { name: "Type", value: "image" },
            { name: "Content-Type", value: "image/png" },
          ],
          creatorName: "cardene",
          creatorId: address || "",
        });
        toast(`Atomic asset uploaded! ${transactionId}`);

        // Add the gun to the new cards array
        newCards.push({ ...randomGun, id: randomGun.id });
      }

      // Store the opened pack
      setOpenedPacks((prev) => ({ ...prev, [selectedPack]: newCards }));
      setOpenedPackCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setIsOpening(false);
    }
  };

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

  // 全パックが開封されたら「Next」ボタンを表示
  useEffect(() => {
    if (openedPackCount === totalPacks) {
      setShowNextButton(true);
    }
  }, [openedPackCount, totalPacks]);

  const handleNextPack = () => {
    if (selectedPack < totalPacks - 1) {
      setSelectedPack((prev) => prev + 1);
    }
  };

  const handlePrevPack = () => {
    if (selectedPack > 0) {
      setSelectedPack((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    // 開封したカードのIDだけをクエリパラメータに追加する
    const openedPacksIds = Object.values(openedPacks)
      .flat()
      .map((card) => `id=${card.id}`)
      .join("&");
    console.log(`openedPacksIds: ${JSON.stringify(openedPacksIds)}`);
    navigate(`/pack-result?${openedPacksIds}`);
  };

  const renderPack = (index: number, size: "small" | "large") => {
    const packs: IPack[] = [
  {
    id: 1,
    name: "Part 1",
    price: 0.001,
    description: "Part 1",
    image: "/img/nft/collection/pack.png",
      }
    ]
    const sizeClass = size === "large" ? "w-64 h-96" : "w-32 h-48";

    if (!packs[0]) return null;

    return (
      <div className={`${sizeClass} mx-2 p-2 border-2 border-gray-400 flex flex-col justify-center items-center`}>
        <img
          src={packs[0].image}
          alt={packs[0].name}
          className="w-full h-full object-cover"
        />
        <p className="text-center">{packs[0].name}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">
        Open Pack
      </h1>

      {showNextButton && (
        <div className="text-center mb-4">
          <button
            onClick={handleNextPage}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}

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
        {isLoading ? (
          <p className="text-lg">Loading...</p>
        ) : (
          <button
            onClick={packOpen}
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            開封する
          </button>
        )}
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
