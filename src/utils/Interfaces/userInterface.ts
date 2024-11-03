// import { Types } from "mongoose";

// interface CourseInfo {
//   courseId: Types.ObjectId;
//   enrolledAt: Date;
//   color?: string;
// }

// interface AssignmentInfo {
//   assignmentId: Types.ObjectId;
//   dueDate?: Date;
//   completedAt?: Date;
// }

// interface TeamInfo {
//   teamId: Types.ObjectId;
//   joinedAt?: Date;
//   invitedAt?: Date;
// }

// interface ChallengeInfo {
//   challengeId: Types.ObjectId;
//   solvedAt: Date;
// }
// userInterface.ts
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
  __v: number;
}


export default User;
