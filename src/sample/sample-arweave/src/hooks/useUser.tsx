"use client";

import { User, UserProviderProps } from "@/types/context";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";
import React, { createContext, useContext } from "react";

const UserContext = createContext<User | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { connected } = useConnection();
  const address = useActiveAddress();

  return (
    <UserContext.Provider value={{ connected, address }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): User => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
