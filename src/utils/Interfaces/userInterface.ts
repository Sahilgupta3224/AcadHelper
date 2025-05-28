import mongoose from "mongoose";

export interface User {
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
  inbox: any[]; // Array of notifications
  __v: number;
  Totalpoints: { courseId: mongoose.Schema.Types.ObjectId; points: number }[]; // Array of point entries
}

export default User;
