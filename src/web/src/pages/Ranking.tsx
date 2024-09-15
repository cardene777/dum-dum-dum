import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import mockGuns from "../../public/json/gun.json"; // gun.jsonをインポート
import { IGun } from "../types/type";
import users from "../../public/json/user.json";
import { IDeck } from "../types/type";

// ランダムなアイテムを選択する関数
const getRandomGuns = (guns: IGun[], count: number) => {
  const shuffled = guns.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


const UserRanking = () => {
  const [decks, setDecks] = useState<IDeck[]>(users as IDeck[]);
  const [openUser, setOpenUser] = useState<number | null>(null); // 現在開いているユーザーID

  useEffect(() => {
    // 各ユーザーにランダムなデッキ（武器）を割り当てる
    const usersWithRandomDecks: IDeck[] = (users as IDeck[]).map((user) => ({
      ...user,
      deck: getRandomGuns(mockGuns, 3), // ランダムに3つの武器を選択
    }));

    setDecks(usersWithRandomDecks);
  }, []);

  const toggleWeaponVisibility = (userId: number) => {
    // 現在開いているユーザーと同じなら閉じる、それ以外なら開く
    setOpenUser(openUser === userId ? null : userId);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Battle Result Ranking
        </h1>
        <div className="mx-auto">
          {decks.map((user, index) => (
            <div
              key={user.address}
              className="mb-8 bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-[#7fffd4] mr-4">
                  #{user.rank}
                </span>
                <div className="w-16 mr-4 rounded-full overflow-hidden bg-[#3a2b4d] flex items-center justify-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold text-[#7fffd4]">
                    {user.name}
                  </h2>
                  <p className="text-lg text-[#b19cd9]">スコア: {user.score}</p>
                </div>
                <div className="flex items-center">
                  {/* Weaponセクョンをクリックで開閉 */}
                  <h3
                    className="text-xl font-semibold text-[#7fffd4] cursor-pointer"
                    onClick={() => toggleWeaponVisibility(index)}
                  >
                    Weapon {openUser === index ? "▲" : "▼"}
                  </h3>
                </div>
              </div>
              {openUser === index && (
                <div className="grid grid-cols-3 gap-4">
                  {user.deck?.map((gun: IGun, index: number) => (
                    <div
                      key={index}
                      className="bg-[#3a2b4d] p-2 rounded-lg text-center"
                    >
                      <img
                        src={gun.image}
                        alt={gun.name}
                        className="w-full object-cover rounded-md mb-2"
                      />
                      <span className="text-sm">{gun.name}</span>
                      <p className="text-xs text-[#b19cd9]">
                        レア度: {gun.rarity}
                      </p>
                      <p className="text-xs text-[#b19cd9]">
                        レベル: {gun.level}
                      </p>
                      <p className="text-xs text-[#b19cd9]">
                        攻撃力: {gun.attack}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserRanking;
