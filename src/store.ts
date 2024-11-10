import { create } from 'zustand';

import User from './Interfaces/user';

interface Store {
  user: User|null;
  setUser: (newUser: User| null) => void;
}

// Function to get the initial user data from localStorage
const getUserFromLocalStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem("user");
    return userData && userData !== "undefined" ? JSON.parse(userData) : null;
  };
  

// Create the Zustand store with localStorage persistence
export const useStore = create<Store>((set) => ({
  user: getUserFromLocalStorage(),
  setUser: (newUser: User | null) => {
    set({ user: newUser });
    if(typeof window!=="undefined"){
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    }
  },
}));

// Clear localStorage on user logout
export const clearUser = () => {
  useStore.getState().setUser(null);
};
