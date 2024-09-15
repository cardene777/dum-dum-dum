import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import mockGuns from "../../public/json/gun.json";
import defaultDeck from "../../public/json/deck.json";
import { IDeck } from "../types/type";
import { useUser } from "../hooks/useUser";
import { getRandomGuns, rarityStyles } from "../lib/common";
import { getHolderAssetData } from "../lib/query-assets";
import { useActiveAddress } from "arweave-wallet-kit";

const BattleRegistrationList: React.FC = () => {
  const { connected } = useUser();
  const address = useActiveAddress();

  const [decks, setDecks] = useState<IDeck[]>(defaultDeck as IDeck[]); // ユーザーのデッキを管理
  const [openUsers, setOpenUsers] = useState<string[]>([]); // 現在開いているユーザーIDのリスト
  const [remainingTime, setRemainingTime] = useState<string>(""); // 残り時間を管理

  // 時刻のフォーマット
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // タイマーの設定
  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999); // 23:59:59.999

      // 差分を計算して秒、分、時に変換
      const difference = midnight.getTime() - now.getTime();
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return formatTime(hours, minutes, seconds);
    };

    const timer = setInterval(() => {
      const timeLeft = calculateRemainingTime();
      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 武器情報の表示/非表示を切り替える処理（クリックされた行の3人を開く）
  const handleDialogToggle = (index: number) => {
    const startIndex = Math.floor(index / 3) * 3; // クリックされた行の最初のインデックス
    const openRowUsers = [
      decks[startIndex]?.address,
      decks[startIndex + 1]?.address,
      decks[startIndex + 2]?.address,
    ];

    if (JSON.stringify(openUsers) === JSON.stringify(openRowUsers)) {
      setOpenUsers([]); // 同じ行がクリックされた場合は閉じる
    } else {
      setOpenUsers(openRowUsers); // その行の3人のIDを格納
    }
  };

  // ユーザー登録ボタンのクリック処理
  const handleUserRegister = async () => {
    if (!connected) return;

    try {
      const assets = await getHolderAssetData(address as string);
      const matchedGuns = assets
        .map((asset: { title: string; id: any }) => {
          const mockGun = mockGuns.find((gun) => gun.name === asset.title);
          return mockGun ? { ...mockGun, id: asset.id } : null;
        })
        .filter((gun: any) => gun !== null); // 保有している武器を取得

      // デフォルト武器のデータ
      const defaultWeapon = {
        id: 86,
        name: "Default Handgun",
        description: "Default Handgun is a basic weapon that deals 10 damage.",
        rarity: "Common",
        level: 1,
        attack: 10,
        image: "/img/gun/default-handgun.png",
      };

      // 保有している武器が3枚未満の場合はデフォルト武器を追加
      const finalDeck = [...matchedGuns];
      while (finalDeck.length < 3) {
        finalDeck.push({ ...defaultWeapon, id: 86 }); // デフォルト武器を追加
      }

      // ランダムに3枚選択（デフォルト武器も含める）
      const selectedGuns = getRandomGuns([...finalDeck, defaultWeapon], 3);

      if (address) {
        const user: IDeck = {
          deck: selectedGuns,
          address: address,
          name: "New User", // 例: 新規ユーザーの名前
          avatar: "/default-avatar.png" // 例: デフォルトのアバター画像
        };
        setDecks([...decks, user]);
        alert("ユーザー登録が完了しました！");
      } else {
        alert("ウォレットアドレスが見つかりません。");
      }
    } catch (error) {
      console.error("Failed to fetch assets or register user:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Battle Registration List
        </h1>

        {/* 残り時間の表示 */}
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-[#7fffd4]">
            Time Remaining: {remainingTime}
          </p>
        </div>

        {/* ユーザー登録ボタン */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleUserRegister}
            className={`text-[#1a0b2e] p-3 rounded-md font-bold transition-colors ${
              connected
                ? "cursor-pointer	bg-[#7fffd4] hover:bg-[#5ec8b1]"
                : "cursor-not-allowed	bg-gray-400"
            }`}
            disabled={!connected}
          >
            Register
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {decks.map((user, index) => (
            <div key={user.address}>
              <div
                onClick={() => handleDialogToggle(index)}
                className="bg-[#2a1b3d] border-[#b19cd9] border-2 shadow-neon cursor-pointer hover:bg-[#3a2b4d] transition-colors p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-[#7fffd4]">
                      {user.name}
                    </h2>
                    <p className="text-sm text-[#b19cd9]">
                      {user.deck?.length} cards
                    </p>
                  </div>
                </div>
              </div>

              {/* 武器表示 */}
              {openUsers.includes(user.address) && (
                <div className="bg-[#2a1b3d] border-[#b19cd9] text-white mt-4 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 p-4 overflow-y-auto max-h-96">
                    {user.deck?.map((card) => (
                      <div
                        key={card.id}
                        className={`relative flex bg-[#2a1b3d] border-2 ${
                          rarityStyles[card.rarity as keyof typeof rarityStyles]
                        } rounded-lg p-4 shadow-lg transition-all hover:scale-105`}
                      >
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-24 h-24 object-cover rounded-md mr-4"
                        />

                        <div className="flex flex-col justify-between">
                          <h3 className="text-lg font-bold text-[#7fffd4]">
                            {card.name}
                          </h3>
                          <p className="text-sm text-[#b19cd9]">
                            {card.rarity}
                          </p>
                          <p className="text-sm text-[#b19cd9]">
                            レベル: Lv.{card.level}
                          </p>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[#7fffd4]">攻撃力</p>
                              <span className="text-lg font-bold text-white">
                                {card.attack}
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[#7fffd4]">防御力</p>
                              <span className="text-lg font-bold text-white">
                                0
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BattleRegistrationList;
