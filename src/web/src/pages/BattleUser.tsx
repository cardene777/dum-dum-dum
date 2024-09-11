import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import mockGuns from "../../public/json/gun.json";
import users from "../../public/json/user.json";
import { IDeck } from "../types/type";
import { useUser } from "../hooks/useUser";
import { getRandomGuns, rarityStyles } from "../lib/common";

const BattleRegistrationList: React.FC = () => {
  const { connected } = useUser();

  const [decks, setDecks] = useState<IDeck[]>(users); // ユーザーのデッキを管理
  const [openUsers, setOpenUsers] = useState<number[]>([]); // 現在開いているユーザーIDのリスト

  useEffect(() => {
    // 各ユーザーにランダムなデッキ（武器）を割り当てる
    const usersWithRandomDecks: IDeck[] = users.map((user) => ({
      ...user,
      deck: getRandomGuns(mockGuns, 3), // ランダムに3つの武器を選択
    }));
    setDecks(usersWithRandomDecks);
  }, []);

  // 武器情報の表示/非表示を切り替える処理（クリックされた行の3人を開く）
  const handleDialogToggle = (index: number) => {
    const startIndex = Math.floor(index / 3) * 3; // クリックされた行の最初のインデックス
    const openRowUsers = [
      decks[startIndex]?.id,
      decks[startIndex + 1]?.id,
      decks[startIndex + 2]?.id,
    ];

    if (JSON.stringify(openUsers) === JSON.stringify(openRowUsers)) {
      setOpenUsers([]); // 同じ行がクリックされた場合は閉じる
    } else {
      setOpenUsers(openRowUsers); // その行の3人のIDを格納
    }
  };

  // ユーザー登録ボタンのクリック処理
  const handleUserRegister = async () => {
    // ユーザー登録処理を実装（ここでは簡単なアラートを表示）
    alert("ユーザー登録が完了しました！");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Battle Registration List
        </h1>

        {/* ユーザー登録ボタン */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleUserRegister}
            className={` text-[#1a0b2e] p-3 rounded-md font-bold  transition-colors ${
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
            <div key={user.id}>
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
                      {user.deck.length} cards
                    </p>
                  </div>
                </div>
              </div>

              {/* 武器表示 */}
              {openUsers.includes(user.id) && (
                <div className="bg-[#2a1b3d] border-[#b19cd9] text-white mt-4 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 p-4 overflow-y-auto max-h-96">
                    {user.deck.map((card) => (
                      <div
                        key={card.id}
                        className={`relative flex bg-[#2a1b3d] border-2 ${
                          rarityStyles[card.rarity as keyof typeof rarityStyles]
                        } rounded-lg p-4 shadow-lg transition-all hover:scale-105`}
                      >
                        {/* 左側に画像 */}
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-24 h-24 object-cover rounded-md mr-4"
                        />

                        {/* 右側にカード情報 */}
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

                          {/* 攻撃力と防御力 */}
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
