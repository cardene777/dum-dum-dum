import React, { useState } from "react";
import { ShoppingCart, Package, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { IPack } from "../types/type";

interface SelectedPacks {
  [key: number]: { quantity: number };
}

const packs: IPack[] = [
  {
    id: 1,
    name: "Part 1",
    price: 0.001,
    description: "Part 1",
    image: "/img/nft/collection/pack.png",
  },
  // {
  //   id: 2,
  //   name: "Part 2",
  //   price: 100,
  //   description: "Part 2",
  //   image: "/img/gun/M16A2.png",
  // },
  // {
  //   id: 3,
  //   name: "Part 3",
  //   price: 100,
  //   description: "Part 3",
  //   image: "/img/gun/desert_eagle.png",
  // },
];

const Shop: React.FC = () => {
  // 初期値を全パックで quantity: 0 に設定
  const [selectedPacks, setSelectedPacks] = useState<SelectedPacks>(
    packs.reduce((acc, pack) => {
      acc[pack.id] = { quantity: 0 };
      return acc;
    }, {} as SelectedPacks)
  );

  const navigate = useNavigate();

  const handleQuantityChange = (packId: number, quantity: string) => {
    const parsedQuantity = parseInt(quantity);

    // 数値が無効または0未満の場合、何もしない
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return;
    }

    setSelectedPacks((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        quantity: parsedQuantity,
      },
    }));
  };

  const handlePurchase = () => {
    const purchasedPacks = Object.entries(selectedPacks)
      .filter(([, details]) => details.quantity > 0) // 購入数が0のものを除外
      .map(([packId, details]) => ({
        pack: packs.find((p) => p.id === parseInt(packId)),
        quantity: details.quantity,
      }));

    const queryParams = new URLSearchParams();

    purchasedPacks.forEach((purchased) => {
      if (purchased.pack) {
        queryParams.append(
          `pack-${purchased.pack.id}`,
          purchased.quantity.toString()
        );
      }
    });

    // ログ出力とアラート
    console.log("Purchased packs:", purchasedPacks);
    alert("購入が完了しました！");

    // 選択したパックをリセット
    setSelectedPacks(
      packs.reduce((acc, pack) => {
        acc[pack.id] = { quantity: 0 };
        return acc;
      }, {} as SelectedPacks)
    );

    // 遷移処理: クエリパラメーター付きで pack-result ページに移動
    navigate(`/open-pack?${queryParams.toString()}`);
  };

  const totalCost = Object.entries(selectedPacks).reduce(
    (total, [packId, details]) => {
      const pack = packs.find((p) => p.id === parseInt(packId));
      return total + (pack ? pack.price * details.quantity : 0);
    },
    0
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Card Pack Shop
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`p-4 rounded-lg bg-[#2a1b3d] transition-colors border-2 ${
                selectedPacks[pack.id].quantity > 0
                  ? "border-[#7fffd4]" // 個数が1以上の場合、枠の色を変更
                  : "border-[#b19cd9]" // それ以外の場合は通常の枠の色
              }`}
            >
              <div className="text-2xl text-[#7fffd4] flex items-center mb-4">
                <Package className="mr-2" />
                {pack.name}
              </div>
              <img
                src={pack.image}
                alt={pack.name}
                className="w-full object-cover rounded-md mb-4"
              />
              <p className="text-[#b19cd9] mb-2">{pack.description}</p>
              <p className="text-xl font-bold text-[#7fffd4]">
                {pack.price} AR
              </p>
              <div className="flex justify-between items-center mt-4">
                <input
                  type="number"
                  min="0"
                  value={selectedPacks[pack.id].quantity}
                  onChange={(e) =>
                    handleQuantityChange(pack.id, e.target.value)
                  }
                  className="w-20 bg-[#1a0b2e] border border-[#b19cd9] text-white rounded-md p-2"
                />
                <Link
                  to={`/pack-details`}
                  className="bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold p-2 rounded-md flex items-center"
                >
                  <Info className="mr-2" />
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        {totalCost > 0 && (
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-[#7fffd4] mb-4">
              合計: {totalCost} コイン
            </p>
            <button
              onClick={handlePurchase}
              className="bg-[#b19cd9] hover:bg-[#9370db] text-[#1a0b2e] font-bold px-8 py-3 text-xl rounded-md flex items-center"
            >
              <ShoppingCart className="mr-2" />
              Buy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
