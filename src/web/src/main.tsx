import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Illustration from "./pages/Illustration.tsx";
import MyCard from "./pages/MyCard.tsx";
import Collections from "./pages/Collections.tsx";
import Ranking from "./pages/Ranking.tsx";
import BattleUser from "./pages/BattleUser.tsx";
import Shop from "./pages/Shop.tsx";
import OpenPack from "./pages/OpenPack.tsx";
import PackDetails from "./pages/PackDetails.tsx";
import PackResult from "./pages/PackResult.tsx";
import { UserProvider } from "./hooks/useUser";
import { ArweaveWalletKit } from "arweave-wallet-kit";


createRoot(document.getElementById("root")!).render(
  <ArweaveWalletKit
    theme={{
      displayTheme: "dark",
      accent: {
        r: 238,
        g: 130,
        b: 238,
      },
    }}
  >
    <UserProvider>
    <StrictMode>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/illustration" element={<Illustration />} />
        <Route path="/my-card" element={<MyCard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/battle-user" element={<BattleUser />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/open-pack" element={<OpenPack />} />
        <Route path="/pack-details" element={<PackDetails />} />
        <Route path="/pack-result" element={<PackResult />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
    </UserProvider>
  </ArweaveWalletKit>
);
