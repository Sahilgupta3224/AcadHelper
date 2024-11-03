import { Types } from "mongoose";

interface Submission {
  _id: string;
  User: Types.ObjectId;
  Assignment?: Types.ObjectId;
  Challenge?: Types.ObjectId;
  submittedAt: Date;
  isVerified: boolean;
  documentLink: string;
  marksObtained?: number;
  feedback?: string;
  lateSubmission: boolean;
  gradedAt?: Date;
}

export default Submission;
