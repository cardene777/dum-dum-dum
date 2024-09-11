import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/hooks/useUser";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ArweaveWalletKit
        config={{
          permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
          ensurePermissions: true,
          appInfo: {
            name: "StarterKit",
          },
        }}
      >
        <UserProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
              <Component {...pageProps} />
            </div>
            <Toaster />
            <Footer />
          </div>

          <TailwindIndicator />
        </UserProvider>
      </ArweaveWalletKit>
    </ThemeProvider>
  );
}
