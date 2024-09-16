import { useState, useEffect, useCallback } from "react"
import { Header } from "../components/Header"
import mockGuns from "../../public/json/gun.json"
import mockArmor from "../../public/json/armor.json"
import { getHolderAssetData } from "../lib/query-assets"
import { useApi, useActiveAddress } from "arweave-wallet-kit"
import { AO, Asset, Collection, Profile } from "aonote"
import { opt } from "../lib/ao-utils"
import { intersection, pluck, mergeLeft, indexBy, prop } from "ramda"

import lf from "localforage"
const UserCardCollection = () => {
  const address = useActiveAddress()
  const api = useApi()
  const [assets, setAssets] = useState([])
  const [gunIDs, setGunIDs] = useState([])
  const [profile, setProfile] = useState(null)
  const [myAssets, setMyAssets] = useState([])
  const [myGuns, setMyGuns] = useState([])
  const [allGuns, setAllGuns] = useState([])
  const [gunInfo, setGunInfo] = useState({})
  const [ranking, setRanking] = useState([])
  const [guns, setGuns] = useState([])
  const [filterRarity, setFilterRarity] = useState("")
  const [filterLevel, setFilterLevel] = useState("")
  const [sortBy, setSortBy] = useState<"rarity" | "level" | "">("")
  const [selectedArmor, setSelectedArmor] = useState(mockArmor[0]) // デフォルトでID1の防具を選択
  useEffect(() => {
    ;(async () => {
      const dumdum = new Collection({ ...opt.collection, pid: opt.dumdums })
      setAssets((await dumdum.info()).Assets)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (address) {
        const prof = new Profile(opt.profile)
        const ids = await prof.ids({ addr: address })
        const info = await prof.info({ id: ids[0] })
        setProfile(info)
        const my_assets = pluck("Id", info?.Assets ?? [])
        setMyAssets(my_assets)
      } else {
        setMyAssets([])
      }
    })()
  }, [address])

  useEffect(() => {
    ;(async () => {
      const guns = new Collection({ ...opt.collection, pid: opt.guns })
      setGunIDs((await guns.info()).Assets)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const my_guns = intersection(myAssets, gunIDs)
      setMyGuns(my_guns)
      let _guns = (await lf.getItem("guns")) ?? {}
      for (const k of my_guns) {
        if (!gunInfo[k] && !_guns[k]) {
          const gun = new Asset({ ...opt.asset, pid: k })
          _guns[k] = await gun.info()
          await lf.setItem("guns", _guns)
        }
      }
      setGunInfo(mergeLeft(_guns, gunInfo))
    })()
  }, [gunIDs, myAssets])

  useEffect(() => {
    ;(async () => {
      let _guns = []
      for (const k of myGuns) {
        const v = gunInfo[k]
        if (v) {
          _guns.push({
            name: v.Name,
            image: `http://localhost:4000/${k}`,
            level: v.Level,
            rarity: v.Rarity,
            id: k,
          })
        }
      }
      setAllGuns(_guns)
    })()
  }, [myGuns, gunInfo])

  useEffect(() => {
    ;(async () => {
      const ao = new AO(opt.ao)
      const { err, out, res } = await ao.dry({
        pid: opt.games,
        act: "Get-Ranking",
        get: { data: true, json: true },
      })
      if (!err) setRanking(out)
    })()
  }, [])
  // フィルター処理
  const filterCards = useCallback(() => {
    let filteredCards = [...allGuns] // mockGunsをベースにフィルターを適用

    // レア度フィルター
    if (filterRarity && filterRarity !== "all") {
      filteredCards = filteredCards.filter(card => card.rarity === filterRarity)
    }

    // レベルフィルター
    if (filterLevel && filterLevel !== "all") {
      filteredCards = filteredCards.filter(
        card => card.level === parseInt(filterLevel),
      )
    }

    return filteredCards
  }, [filterRarity, filterLevel, allGuns]) // 依存配列にフィルター状態を追加

  // ソート処理
  const sortCards = useCallback(
    (cards: typeof mockGuns) => {
      const sortedCards = [...cards]

      if (sortBy === "rarity") {
        // レア度でソート
        sortedCards.sort((a, b) => {
          const rarityOrder: { [key: string]: number } = {
            Legendary: 3,
            Epic: 2,
            Rare: 1,
            Common: 0,
          }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        })
      } else if (sortBy === "level") {
        // レベルでソート
        sortedCards.sort((a, b) => b.level - a.level)
      }

      return sortedCards
    },
    [sortBy],
  ) // sortByを依存配列に追加

  // フィルターとソートが変更されたら自動的にリストを更新
  useEffect(() => {
    const filteredCards = filterCards()
    const sortedAndFilteredCards = sortCards(filteredCards)
    setGuns(sortedAndFilteredCards)
  }, [filterCards, sortBy, sortCards]) // sortByを依存配列に追加

  // 防具変更処理
  const handleArmorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArmorId = parseInt(e.target.value)
    const selectedArmorItem = mockArmor.find(
      item => item.id === selectedArmorId,
    )
    if (selectedArmorItem) {
      setSelectedArmor(selectedArmorItem)
    }
  }

  useEffect(() => {
    if (address) {
      const fetchAssets = async () => {
        try {
          const assets = await getHolderAssetData(address)
          console.log(`assets: ${JSON.stringify(assets)}`)
          const matchedGuns = assets
            .map((asset: { title: string; id: any }) => {
              const mockGun = mockGuns.find(gun => gun.name === asset.title)
              return mockGun ? { ...mockGun, id: asset.id } : null
            })
            .filter((gun: null) => gun !== null) // Filter out any unmatched assets

          setGuns(matchedGuns)
          // setGuns(assets);
        } catch (error) {
          console.error("Failed to fetch assets:", error)
        }
      }
      fetchAssets()
    }
  }, [address])

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-[#1a0b2e] to-[#eee5fb] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Card Collection
        </h1>

        {/* フィルタリングとソートのためのUI */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex space-x-4">
            {/* ソートのためのドロップダウン */}
            <select
              onChange={e => setSortBy(e.target.value as "rarity" | "level")}
              className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
            >
              <option value="">Sort</option>
              <option value="rarity">Rarity</option>
              <option value="level">Level</option>
            </select>

            {/* レア度フィルターのドロップダウン */}
            <select
              onChange={e => setFilterRarity(e.target.value)}
              className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
            >
              <option value="all">All</option>
              <option value="Legendary">Legendary</option>
              <option value="Epic">Epic</option>
              <option value="Rare">Rare</option>
              <option value="Common">Common</option>
            </select>

            {/* レベルフィルターのドロップダウン */}
            <select
              onChange={e => setFilterLevel(e.target.value)}
              className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
            >
              <option value="all">Level</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            {/* 防具を選択するドロップダウン */}
            <select
              onChange={handleArmorChange}
              className="w-[180px] bg-[#1a0b2e] border border-[#b19cd9] text-white rounded p-2"
            >
              {mockArmor.map(armorItem => (
                <option key={armorItem.id} value={armorItem.id}>
                  {armorItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guns.map(card => (
            <div
              onClick={async () => {
                const prof = await new Profile(opt.profile).init(api)
                const ids = await prof.ids({ addr: address })
                const info = await prof.info({ id: ids[0] })
                const my_assets = pluck("Id", info?.Assets ?? [])
                const my_dumdum = intersection(my_assets, assets)[0] ?? null
                const guns = indexBy(prop("id"))(ranking)
                if (guns[my_dumdum]?.guns[card.id]) {
                  alert("already equipped")
                } else {
                  const { err } = await prof.ao.msg({
                    pid: ids[0],
                    act: "Run-Action",
                    data: JSON.stringify({
                      Target: opt.games,
                      Action: "Equip",
                      Input: JSON.stringify({
                        "Asset-ID": my_dumdum,
                        "Gun-ID": card.id,
                      }),
                    }),
                    get: "Action",
                  })
                  if (err) {
                    alert("something went wrong")
                  } else {
                    alert("equipped!")
                  }
                }
              }}
              key={card.id}
              className="relative bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-4"
              style={{ cursor: "pointer" }}
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
                <span className="text-sm text-[#1a0b2e] font-bold">
                  Lv.{card.level}
                </span>
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
                    <span className="text-lg font-bold">
                      {selectedArmor.defense}
                    </span>
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
  )
}

export default UserCardCollection
