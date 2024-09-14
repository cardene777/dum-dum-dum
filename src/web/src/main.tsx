import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./react-router/AppRoutes.tsx";
import "./index.css";
import { UserProvider } from "./hooks/useUser";
import { ArweaveWalletKit } from "arweave-wallet-kit";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
        <AppRoutes />
        </UserProvider>
      </ArweaveWalletKit>
  </StrictMode>
);
