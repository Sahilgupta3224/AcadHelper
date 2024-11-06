import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  password: string;
  Courses: string[];
  CoursesAsAdmin: string[];
  challengessolved: string[];
  completedAssignments: string[];
  pendingAssignments: string[];
  pendingInvites: string[];
  submissions: string[];
  tasks: string[];
  teams: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Store {
  user: User;
  setUser: (newUser: User) => void;
}

// Default user state
const defaultUser: User = {
  _id: "",
  username: "",
  email: "",
  isAdmin: false,
  isVerified: false,
  password: "",
  Courses: [],
  CoursesAsAdmin: [],
  challengessolved: [],
  completedAssignments: [],
  pendingAssignments: [],
  pendingInvites: [],
  submissions: [],
  tasks: [],
  teams: [],
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

// Function to get the initial user data from localStorage
const getUserFromLocalStorage = (): User => {
  if(typeof window==='undefined')return defaultUser
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : defaultUser;
};

// Create the Zustand store with localStorage persistence
export const useStore = create<Store>((set) => ({
  user: getUserFromLocalStorage(),
  setUser: (newUser: User) => {
    set({ user: newUser });
    if(typeof window!=="undefined")localStorage.setItem("user", JSON.stringify(newUser));
  },
}));

// Clear localStorage on user logout
export const clearUser = () => {
  useStore.setState({ user: defaultUser });
  localStorage.removeItem("user");
};
