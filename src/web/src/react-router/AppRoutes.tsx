import { RouterProvider, createHashRouter } from "react-router-dom"
import App from "../App.tsx"
import Illustration from "../pages/Illustration.tsx"
import MyCard from "../pages/MyCard.tsx"
import Collections from "../pages/Collections.tsx"
import Ranking from "../pages/Ranking.tsx"
import BattleUser from "../pages/BattleUser.tsx"
import Shop from "../pages/Shop.tsx"
import OpenPack from "../pages/OpenPack.tsx"
import PackDetails from "../pages/PackDetails.tsx"
import PackResult from "../pages/PackResult.tsx"
import Nft from "../pages/Nft.tsx"

const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/illustration", element: <Illustration /> },
  { path: "/my-card", element: <MyCard /> },
  { path: "/collections", element: <Collections /> },
  { path: "/ranking", element: <Ranking /> },
  { path: "/battle-user", element: <BattleUser /> },
  { path: "/shop", element: <Shop /> },
  { path: "/open-pack", element: <OpenPack /> },
  { path: "/pack-details", element: <PackDetails /> },
  { path: "/pack-result", element: <PackResult /> },
  { path: "/nft", element: <Nft /> },
])
const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
