import { create } from 'zustand';

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   isAdmin: boolean;
//   isVerified: boolean;
//   password: string;
//   isEmailVerified:boolean;
//   Courses: string[];
//   CoursesAsAdmin: string[];
//   challengessolved: string[];
//   completedAssignments: string[];
//   pendingAssignments: string[];
//   pendingInvites: string[];
//   submissions: string[];
//   tasks: string[];
//   teams: string[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }
import User from './Interfaces/user';

interface Store {
  user: User|null;
  setUser: (newUser: User| null) => void;
}

// Default user state
// const defaultUser: User = {
//   _id: "",
//   username: "",
//   email: "",
//   isAdmin: false,
//   isVerified: false,
//   password: "",
//   Courses: [],
//   CoursesAsAdmin: [],
//   challengessolved: [],
//   completedAssignments: [],
//   pendingAssignments: [],
//   pendingInvites: [],
//   submissions: [],
//   tasks: [],
//   teams: [],
//   createdAt: "",
//   updatedAt: "",
//   __v: 0,
// };

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
