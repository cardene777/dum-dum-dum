import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App.tsx";
import Illustration from "../pages/Illustration.tsx";
import MyCard from "../pages/MyCard.tsx";
import Collections from "../pages/Collections.tsx";
import Ranking from "../pages/Ranking.tsx";
import BattleUser from "../pages/BattleUser.tsx";
import Shop from "../pages/Shop.tsx";
import OpenPack from "../pages/OpenPack.tsx";
import PackDetails from "../pages/PackDetails.tsx";
import PackResult from "../pages/PackResult.tsx";
import Nft from "../pages/Nft.tsx";
const AppRoutes = () => {
  return (
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
        <Route path="/nft" element={<Nft />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
