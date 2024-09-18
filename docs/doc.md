# Dum Dum Dum
DumDumDum is the first reference implementation built by TCG protocol. It's an onchain trading card game using the popular DumDum atomic asset collection.

TCG stands for Trading Card Game, and it's a 20 billion dollar RWA market. TCG protocol aims to bring such a huge industry by inventing a decentralized protocol whereby anyone can build their own trading card games using atomic assets and universal data licenses on AO.

## TCG Protocol

### How Trading Card Game Works

- Players own cards
- Each card has parameters
- Cards can be combined (e.g. a dumdum owns some weapons)
- Game sessions take place with something at stake
- Winners will be determined based upon card combinations and parameters
- Winners obtain what is on stake at each session

So as a player, it becomes important to collect cards to let you win game sessions to earn winning prizes, and deal the cards with good tactics. Also each card could have art values too.

### How TCGs fit with the AO protocols

AO and atomic assets are the perfect fit to build a decentralized trading card game protocol.

- Cards are traded as atomic assets on universal content marketplace
- Card parameters can be defined as transaction tags on Arweave and used in AO processes
- AO processes can handle complex game rules and execute game sessions in a decentralized fashion
- AO crons can auto-execute sessions and even AI players can own cards and join games
- AO is highly performant and horizontally scalable unlike other blockchains
- Card data are permanently stored onchain by Arweave unlike NFTs on other blockchains

In conclusion, there's no other decentralized protocols to bring in the 20 billion dollar TCG industry.

## Trading Card Game SDK (WIP)

The protocol is defined as AO handlers but wrapped and handled by the SDK at a higher level.

```bash
yarn add tcg
```
The tcg classes represent base components of trading card games.

```js
import { Player, Card, Deck, Game, Agent } from "tcg"
```

### Players

Each player is usually an AO profile owned by an Arweave private key.

```js
const player = new Player()
```
#### create

```js
const { pid } = await player.create({ name, description, thumbnail })
```

#### enter

Enter a game session.

```js
await player.enter({ gid, sid })
```

### Cards

Each card is an aromic asset on AO and parameters are defined as message tags.

```js
const card = new Card()
```
#### create
 
```js
const { pid: cid } = await card.create({ name, description, image, params })
```

### Decks

Each deck is a collection of atomic assets with special rules defined.

```js
const deck = new Deck()
```
#### create

```js
const { pid: did } = deck.create({ name, description, thumbnail, banner })
```
#### addCard

```js
await deck.addCard({ cid })
```

### Games

Each game is an AO process which periodically hosts game sessions by
1. accepting players' entry
2. pooling tokens
3. determining winners
4. distributing token prizes

```js
const game = new Game()
```

#### create

```js
const { pid: gid } = game.create({ start, span, end, times, rules })
```
#### play
 
 Play a game session. The returned result includes various stats of the executed session.
 
```js
const { result } = await game.play({ sid })
```


### Agents

Agents are AO cron processes which periodically triggers some actions.

```js
const agent = new Agent()
```
### create

```js
const { pid: aid } = await agent.create({ span, data })
```
### start

```js
await agent.start()
```
### stop

```js
await agent.stop()
```


