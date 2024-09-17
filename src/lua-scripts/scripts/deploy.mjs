import { Profile, Asset, AO, Collection } from "aonote"
import { writeFileSync, readFileSync } from "fs"
import { resolve } from "path"

const dum = "CoqeBSfYjsYPrVDZUxlpS5n39UAlkrz6jRCNJWpiINA"
const gun = "XrxQde5ccu_X7dxP9NwmhI8PQkSQs8EWpltkOcPhWQE"
const game = "89HBqWgMIm0lj8z9-i5BX9g4K4cYo2VvkVFkf-oLIbs"
const cron = "1iCrFZtYy80X82D_35N9NxE7el07ezQFjR8H0D-Gfj8"

const jwk = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "keyfile.json"), "utf8"),
)

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

const createCollectionDum = async () => {
  const thumbnail_data = readFileSync(
    resolve(import.meta.dirname, "thumbnail.png"),
  )
  const banner_data = readFileSync(resolve(import.meta.dirname, "banner.png"))
  const dumdum_collection = await new Collection({}).init(jwk)
  const { pid: dumdum_pid } = await dumdum_collection.create({
    info: {
      title: "Dum Dum Dum",
      description: "dum dum dum",
      thumbnail_data,
      thumbnail_type: "image/png",
      banner_data,
      banner_type: "image/png",
    },
  })
  console.log("dumdums: " + dumdum_pid)
}

const dumNames = [
  "Phantom Trunk",
  "Dreadumbo",
  "Grimphant",
  "Spectrephant",
  "Boo-elephant",
  "Shadophant",
  "Nightmare Trunks",
  "Ghoulphant",
  "Eeriephant",
]
const createAssetsDum = async () => {
  const dumdum_collection = await new Collection({
    pid: dum,
  }).init(jwk)
  for (let i = 1; i <= 9; i++) {
    const data = readFileSync(
      resolve(import.meta.dirname, `dums/dumdumdum-${i}.png`),
    )
    const asset = await new Asset().init(jwk)
    const { pid } = await asset.create({
      data,
      content_type: "image/png",
      info: {
        title: dumNames[i - 1],
        description: "dumdum",
      },
      token: { fraction: "100" },
      udl: genUDL(asset.ar.addr),
    })
    console.log(`dumdum-${i}: ${pid}`)
    const { err } = await dumdum_collection.addAsset(pid)
    console.log(err)
  }
}

const gunNames = [
  "Blaster Bolt",
  "Thunderstrike",
  "Laser Fury",
  "Pixel Pistol",
  "Neon Revolver",
  "Turbo Cannon",
  "Zap Blaster",
  "Inferno Shooter",
  "Sonic Boom",
  "Magnum Nova",
]
const createCollectionGun = async () => {
  const thumbnail_data = readFileSync(
    resolve(import.meta.dirname, "thumbnail-guns.png"),
  )
  const banner_data = readFileSync(
    resolve(import.meta.dirname, "banner-guns.png"),
  )
  const guns_collection = await new Collection({}).init(jwk)
  const { pid: guns_pid } = await guns_collection.create({
    info: {
      title: "Gun Gun Gun",
      description: "gun gun gun",
      thumbnail_data,
      thumbnail_type: "image/png",
      banner_data,
      banner_type: "image/png",
    },
  })
  console.log("guns: " + guns_pid)
}

const createAssetsGun = async () => {
  const gunPath = resolve(`${import.meta.dirname}/gun.lua`)
  const lua_gun = readFileSync(gunPath)
  const ao = await new AO().init(jwk)
  const { id: gun_src } = await ao.ar.post({ data: lua_gun })
  console.log("gun_src", gun_src)
  const guns_collection = await new Collection({
    pid: gun,
  }).init(jwk)
  const rarities = ["Legendary", "Epic", "Rare", "Common"]
  for (let i = 1; i <= 9; i++) {
    const data = readFileSync(resolve(import.meta.dirname, `guns/gun-${i}.png`))
    const asset = await new Asset({ asset_src: gun_src }).init(jwk)
    const v = {
      name: gunNames[i - 1],
      description: "gungungum",
      level: Math.ceil(Math.random() * 5),
      rarity: rarities[Math.floor(Math.random() * 4)],
      attack: Math.ceil(Math.random() * 50 + 50),
    }
    const { pid } = await asset.create({
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
      content_type: "image/png",
      info: {
        title: v.name,
        description: v.description,
      },
      token: { fraction: "1" },
      udl: genUDL(asset.ar.addr),
    })

    console.log(`gun-${i}: ${pid}`)
    const { err } = await guns_collection.addAsset(pid)
    console.log(err)
  }
}

const deployGame = async () => {
  const ao = await new AO().init(jwk)
  const gamePath = resolve(`${import.meta.dirname}/games.lua`)
  const lua_game = readFileSync(gamePath)
  const { id: game_src } = await ao.ar.post({ data: lua_game })
  const { pid } = await ao.deploy({
    src: game_src,
    fills: { DUMDUM: dum, GUN: gun },
  })
  console.log(`game process: ${pid}`)

  const { err } = await ao.msg({
    pid,
    act: "Set-Origin",
    tags: {
      Origin: Number(Date.now()).toString(),
      Span: Number(1000 * 60 * 60).toString(),
    },
    checkData: "origin set!",
  })
  console.log(err)
}

const humanNames = ["Charlie", "Max", "Olivia", "Sophia", "Liam"]
const usersPath = resolve(import.meta.dirname, `users.json`)

const createUsers = async () => {
  const users = []
  for (const v of humanNames) {
    const profile = new Profile()
    await profile.ar.gen("100")
    const user_profile = {
      DisplayName: v,
      UserName: v,
      Description: `My name is ${v}!`,
    }
    const { pid } = await profile.createProfile({ profile: user_profile })
    users.push({
      name: v.name,
      addr: profile.ar.addr,
      jwk: profile.ar.jwk,
      profileId: pid,
    })
    console.log(v, pid)
  }
  writeFileSync(usersPath, JSON.stringify(users))
}

const transfer = async () => {
  const dumdums = await new Collection({ pid: dum }).init(jwk)
  const dassets = (await dumdums.info()).Assets
  const guns = await new Collection({ pid: gun }).init(jwk)
  const gassets = (await guns.info()).Assets
  const users = JSON.parse(readFileSync(usersPath, "utf8"))
  let i = 0
  for (let v of users) {
    console.log(v.profileId)
    const asset = await new Asset({ pid: dassets[i] }).init(jwk)
    const gasset = await new Asset({ pid: gassets[i] }).init(jwk)
    const { err } = await asset.transfer({
      recipient: v.profileId,
      quantity: "100",
      profile: true,
    })
    const { err: err2 } = await gasset.transfer({
      recipient: v.profileId,
      quantity: "1",
      profile: true,
    })
    console.log(i, err, err2)
    i++
  }
}

const equip = async () => {
  const dumdums = await new Collection({ pid: dum }).init(jwk)
  const dassets = (await dumdums.info()).Assets
  const guns = await new Collection({ pid: gun }).init(jwk)
  const gassets = (await guns.info()).Assets
  const users = JSON.parse(readFileSync(usersPath, "utf8"))
  console.log(dassets)
  console.log(gassets)
  for (let v of users) {
    const prof = await new Profile().init(v.jwk)
    const my_assets = (await prof.info()).Assets
    let dum = null
    let gun = null
    for (let v2 of my_assets) {
      if (v2.Quantity === "1") gun = v2.Id
      if (v2.Quantity === "100") dum = v2.Id
    }
    if (dum && gun) {
      console.log(dum, gun)
      const { err } = await prof.ao.msg({
        pid: v.profileId,
        act: "Run-Action",
        data: JSON.stringify({
          Target: game,
          Action: "Equip",
          Input: JSON.stringify({ "Asset-ID": dum, "Gun-ID": gun }),
        }),
        get: "Action",
      })
      console.log(err)
    }
  }
}

const register = async () => {
  const users = JSON.parse(readFileSync(usersPath, "utf8"))
  for (let v of users) {
    const prof = await new Profile().init(v.jwk)
    const my_assets = (await prof.info()).Assets
    let dum = null
    for (let v2 of my_assets) {
      if (v2.Quantity === "100") dum = v2.Id
    }
    if (dum) {
      console.log(dum)
      const { err } = await prof.ao.msg({
        pid: v.profileId,
        act: "Run-Action",
        data: JSON.stringify({
          Target: game,
          Action: "Register",
          Input: JSON.stringify({ "Asset-ID": dum }),
        }),
        get: "Action",
      })
      console.log(err)
    }
  }
}

const execute = async gid => {
  const ao = await new AO().init(jwk)
  const { err } = await ao.msg({
    pid: game,
    act: "Execute",
    tags: { ID: gid, Force: "1" },
    checkData: "executed!",
  })
  console.log(err)
}

const deployProxies = async () => {
  const ao = await new AO().init(jwk)
  const proxyPath = resolve(`${import.meta.dirname}/profile-cron.lua`)
  const lua_proxy = readFileSync(proxyPath)
  const { id: proxy_src } = await ao.ar.post({ data: lua_proxy })
  console.log(proxy_src)
  const users = JSON.parse(readFileSync(usersPath, "utf8"))

  for (let v of users) {
    const prof = await new Profile().init(v.jwk)
    const my_assets = (await prof.info()).Assets
    let dum = null
    for (let v2 of my_assets) {
      if (v2.Quantity === "100") dum = v2.Id
    }
    console.log(prof.id, dum)
    const { err } = await prof.ao.load({
      src: proxy_src,
      pid: prof.id,
      fills: { Cron: cron, DumDum: dum, Games: game },
    })
    console.log(err)
  }
}

const deployGameProxy = async () => {
  const ao = await new AO().init(jwk)
  const proxyPath = resolve(`${import.meta.dirname}/game-cron.lua`)
  const lua_proxy = readFileSync(proxyPath)
  const { id: proxy_src } = await ao.ar.post({ data: lua_proxy })
  console.log(proxy_src)
  const { err } = await ao.load({
    src: proxy_src,
    pid: game,
    fills: { Cron: cron },
  })
  console.log(err)
}
