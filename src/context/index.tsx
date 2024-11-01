"use client";
import User from "@/utils/Interfaces/userInterface";
import { createContext, useContext, useState } from "react";


interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Initialize context with a default value of null for user and a placeholder for setUser
const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for accessing the context
export function useAppWrapper() {
  return useContext(AppContext);
}
