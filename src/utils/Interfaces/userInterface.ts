import { Types } from "mongoose";

interface CourseInfo {
  courseId: Types.ObjectId;
  enrolledAt: Date;
  color?: string;
}

interface AssignmentInfo {
  assignmentId: Types.ObjectId;
  dueDate?: Date;
  completedAt?: Date;
}

interface TeamInfo {
  teamId: Types.ObjectId;
  joinedAt?: Date;
  invitedAt?: Date;
}

interface ChallengeInfo {
  challengeId: Types.ObjectId;
  solvedAt: Date;
}

interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  isAdmin: boolean;
  Courses: CourseInfo[];
  pendingAssignments: AssignmentInfo[];
  completedAssignments: AssignmentInfo[];
  teams: TeamInfo[];
  pendingInvites: TeamInfo[];
  challengessolved: ChallengeInfo[];
  submissions: Types.ObjectId[];
  CoursesAsAdmin: Types.ObjectId[];
  tasks: Types.ObjectId[];
  phone?: string;
  gender?: string;
  Branch?: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
