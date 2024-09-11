import React from "react";

export interface User {
  connected: boolean;
  address?: string;
}

export interface UserProviderProps {
  children: React.ReactNode;
}
