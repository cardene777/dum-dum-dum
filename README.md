# Dum Dum Dum

DumDumDum is the first reference implementation built by TCG protocol. It's an onchain trading card game using the popular DumDum atomic asset collection.

TCG stands for Trading Card Game, and it's a 20 billion dollar RWA market. TCG protocol aims to bring such a huge industry by inventing a decentralized protocol whereby anyone can build their own trading card games using atomic assets and universal data licenses on AO.

- [Read why AO is perfect for trading card games](/docs)

## 🖼️ Game App

- https://arweave.net/hOpmIgM8GJy8gEyfl1TueDviGsjRPNSoaoi5x-HOhCk

## How to Play

We are currently using a test DumDumDum collection, but will be using the real DumDum collection for the production release.

1. Obtain an available [DumDumDum](https://bazar.arweave.dev/#/collection/CoqeBSfYjsYPrVDZUxlpS5n39UAlkrz6jRCNJWpiINA/assets/) and some [Guns](https://bazar.arweave.dev/#/collection/XrxQde5ccu_X7dxP9NwmhI8PQkSQs8EWpltkOcPhWQE) from BazAR.  
(They are sold for the minimum possible prices for test purposes).
2. Go to [My Cards](https://arweave.net/hOpmIgM8GJy8gEyfl1TueDviGsjRPNSoaoi5x-HOhCk/#/my-card) page and equip your DumDumDum with the Guns you own.
3. Go to [Battle Registration](https://arweave.net/hOpmIgM8GJy8gEyfl1TueDviGsjRPNSoaoi5x-HOhCk/#/battle-user) page and register for the next game session.
4. Wait for the game to be executed. The winenrs will be determined by some battle logic based on the parameters of your deck and you will be rewarded with the pooled tokens (just some points for the test). You can see the latest scores on [Ranking](https://arweave.net/hOpmIgM8GJy8gEyfl1TueDviGsjRPNSoaoi5x-HOhCk/#/ranking) page.

This might seem to be too simple for now, but trading card games are a global phenomenon when built on well-designed game logic.

[The TCG protocol on AO](./docs/doc.md) will serve as a framework to tap into the multi-billion dollar market.

## 📜 Docs

- [slide](./docs/slide.pdf)
- [doc](./docs/doc.md)

## 📄 Page

| Home | Buttle |
| ---- | ---- |
| ![Screenshot 2024-09-17 at 18 45 45](https://github.com/user-attachments/assets/be7af77c-87ce-4440-bb7d-559de020d8b8) | ![Screenshot 2024-09-17 at 19 14 59](https://github.com/user-attachments/assets/f37e934a-2bb9-4360-9dbc-74f679af517b) |

| MyCard | Collection |
| ---- | ---- |
| ![Screenshot 2024-09-17 at 18 47 02](https://github.com/user-attachments/assets/4dfcccb4-37eb-4791-9232-1b02fecd90aa) | ![Screenshot 2024-09-17 at 18 49 14](https://github.com/user-attachments/assets/2c8bd7f5-e6de-4f19-915e-5e887331c069) |

| MyRanking |
| ---- |
| ![Screenshot 2024-09-17 at 18 47 25](https://github.com/user-attachments/assets/a8d71777-aa20-4caf-b448-3fdffc459265) |

| Shop | Buy |
| ---- | ---- |
| ![Screenshot 2024-09-17 at 18 47 49](https://github.com/user-attachments/assets/9f9e74cb-c4e0-4dad-b96c-e5a521fdeca6) | ![Screenshot 2024-09-17 at 18 48 06](https://github.com/user-attachments/assets/e0d840e1-2e35-439e-827a-e6cba16d7e05) |

| Open Pack | Pack Result |
| ---- | ---- |
| ![Screenshot 2024-09-17 at 18 50 53](https://github.com/user-attachments/assets/d45f1aa8-aca6-42b0-bc9f-6ba6f58da047) | ![Screenshot 2024-09-17 at 18 51 09](https://github.com/user-attachments/assets/08b473a5-df40-4c79-b471-63e52589bb66) |

| Illustrations |
| ---- |
| ![Screenshot 2024-09-17 at 18 49 43](https://github.com/user-attachments/assets/132b2a01-9456-4b80-a65d-33c7423af10c) |

## 💻 Code

- [ao scripts](src/lua-scripts)
- [web](src/web)

## 🔗 Links

- [Test DumDumDums](https://bazar.arweave.dev/#/collection/CoqeBSfYjsYPrVDZUxlpS5n39UAlkrz6jRCNJWpiINA/assets/)
- [Test Guns](https://bazar.arweave.dev/#/collection/XrxQde5ccu_X7dxP9NwmhI8PQkSQs8EWpltkOcPhWQE)
- [Game AO Process](https://www.ao.link/#/entity/89HBqWgMIm0lj8z9-i5BX9g4K4cYo2VvkVFkf-oLIbs)

## 🛠️ Tech

- Vite
- React
- Typescript
- AO
- Arweave
- aonote
- Tailwindcss
- Arkb
