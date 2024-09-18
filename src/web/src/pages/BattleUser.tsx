import React, { useState, useEffect } from "react"
import { Header } from "../components/Header"
import mockGuns from "../../public/json/gun.json"
import defaultDeck from "../../public/json/deck.json"
import { IDeck } from "../types/type"
import { useUser } from "../hooks/useUser"
import { getRandomGuns, rarityStyles } from "../lib/common"
import { getHolderAssetData } from "../lib/query-assets"
import { useApi, useActiveAddress } from "arweave-wallet-kit"
import { Asset, Collection, AO, Profile } from "aonote"
import { wait } from "aonote/test/utils"
import { opt } from "../lib/ao-utils"
import lf from "localforage"
import {
  indexBy,
  prop,
  reject,
  pathEq,
  assoc,
  intersection,
  pluck,
  toPairs,
  compose,
  map,
  addIndex,
  mergeLeft,
  mergeAll,
} from "ramda"

const BattleRegistrationList: React.FC = () => {
  const { connected } = useUser()
  const api = useApi()
  const address = useActiveAddress()
  const [gameID, setGameID] = useState(null)
  const [game, setGame] = useState(null)
  const [gunInfo, setGunInfo] = useState({})
  const [ranking, setRanking] = useState([])
  const [profiles, setProfiles] = useState([])
  const [assets, setAssets] = useState([])
  const [guns, setGuns] = useState([])
  const [players, setPlayers] = useState([])
  const [midnight, setMidnight] = useState(null)
  const [timeDiff, setTimeDiff] = useState(0)
  const [decks, setDecks] = useState<IDeck[]>([] as IDeck[]) // ユーザーのデッキを管理
  const [openUsers, setOpenUsers] = useState<string[]>([]) // 現在開いているユーザーIDのリスト
  const [remainingTime, setRemainingTime] = useState<string>("") // 残り時間を管理

  const getGame = async ({ id }) => {
    const ao = new AO(opt.ao)
    const { out: game } = await ao.dry({
      pid: import.meta.env.VITE_GAMES,
      act: "Get-Game",
      tags: { ID: Number(id).toString() },
      get: { name: "Game", json: true },
    })
    setGame(game)
    if (game) {
      const decks = compose(
        map(([key, val]) => {
          const deck = compose(
            map(([key2, val2]) => {
              return {
                id: key2,
                image: `${import.meta.env.VITE_GATEWAY}/${key2}`,
                rerity: "Common",
                attack: val2.attack,
                level: 1,
              }
            }),
            toPairs,
          )(val.guns)
          return {
            address: key,
            owner: val.owner,
            avatar: `${import.meta.env.VITE_GATEWAY}/${key}`,
            name: key.slice(0, 5),
            score: 300,
            rank: 1,
            deck,
          }
        }),
        reject(pathEq([1, "pending"], true)),
        toPairs,
      )(game.players)
      setPlayers(decks)

      let _profiles = (await lf.getItem("profiles")) ?? {}
      let profile_ids = []
      let profs = []
      for (const k in game.players) {
        const v = game.players[k]
        if (!v.pending && !profiles[v.owner] && !_profiles[v.owner])
          profile_ids.push(v.owner)
      }
      if (profile_ids.length > 0) {
        const prof = new Profile(opt.profile)
        profs = await prof.profiles({ ids: profile_ids })
      }
      let __profiles = mergeAll([
        indexBy(prop("ProfileId"))(profs),
        profiles,
        _profiles,
      ])
      await lf.setItem("profiles", __profiles)
      setProfiles(__profiles)
      let _guns = (await lf.getItem("guns")) ?? {}
      for (const k in game.guns) {
        if (!gunInfo[k] && !_guns[k]) {
          const gun = new Asset({ ...opt.asset, pid: k })
          _guns[k] = await gun.info()
          await lf.setItem("guns", _guns)
        }
      }
      setGunInfo(mergeLeft(_guns, gunInfo))
    }
  }

  useEffect(() => {
    ;(async () => {
      if (players.length > 0) {
        const scores = compose(
          indexBy(prop("id")),
          addIndex(map)((v, i) => assoc("rank", i + 1, v)),
        )(ranking)
        const _decks = map(v => {
          v.name = profiles[v.owner]?.DisplayName ?? v.name
          v.score = scores[v.address]?.score ?? 0
          v.rank = scores[v.address]?.rank ?? null
          for (const v2 of v.deck || []) {
            if (gunInfo[v2.id]) {
              v2.level = gunInfo[v2.id].Level
              v2.rarity = gunInfo[v2.id].Rarity
              v2.name = gunInfo[v2.id].Name
            }
          }
          return v
        })(players)
        setDecks(_decks)
      }
    })()
  }, [players, ranking, profiles, guns])

  const getGameID = async () => {
    const ao = new AO(opt.ao)
    let { res, out } = await ao.dry({
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
    })
    const now = Date.now()
    const id = Math.ceil((now - +out.origin) / +out.span)
    const _midnight = +out.origin + +out.span * id
    setMidnight(_midnight)
    setGameID(id)
    getGame({ id })
  }

  useEffect(() => {
    ;(async () => {
      await getGameID()
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const ao = new AO(opt.ao)
      const { err, out, res } = await ao.dry({
        pid: import.meta.env.VITE_GAMES,
        act: "Get-Ranking",
        get: { data: true, json: true },
      })
      if (!err) setRanking(out)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const dumdum = new Collection({
        ...opt.collection,
        pid: import.meta.env.VITE_DUMDUMS,
      })
      setAssets((await dumdum.info()).Assets)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const guns = new Collection({
        ...opt.collection,
        pid: import.meta.env.VITE_GUNS,
      })
      setGuns((await guns.info()).Assets)
    })()
  }, [])

  // 時刻のフォーマット
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // タイマーの設定
  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!midnight) return formatTime(0, 0, 0)
      const now = new Date()
      //const midnight = new Date()
      //midnight.setHours(23, 59, 59, 999) // 23:59:59.999

      // 差分を計算して秒、分、時に変換
      //const difference = midnight.getTime() - now.getTime()
      let difference = midnight - now.getTime()
      if (difference < 0) difference = 0
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)
      const seconds = Math.floor((difference / 1000) % 60)
      if (difference <= 0) getGameID()
      return formatTime(hours, minutes, seconds)
    }

    const timer = setInterval(() => {
      const timeLeft = calculateRemainingTime()
      setRemainingTime(timeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [midnight])

  // 武器情報の表示/非表示を切り替える処理（クリックされた行の3人を開く）
  const handleDialogToggle = (index: number) => {
    const startIndex = Math.floor(index / 3) * 3 // クリックされた行の最初のインデックス
    const openRowUsers = [
      decks[startIndex]?.address,
      decks[startIndex + 1]?.address,
      decks[startIndex + 2]?.address,
    ]

    if (JSON.stringify(openUsers) === JSON.stringify(openRowUsers)) {
      setOpenUsers([]) // 同じ行がクリックされた場合は閉じる
    } else {
      setOpenUsers(openRowUsers) // その行の3人のIDを格納
    }
  }

  // ユーザー登録ボタンのクリック処理
  const handleUserRegister = async () => {
    const prof = await new Profile(opt.profile).init(api)
    const ids = await prof.ids({ addr: address })
    const info = await prof.info({ id: ids[0] })
    const my_assets = pluck("Id", info?.Assets ?? [])
    const my_dumdum = intersection(my_assets, assets)[0] ?? null
    if (!my_dumdum) {
      alert("You don't own any Dumdum!")
    } else if (game?.players?.[my_dumdum]) {
      alert("Already registered!")
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
      })
      if (err) {
        console.log(err)
        alert("something went wrong!")
      } else {
        alert(`registered to #${gameID}!`)
        await wait(5000)
        await getGame({ id: gameID })
        await wait(5000)
        await getGame({ id: gameID })
      }
    }
  }
  /*
    const _handleUserRegister = async () => {
    if (!connected) return

    try {
    const assets = await getHolderAssetData(address as string)
    const matchedGuns = assets
    .map((asset: { title: string; id: any }) => {
    const mockGun = mockGuns.find(gun => gun.name === asset.title)
    return mockGun ? { ...mockGun, id: asset.id } : null
    })
    .filter((gun: any) => gun !== null) // 保有している武器を取得

    // デフォルト武器のデータ
    const defaultWeapon = {
    id: 86,
    name: "Default Handgun",
    description: "Default Handgun is a basic weapon that deals 10 damage.",
    rarity: "Common",
    level: 1,
    attack: 10,
    image: "./img/gun/default-handgun.png",
    }

    // 保有している武器が3枚未満の場合はデフォルト武器を追加
    const finalDeck = [...matchedGuns]
    while (finalDeck.length < 3) {
    finalDeck.push({ ...defaultWeapon, id: 86 }) // デフォルト武器を追加
    }

    // ランダムに3枚選択（デフォルト武器も含める）
    const selectedGuns = getRandomGuns([...finalDeck, defaultWeapon], 3)

    if (address) {
    const user: IDeck = {
    deck: selectedGuns,
    address: address,
    name: "New User", // 例: 新規ユーザーの名前
    avatar: "/default-avatar.png", // 例: デフォルトのアバター画像
    }
    setDecks([...decks, user])
    alert("ユーザー登録が完了しました！")
    } else {
    alert("ウォレットアドレスが見つかりません。")
    }
    } catch (error) {
    console.error("Failed to fetch assets or register user:", error)
    }
    }
  */
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Battle #{gameID} Registration List
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
                    {user.deck?.map(card => (
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
  )
}

export default BattleRegistrationList
