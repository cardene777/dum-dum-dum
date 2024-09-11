"use client";

import { siteConfig } from "@/config/site";
import { ConnectButton } from "arweave-wallet-kit";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function SiteHeader() {
  const { isAboveSm } = useBreakpoint("sm");

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ConnectButton
              showBalance={isAboveSm}
              showProfilePicture={isAboveSm}
            />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
