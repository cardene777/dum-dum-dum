import { setup, ok, fail } from "aonote/test/helpers.js"
import { expect } from "chai"
import { AR, AO, Profile, Asset, Collection } from "aonote/test/index.js"
import { wait } from "aonote/test/utils.js"
import { resolve } from "path"
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs"
import { range, indexBy, prop } from "ramda"

const cacheDir = resolve(import.meta.dirname, ".cache")
const optPath = `${cacheDir}/opt.json`
const usersPath = `${cacheDir}/users.json`
const dumdumPath = `${cacheDir}/dumdum.json`
const gunsPath = `${cacheDir}/guns.json`

const luaDir = resolve(import.meta.dirname, "../lua")
const gamePath = `${luaDir}/games.lua`
const gunPath = `${luaDir}/gun.lua`
const imageDir = resolve(import.meta.dirname, "../../web/public")

const thumbnail_data = readFileSync(`${imageDir}/img/nft/collection/pack.png`)
const banner_data = readFileSync(`${imageDir}/img/nft/collection/banner.png`)

const genUDL = recipient => {
  return {
    payment: { mode: "single", recipient },
    access: { mode: "none" },
    derivations: {
      mode: "allowed",
      term: "one-time",
      fee: "0",
    },
    commercial: {
      mode: "allowed",
      term: "revenue",
      fee: "5",
    },
    training: { mode: "disallowed" },
  }
}

describe("Atomic Notes", function () {
  this.timeout(0)
  console.error = () => {}
  console.warn = () => {}
  let opt, users, dumdums, guns, usermap

  before(async () => {
    // set up environment
    if (!existsSync(cacheDir)) mkdirSync(cacheDir)

    if (existsSync(optPath)) {
      opt = JSON.parse(readFileSync(optPath, "utf8"))
    } else {
      ;({ opt } = await setup({}))
      writeFileSync(optPath, JSON.stringify(opt))
    }

    // generate user wallets and create AO profiles
    let _users = JSON.parse(
      readFileSync(resolve(import.meta.dirname, "../data/user.json"), "utf8"),
    )
    _users = [{ name: "DumDum Owner" }, { name: "Weapon Owner" }].concat(_users)
    if (existsSync(usersPath)) {
      users = JSON.parse(readFileSync(usersPath, "utf8"))
    } else {
      users = []
      for (const v of _users) {
        const profile = new Profile(opt.profile)
        await profile.ar.gen("100")
        const user_profile = {
          DisplayName: v.name,
          UserName: v.name,
          Description: v.name,
        }
        const { pid } = ok(
          await profile.createProfile({ profile: user_profile }),
        )
        users.push({
          name: v.name,
          addr: profile.ar.addr,
          jwk: profile.ar.jwk,
          profileId: pid,
        })
      }
      writeFileSync(usersPath, JSON.stringify(users))
    }

    // create collections
    let dumdum_collection, guns_collection
    if (existsSync(dumdumPath)) {
      dumdums = JSON.parse(readFileSync(dumdumPath, "utf8"))
      dumdum_collection = await new Collection({
        ...opt.collection,
        pid: dumdums.pid,
      }).init(users[0].jwk)
    } else {
      dumdum_collection = await new Collection(opt.collection).init(
        users[0].jwk,
      )
      const { pid: dumdum_pid } = ok(
        await dumdum_collection.create({
          info: {
            title: "Dum dum",
            description: "dum dum",
            thumbnail_data,
            thumbnail_type: "image/png",
            banner_data,
            banner_type: "image/png",
          },
        }),
      )
      console.log("dumdums: " + dumdum_pid)
      dumdums = { pid: dumdum_pid }
      writeFileSync(dumdumPath, JSON.stringify(dumdums))
    }

    if (existsSync(gunsPath)) {
      guns = JSON.parse(readFileSync(gunsPath, "utf8"))
      guns_collection = await new Collection({
        ...opt.collection,
        pid: guns.pid,
      }).init(users[1].jwk)
    } else {
      guns_collection = await new Collection(opt.collection).init(users[1].jwk)
      const { pid: guns_pid } = ok(
        await guns_collection.create({
          info: {
            title: "Guns",
            description: "guns",
            thumbnail_data,
            thumbnail_type: "image/png",
            banner_data,
            banner_type: "image/png",
          },
        }),
      )
      console.log("guns: ", guns_pid)
      guns = { pid: guns_pid }
      writeFileSync(gunsPath, JSON.stringify(guns))
    }

    // create dumdums
    if (!dumdums.assets) {
      for (const v of range(0, 5)) {
        const data = readFileSync(`${imageDir}${_users[v].avatar}`)
        const asset = await new Asset(opt.asset).init(users[0].jwk)
        const { pid } = ok(
          await asset.create({
            data,
            content_type: "image/png",
            info: {
              title: `dumdum-${v + 1}`,
              description: "dumdum",
            },
            token: { fraction: "100" },
            udl: genUDL(users[0].addr),
          }),
        )
        ok(await dumdum_collection.addAsset(pid))
        ok(
          await asset.transfer({
            recipient: users[v + 2].profileId,
            quantity: "100",
            profile: true,
          }),
        )
        console.log(pid)
        dumdums.assets ??= []
        dumdums.assets.push({ pid, profile: users[v + 2].profileId })
      }
      writeFileSync(dumdumPath, JSON.stringify(dumdums))
    }

    // create guns
    if (!guns.assets) {
      const _guns = JSON.parse(
        readFileSync(resolve(import.meta.dirname, "../data/guns.json"), "utf8"),
      )
      const ao = await new AO(opt.ao).init(users[1].jwk)
      const lua_gun = readFileSync(gunPath)
      const { id: gun_src } = await ao.ar.post({ data: lua_gun })

      let i = 0
      for (const v of _guns) {
        const data = readFileSync(`${imageDir}${v.image}`)
        const asset = await new Asset({
          ...opt.asset,
          asset_src: gun_src,
        }).init(users[1].jwk)
        const { pid } = ok(
          await asset.create({
            data,
            fills: {
              Rarity: v.rarity,
              Level: Number(v.level).toString(),
              Attack: Number(v.attack).toString(),
            },
            tags: {
              Rarity: v.rarity,
              Level: Number(v.level).toString(),
              Attack: Number(v.attack).toString(),
            },
            data: v.name,
            content_type: "image/png",
            info: {
              title: v.name,
              description: v.description,
            },
            token: { fraction: "1" },
            udl: genUDL(users[0].addr),
          }),
        )
        ok(await guns_collection.addAsset(pid))
        const recipient = users[(i % (users.length - 2)) + 2].profileId
        ok(
          await asset.transfer({
            recipient,
            quantity: "100",
            profile: true,
          }),
        )
        guns.assets ??= []
        guns.assets.push({ pid, profileId: recipient })
        i++
      }
      writeFileSync(gunsPath, JSON.stringify(guns))
    }
    usermap = indexBy(prop("profileId"), users)
  })

  let ao, pid, gid
  it("should deploy the game process", async () => {
    ao = await new AO(opt.ao).init(users[1].jwk)
    const lua_game = readFileSync(gamePath)
    const { id: game_src } = await ao.ar.post({ data: lua_game })
    ;({ pid } = await ao.deploy({
      src: game_src,
      fills: { DUMDUM: dumdums.pid, GUN: guns.pid },
    }))
    ok(
      await ao.msg({
        pid,
        act: "Set-Origin",
        tags: {
          Origin: Number(Date.now()).toString(),
          Span: Number(15000).toString(),
        },
        checkData: "origin set!",
      }),
    )
    await wait(2000)
  })

  it("should equip guns to dumdums", async () => {
    const dumdummap = indexBy(prop("profile"), dumdums.assets)
    for (const v of guns.assets) {
      const user = usermap[v.profileId]
      const ao2 = await new AO(opt.ao).init(user.jwk)
      if (!dumdummap[user.profileId]) continue
      console.log(`Equip: ${pid} => ${dumdummap[user.profileId].pid}`)
      ok(
        await ao2.msg({
          pid: user.profileId,
          act: "Run-Action",
          data: JSON.stringify({
            Target: pid,
            Action: "Equip",
            Input: JSON.stringify({
              "Asset-ID": dumdummap[user.profileId].pid,
              "Gun-ID": v.pid,
            }),
          }),
          get: "Action",
        }),
      )
    }
    await wait(2000)
  })

  it("should register players", async () => {
    gid = ok(await ao.dry({ pid, act: "GameID", get: "ID" })).out
    for (const v of dumdums.assets) {
      const user = usermap[v.profile]
      const ao2 = await new AO(opt.ao).init(user.jwk)
      console.log("Register:", v.pid)
      ok(
        await ao2.msg({
          pid: user.profileId,
          act: "Run-Action",
          data: JSON.stringify({
            Target: pid,
            Action: "Register",
            Input: JSON.stringify({ "Asset-ID": v.pid }),
          }),
          get: "Action",
        }),
      )
    }
    await wait(3000)
    expect(
      ok(
        await ao.dry({
          pid,
          act: "Get-Game",
          tags: { ID: gid },
          get: { name: "Game", json: true },
        }),
      ).out.executed,
    ).to.eql(false)
    await wait(5000)
  })

  it("should execute the game", async () => {
    ok(
      await ao.msg({
        pid,
        act: "Execute",
        tags: { ID: gid },
        checkData: "executed!",
      }),
    )
    await wait(2000)
    const game = ok(
      await ao.dry({
        pid,
        act: "Get-Game",
        tags: { ID: gid },
        get: { name: "Game", json: true },
      }),
    ).out

    expect(game.executed).to.eql(true)
  })

  it("should get the ranking", async () => {
    const rank = ok(
      await ao.dry({
        pid,
        act: "Get-Ranking",
        tags: { ID: gid },
        get: { data: true, json: true },
      }),
    ).out
    expect(rank[0].score).to.eql(9)
  })
})
