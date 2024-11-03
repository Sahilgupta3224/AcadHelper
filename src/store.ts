// src/store.ts
import {create} from 'zustand';

// Define the User type
interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  password: string;
  Courses: string[]; // Assuming Courses is an array of strings
  CoursesAsAdmin: string[]; // Assuming CoursesAsAdmin is an array of strings
  challengessolved: string[]; // Assuming challengessolved is an array of strings
  completedAssignments: string[]; // Assuming completedAssignments is an array of strings
  pendingAssignments: string[]; // Assuming pendingAssignments is an array of strings
  pendingInvites: string[]; // Assuming pendingInvites is an array of strings
  submissions: string[]; // Assuming submissions is an array of strings
  tasks: string[]; // Assuming tasks is an array of strings
  teams: string[]; // Assuming teams is an array of strings
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the store type
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

// Create the Zustand store
export const useStore = create<Store>((set) => ({
  user: defaultUser,
  setUser: (newUser: User) => set({ user: newUser }),
}));
