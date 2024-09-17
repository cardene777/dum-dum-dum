import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import mockGuns from "../../public/json/gun.json"; // gun.jsonをインポート
import { IGun } from "../types/type";
import users from "../../public/json/user.json";
import { IDeck } from "../types/type";
import { Asset, Collection, AO, Profile } from "aonote";
import { opt } from "../lib/ao-utils";
import { mergeLeft, map, addIndex, compose } from "ramda";
import lf from "localforage";

// ランダムなアイテムを選択する関数
const getRandomGuns = (guns: IGun[], count: number) => {
  const shuffled = guns.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const UserRanking = () => {
  const [decks, setDecks] = useState<IDeck[]>([] as IDeck[]);
  const [openUser, setOpenUser] = useState<number | null>(null); // 現在開いているユーザーID

  const [ranking, setRanking] = useState([]);
  const [gunInfo, setGunInfo] = useState({});

  useEffect(() => {
    (async () => {
      const ao = new AO(opt.ao);
      const { err, out, res } = await ao.dry({
        pid: import.meta.env.VITE_GAMES,
        act: "Get-Ranking",
        get: { data: true, json: true },
      });
      if (!err) setRanking(out);
      let gunIds = [];
      for (const v of ranking) {
        for (const k in v.guns) gunIds.push(k);
      }
      let _guns = (await lf.getItem("guns")) ?? {};
      for (const k of gunIds) {
        if (!gunInfo[k] && !_guns[k]) {
          const gun = new Asset({ ...opt.asset, pid: k });
          _guns[k] = await gun.info();
          await lf.setItem("guns", _guns);
        }
      }
      setGunInfo(mergeLeft(_guns, gunInfo));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (ranking.length > 0) {
        const _decks = addIndex(map)((v, i) => {
          const deck = [];
          for (const k in v.guns) {
            const gun = v.guns[k];
            const _gun = gunInfo[k];
            deck.push({
              name: _gun?.Name ?? k.slice(0, 5),
              level: _gun?.Level ?? 1,
              rarity: _gun?.Rarity ?? "Common",
              attack: gun.attack,
              image: `${import.meta.env.VITE_GATEWAY}/${k}`,
            });
          }
          return {
            name: `DumDum ${v.id.slice(0, 5)}`,
            avatar: `${import.meta.env.VITE_GATEWAY}/${v.id}`,
            address: v.id,
            score: v.score,
            deck,
            rank: i + 1,
          };
        })(ranking);
        setDecks(_decks);
      }
    })();
  }, [ranking, gunInfo]);

  /*
  useEffect(() => {
    // 各ユーザーにランダムなデッキ（武器）を割り当てる
    const usersWithRandomDecks: IDeck[] = (users as IDeck[]).map(user => ({
      ...user,
      deck: getRandomGuns(mockGuns, 3), // ランダムに3つの武器を選択
    }))

    setDecks(usersWithRandomDecks)
  }, [])
  */
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
                  <p className="text-lg text-[#b19cd9]">Score: {user.score}</p>
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
                        Level: {gun.level}
                      </p>
                      <p className="text-xs text-[#b19cd9]">
                        Attack: {gun.attack}
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
