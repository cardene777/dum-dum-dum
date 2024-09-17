import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { IDeck } from "../types/type";
import { useUser } from "../hooks/useUser";
import { rarityStyles } from "../lib/common";
import { useApi, useActiveAddress } from "arweave-wallet-kit";
import { Asset, Collection, AO, Profile } from "aonote";
// import { wait } from "aonote/test/utils";
import { opt } from "../lib/ao-utils";
import lf from "localforage";
import {
  indexBy,
  prop,
  reject,
  assoc,
  intersection,
  pluck,
  toPairs,
  compose,
  map,
  addIndex,
  mergeLeft,
  mergeAll,
} from "ramda";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const BattleRegistrationList: React.FC = () => {
  const { connected } = useUser();
  const api = useApi();
  const address = useActiveAddress();

  const [gameID, setGameID] = useState<number | null>(null);
  const [game, setGame] = useState<{
    players?: { [key: string]: any };
    guns?: { [key: string]: any };
  } | null>(null);
  const [gunInfo, setGunInfo] = useState<{ [key: string]: any }>({});
  const [ranking, setRanking] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<{ [key: string]: any }>({});
  const [assets, setAssets] = useState<any[]>([]);
  const [guns, setGuns] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [midnight, setMidnight] = useState<number | null>(null);
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [openUsers, setOpenUsers] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>("");

  const getGame = useCallback(async (id: number) => {
    const ao = new AO(opt.ao);
    const { out: game } = await ao.dry({
      pid: import.meta.env.VITE_GAMES,
      act: "Get-Game",
      tags: { ID: id.toString() },
      get: { name: "Game", json: true },
      jwk: {},
      data: {},
    });
    setGame(game);

    if (game) {
      const decks = compose(
        map(([key, val]) => {
          const deck = compose(
            map(([key2, val2]) => ({
              id: key2,
              image: `${import.meta.env.VITE_GATEWAY}/${key2}`,
              rerity: "Common",
              attack: val2.attack,
              level: 1,
            })),
            toPairs
          )(val.guns);
          return {
            address: key,
            owner: val.owner,
            avatar: `${import.meta.env.VITE_GATEWAY}/${key}`,
            name: key.slice(0, 5),
            score: 300,
            rank: 1,
            deck,
          };
        }),
        // eslint-disable-next-line no-unused-vars
        reject(([_, val]) => val.pending === true),
        toPairs
      )(game.players);
      setPlayers(decks);

      const _profiles =
        (await lf.getItem<{ [key: string]: any }>("profiles")) ?? {};
      const profile_ids: string[] = [];
      let profs = [];

      for (const k in game.players) {
        const v = game.players[k];
        if (!v.pending && !profiles[v.owner] && !_profiles[v.owner])
          profile_ids.push(v.owner);
      }

      if (profile_ids.length > 0) {
        const prof = new Profile(opt.profile);
        profs = await prof.profiles({ ids: profile_ids });
      }

      const __profiles = mergeAll([
        indexBy(prop("ProfileId") as any)(profs),
        profiles,
        _profiles,
      ]);
      await lf.setItem("profiles", __profiles);
      setProfiles(__profiles);

      const _guns: { [key: string]: any } = (await lf.getItem("guns")) ?? {};

      for (const k in game.guns) {
        if (!gunInfo[k] && !_guns[k]) {
          const gun = new Asset({ ...opt.asset, pid: k });
          _guns[k] = await gun.info();
          await lf.setItem("guns", _guns);
        }
      }
      setGunInfo(mergeLeft(_guns, gunInfo));
      }
    },
    [gunInfo, profiles]
  );

  useEffect(() => {
    (async () => {
      if (players.length > 0) {
        const scores = compose(
          indexBy(prop("id") as any),
          // @ts-expect-error: ignore
          addIndex(map)((v, i) => assoc("rank", i + 1, v))
        )(ranking) as any;

        const _decks = map((v: any) => {
          v.name = profiles[v.owner]?.DisplayName ?? v.name;
          v.score = scores[v.address]?.score ?? 0;
          v.rank = scores[v.address]?.rank ?? null;
          for (const v2 of v.deck || []) {
            if (gunInfo[v2.id]) {
              v2.level = gunInfo[v2.id].Level;
              v2.rarity = gunInfo[v2.id].Rarity;
              v2.name = gunInfo[v2.id].Name;
            }
          }
          return v;
        })(players);
        setDecks(_decks as IDeck[]);
      }
    })();
  }, [players, ranking, profiles, guns, gunInfo]);

  const getGameID = useCallback(async () => {
    const ao = new AO(opt.ao);
    const { out } = await ao.dry({
      pid: import.meta.env.VITE_GAMES,
      act: "GameID",
      get: {
        obj: {
          id: "ID",
          span: "Span",
          timestamp: "Timestamp",
          origin: "Origin",
        },
      },
      jwk: {},
      data: {},
    });
    const now = Date.now();
    const id = Math.ceil((now - +out.origin) / +out.span);
    const _midnight = +out.origin + +out.span * id;
    setMidnight(_midnight);
    setGameID(id);
    getGame(id);
  }, [getGame]);

  useEffect(() => {
    (async () => {
      await getGameID();
    })();
  }, [getGameID]);

  useEffect(() => {
    const getRanking = async () => {
      const ao = new AO(opt.ao);
      const { err, out } = await ao.dry({
        pid: import.meta.env.VITE_GAMES,
        act: "Get-Ranking",
        get: { data: true, json: true },
        jwk: {},
        data: {},
      });
      if (!err) setRanking(out);
    };
    getRanking();
  }, []);

  useEffect(() => {
    const getAssets = async () => {
      const dumdum = new Collection({
        ...opt.collection,
        pid: import.meta.env.VITE_DUMDUMS,
      });
      setAssets((await dumdum.info()).Assets);
    };
    getAssets();
  }, []);

  useEffect(() => {
    const getGuns = async () => {
      const guns = new Collection({
        ...opt.collection,
        pid: import.meta.env.VITE_GUNS,
      });
      setGuns((await guns.info()).Assets);
    };
    getGuns();
  }, []);

  // 時刻のフォーマット
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // タイマーの設定
  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!midnight) return formatTime(0, 0, 0);
      const now = new Date();
      let difference = midnight - now.getTime();
      if (difference < 0) difference = 0;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      if (difference <= 0) getGameID();
      return formatTime(hours, minutes, seconds);
    };

    const timer = setInterval(() => {
      const timeLeft = calculateRemainingTime();
      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [getGameID, midnight]);

  // 武器情報の表示/非表示を切り替える処理
  const handleDialogToggle = (index: number) => {
    const startIndex = Math.floor(index / 3) * 3;
    const openRowUsers = [
      decks[startIndex]?.address,
      decks[startIndex + 1]?.address,
      decks[startIndex + 2]?.address,
    ];

    if (JSON.stringify(openUsers) === JSON.stringify(openRowUsers)) {
      setOpenUsers([]);
    } else {
      setOpenUsers(openRowUsers);
    }
  };

  // ユーザー登録ボタンのクリック処理
  const handleUserRegister = async () => {
    const prof = await new Profile(opt.profile).init(api);
    const ids = await prof.ids({ addr: address });
    const info = await prof.info({ id: ids[0] });
    const my_assets = pluck("Id", info?.Assets ?? []);
    const my_dumdum = intersection(my_assets, assets)[0] ?? null;

    if (!my_dumdum) {
      alert("You don't own any Dumdum!");
    } else if (game?.players?.[my_dumdum]) {
      alert("Already registered!");
    } else {
      const { err } = await prof.ao.msg({
        pid: ids[0],
        act: "Run-Action",
        data: JSON.stringify({
          Target: import.meta.env.VITE_GAMES,
          Action: "Register",
          Input: JSON.stringify({ "Asset-ID": my_dumdum }),
        }),
        get: "Action",
        jwk: {},
      });
      if (err) {
        console.log(err);
        alert("something went wrong!");
      } else {
        alert(`registered to #${gameID}!`);
        await wait(5000);
        await getGame(gameID!);
        await wait(5000);
        await getGame(gameID!);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Battle #{gameID} Registration List
        </h1>

        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-[#7fffd4]">
            Time Remaining: {remainingTime}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleUserRegister}
            className={`text-[#1a0b2e] p-3 rounded-md font-bold transition-colors ${
              connected
                ? "cursor-pointer bg-[#7fffd4] hover:bg-[#5ec8b1]"
                : "cursor-not-allowed bg-gray-400"
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
                            {card.rarity}・Lv.{card.level}
                          </p>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[#7fffd4]">Attack</p>
                              <span className="text-lg font-bold text-white">
                                {card.attack}
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[#7fffd4]">Defense</p>
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
