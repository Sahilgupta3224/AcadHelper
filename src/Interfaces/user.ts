import { Types } from "mongoose";

interface UserCourse {
  courseId: Types.ObjectId;
  enrolledAt: Date;
  color?: string;
}

interface UserPendingAssignment {
  assignmentId: Types.ObjectId;
  dueDate?: Date;
}

interface UserCompletedAssignment {
  assignmentId: Types.ObjectId;
  completedAt: Date;
}

interface UserTeam {
  teamId: Types.ObjectId;
  joinedAt: Date;
}

interface UserPendingInvite {
  teamId: Types.ObjectId;
  invitedAt: Date;
}

interface UserChallengeSolved {
  challengeId: Types.ObjectId;
  solvedAt: Date;
}

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  isAdmin: boolean;
  Courses?: UserCourse[];
  pendingAssignments?: UserPendingAssignment[];
  completedAssignments?: UserCompletedAssignment[];
  teams?: UserTeam[];
  pendingInvites?: UserPendingInvite[];
  challengessolved?: UserChallengeSolved[];
  submissions?: Types.ObjectId[];
  CoursesAsAdmin?: Types.ObjectId[];
  tasks?: Types.ObjectId[];
  phone?: string;
  gender?: string;
  Branch?: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

export default User;
