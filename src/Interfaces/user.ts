import { Types } from "mongoose";

interface UserCourse {
  courseId: string;
  enrolledAt: Date;
  color?: string;
}

interface UserPendingAssignment {
  assignmentId:string;
  dueDate?: Date;
}
 
interface UserCompletedAssignment {
  assignmentId: string;
  completedAt: Date;
}

interface UserTeam {
  teamId: string;
  joinedAt: Date;
}

interface UserPendingInvite {
  teamId: string;
  invitedAt: Date;
}

interface UserChallengeSolved {
  challengeId:string;
  solvedAt: Date;
}

// Badge type for user rewards
interface UserBadge {
  title: string;
  description: string;
  photo: string;
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
  Totalpoints:[{
    courseId:{
        type:string
    },
    points:{
        type:Number,
        default:0
  }}];
  challengessolved:[{
    challengeId: {
        type:string
    },
    solvedAt: {
        type: Date,
    }
  }];
  isEmailVerified:boolean
  pendingAssignments?: UserPendingAssignment[] | [];
  completedAssignments?: UserCompletedAssignment[] | [];
  teams?: UserTeam[]|[];
  pendingInvites?: UserPendingInvite[]|[];
  submissions?: string[]|[];
  CoursesAsAdmin?: string[]|[];
  tasks?: string[]|[];
  phone?: string;
  gender?: string;
  Branch?: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  badges?: UserBadge[];
}

export default User;
