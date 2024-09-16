import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import AppRoutes from "./react-router/AppRoutes.tsx"
import "./index.css"
import { UserProvider } from "./hooks/useUser"
import { ArweaveWalletKit } from "arweave-wallet-kit"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
        ],
        ensurePermissions: true,
      }}
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
        <AppRoutes />
      </UserProvider>
    </ArweaveWalletKit>
  </StrictMode>,
)
